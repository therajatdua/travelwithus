/* ============================================================
   Atom: InputField
   ============================================================
   Controlled text input with label, error state, and
   theme-aware styling.
   ============================================================ */

"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

export interface InputFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Input element type */
  type?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Accessible label (rendered above the input) */
  label?: string;
  /** Error message — when truthy the field renders in error state */
  error?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ type = "text", placeholder, label, error, className = "", ...props }, ref) => {
    const baseInput =
      "w-full rounded-[var(--radius-md)] border bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--heading)] placeholder:text-[var(--muted)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1";

    const normalBorder = "border-[var(--border)] focus:ring-[var(--primary)]";
    const errorBorder = "border-red-500 focus:ring-red-400";

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-[var(--body)]">
            {label}
          </label>
        )}

        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={`${baseInput} ${error ? errorBorder : normalBorder} ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${props.id ?? "input"}-error` : undefined}
          {...props}
        />

        {error && (
          <p
            id={`${props.id ?? "input"}-error`}
            className="text-xs font-medium text-red-500"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

InputField.displayName = "InputField";
export default InputField;
