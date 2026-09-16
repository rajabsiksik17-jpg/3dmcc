"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, forgotPassword } from "@/app/admin/actions/auth";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await login({ email, password });
    setLoading(false);
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError(res.error ?? "Login failed");
    }
  }

  async function onForgot() {
    setInfo("");
    setError("");
    if (!email) {
      setError("Enter your email address first.");
      return;
    }
    const res = await forgotPassword({ email });
    if (res.ok) setInfo("Password reset link sent to your email.");
    else setError(res.error ?? "Failed to send reset email.");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal-50 p-6">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient text-base font-bold text-white">
            3D
          </span>
          <div>
            <p className="text-lg font-bold text-charcoal-900">3DMCC</p>
            <p className="text-xs text-charcoal-500">Admin Dashboard</p>
          </div>
        </div>
        <form onSubmit={onSubmit} className="rounded-2xl border border-charcoal-100 bg-white p-8 shadow-card">
          <h1 className="text-xl font-semibold text-charcoal-900">Sign in</h1>
          <p className="mt-1 text-sm text-charcoal-500">Access the management dashboard.</p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
          {info && (
            <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {info}
            </div>
          )}

          <Button type="submit" loading={loading} className="mt-6 w-full">
            Sign in
          </Button>

          <button type="button" onClick={onForgot} className="mt-4 w-full text-center text-sm text-brand-600 hover:text-brand-700">
            Forgot password?
          </button>
        </form>
      </div>
    </div>
  );
}
