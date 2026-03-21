import { CheckCircle } from 'lucide-react';

const rules = [
  '8 characters long',
  'One uppercase character',
  'One lowercase character',
  'One special character',
  'One digit',
  'Must not include spaces',
];

export default function PasswordRules() {
  return (
    <div>
      <p className="text-sm font-medium text-[#1B1818]">
        Password must include at least:
      </p>

      <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm text-[#667185]">
        {rules.map((rule) => (
          <li key={rule} className="flex items-center gap-2">
            <CheckCircle
              className="h-5 w-5 text-[#667185]"
              aria-hidden="true"
            />
            <span>{rule}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}