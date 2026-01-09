"use client";

import { useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase/client";
import { useAuth } from "./AuthProvider";

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
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 text-white shadow-2xl backdrop-blur">
        <div className="space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-400">GreenGlitch Access</p>
          <h1 className="text-3xl font-semibold">Sign in to continue</h1>
          <p className="text-sm text-slate-300">Only authenticated volunteers can file reports or view the live dashboard.</p>
        </div>
        <div className="space-y-3">
          <Button
            type="button"
            onClick={handleLogin}
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 bg-white text-slate-900 hover:bg-slate-100"
          >
            {busy ? "Connecting" : "Continue with Google"}
          </Button>
          {user ? (
            <Button type="button" variant="secondary" onClick={handleLogout} className="w-full">
              Sign Out
            </Button>
          ) : null}
        </div>
        {error ? <p className="text-center text-sm text-red-400">{error}</p> : null}
        <p className="text-center text-xs text-slate-400">We never post to your account. Access is only used to associate reports with trusted volunteers.</p>
      </div>
    </div>
  );
}
