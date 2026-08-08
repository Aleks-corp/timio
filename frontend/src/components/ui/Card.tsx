import type { HTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={clsx("rounded-widget bg-card p-3.5 shadow-widget", className)}
      {...props}
    >
      {children}
    </div>
  );
}
