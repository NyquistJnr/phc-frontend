import { useState, FormEvent, ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export type InputType =
  | "text"
  | "email"
  | "date"
  | "month"
  | "select"
  | "textarea"
  | "number";

export interface FormFieldDef {
  name: string;
  label: string;
  type: InputType;
  placeholder?: string;
  options?: { label: string; value: string }[];
  icon?: ReactNode;
  colSpan?: 1 | 2 | 3 | 4;
  disabled?: boolean;
  readOnly?: boolean;
  helperText?: string;
}

interface ReusableFormProps {
  title?: string;
  headerIcon?: ReactNode;
  fields: FormFieldDef[];
  columns?: 1 | 2 | 3 | 4;
  submitLabel?: string;
  cancelLabel?: string;
  submitIcon?: ReactNode;
  onSubmit: (data: Record<string, any>) => void;
  onCancel?: () => void;
  initialValues?: Record<string, any>;
}

export const ReusableForm = ({
  title,
  headerIcon,
  fields,
  columns = 2,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  submitIcon,
  onSubmit,
  onCancel,
  initialValues = {},
}: ReusableFormProps) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialValues);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const gridColsMap: Record<number, string> = {
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  };

  const colSpanMap: Record<number, string> = {
    1: "md:col-span-1",
    2: "md:col-span-2",
    3: "md:col-span-3",
    4: "md:col-span-4",
  };

  const gridColsClass = gridColsMap[columns];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-8 md:p-10 w-full max-w-6xl">
      {title && (
        <div className="flex items-center gap-3 mb-8 md:mb-10">
          {headerIcon && <div className="text-[#0a6c38]">{headerIcon}</div>}
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-10">
        <div className={`grid grid-cols-1 ${gridColsClass} gap-6 md:gap-8`}>
          {fields.map((field) => {
            const spanClass = field.colSpan
              ? colSpanMap[field.colSpan]
              : "md:col-span-1";
            const finalSpanClass =
              field.colSpan === columns
                ? "col-span-1 md:col-span-full"
                : spanClass;

            return (
              <div
                key={field.name}
                className={`flex flex-col ${finalSpanClass}`}
              >
                <div
                  className={`relative border flex gap-3 transition-all ${
                    field.type === "textarea"
                      ? "items-start py-3.5"
                      : "items-center py-2.5 md:py-3"
                  } px-4 rounded-xl ${
                    field.disabled || field.readOnly
                      ? "bg-gray-50/70 border-gray-200"
                      : "bg-white border-gray-300 hover:border-gray-400 focus-within:border-[#0a6c38] focus-within:ring-1 focus-within:ring-[#0a6c38]"
                  }`}
                >
                  {field.icon && (
                    <div className="text-gray-400 mt-0.5">{field.icon}</div>
                  )}
                  <div className="flex flex-col flex-1 relative">
                    <label
                      htmlFor={field.name}
                      className="text-[10px] md:text-xs text-gray-500 mb-1"
                    >
                      {field.label}
                    </label>
                    {field.type === "select" ? (
                      <div className="relative flex items-center">
                        <select
                          id={field.name}
                          disabled={field.disabled}
                          value={formData[field.name] || ""}
                          onChange={(e) =>
                            handleChange(field.name, e.target.value)
                          }
                          className="w-full text-sm outline-none bg-transparent text-gray-900 appearance-none cursor-pointer pr-6 disabled:cursor-not-allowed font-medium"
                        >
                          <option value="" disabled hidden>
                            {field.placeholder || "Select..."}
                          </option>
                          {field.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={16}
                          className="text-gray-400 absolute right-0 pointer-events-none"
                        />
                      </div>
                    ) : field.type === "textarea" ? (
                      <textarea
                        id={field.name}
                        disabled={field.disabled}
                        readOnly={field.readOnly}
                        placeholder={field.placeholder}
                        value={formData[field.name] || ""}
                        onChange={(e) =>
                          handleChange(field.name, e.target.value)
                        }
                        rows={4}
                        className="w-full text-sm outline-none bg-transparent text-gray-900 placeholder-gray-400 resize-none disabled:cursor-not-allowed font-medium"
                      />
                    ) : (
                      <input
                        id={field.name}
                        type={field.type}
                        disabled={field.disabled}
                        readOnly={field.readOnly}
                        placeholder={field.placeholder}
                        value={formData[field.name] || ""}
                        onChange={(e) =>
                          handleChange(field.name, e.target.value)
                        }
                        className="w-full text-sm outline-none bg-transparent text-gray-900 placeholder-gray-400 disabled:cursor-not-allowed font-medium"
                      />
                    )}
                  </div>
                </div>
                {field.helperText && (
                  <span className="text-[11px] text-gray-400 mt-1.5 ml-1">
                    {field.helperText}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-center gap-4 pt-6 md:pt-8 border-t border-gray-50">
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-3 rounded-xl text-sm font-semibold bg-[#b8bcc8] text-white hover:bg-gray-400 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="submit"
            className="px-8 py-3 rounded-xl text-sm font-semibold bg-[#0a6c38] text-white hover:bg-[#085a2e] transition-colors flex items-center gap-2 shadow-lg shadow-[#0a6c38]/20"
          >
            {submitIcon}
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
};
