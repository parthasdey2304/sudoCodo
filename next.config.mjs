/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/sitemap.xml",
        headers: [{ key: "Content-Type", value: "application/xml" }],
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    dangerouslyAllowSVG: true,
  },
  async redirects() {
    return [
      // Short alias so /arena deep links (sitemap, ads, QR) resolve instead of 404
      { source: "/arena", destination: "/duels", permanent: true },
    ];
  },
};
export default nextConfig;
