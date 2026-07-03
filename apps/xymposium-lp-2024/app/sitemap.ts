import type { MetadataRoute } from "next";

const BASE_URL = "https://community-xymposium-2024.nemtus.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/registration", "/terms"];
  return routes.map((path) => ({
    url: `${BASE_URL}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
}
