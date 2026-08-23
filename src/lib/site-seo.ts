/** Public site URL - set VITE_SITE_URL in production (e.g. https://mycitycenter.online) */
export const SITE_URL = (
  import.meta.env.VITE_SITE_URL as string | undefined
)?.replace(/\/$/, "") || "https://mycitycenter.online";

export const SITE_NAME = "Kohat Business Directory";

export const DEFAULT_DESCRIPTION =
  "Discover every business in Kohat - restaurants, cafés, biryani spots, bike shops, salons, tailors, workshops and more. Contact owners directly on WhatsApp or phone.";

export const DEFAULT_OG_IMAGE = `${SITE_URL}/my-city-center-logo.png`;

export function siteUrl(path = "/") {
  if (!path || path === "/") return `${SITE_URL}/`;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: string;
  noindex?: boolean;
};

export function pageHead({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  type = "website",
  noindex = false,
}: PageMetaInput) {
  const url = siteUrl(path);
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "author", content: SITE_NAME },
      ...(noindex ? [{ name: "robots", content: "noindex, nofollow" } as const] : []),
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:url", content: url },
      { property: "og:image", content: image },
      { property: "og:locale", content: "en_PK" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

export function jsonLdScript(data: Record<string, unknown>) {
  return {
    type: "application/ld+json" as const,
    children: JSON.stringify(data),
  };
}

export function websiteJsonLd() {
  return jsonLdScript({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: siteUrl("/"),
    description: DEFAULT_DESCRIPTION,
    inLanguage: ["en", "ur"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl("/shops")}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  });
}

export function organizationJsonLd() {
  return jsonLdScript({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: siteUrl("/"),
    logo: DEFAULT_OG_IMAGE,
    areaServed: {
      "@type": "City",
      name: "Kohat",
      containedInPlace: { "@type": "AdministrativeArea", name: "Khyber Pakhtunkhwa" },
    },
  });
}

export function webPageJsonLd({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  return jsonLdScript({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: siteUrl(path),
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: siteUrl("/") },
  });
}

export function localBusinessJsonLd(shop: {
  name: string;
  tagline: string;
  image: string;
  phone: string;
  whatsapp: string;
  address?: string | null;
  area: string;
  slug: string;
  categoryLabel: string;
  website?: string | null;
}) {
  const url = siteUrl(`/shops/${shop.slug}`);
  const phone = shop.phone || shop.whatsapp;
  return jsonLdScript({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: shop.name,
    description: shop.tagline,
    image: shop.image,
    url,
    telephone: phone || undefined,
    ...(shop.website ? { sameAs: [shop.website] } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: shop.address || shop.area,
      addressLocality: shop.area,
      addressRegion: "Khyber Pakhtunkhwa",
      addressCountry: "PK",
    },
    areaServed: "Kohat",
    category: shop.categoryLabel,
  });
}

/** Static routes included in sitemap.xml */
export const STATIC_SITEMAP_PATHS = [
  "/",
  "/shops",
  "/about",
  "/contact",
  "/list-business",
] as const;
