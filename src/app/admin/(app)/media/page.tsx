import { requireAdmin } from "@/lib/auth";
import { adminMedia } from "@/lib/admin-data";
import { deleteMedia } from "@/app/admin/actions/content";
import { MediaUploader } from "@/components/admin/media-uploader";
import { DeleteButton } from "@/components/admin/delete-button";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  await requireAdmin();
  const media = await adminMedia();

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-charcoal-900">Media Library</h1>

      <div className="mb-6 rounded-2xl border border-charcoal-100 bg-white p-5 shadow-card">
        <MediaUploader />
      </div>

      {media.length === 0 ? (
        <div className="rounded-2xl border border-charcoal-100 bg-white py-16 text-center text-sm text-charcoal-500 shadow-card">
          No media uploaded yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {media.map((m) => (
            <div key={m.id} className="overflow-hidden rounded-xl border border-charcoal-100 bg-white shadow-card">
              <div className="flex aspect-square items-center justify-center bg-charcoal-50">
                {m.type === "image" && m.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.url} alt={m.alt ?? m.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xs font-medium text-charcoal-400">{m.type}</span>
                )}
              </div>
              <div className="p-2">
                <p className="truncate text-xs font-medium text-charcoal-900">{m.name}</p>
                <div className="mt-1 flex items-center justify-between">
                  {m.url && (
                    <button
                      onClick={() => navigator.clipboard.writeText(m.url!)}
                      className="text-xs text-brand-600 hover:text-brand-700"
                    >
                      Copy URL
                    </button>
                  )}
                  <DeleteButton action={deleteMedia.bind(null, m.id)} confirmText="Delete this media?" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
