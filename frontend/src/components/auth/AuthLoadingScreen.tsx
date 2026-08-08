import { Loader2 } from "lucide-react";

export function AuthLoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Loader2 size={24} className="animate-spin text-muted" aria-hidden />
    </div>
  );
}
