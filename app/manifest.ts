import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TreatAxis",
    short_name: "TreatAxis",
    description:
      "TreatAxis helps international patients plan treatment abroad with confidence.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf7ef",
    theme_color: "#0f766e",
    lang: "en",
  };
}