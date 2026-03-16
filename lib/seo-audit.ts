export type AuditCheck = {
  label: string;
  passed: boolean;
  detail: string;
  weight: number;
};

export type AuditResult = {
  url: string;
  seoScore: number;
  eeatScore: number;
  totalScore: number;
  checkedAt: string;
  seoChecks: AuditCheck[];
  eeatChecks: AuditCheck[];
};

function match(content: string, regex: RegExp): string | null {
  const found = content.match(regex);
  return found?.[1]?.trim() || null;
}

function countMatches(content: string, regex: RegExp): number {
  return content.match(regex)?.length || 0;
}

function toScore(checks: AuditCheck[]): number {
  const max = checks.reduce((sum, check) => sum + check.weight, 0);
  const actual = checks.reduce((sum, check) => sum + (check.passed ? check.weight : 0), 0);
  if (!max) return 0;
  return Math.round((actual / max) * 100);
}

export function scoreHtml(url: string, html: string): AuditResult {
  const title = match(html, /<title>([\s\S]*?)<\/title>/i) || "";
  const description = match(html, /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i) || "";
  const canonical = match(html, /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i) || "";
  const h1Count = countMatches(html, /<h1[\s>]/gi);
  const words = html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").trim();
  const wordCount = words ? words.split(/\s+/).length : 0;

  const imgCount = countMatches(html, /<img[\s>]/gi);
  const imgAltCount = countMatches(html, /<img[^>]*\salt=["'][^"']*["'][^>]*>/gi);

  const internalAnchorCount = countMatches(html, /<a[^>]+href=["']\//gi);
  const hasJsonLd = /application\/ld\+json/i.test(html);
  const hasOg = /property=["']og:title["']/i.test(html) && /property=["']og:description["']/i.test(html);
  const hasTwitterCard = /name=["']twitter:card["']/i.test(html);
  const isNoIndex = /<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i.test(html);

  const hasAboutLink = /href=["'][^"']*\/about["']/i.test(html);
  const hasContactLink = /href=["'][^"']*\/contact["']/i.test(html);
  const hasPrivacyLink = /href=["'][^"']*\/privacy["']/i.test(html);
  const hasTermsLink = /href=["'][^"']*\/terms["']/i.test(html);
  const hasDisclaimerLink = /href=["'][^"']*\/medical-disclaimer["']/i.test(html);
  const hasAuthorOrReviewer = /author|reviewedBy|accountablePerson|medical reviewer|editorial team/i.test(html);
  const hasPublishedDates = /datePublished|dateModified|lastReviewed/i.test(html);
  const hasMedicalSchema = /MedicalWebPage|MedicalOrganization|Physician|Person/i.test(html);
  const hasFaqSchema = /FAQPage/i.test(html);
  const hasOrganization = /"@type"\s*:\s*"Organization"/i.test(html);

  const seoChecks: AuditCheck[] = [
    {
      label: "Title tag quality",
      passed: title.length >= 30 && title.length <= 70,
      detail: title ? `Title length: ${title.length}` : "Missing title tag",
      weight: 12,
    },
    {
      label: "Meta description quality",
      passed: description.length >= 120 && description.length <= 180,
      detail: description ? `Description length: ${description.length}` : "Missing meta description",
      weight: 12,
    },
    {
      label: "Single H1 heading",
      passed: h1Count === 1,
      detail: `H1 count: ${h1Count}`,
      weight: 10,
    },
    {
      label: "Canonical URL",
      passed: Boolean(canonical),
      detail: canonical ? `Canonical set: ${canonical}` : "Missing canonical",
      weight: 8,
    },
    {
      label: "Indexability",
      passed: !isNoIndex,
      detail: isNoIndex ? "Page appears noindex" : "No noindex robots tag found",
      weight: 8,
    },
    {
      label: "Open Graph metadata",
      passed: hasOg,
      detail: hasOg ? "og:title and og:description found" : "Missing Open Graph title/description",
      weight: 8,
    },
    {
      label: "Twitter card metadata",
      passed: hasTwitterCard,
      detail: hasTwitterCard ? "twitter:card found" : "Missing twitter:card",
      weight: 5,
    },
    {
      label: "Structured data present",
      passed: hasJsonLd,
      detail: hasJsonLd ? "JSON-LD detected" : "No JSON-LD detected",
      weight: 10,
    },
    {
      label: "Internal links depth",
      passed: internalAnchorCount >= 5,
      detail: `Internal links detected: ${internalAnchorCount}`,
      weight: 10,
    },
    {
      label: "Content depth",
      passed: wordCount >= 500,
      detail: `Estimated words: ${wordCount}`,
      weight: 10,
    },
    {
      label: "Image alt coverage",
      passed: imgCount === 0 || imgAltCount === imgCount,
      detail: `Images: ${imgCount}, with alt: ${imgAltCount}`,
      weight: 7,
    },
  ];

  const eeatChecks: AuditCheck[] = [
    {
      label: "About page linked",
      passed: hasAboutLink,
      detail: hasAboutLink ? "About link found" : "No About link found",
      weight: 10,
    },
    {
      label: "Contact page linked",
      passed: hasContactLink,
      detail: hasContactLink ? "Contact link found" : "No Contact link found",
      weight: 10,
    },
    {
      label: "Privacy policy linked",
      passed: hasPrivacyLink,
      detail: hasPrivacyLink ? "Privacy link found" : "No Privacy link found",
      weight: 8,
    },
    {
      label: "Terms page linked",
      passed: hasTermsLink,
      detail: hasTermsLink ? "Terms link found" : "No Terms link found",
      weight: 8,
    },
    {
      label: "Medical disclaimer linked",
      passed: hasDisclaimerLink,
      detail: hasDisclaimerLink ? "Medical disclaimer link found" : "No medical disclaimer link found",
      weight: 12,
    },
    {
      label: "Author or reviewer signal",
      passed: hasAuthorOrReviewer,
      detail: hasAuthorOrReviewer ? "Author/reviewer mention found" : "No author/reviewer signal found",
      weight: 12,
    },
    {
      label: "Review/publication date signals",
      passed: hasPublishedDates,
      detail: hasPublishedDates ? "DatePublished/DateModified/LastReviewed present" : "No clear review/publication dates found",
      weight: 10,
    },
    {
      label: "Medical schema presence",
      passed: hasMedicalSchema,
      detail: hasMedicalSchema ? "Medical schema/reviewer entity present" : "No medical schema entities detected",
      weight: 12,
    },
    {
      label: "Organization trust entity",
      passed: hasOrganization,
      detail: hasOrganization ? "Organization schema found" : "Organization schema not found",
      weight: 8,
    },
    {
      label: "FAQ trust-supporting schema",
      passed: hasFaqSchema,
      detail: hasFaqSchema ? "FAQ schema found" : "No FAQ schema detected",
      weight: 10,
    },
  ];

  const seoScore = toScore(seoChecks);
  const eeatScore = toScore(eeatChecks);

  return {
    url,
    seoScore,
    eeatScore,
    totalScore: Math.round((seoScore + eeatScore) / 2),
    checkedAt: new Date().toISOString(),
    seoChecks,
    eeatChecks,
  };
}