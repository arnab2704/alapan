import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Lets builds/verification run in their own folder so they never clobber a running `next dev`.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  reactStrictMode: true,
  transpilePackages: ["@alapon/ui", "@alapon/bengali", "@alapon/game-engine", "@alapon/types"]
};

export default withNextIntl(nextConfig);
