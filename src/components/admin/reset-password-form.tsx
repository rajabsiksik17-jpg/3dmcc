"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/app/admin/actions/auth";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    const res = await resetPassword({ password });
    setLoading(false);
    if (res.ok) {
      setDone(true);
      setTimeout(() => router.push("/admin"), 1500);
    } else {
      setError(res.error ?? "Failed to reset password.");
    }
  }

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-charcoal-50 p-6">
        <div className="w-full max-w-md rounded-2xl border border-charcoal-100 bg-white p-8 text-center shadow-card">
          <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
          <h1 className="mt-4 text-xl font-semibold text-charcoal-900">Password updated</h1>
          <p className="mt-1 text-sm text-charcoal-500">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal-50 p-6">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl border border-charcoal-100 bg-white p-8 shadow-card">
        <h1 className="text-xl font-semibold text-charcoal-900">Reset password</h1>
        <div className="mt-6 space-y-4">
          <div>
            <label className="label">New password</label>
            <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div>
            <label className="label">Confirm password</label>
            <input type="password" className="input" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          </div>
        </div>
        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}
        <Button type="submit" loading={loading} className="mt-6 w-full">
          Update password
        </Button>
      </form>
    </div>
  );
}
