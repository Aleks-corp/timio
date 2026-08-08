import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import clsx from "clsx";

export interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export const PrimaryButton = forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ isLoading, disabled, children, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={clsx(
          "flex h-10 w-full items-center justify-center gap-2 rounded-button font-helvetica text-cta-btn text-white",
          "bg-gradient-to-b from-cta-from via-cta-via to-cta-to shadow-cta ring-1 ring-inset ring-white/10",
          "transition-opacity disabled:cursor-not-allowed disabled:opacity-60",
          className,
        )}
        {...props}
      >
        {isLoading ? <Loader2 size={16} className="animate-spin" aria-hidden /> : null}
        {children}
      </button>
    );
  },
);
PrimaryButton.displayName = "PrimaryButton";
