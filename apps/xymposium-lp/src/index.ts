// xymposium-lp — the XYMPOSIUM redirect aggregator at xymposium.nemtus.com.
//
// A stable entry point that forwards to the per-year event sites:
//   /            -> latest year   (302 temporary; re-points as new years are added)
//   /2024[/...]  -> xymposium-2024.nemtus.com  (301 permanent)
//   /2025[/...]  -> xymposium-2025.nemtus.com  (301 permanent)
//   /<anything>  -> latest year   (302 temporary)
//
// Adding a new year = add one entry to YEARS and bump LATEST_YEAR. Nothing else changes.

const YEARS: Record<string, string> = {
  "2024": "https://xymposium-2024.nemtus.com",
  "2025": "https://xymposium-2025.nemtus.com",
};

// The year `/` (and any unknown path) redirects to. Bump this when a newer year launches.
const LATEST_YEAR = "2025";

export default {
  fetch(request: Request): Response {
    const url = new URL(request.url);

    // First non-empty path segment, e.g. "/2024/foo" -> "2024".
    const segments = url.pathname.split("/").filter(Boolean);
    const first = segments[0];

    if (first && Object.prototype.hasOwnProperty.call(YEARS, first)) {
      // Known year: 301 permanent, preserving any sub-path and query string.
      const rest = "/" + segments.slice(1).join("/");
      const target = new URL(rest + url.search, YEARS[first]);
      return Response.redirect(target.toString(), 301);
    }

    // Root or unknown path: 302 temporary to the latest year (query preserved).
    const target = new URL("/" + url.search, YEARS[LATEST_YEAR]);
    return Response.redirect(target.toString(), 302);
  },
};
