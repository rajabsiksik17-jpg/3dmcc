import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Match all pathnames except for
    // - files with extensions (e.g. images, css, js)
    // - _next, api, admin, and public files
    "/((?!api|admin|auth|_next|_vercel|.*\\..*).*)",
  ],
};
