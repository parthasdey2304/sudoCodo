import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: { path: string; priority: number; changeFreq: "daily" | "weekly" | "monthly" }[] = [
    { path: "/", priority: 1.0, changeFreq: "daily" },
    { path: "/duels", priority: 0.95, changeFreq: "daily" },
    { path: "/dailies", priority: 0.95, changeFreq: "daily" },
    { path: "/ascenso", priority: 0.9, changeFreq: "weekly" },
    { path: "/monkey-code", priority: 0.9, changeFreq: "weekly" },
    { path: "/sequencing", priority: 0.9, changeFreq: "weekly" },
    { path: "/maze", priority: 0.9, changeFreq: "weekly" },
    { path: "/puzzle", priority: 0.8, changeFreq: "monthly" },
    { path: "/bird", priority: 0.8, changeFreq: "weekly" },
    { path: "/turtle", priority: 0.8, changeFreq: "monthly" },
    { path: "/movie", priority: 0.7, changeFreq: "monthly" },
    { path: "/music", priority: 0.7, changeFreq: "monthly" },
    { path: "/pond", priority: 0.8, changeFreq: "weekly" },
  ];

  return routes.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFreq,
    priority: r.priority,
  }));
}
