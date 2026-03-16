import type { MetadataRoute } from "next";
import { destinations, treatments } from "../lib/seo-content";
import { africaCountries } from "../lib/africa-content";
import { highVolumeCountries } from "../lib/high-volume-country-content";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const treatmentRoutes: MetadataRoute.Sitemap = [
    {
      url: "https://www.treataxis.com/treatments",
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...treatments.map((item) => ({
      url: `https://www.treataxis.com/treatments/${item.slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    {
      url: "https://www.treataxis.com/blog",
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...treatments.map((item) => ({
      url: `https://www.treataxis.com/blog/${item.slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
  ];

  const destinationRoutes: MetadataRoute.Sitemap = [
    {
      url: "https://www.treataxis.com/destinations",
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...destinations.map((country) => ({
      url: `https://www.treataxis.com/destinations/${country.slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    ...destinations.flatMap((country) =>
      country.cities.map((city) => ({
        url: `https://www.treataxis.com/destinations/${country.slug}/${city.slug}`,
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    ),
  ];

  return [
    {
      url: "https://www.treataxis.com",
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://www.treataxis.com/africa",
      lastModified,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: "https://www.treataxis.com/countries",
      lastModified,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    ...africaCountries.map((item) => ({
      url: `https://www.treataxis.com/africa/${item.slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...highVolumeCountries.map((item) => ({
      url: `https://www.treataxis.com/countries/${item.slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    {
      url: "https://www.treataxis.com/doctors",
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://www.treataxis.com/about",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://www.treataxis.com/contact",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://www.treataxis.com/privacy",
      lastModified,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: "https://www.treataxis.com/terms",
      lastModified,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: "https://www.treataxis.com/medical-disclaimer",
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    ...treatmentRoutes,
    ...destinationRoutes,
  ];
}