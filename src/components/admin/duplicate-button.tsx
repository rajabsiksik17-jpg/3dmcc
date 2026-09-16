"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Copy } from "lucide-react";

export function DuplicateButton({
  action,
  label,
}: {
  action: () => Promise<{ ok: boolean; error?: string }>;
  label?: string;
}) {
  const t = useTranslations();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await action();
          router.refresh();
        })
      }
      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-charcoal-600 hover:bg-charcoal-50 disabled:opacity-50"
    >
      <Copy className="h-3.5 w-3.5" />
      {label ?? t("new")}
    </button>
  );
}
