const rules = [
  'Must be at least 8 characters long',
  'Must include uppercase and lowercase letters',
  'Must include at least one number',
  'Must include at least one special character',
];

export default function PasswordRules() {
  return (
    <div className="rounded-2xl border border-[#D9DEE8] bg-white/70 p-4">
      <p className="text-sm font-semibold text-[#1B1818]">Password requirements</p>
      <ul className="mt-3 space-y-2 text-sm text-[#645D5D]">
        {rules.map((rule) => (
          <li key={rule} className="flex items-start gap-2">
            <span className="mt-1 h-2 w-2 rounded-full bg-[#006732]" aria-hidden="true" />
            <span>{rule}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}