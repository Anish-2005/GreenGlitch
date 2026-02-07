"use client";

import { useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase/client";
import { useAuth } from "./AuthProvider";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ShieldCheck, Command, Lock, Cpu } from "lucide-react";

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
      setError("AUTHENTICATION_FAILED: POPUP_BLOCKED_OR_INTERRUPTED");
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = async () => {
    await signOutUser();
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-6">

      {/* Back Link - Styled as small tech label */}
      <Link
        href="/"
        className="absolute top-12 left-12 group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground hover:text-foreground transition-all duration-500 italic"
      >
        <div className="h-8 w-8 rounded-xl bg-secondary flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
          <ArrowLeft className="h-4 w-4" />
        </div>
        <span>Terminate Session / Return</span>
      </Link>

      {/* Decorative Technical UI elements */}
      <div className="absolute bottom-12 left-12 hidden lg:flex flex-col gap-2 opacity-30">
        <div className="flex gap-2 items-center text-[8px] font-black tracking-widest text-muted-foreground uppercase">
          <Cpu className="h-3 w-3" /> System Architecture: v4.2.0-LTS
        </div>
        <div className="flex gap-2 items-center text-[8px] font-black tracking-widest text-muted-foreground uppercase">
          <Lock className="h-3 w-3" /> Core Protocols: Encrypted
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-xl"
      >
        <div className="relative group">
          {/* High-end Neon Glow behind the card */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-emerald-500/10 to-sky-500/20 rounded-[3.5rem] blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />

          <div className="relative glass rounded-[3.5rem] p-1 shadow-[0_80px_160px_rgba(0,0,0,0.5)] overflow-hidden border border-white/10 dark:border-white/5">
            <div className="bg-background/80 dark:bg-background/40 backdrop-blur-3xl rounded-[3.4rem] p-10 md:p-20 flex flex-col items-center">

              <div className="mb-12 relative">
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
                <div className="relative h-24 w-24 rounded-3xl bg-secondary/80 flex items-center justify-center border border-white/10 shadow-2xl group-hover:rotate-[15deg] transition-transform duration-700">
                  <Image src="/greenglitch-logo.svg" alt="Logo" width={56} height={56} className="dark:invert-0 invert" />
                </div>
              </div>

              <div className="text-center space-y-6 mb-16">
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic leading-none">
                  DECRYPTING <br />
                  <span className="text-gradient">IDENTITY.</span>
                </h1>
                <p className="max-w-xs mx-auto text-muted-foreground font-medium text-sm leading-relaxed tracking-tight">
                  Establish a secure linkage to the civic network core. All telemetry remains sovereign.
                </p>
              </div>

              <div className="w-full space-y-4">
                <Button
                  type="button"
                  onClick={handleLogin}
                  disabled={busy}
                  className="group relative w-full h-20 rounded-[1.8rem] bg-foreground text-background hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10 flex items-center justify-center gap-4">
                    <svg className="h-6 w-6" viewBox="0 0 24 24">
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
                    <span className="text-sm font-black uppercase tracking-[0.3em]">
                      {busy ? "LINKING..." : "Establish Link"}
                    </span>
                  </div>
                </Button>

                <AnimatePresence>
                  {user && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="w-full h-16 rounded-2xl border-white/10 bg-transparent text-[10px] font-black uppercase tracking-widest hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all duration-300 mt-4"
                      >
                        Terminate Link
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-8 p-4 rounded-[1.2rem] bg-destructive/10 border border-destructive/20 text-destructive text-[9px] font-black uppercase tracking-widest"
                >
                  {error}
                </motion.div>
              )}

              <div className="mt-16 flex items-center justify-center gap-3 text-[9px] uppercase tracking-[0.4em] text-muted-foreground font-black opacity-50">
                <ShieldCheck className="h-3 w-3" />
                Biometric / Sovereign Pass Ready
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
