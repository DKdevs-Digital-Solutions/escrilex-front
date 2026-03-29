import React, { useEffect, useState } from "react";
import { api, setToken, getToken } from "../api";
import { Login } from "./Login";
import { AdminUsers } from "./AdminUsers";
import { AdminSectors } from "./AdminSectors";
import { Companies } from "./Companies";
import { CompanyDetail } from "./CompanyDetail";
import { ChecklistRun } from "./ChecklistRun";
import { Audit } from "./Audit";
import { Templates } from "./Templates";
import { ToastProvider } from "../toast";
import { ConfirmProvider } from "../confirm";
import {
  Briefcase, FileText, Users, Layers, Search, Bell, LogOut,
  ChevronLeft, ChevronRight, Menu, ClipboardList, AlertTriangle,
} from "lucide-react";

type Page = "companies" | "company" | "users" | "sectors" | "templates" | "checklistRun" | "audit";

interface NavItem {
  id: Page;
  label: string;
  icon: JSX.Element;
  roles: string[];
  badge?: { text: string; color: string };
}

const NAV_GROUPS: { label?: string; items: NavItem[] }[] = [
  {
    label: "PRINCIPAL",
    items: [
      { id: "companies", label: "Empresas",  icon: <Briefcase size={15} strokeWidth={1.8} />, roles: [] },
      { id: "templates", label: "Templates", icon: <FileText   size={15} strokeWidth={1.8} />, roles: ["ADMIN", "GESTOR_EMPRESA"] },
    ],
  },
  {
    label: "ADMINISTRAÇÃO",
    items: [
      { id: "users",   label: "Usuários",  icon: <Users   size={15} strokeWidth={1.8} />, roles: ["ADMIN"] },
      { id: "sectors", label: "Setores",   icon: <Layers  size={15} strokeWidth={1.8} />, roles: ["ADMIN"] },
      { id: "audit",   label: "Auditoria", icon: <Search  size={15} strokeWidth={1.8} />, roles: ["ADMIN"],
        badge: { text: "LOG", color: "#2563eb" } },
    ],
  },
];

const PAGE_TITLES: Record<Page, string> = {
  companies: "Empresas", company: "Detalhe da Empresa",
  users: "Usuários", sectors: "Setores",
  templates: "Templates", checklistRun: "Checklist", audit: "Auditoria",
};

// ── Confirm logout modal ──────────────────────────────────────────────────────
function LogoutConfirm({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 2000,
      background: "rgba(15,23,42,0.45)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}
      onClick={e => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div style={{
        background: "#fff", borderRadius: 14, width: 360, padding: "28px 28px 22px",
        boxShadow: "0 24px 60px rgba(15,23,42,0.2), 0 0 0 1px rgba(15,23,42,0.05)",
        animation: "modalIn 0.2s cubic-bezier(0.22,1,0.36,1)",
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12, background: "#fef3c7",
          border: "1px solid #fde68a",
          display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16,
        }}>
          <AlertTriangle size={22} color="#d97706" strokeWidth={2} />
        </div>
        <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em" }}>
          Sair do sistema?
        </h3>
        <p style={{ margin: "0 0 24px", fontSize: 13.5, color: "#64748b", lineHeight: 1.5 }}>
          Você será desconectado e precisará fazer login novamente para acessar o sistema.
        </p>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button
            onClick={onCancel}
            style={{
              padding: "8px 18px", fontSize: 13.5, fontWeight: 600, borderRadius: 9,
              border: "1.5px solid #e2e8f0", background: "#fff", color: "#475569",
              cursor: "pointer", fontFamily: "inherit", transition: "background 0.12s",
            }}
            onMouseOver={e => { e.currentTarget.style.background = "#f8fafc"; }}
            onMouseOut={e => { e.currentTarget.style.background = "#fff"; }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "8px 18px", fontSize: 13.5, fontWeight: 700, borderRadius: 9,
              border: "none", background: "#ef4444", color: "#fff",
              cursor: "pointer", fontFamily: "inherit", transition: "background 0.12s",
            }}
            onMouseOver={e => { e.currentTarget.style.background = "#dc2626"; }}
            onMouseOut={e => { e.currentTarget.style.background = "#ef4444"; }}
          >
            Sair
          </button>
        </div>
      </div>
      <style>{`@keyframes modalIn { from { opacity:0; transform:translateY(12px) scale(0.97); } to { opacity:1; transform:none; } }`}</style>
    </div>
  );
}

export function App() {
  const [me, setMe] = useState<any>(null);
  const [page, setPage] = useState<Page>("companies");
  const [companyId, setCompanyId] = useState("");
  const [runId, setRunId] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  async function loadMe() {
    if (!getToken()) return;
    try { setMe(await api("/api/auth/me")); }
    catch { setToken(null); setMe(null); }
  }
  useEffect(() => { loadMe(); }, []);

  if (!me) return <Login onLogin={loadMe} />;

  const roles: string[] = me.roles || [];
  const isAdmin = roles.includes("ADMIN");
  const canEditTemplates = isAdmin || roles.includes("GESTOR_EMPRESA");

  function hasAccess(r: string[]) { return r.length === 0 || r.some(x => roles.includes(x)); }
  function navigate(p: Page) { setPage(p); setCompanyId(""); setRunId(""); setNotifOpen(false); }

  const activeSection = (page === "company" || page === "checklistRun") ? "companies" : page;
  const SW = collapsed ? 64 : 240;

  const C = {
    sideBg:      "#111327",
    sideBorder:  "rgba(255,255,255,0.06)",
    activeColor: "#60a5fa",
    activeBg:    "rgba(99,102,241,0.14)",
    inactColor:  "#7c8399",
    hoverBg:     "rgba(255,255,255,0.05)",
    groupLabel:  "#3d4259",
  };

  const navItemStyle = (active: boolean): React.CSSProperties => ({
    display: "flex", alignItems: "center",
    gap: collapsed ? 0 : 10,
    padding: collapsed ? "10px 0" : "9px 12px",
    justifyContent: collapsed ? "center" : "flex-start",
    borderRadius: 9, border: "none", cursor: "pointer",
    width: "100%", textAlign: "left",
    background: active ? C.activeBg : "transparent",
    color: active ? C.activeColor : C.inactColor,
    fontWeight: active ? 600 : 400, fontSize: 13.5,
    fontFamily: "inherit",
    transition: "background 0.13s, color 0.13s",
    position: "relative",
  });

  const iconBoxStyle = (active: boolean): React.CSSProperties => ({
    width: 30, height: 30, borderRadius: 8, flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
    background: active ? "rgba(99,102,241,0.22)" : "rgba(255,255,255,0.05)",
    color: active ? C.activeColor : C.inactColor,
    transition: "background 0.13s, color 0.13s",
  });

  const topIconBtn: React.CSSProperties = {
    width: 36, height: 36, borderRadius: 9, border: "none", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    background: "transparent", color: "#6b7280",
    transition: "background 0.12s, color 0.12s",
    position: "relative",
  };

  const initials = (me.name || me.email || "?")
    .split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <ToastProvider>
      <ConfirmProvider>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        body { font-family:'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; background:#f1f4f9; }
        ::-webkit-scrollbar { width:5px; height:5px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:#d1d5db; border-radius:99px; }
        input, select, textarea, button { font-family:inherit; }
        .nav-btn:hover { background:${C.hoverBg} !important; color:#c7d0e8 !important; }
        .nav-btn:hover .nav-icon-box { background:rgba(255,255,255,0.09) !important; color:#c7d0e8 !important; }
        .topbar-btn:hover { background:#f3f4f6 !important; color:#374151 !important; }
        .dropdown { position:absolute; top:calc(100% + 8px); right:0; background:#fff; border:1px solid #e5e7eb; border-radius:12px; box-shadow:0 16px 40px rgba(0,0,0,0.12); min-width:220px; z-index:999; overflow:hidden; }
        .sidebar-transition { transition:width 0.22s cubic-bezier(0.4,0,0.2,1); }
      `}</style>

      {logoutConfirm && (
        <LogoutConfirm
          onConfirm={() => { setToken(null); setMe(null); setLogoutConfirm(false); }}
          onCancel={() => setLogoutConfirm(false)}
        />
      )}

      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>

        {/* ════ SIDEBAR ════ */}
        <aside className="sidebar-transition" style={{
          width: SW, flexShrink: 0, background: C.sideBg,
          display: "flex", flexDirection: "column",
          overflow: "hidden", zIndex: 200,
          boxShadow: "4px 0 24px rgba(0,0,0,0.18)",
        }}>
          {/* Logo */}
          <div style={{
            height: 64, flexShrink: 0,
            display: "flex", alignItems: "center",
            padding: collapsed ? "0" : "0 14px 0 18px",
            justifyContent: collapsed ? "center" : "space-between",
            borderBottom: `1px solid ${C.sideBorder}`,
          }}>
            {collapsed ? (
              <div
                style={{
                  width: 36, height: 36, borderRadius: 10, background: "#2563eb",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                }}
                onClick={() => setCollapsed(false)}
              >
                <ClipboardList size={17} color="#fff" strokeWidth={2.5} />
              </div>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 10, background: "#2563eb",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <ClipboardList size={16} color="#fff" strokeWidth={2.5} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 14.5, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1 }}>Gestão</div>
                    <div style={{ fontSize: 10, color: "#4b5266", fontWeight: 700, letterSpacing: "0.07em", marginTop: 2 }}>PRO</div>
                  </div>
                </div>
                <button
                  onClick={() => setCollapsed(true)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: C.groupLabel, display: "flex", padding: 5, borderRadius: 6, transition: "color 0.12s" }}
                  onMouseOver={e => { e.currentTarget.style.color = "#8b92a9"; }}
                  onMouseOut={e => { e.currentTarget.style.color = C.groupLabel; }}
                >
                  <ChevronLeft size={14} strokeWidth={2.5} />
                </button>
              </>
            )}
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, overflowY: "auto", padding: "10px 8px" }}>
            {NAV_GROUPS.map((group, gi) => {
              const visible = group.items.filter(item => hasAccess(item.roles));
              if (!visible.length) return null;
              return (
                <div key={gi} style={{ marginBottom: 4 }}>
                  {group.label && !collapsed && (
                    <div style={{ fontSize: 10, fontWeight: 700, color: C.groupLabel, letterSpacing: "0.1em", padding: "10px 10px 6px" }}>
                      {group.label}
                    </div>
                  )}
                  {group.label && collapsed && <div style={{ height: 8 }} />}
                  {visible.map(item => {
                    const active = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        className="nav-btn"
                        onClick={() => navigate(item.id)}
                        title={collapsed ? item.label : undefined}
                        style={navItemStyle(active)}
                      >
                        {active && (
                          <span style={{
                            position: "absolute", left: 0, top: "20%", bottom: "20%",
                            width: 3, borderRadius: "0 3px 3px 0", background: "#2563eb",
                          }} />
                        )}
                        <span className="nav-icon-box" style={iconBoxStyle(active)}>{item.icon}</span>
                        {!collapsed && (
                          <>
                            <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.label}</span>
                            {item.badge && (
                              <span style={{
                                fontSize: 9.5, fontWeight: 800, padding: "2px 6px", borderRadius: 4,
                                background: item.badge.color, color: "#fff", letterSpacing: "0.04em", flexShrink: 0,
                              }}>{item.badge.text}</span>
                            )}
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </nav>

          {/* User */}
          <div style={{
            borderTop: `1px solid ${C.sideBorder}`,
            padding: collapsed ? "12px 0" : "12px 10px",
            display: "flex", alignItems: "center",
            gap: collapsed ? 0 : 10,
            justifyContent: collapsed ? "center" : "flex-start",
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10, flexShrink: 0,
              background: "#2563eb",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 700, fontSize: 12.5,
            }}>
              {initials}
            </div>
            {!collapsed && (
              <>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: "#c7d0e8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {me.name || me.email}
                  </div>
                  <div style={{ fontSize: 11, color: "#4b5266", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {roles[0] || ""}
                  </div>
                </div>
                <button
                  onClick={() => setLogoutConfirm(true)}
                  title="Sair"
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#4b5266", display: "flex", padding: 5, borderRadius: 7, transition: "color 0.12s, background 0.12s", flexShrink: 0 }}
                  onMouseOver={e => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.background = "rgba(248,113,113,0.1)"; }}
                  onMouseOut={e => { e.currentTarget.style.color = "#4b5266"; e.currentTarget.style.background = "transparent"; }}
                >
                  <LogOut size={15} strokeWidth={1.8} />
                </button>
              </>
            )}
          </div>
        </aside>

        {/* ════ MAIN ════ */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Topbar */}
          <header style={{
            height: 64, background: "#fff", borderBottom: "1px solid #e5e7eb",
            display: "flex", alignItems: "center", padding: "0 24px",
            flexShrink: 0, zIndex: 100,
          }}>
            {collapsed && (
              <button className="topbar-btn" onClick={() => setCollapsed(false)}
                style={{ ...topIconBtn, marginRight: 8 }}>
                <Menu size={17} />
              </button>
            )}
            {/* Breadcrumb */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13.5, flex: 1 }}>
              {(page === "company" || page === "checklistRun") && (
                <>
                  <button onClick={() => navigate("companies")}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 13.5, padding: 0, transition: "color 0.12s" }}
                    onMouseOver={e => { e.currentTarget.style.color = "#374151"; }}
                    onMouseOut={e => { e.currentTarget.style.color = "#9ca3af"; }}>
                    Empresas
                  </button>
                  <ChevronRight size={13} color="#d1d5db" strokeWidth={2.5} />
                </>
              )}
              {page === "checklistRun" && companyId && (
                <>
                  <button onClick={() => { setPage("company"); setRunId(""); }}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 13.5, padding: 0 }}>
                    Detalhe
                  </button>
                  <ChevronRight size={13} color="#d1d5db" strokeWidth={2.5} />
                </>
              )}
              <span style={{ fontWeight: 700, color: "#111827", fontSize: 14 }}>{PAGE_TITLES[page]}</span>
            </div>
            {/* Bell */}
            <div style={{ position: "relative" }}>
              <button className="topbar-btn" style={topIconBtn} title="Notificações"
                onClick={() => setNotifOpen(o => !o)}>
                <Bell size={17} strokeWidth={1.8} />
                <span style={{ position: "absolute", top: 7, right: 7, width: 7, height: 7, borderRadius: "50%", background: "#ef4444", border: "2px solid #fff" }} />
              </button>
              {notifOpen && (
                <div className="dropdown">
                  <div style={{ padding: "14px 18px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: 700, fontSize: 13.5, color: "#111827" }}>Notificações</span>
                    <span style={{ fontSize: 11, color: "#9ca3af", background: "#f3f4f6", padding: "2px 8px", borderRadius: 99, fontWeight: 600 }}>0</span>
                  </div>
                  <div style={{ padding: "16px 18px", fontSize: 13, color: "#9ca3af", textAlign: "center" }}>Nenhuma notificação nova.</div>
                </div>
              )}
            </div>
          </header>

          {/* Content */}
          <main style={{ flex: 1, overflow: "auto", padding: 28 }}
            onClick={() => setNotifOpen(false)}>
            {page === "companies" && <Companies onOpenCompany={id => { setCompanyId(id); setPage("company"); }} />}
            {page === "company" && companyId && (
              <CompanyDetail companyId={companyId} isAdmin={isAdmin} userRoles={roles}
                onBack={() => { setPage("companies"); setCompanyId(""); }}
                onOpenRun={rid => { setRunId(rid); setPage("checklistRun"); }} />
            )}
            {page === "checklistRun" && runId && (
              <ChecklistRun runId={runId} onBack={() => { setRunId(""); setPage(companyId ? "company" : "companies"); }} />
            )}
            {page === "templates"   && canEditTemplates && <Templates />}
            {page === "users"       && isAdmin && <AdminUsers />}
            {page === "sectors"     && isAdmin && <AdminSectors />}
            {page === "audit"       && isAdmin && <Audit />}
          </main>
        </div>
      </div>
    </ConfirmProvider>
    </ToastProvider>
  );
}
