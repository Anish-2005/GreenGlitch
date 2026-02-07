"use client";

import { useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase/client";
import { useAuth } from "./AuthProvider";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export function LoginScreen() {
  const router = useRouter();
  const params = useSearchParams();
  const { user, signOutUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) {
      const next = params?.get("next") ?? "/dashboard";
      router.replace(next);
    }
  }, [user, router, params]);

  const handleLogin = async () => {
    setBusy(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error(err);
      setError("Login failed. Make sure pop-ups are allowed and try again.");
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = async () => {
    await signOutUser();
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 -z-10 h-full w-full bg-background" />
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-[100px]" />
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-indigo-500/10 blur-[100px]" />

      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md px-6"
      >
        <div className="glass rounded-[2.5rem] p-8 md:p-12 shadow-2xl space-y-8">
          <div className="text-center space-y-4">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Image src="/greenglitch-logo.svg" alt="Logo" width={40} height={40} />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold tracking-tight">Welcome back.</h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Sign in to access the reporter tool and live heatmap dashboard.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Button
              type="button"
              onClick={handleLogin}
              disabled={busy}
              className="relative w-full h-14 rounded-2xl bg-foreground text-background hover:bg-foreground/90 font-bold shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <div className="flex items-center justify-center gap-3">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {busy ? "Signing in..." : "Continue with Google"}
              </div>
            </Button>

            {user && (
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full h-14 rounded-2xl border-border bg-transparent font-bold"
              >
                Sign Out
              </Button>
            )}
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs text-center font-medium">
              {error}
            </div>
          )}

          <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
            <ShieldCheck className="h-3 w-3" />
            Secure Authentication
          </div>
        </div>
      </motion.div>
    </div>
  );
}
