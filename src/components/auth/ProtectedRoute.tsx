"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      const next = pathname ? `?next=${encodeURIComponent(pathname)}` : "";
      router.replace(`/login${next}`);
    }
  }, [loading, user, router, pathname]);

  if (loading || (!user && typeof window !== "undefined")) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="animate-spin rounded-full border-b-2 border-white/60 p-4" aria-label="Loading" />
      </div>
    );
  }

  return <>{children}</>;
}
