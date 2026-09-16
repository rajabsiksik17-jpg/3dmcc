import { requireSuperAdmin } from "@/lib/auth";
import { adminIntegrations } from "@/lib/admin-data";
import { createAdminClient } from "@/lib/supabase/admin";
import { IntegrationsPanel } from "@/components/admin/integrations-panel";
import { getAdminT } from "@/lib/admin-i18n";

export const dynamic = "force-dynamic";

export default async function IntegrationsPage() {
  await requireSuperAdmin();
  const { t } = await getAdminT();

  const integrations = await adminIntegrations();
  const ga = integrations.find((i) => i.key === "google_analytics")?.config as { measurementId?: string } | undefined;
  const gsc = integrations.find((i) => i.key === "google_search_console")?.config as { verificationTag?: string; propertyUrl?: string } | undefined;

  const { data: emailSettings } = await createAdminClient()
    .from("email_settings")
    .select("config")
    .limit(1)
    .maybeSingle();
  const smtpCfg = (emailSettings?.config ?? {}) as Record<string, unknown>;

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-charcoal-900">{t("integrations")}</h1>
      <IntegrationsPanel
        ga={{ enabled: Boolean(integrations.find((i) => i.key === "google_analytics")?.enabled), measurementId: ga?.measurementId ?? "" }}
        gsc={{
          enabled: Boolean(integrations.find((i) => i.key === "google_search_console")?.enabled),
          verificationTag: gsc?.verificationTag ?? "",
          propertyUrl: gsc?.propertyUrl ?? "",
        }}
        smtp={{
          host: String(smtpCfg.host ?? ""),
          port: Number(smtpCfg.port ?? 587),
          user: String(smtpCfg.user ?? ""),
          encryption: String(smtpCfg.encryption ?? "tls"),
          fromName: String(smtpCfg.fromName ?? "3DMCC"),
          fromEmail: String(smtpCfg.fromEmail ?? "info@3dmcc.net"),
        }}
      />
    </div>
  );
}
