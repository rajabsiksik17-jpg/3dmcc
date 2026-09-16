import Link from "next/link";

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-white p-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">404</p>
          <h1 className="mt-3 text-3xl font-bold text-charcoal-900">Page Not Found</h1>
          <p className="mt-3 text-charcoal-600">The page you are looking for does not exist.</p>
          <Link href="/en" className="btn-primary mt-6">
            Back to Home
          </Link>
        </div>
      </body>
    </html>
  );
}
