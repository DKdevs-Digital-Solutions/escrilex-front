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
  Mail,
  Activity,
} from "lucide-react";
import { useMe } from "../hooks/useMe";
import Logo from "../assets/logo.png";
import EmailNotificationsPage from "./Emailpage";
import { DashboardPage } from "./Dashboard";

type Page = "companies" | "company" | "users" | "sectors" | "processos" | "checklistRun" | "audit" | "emailSettings" | "dashboard";

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
       {
      id: "dashboard",
      label: "Dashboard",
      icon: <Activity size={15} strokeWidth={1.8} />,
      roles: ["ADMIN","GESTOR_EMPRESA"],
    },
      { id: "companies", label: "Empresas", icon: <Briefcase size={15} strokeWidth={1.8} />, roles: [] },
      {
        id: "audit", label: "Auditoria", icon: <Search size={15} strokeWidth={1.8} />, roles: ["ADMIN"],
        badge: { text: "LOG", color: "#2563eb" }
      },
    ],
  },
  {
    label: "ADMINISTRAÇÃO",
    items: [
      { id: "users", label: "Usuários", icon: <Users size={15} strokeWidth={1.8} />, roles: ["ADMIN"] },
      { id: "sectors", label: "Setores", icon: <Layers size={15} strokeWidth={1.8} />, roles: ["ADMIN"] },
      
      { id: "processos", label: "Processos", icon: <FileText size={15} strokeWidth={1.8} />, roles: ["ADMIN", "GESTOR_EMPRESA"] },
       {
        id: "emailSettings",
        label: "E-mail",
        icon: <Mail size={15} strokeWidth={1.8} />,
        roles: ["ADMIN","GESTOR_EMPRESA"],
      },
     
    ],
  },
];

const PAGE_TITLES: Record<Page, string> = {
  dashboard: "Dashboard",
  companies: "Empresas", 
  company: "Detalhe da Empresa",
  users: "Usuários", 
  sectors: "Setores",
  processos: "Processos", 
  checklistRun: "Checklist", 
  audit: "Auditoria",
  emailSettings: "Email",
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
  // const [me, setMe] = useState<any>(null);
  const [page, setPage] = useState<Page>("dashboard");
  const [companyId, setCompanyId] = useState("");
  const [runId, setRunId] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const { me, loading, reload } = useMe();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 999);



  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 999);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  if (loading)
  return (
    <div
  style={{
    height: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "radial-gradient(circle at 20% 0%, rgba(37,99,235,.10), transparent 55%), #f8fafc",
  }}
>
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 22,
      padding: "30px 34px",
      borderRadius: 22,
      background: "#fff",
      border: "1px solid #e2e8f0",
      boxShadow:
        "0 25px 60px rgba(15,23,42,.10), inset 0 1px 0 rgba(255,255,255,.6)",
      animation: "fadeIn 0.5s ease",
    }}
  >
    {/* Spinner + pulse */}
    <div
      style={{
        position: "relative",
        width: 56,
        height: 56,
      }}
    >
      {/* outer pulse */}
      <div
        style={{
          position: "absolute",
          inset: -10,
          borderRadius: "50%",
          background: "rgba(37,99,235,.10)",
          animation: "pulse 1.8s infinite ease-in-out",
        }}
      />

      {/* base circle */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: "4px solid #e2e8f0",
        }}
      />

      {/* spinner */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: "4px solid transparent",
          borderTop: "4px solid #2563eb",
          borderRight: "4px solid #7dd3fc",
          animation: "spin 0.8s linear infinite",
        }}
      />
    </div>

    {/* Texto */}
    <div style={{ textAlign: "center" }}>
      <strong
        style={{
          display: "block",
          fontSize: 15,
          color: "#0f172a",
          fontWeight: 900,
          letterSpacing: 0.2,
        }}
      >
        Carregando dados
      </strong>

      <div
        style={{
          marginTop: 6,
          fontSize: 13,
          color: "#64748b",
        }}
      >
        Aguarde enquanto buscamos as informações...
      </div>

      {/* dots animados */}
      <div
        style={{
          marginTop: 10,
          display: "flex",
          justifyContent: "center",
          gap: 6,
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#2563eb",
              opacity: 0.4,
              animation: `dotPulse 1.4s ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  </div>

  {/* animações */}
  <style>
    {`
      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(8px) scale(0.97);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      @keyframes pulse {
        0%, 100% {
          transform: scale(0.9);
          opacity: 0.4;
        }
        50% {
          transform: scale(1.1);
          opacity: 0.15;
        }
      }

      @keyframes dotPulse {
        0%, 100% {
          transform: translateY(0);
          opacity: 0.3;
        }
        50% {
          transform: translateY(-4px);
          opacity: 1;
        }
      }
    `}
  </style>
</div>
  );

  if (!me) return <Login onLogin={reload} />;

  const roles: string[] = me.roles || [];
  const isAdmin = roles.includes("ADMIN");
  const canEditTemplates = isAdmin || roles.includes("GESTOR_EMPRESA");

  function hasAccess(r: string[]) { return r.length === 0 || r.some(x => roles.includes(x)); }
  function navigate(p: Page) { setPage(p); setCompanyId(""); setRunId(""); setNotifOpen(false); if (isMobile) setMobileMenuOpen(false); }

  const activeSection = (page === "company" || page === "checklistRun") ? "companies" : page;
  const SW = isMobile ? 240 : (collapsed ? 64 : 240);



const C = {
  sideBg: "linear-gradient(180deg, #0f172a 0%, #111827 100%)",
  sideBorder: "rgba(255,255,255,0.07)",
  activeColor: "#dbeafe",
  activeBg: "linear-gradient(90deg, rgba(37,99,235,0.22) 0%, rgba(59,130,246,0.10) 100%)",
  inactColor: "#94a3b8",
  hoverBg: "rgba(255,255,255,0.06)",
  groupLabel: "#475569",
  activePill: "#3b82f6",
};

const navItemStyle = (active: boolean): React.CSSProperties => ({
  display: "flex",
  alignItems: "center",
  gap: collapsed ? 0 : 12,
  padding: collapsed ? "10px 0" : "10px 12px",
  justifyContent: collapsed ? "center" : "flex-start",
  borderRadius: 12,
  border: active ? "1px solid rgba(96,165,250,0.18)" : "1px solid transparent",
  width: "100%",
  textAlign: "left",
  background: active ? C.activeBg : "transparent",
  color: active ? C.activeColor : C.inactColor,
  fontWeight: active ? 700 : 500,
  fontSize: 13.5,
  fontFamily: "inherit",
  cursor: "pointer",
  transition: "all 0.16s ease",
  position: "relative",
  boxShadow: active ? "0 8px 18px rgba(2,6,23,0.18)" : "none",
  backdropFilter: active ? "blur(8px)" : undefined,
});

const iconBoxStyle = (active: boolean): React.CSSProperties => ({
  width: 32,
  height: 32,
  borderRadius: 10,
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: active ? "rgba(59,130,246,0.18)" : "rgba(255,255,255,0.05)",
  color: active ? "#BB9F58" : C.inactColor,
  border: active ? "1px solid rgba(96,165,250,0.20)" : "1px solid rgba(255,255,255,0.04)",
  transition: "all 0.16s ease",
});



const topIconBtn: React.CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#fff",
  color: "#6b7280",
  transition: "all 0.14s ease",
  position: "relative",
  boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
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
            onConfirm={() => { setToken(null); setLogoutConfirm(false); setTimeout(() => window.location.reload(), 300); }}
            onCancel={() => setLogoutConfirm(false)}
          />
        )}



        <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>

          {isMobile && mobileMenuOpen && (
            <div
              onClick={() => setMobileMenuOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.4)",
                zIndex: 998,
              }}
            />
          )}

          {/* ════ SIDEBAR ════ */}
          <aside
          className="sidebar-transition"
          style={{
            width: isMobile ? 240 : SW,
            position: isMobile ? "fixed" : "relative",
            left: isMobile ? (mobileMenuOpen ? 0 : -260) : 0,
            top: 0,
            height: "100vh",
            background: "#012942",
            zIndex: 999,
            transition: "left 0.25s ease",
            boxShadow: "inset -1px 0 0 rgba(255,255,255,0.04)",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}
        >


            {/* Logo */}
            <div
              style={{
                height: 68,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                padding: collapsed ? "0" : "0 14px 0 18px",
                justifyContent: collapsed ? "center" : "space-between",
                borderBottom: `1px solid ${C.sideBorder}`,
                background: "rgba(255,255,255,0.02)",
                backdropFilter: "blur(10px)",
              }}
            >
              {collapsed ? (
                <div
                  style={{
                    width: 36, height: 36, borderRadius: 10, background: "#BB9F58",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => setCollapsed(false)}
                >
                  <Menu size={17} color="#fff" strokeWidth={2.5} />
                </div>
              ) : (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: "100%",
                      height: 55,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start", // 👈 AQUI
                      flexShrink: 0,
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={Logo}
                      alt="Logo"
                      style={{
                        height: "100%",   // 👈 melhor que width aqui
                        objectFit: "contain",
                        position: "relative",
                        right: 8, // 👈 ajusta a posição horizontal
                        top:4
                      }}
                    />
                  </div>
                </div>

                
                {!isMobile && (
                  <>
                  <button
                    onClick={() => setCollapsed(true)}
                    style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid",
                    cursor: "pointer",
                    color: "#BB9F58",
                    display: "flex",
                    padding: 6,
                    borderRadius: 10,
                    transition: "all 0.12s ease",
                  }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.color = "#BB9F58";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.color = "#BB9F58";
                    }}
                  >
                    <ChevronLeft size={18} strokeWidth={2.5} />
                  </button>
                </>
              )}
              </>
            )}
            </div>

            {/* Nav */}
            <nav
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "10px 8px",
                  minHeight: 0,
                }}
              >
              {NAV_GROUPS.map((group, gi) => {
                const visible = group.items.filter(item => hasAccess(item.roles));
                if (!visible.length) return null;
                return (
                  <div key={gi} style={{ marginBottom: 4 }}>
                    {group.label && !collapsed && (
                    <div
                      style={{
                        fontSize: 10.5,
                        fontWeight: 800,
                        color: "#ccc",
                        letterSpacing: "0.12em",
                        padding: "14px 12px 8px",
                        textTransform: "uppercase",
                        margin:"5px 0px"
                      }}
                    >
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
                          <span
                            style={{
                              position: "absolute",
                              left: -1,
                              top: "18%",
                              bottom: "18%",
                              width: 3,
                              borderRadius: "0 999px 999px 0",
                              background: "#BB9F58",
                              boxShadow: "0 0 12px #ccc",
                            }}
                          />
                        )}
                          <span className="nav-icon-box" style={iconBoxStyle(active)}>{item.icon}</span>
                          {!collapsed && (
                            <>
                              <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.label}</span>
                              {item.badge && (
                                <span style={{
                                  fontSize: 9.5, fontWeight: 800, padding: "2px 6px", borderRadius: 4,
                                  background: '#BB9F58', color: "#fff", letterSpacing: "0.04em", flexShrink: 0,
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
           <div
            style={{
              borderTop: `1px solid ${C.sideBorder}`,
              padding: collapsed ? "12px 0" : "14px 12px",
              display: "flex",
              alignItems: "center",
              gap: collapsed ? 0 : 12,
              justifyContent: collapsed ? "center" : "flex-start",
              flexShrink: 0,
              background: "rgba(255,255,255,0.02)",
            }}
          >
             <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                flexShrink: 0,
                background: "#BB9F58",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 800,
                fontSize: 12.5,
                boxShadow: "0 8px 18px rgba(37,99,235,0.28)",
              }}
            >
              {initials}
            </div>
              {!collapsed && (
                <>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 12.5,
                        fontWeight: 700,
                        color: "#e2e8f0",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {me.name || me.email}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#64748b",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {roles[0] || ""}
                    </div>
                  </div>
                  <button
                    onClick={() => setLogoutConfirm(true)}
                    title="Sair"
                    style={{ background: "none", border: "1px solid", cursor: "pointer", color: "#4b5266", display: "flex", padding: 5, borderRadius: 7, transition: "color 0.12s, background 0.12s", flexShrink: 0 }}
                    onMouseOver={e => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.background = "rgba(248,113,113,0.1)"; }}
                    onMouseOut={e => { e.currentTarget.style.color = "#4b5266"; e.currentTarget.style.background = "transparent"; }}
                  >
                    <LogOut size={17} strokeWidth={1.8} />
                  </button>
                </>
              )}
            </div>
          </aside>

          {/* ════ MAIN ════ */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Topbar */}
            <header
  style={{
    height: 70,
    background: "rgba(255,255,255,0.85)",
    borderBottom: "1px solid #eef2f7",
    backdropFilter: "blur(12px)",
    boxShadow: "0 8px 24px rgba(15,23,42,0.04)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    flexShrink: 0,
    zIndex: 100,
  }}
>
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 14,
      minWidth: 0,
      flex: 1,
    }}
  >
    {isMobile && (
      <button
        onClick={() => setMobileMenuOpen(true)}
        style={{
          ...topIconBtn,
          marginRight: 2,
          width: 38,
          height: 38,
          borderRadius: 12,
          border: "1px solid #e5e7eb",
          background: "#fff",
          boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
        }}
      >
        <Menu size={18} />
      </button>
    )}

{!isMobile && (
    <div style={{ minWidth: 0 }}>
      {/* breadcrumb */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 12.5,
          color: "#94a3b8",
          marginBottom: 3,
          flexWrap: "wrap",
        }}
      >
        {(page === "company" || page === "checklistRun") && (
          <>
            <button
              onClick={() => navigate("companies")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#94a3b8",
                fontSize: 12.5,
                fontWeight: 600,
                padding: 0,
                transition: "color 0.12s ease",
                fontFamily: "inherit",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = "#374151";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = "#94a3b8";
              }}
            >
              Empresas
            </button>
            <ChevronRight size={13} color="#d1d5db" strokeWidth={2.5} />
          </>
        )}

        {page === "checklistRun" && companyId && (
          <>
            <button
              onClick={() => {
                setPage("company");
                setRunId("");
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#94a3b8",
                fontSize: 12.5,
                fontWeight: 600,
                padding: 0,
                transition: "color 0.12s ease",
                fontFamily: "inherit",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = "#374151";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = "#94a3b8";
              }}
            >
              Detalhe
            </button>
            <ChevronRight size={13} color="#d1d5db" strokeWidth={2.5} />
          </>
        )}

        <span
          style={{
            color: "#64748b",
            fontWeight: 700,
          }}
        >
          {PAGE_TITLES[page]}
        </span>
       
      </div>

      
    </div>
)}

  </div>
  

  {/* ações da direita */}
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
        marginLeft: 16,
    }}
  >
    <div style={{ position: "relative" }}>
      <button
        className="topbar-btn"
        style={{
          ...topIconBtn,
          width: 40,
          height: 40,
          borderRadius: 12,
          border: "1px solid #e5e7eb",
          background: "#fff",
          boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
          position: "relative",
        }}
        title="Notificações"
        onClick={() => setNotifOpen((o) => !o)}
      >
        <Bell size={17} strokeWidth={1.9} />
        <span
          style={{
            position: "absolute",
            top: 9,
            right: 9,
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#ef4444",
            border: "2px solid #fff",
            boxShadow: "0 0 0 1px rgba(239,68,68,0.15)",
          }}
        />
      </button>

      {notifOpen && (
        <div
          className="dropdown"
          style={{
            position: "absolute",
            top: "calc(100% + 10px)",
            right: 0,
            width: 300,
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 16,
            boxShadow: "0 18px 40px rgba(15,23,42,0.12)",
            overflow: "hidden",
            zIndex: 200,
          }}
        >
          <div
            style={{
              padding: "14px 18px",
              borderBottom: "1px solid #f1f5f9",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "linear-gradient(180deg, #ffffff 0%, #fafcff 100%)",
            }}
          >
            <span
              style={{
                fontWeight: 800,
                fontSize: 13.5,
                color: "#111827",
              }}
            >
              Notificações
            </span>

            <span
              style={{
                fontSize: 11,
                color: "#64748b",
                background: "#f3f4f6",
                padding: "3px 8px",
                borderRadius: 999,
                fontWeight: 700,
              }}
            >
              0
            </span>
          </div>

          <div
            style={{
              padding: "20px 18px",
              fontSize: 13,
              color: "#94a3b8",
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            Nenhuma notificação nova.
          </div>
        </div>
      )}
    </div>
  </div>
</header>

            {/* Content */}
            <main style={{ flex: 1, overflow: "auto", padding: isMobile ? 15 : 28 }}
              onClick={() => setNotifOpen(false)}>
              {page === "companies" && <Companies onOpenCompany={id => { setCompanyId(id); setPage("company"); }} />}
              {page === "company" && companyId && (
                <CompanyDetail companyId={companyId} isAdmin={isAdmin} userRoles={roles}
                  onBack={() => { setPage("companies"); setCompanyId(""); }}
                  onOpenRun={rid => { setRunId(rid); setPage("checklistRun"); }} />
              )}
              {page === "audit" && isAdmin && <Audit />}

              
              {page === "dashboard" && isAdmin && <DashboardPage />}
              {page === "processos" && canEditTemplates && <Templates />}
              {page === "users" && isAdmin && <AdminUsers />}
              {page === "sectors" && isAdmin && <AdminSectors />}
              {page === "checklistRun" && runId && (
                <ChecklistRun runId={runId} onBack={() => { setRunId(""); setPage(companyId ? "company" : "companies"); }} />
              )}
              {page === "emailSettings" && isAdmin && <EmailNotificationsPage />}
            </main>
          </div>
        </div>
      </ConfirmProvider>
    </ToastProvider>
  );
}
