import type { ReactNode } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { PageContainer } from "./PageContainer";

interface AuthLayoutProps {
  children: ReactNode;
}

// Two-column split screen from the Figma "Sign up" frame (158:4582): a centered
// form column on the left, a photo + testimonial panel on the right. The photo
// panel is hidden below `lg` — Figma has no dedicated mobile variant for this
// screen, so this is our own responsive adaptation, not a second design.
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <PageContainer className="flex min-h-screen items-center justify-center py-6">
      <div className="flex w-full max-w-[1440px] overflow-hidden rounded-card bg-background lg:h-[790px]">
        <div className="flex w-full flex-col items-center justify-center px-6 py-10 sm:px-10 lg:w-1/2 lg:px-20">
          <div className="flex w-full max-w-[320px] flex-col items-center">{children}</div>
        </div>

        <div className="relative hidden w-1/2 overflow-hidden rounded-panel lg:block">
          <Image
            src="/images/signup-room.jpg"
            alt="A modern meeting room with green fluted wall panels, a wooden table and ergonomic chairs"
            fill
            sizes="50vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-5 bg-gradient-to-t from-black/70 to-transparent p-6 backdrop-blur-md">
            <p className="text-testimonial text-white">
              Booking a room now takes seconds — no more double bookings or hunting for a
              free space before a call.
            </p>
            <div className="flex items-center gap-2.5">
              <p className="text-testimonial-author text-white/70">
                Olena K. - Office Manager
              </p>
              <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 backdrop-blur-sm">
                <div className="flex gap-0.5 text-rating">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} size={14} fill="currentColor" strokeWidth={0} aria-hidden />
                  ))}
                </div>
                <span className="text-xs font-medium text-white">5.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
