export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  const json = Array.isArray(data) ? data : [data];
  return (
    <>
      {json.map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}
    </>
  );
}

// Helpers — all emit absolute URLs ready for Google

export function websiteSchema(siteUrl: string, siteName: string, siteTagline: string, logoUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}#website`,
    url: siteUrl,
    name: siteName,
    description: siteTagline,
    publisher: { "@id": `${siteUrl}#organization` },
    inLanguage: "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationSchema(siteUrl: string, siteName: string, logoUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}#organization`,
    name: siteName,
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: logoUrl,
      width: 512,
      height: 512,
    },
    sameAs: ["https://github.com/parthasdey2304/sudoCodo"],
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

export function softwareAppSchema(opts: {
  name: string;
  url: string;
  description: string;
  image: string;
  applicationCategory: string;
  operatingSystem: string;
  offersPrice: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: opts.name,
    url: opts.url,
    description: opts.description,
    image: opts.image,
    applicationCategory: opts.applicationCategory,
    operatingSystem: opts.operatingSystem,
    offers: {
      "@type": "Offer",
      price: opts.offersPrice,
      priceCurrency: "USD",
    },
    publisher: { "@id": `${opts.url.split("/").slice(0, 3).join("/")}#organization` },
    isAccessibleForFree: true,
    educationalUse: "coding tutorial for kids",
  };
}

export function courseSchema(opts: {
  name: string;
  url: string;
  description: string;
  image: string;
  totalLevels: number;
  providerUrl: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: opts.name,
    description: opts.description,
    url: opts.url,
    image: opts.image,
    provider: {
      "@type": "Organization",
      name: "SudoCodo",
      sameAs: opts.providerUrl,
    },
    numberOfCredits: opts.totalLevels,
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: `PT${opts.totalLevels * 5}M`,
    },
  };
}
