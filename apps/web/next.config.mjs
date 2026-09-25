import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Lets builds/verification run in their own folder so they never clobber a running `next dev`.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()"
          },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" }
        ]
      },
      { source: "/sw.js", headers: [{ key: "Cache-Control", value: "no-cache" }] }
    ];
  },
  transpilePackages: ["@alapon/ui", "@alapon/bengali", "@alapon/game-engine", "@alapon/types"]
};

export default withNextIntl(nextConfig);
