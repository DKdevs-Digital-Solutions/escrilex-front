import { drawerInputStyle } from "../../styles/ExpectationMatrix.styled";


type Props = {
  column: any;
  value: any;
  users: any[];
  options: any;
  onChange: (value: any) => void;
};

export function EditableField({
  column,
  value,
  users,
  options,
  onChange,
}: Props) {
  if (column.type === "automatic") {
    return (
      <input
        value={value || ""}
        disabled
        style={{
          ...drawerInputStyle,
          background: "#f8fafc",
          color: "#64748b",
          cursor: "not-allowed",
        }}
      />
    );
  }

  if (column.type === "user") {
    return (
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value || null)}
        style={drawerInputStyle}
      >
        <option value="">Sem responsável</option>

        {users.map((user: any) => (
          <option key={user.id} value={user.id}>
            {user.name}
            {user.sector?.name
              ? ` • ${user.sector.name}`
              : ""}
          </option>
        ))}
      </select>
    );
  }

  if (column.type === "select") {
    const list = options?.[column.optionsKey] ?? [];

    return (
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value || null)}
        style={drawerInputStyle}
      >
        <option value="">Selecione</option>

        {list.map((item: string) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    );
  }

  if (column.type === "date") {
    return (
      <input
        type="date"
        value={value ? String(value).slice(0, 10) : ""}
        onChange={(e) => onChange(e.target.value || null)}
        style={drawerInputStyle}
      />
    );
  }

  if (column.type === "textarea") {
    return (
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        style={{
          ...drawerInputStyle,
          height: 92,
          paddingTop: 10,
          resize: "vertical",
        }}
      />
    );
  }

  return (
    <input
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      style={drawerInputStyle}
    />
  );
}