export const StatusBadge = ({
  label,
  bgColorHex,
  textColorHex,
}: {
  label: string;
  bgColorHex: string;
  textColorHex: string;
}) => {
  return (
    <span
      className="px-3 py-1.5 rounded-full text-xs font-medium"
      style={{ backgroundColor: bgColorHex, color: textColorHex }}
    >
      {label}
    </span>
  );
};

export const ActionButton = ({
  label,
  variant = "solid",
  onClick,
}: {
  label: string;
  variant?: "solid" | "soft";
  onClick?: () => void;
}) => {
  const baseStyles =
    "px-4 py-1.5 rounded-full text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#0a6c38]/50";
  const styles = {
    solid: "bg-[#0a6c38] text-white hover:bg-[#085a2e]",
    soft: "bg-[#e6f4ea] text-[#0a6c38] hover:bg-[#d0ebd6]",
  };

  return (
    <button onClick={onClick} className={`${baseStyles} ${styles[variant]}`}>
      {label}
    </button>
  );
};
