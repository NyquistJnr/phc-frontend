import { FieldShell } from "./FieldShell";

export function TextField({
  label,
  value,
  placeholder,
  readOnly = false,
  icon,
  type = "text",
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  readOnly?: boolean;
  icon?: React.ReactNode;
  type?: string;
  onChange: (value: string) => void;
}) {
  return (
    <FieldShell label={label}>
      <div className="flex items-center gap-3">
        {icon}
        <input
          value={value}
          readOnly={readOnly}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          type={type}
          className={`w-full bg-transparent text-base outline-none placeholder:text-gray-400 ${readOnly ? "text-gray-400" : "text-gray-700"}`}
        />
      </div>
    </FieldShell>
  );
}
