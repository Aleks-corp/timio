import { forwardRef, useId, type SelectHTMLAttributes } from "react";
import clsx from "clsx";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label: string;
  options: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, id, className, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={selectId} className="text-label text-strong">
          {label}
        </label>
        <select
          id={selectId}
          ref={ref}
          className={clsx(
            "h-11 rounded-input border border-border bg-input px-3 font-inter text-sm text-strong outline-none transition-colors",
            "focus:border-accent",
            className,
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  },
);
Select.displayName = "Select";
