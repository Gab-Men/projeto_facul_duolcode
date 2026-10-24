import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";
const frontendRoot = fileURLToPath(new URL(".", import.meta.url));
const config: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: frontendRoot,
  turbopack: { root: frontendRoot },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.API_INTERNAL_URL ?? "http://127.0.0.1:3001"}/api/:path*`,
      },
    ];
  },
};
export default config;
