import { r as e } from "./useRouter-Dpb7RwMI.js";
import { t } from "./link-Dg6wktOY.js";
var n = e();
function r() {
  return (0, n.jsxs)(`div`, {
    className: `relative flex min-h-screen flex-col items-center justify-center gap-4 px-5 text-center`,
    children: [
      (0, n.jsx)(`div`, {
        className: `aura pointer-events-none absolute inset-0 -z-10`,
      }),
      (0, n.jsx)(`h1`, {
        className: `font-display text-3xl font-bold`,
        children: `This handle is free`,
      }),
      (0, n.jsx)(`p`, {
        className: `max-w-sm text-sm text-muted-foreground`,
        children: `Nobody has claimed this page yet — or it has been removed.`,
      }),
      (0, n.jsx)(t, {
        to: `/auth`,
        search: { mode: `signup` },
        className: `btn-primary`,
        children: `Claim it`,
      }),
    ],
  });
}
export { r as notFoundComponent };
