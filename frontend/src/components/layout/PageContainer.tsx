import type { ReactNode } from "react";
import clsx from "clsx";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={clsx("mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}
