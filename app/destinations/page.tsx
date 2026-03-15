import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Medical Tourism Destinations",
  description:
    "Explore country and city destination pages designed as SEO clusters for treatment-abroad search intent.",
  alternates: { canonical: "/destinations" },
};

export default function DestinationsIndexPage() {
  permanentRedirect("/africa");
}
