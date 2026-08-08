import { forwardRef, useId, type InputHTMLAttributes } from "react";
import clsx from "clsx";

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, id, className, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-label text-strong">
          {label}
        </label>
        <input
          id={inputId}
          ref={ref}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={clsx(
            "h-10 rounded-input border bg-input px-6 py-3 font-inter text-sm text-strong outline-none transition-colors",
            "placeholder:text-muted-light focus:border-accent",
            error ? "border-error bg-error-bg" : "border-border",
            className,
          )}
          {...props}
        />
        {error ? (
          <p id={errorId} role="alert" className="text-caption text-error">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);
TextInput.displayName = "TextInput";
