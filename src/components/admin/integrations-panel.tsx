"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  saveIntegration,
  saveEmailSettings,
  testSmtpInput,
  testImapConnection,
  testAnalyticsConnection,
} from "@/app/admin/actions/content";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { Json } from "@/types/database";

type Status = { ok: boolean; message: string } | null;

export function IntegrationsPanel({
  ga,
  gsc,
  smtp,
}: {
  ga: { enabled: boolean; measurementId: string };
  gsc: { enabled: boolean; verificationTag: string; propertyUrl: string };
  smtp: { host: string; port: number; user: string; encryption: string; fromName: string; fromEmail: string };
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [gaState, setGaState] = useState(ga);
  const [gscState, setGscState] = useState(gsc);
  const [smtpState, setSmtpState] = useState({ ...smtp, password: "" });
  const [imapState, setImapState] = useState({ host: "", port: 993, encryption: "ssl" });
  const [status, setStatus] = useState<Record<string, Status>>({});

  function run(key: string, fn: () => Promise<{ ok: boolean; error?: string; detail?: string }>) {
    startTransition(async () => {
      const res = await fn();
      setStatus((s) => ({ ...s, [key]: { ok: res.ok, message: res.ok ? "Success" : res.error ?? "Failed" } }));
    });
  }

  return (
    <div className="space-y-6">
      {/* Google Analytics */}
      <Section title="Google Analytics (GA4)">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Measurement ID</label>
            <input className="input" placeholder="G-XXXXXXXXXX" value={gaState.measurementId} onChange={(e) => setGaState({ ...gaState, measurementId: e.target.value })} />
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input type="checkbox" className="h-4 w-4 text-brand-600" checked={gaState.enabled} onChange={(e) => setGaState({ ...gaState, enabled: e.target.checked })} />
            <span className="text-sm text-charcoal-700">Enabled</span>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button size="sm" loading={pending} onClick={() => run("ga-save", () => saveIntegration({ key: "google_analytics", config: { measurementId: gaState.measurementId } as Json, enabled: gaState.enabled }).then(() => { router.refresh(); return { ok: true }; }))}>Save</Button>
          <Button size="sm" variant="secondary" loading={pending} onClick={() => run("ga-test", () => testAnalyticsConnection({ measurementId: gaState.measurementId }))}>Test Connection</Button>
          <Button size="sm" variant="ghost" onClick={() => run("ga-disconnect", () => saveIntegration({ key: "google_analytics", config: {} as Json, enabled: false }).then(() => { setGaState({ ...gaState, measurementId: "", enabled: false }); router.refresh(); return { ok: true }; }))}>Disconnect</Button>
        </div>
        <StatusLine status={status["ga-test"] ?? status["ga-save"] ?? status["ga-disconnect"]} />
      </Section>

      {/* Google Search Console */}
      <Section title="Google Search Console">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Property URL</label>
            <input className="input" placeholder="https://3dmcc.net" value={gscState.propertyUrl} onChange={(e) => setGscState({ ...gscState, propertyUrl: e.target.value })} />
          </div>
          <div>
            <label className="label">Verification Meta Tag Content</label>
            <input className="input" placeholder="google-site-verification=..." value={gscState.verificationTag} onChange={(e) => setGscState({ ...gscState, verificationTag: e.target.value })} />
          </div>
        </div>
        <div className="mt-4">
          <Button size="sm" loading={pending} onClick={() => run("gsc-save", () => saveIntegration({ key: "google_search_console", config: { verificationTag: gscState.verificationTag, propertyUrl: gscState.propertyUrl } as Json, enabled: gscState.enabled }).then(() => { router.refresh(); return { ok: true }; }))}>Save</Button>
        </div>
        {gscState.verificationTag && (
          <p className="mt-3 text-xs text-charcoal-500">Verification tag: <code className="rounded bg-charcoal-100 px-1.5 py-0.5">{gscState.verificationTag}</code></p>
        )}
        <StatusLine status={status["gsc-save"]} />
      </Section>

      {/* SMTP */}
      <Section title="SMTP (Email)">
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label">SMTP Host</label><input className="input" value={smtpState.host} onChange={(e) => setSmtpState({ ...smtpState, host: e.target.value })} /></div>
          <div><label className="label">SMTP Port</label><input className="input" type="number" value={smtpState.port} onChange={(e) => setSmtpState({ ...smtpState, port: Number(e.target.value) })} /></div>
          <div><label className="label">Username</label><input className="input" value={smtpState.user} onChange={(e) => setSmtpState({ ...smtpState, user: e.target.value })} /></div>
          <div><label className="label">Password (leave blank to keep)</label><input className="input" type="password" value={smtpState.password} onChange={(e) => setSmtpState({ ...smtpState, password: e.target.value })} /></div>
          <div>
            <label className="label">Encryption</label>
            <select className="input" value={smtpState.encryption} onChange={(e) => setSmtpState({ ...smtpState, encryption: e.target.value })}>
              <option value="tls">TLS (STARTTLS)</option>
              <option value="ssl">SSL</option>
              <option value="none">None</option>
            </select>
          </div>
          <div><label className="label">From Email</label><input className="input" value={smtpState.fromEmail} onChange={(e) => setSmtpState({ ...smtpState, fromEmail: e.target.value })} /></div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button size="sm" loading={pending} onClick={() => run("smtp-save", () => saveEmailSettings(smtpState).then(() => { router.refresh(); return { ok: true }; }))}>Save</Button>
          <Button size="sm" variant="secondary" loading={pending} onClick={() => run("smtp-test", () => testSmtpInput(smtpState))}>Test SMTP Connection</Button>
        </div>
        <StatusLine status={status["smtp-test"] ?? status["smtp-save"]} />
      </Section>

      {/* IMAP */}
      <Section title="IMAP (Inbox)">
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label">IMAP Host</label><input className="input" value={imapState.host} onChange={(e) => setImapState({ ...imapState, host: e.target.value })} /></div>
          <div><label className="label">IMAP Port</label><input className="input" type="number" value={imapState.port} onChange={(e) => setImapState({ ...imapState, port: Number(e.target.value) })} /></div>
          <div>
            <label className="label">Encryption</label>
            <select className="input" value={imapState.encryption} onChange={(e) => setImapState({ ...imapState, encryption: e.target.value })}>
              <option value="ssl">SSL</option>
              <option value="tls">TLS</option>
              <option value="none">None</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <Button size="sm" variant="secondary" loading={pending} onClick={() => run("imap-test", () => testImapConnection(imapState))}>Test IMAP Connection</Button>
        </div>
        <StatusLine status={status["imap-test"]} />
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-charcoal-100 bg-white p-6 shadow-card">
      <h2 className="mb-4 font-semibold text-charcoal-900">{title}</h2>
      {children}
    </div>
  );
}

function StatusLine({ status }: { status: Status }) {
  if (!status) return null;
  return (
    <div className={`mt-3 flex items-center gap-2 text-sm ${status.ok ? "text-emerald-600" : "text-red-600"}`}>
      {status.ok ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
      {status.message}
    </div>
  );
}
