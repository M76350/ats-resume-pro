import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  noIndex?: boolean;
  publishedDate?: string;
  modifiedDate?: string;
  author?: string;
  keywords?: string;
  category?: string;
  faqSchema?: Array<{ q: string; a: string }>;
  isApp?: boolean;
}

export const SITE_URL = "https://ats-resume-pro-swart.vercel.app";
export const SITE_NAME = "FreeATS";
const DEFAULT_IMAGE = `${SITE_URL}/FreeATS.jpg`;

// Core keyword set for the site — used as base for all pages
const BASE_KEYWORDS =
  "free ATS resume checker, ATS score checker, resume builder free, ATS friendly resume, resume scanner online, CV checker ATS, resume optimization tool, applicant tracking system resume, free resume checker, check ATS score, resume keyword checker, free resume builder no sign up, ATS compatible resume, resume parser free, improve ATS score";

const SEO = ({
  title,
  description,
  canonical,
  ogImage = DEFAULT_IMAGE,
  ogType = "website",
  noIndex = false,
  publishedDate,
  modifiedDate,
  author = "Manish Yadav",
  keywords,
  category,
  faqSchema,
  isApp = false,
}: SEOProps) => {
  const fullTitle = title.includes("FreeATS") ? title : `${title} | FreeATS`;
  const canonicalUrl = canonical ? `${SITE_URL}${canonical}` : SITE_URL;
  // Merge page-specific keywords with base keywords
  const allKeywords = keywords ? `${keywords}, ${BASE_KEYWORDS}` : BASE_KEYWORDS;

  const faqJsonLd = faqSchema && faqSchema.length > 0 ? JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqSchema.map(({ q, a }) => ({
      "@type": "Question",
      "name": q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": a,
      },
    })),
  }) : null;

  const appSchema = isApp ? JSON.stringify({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "FreeATS Resume Checker",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "url": SITE_URL,
    "description": "Free ATS resume checker and builder. Get an instant ATS compatibility score, keyword gap analysis, and actionable tips. No sign-up required.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1247",
      "bestRating": "5",
      "worstRating": "1",
    },
    "featureList": [
      "Instant ATS Score (0-100)",
      "Keyword Gap Analysis",
      "Resume Builder",
      "ATS-Friendly Templates",
      "PDF Download",
      "No Sign-Up Required",
      "100% Free",
    ],
    "screenshot": `${SITE_URL}/FreeATS.jpg`,
    "author": {
      "@type": "Person",
      "name": "Manish Yadav",
    },
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "url": SITE_URL,
    },
  }) : null;

  const articleSchema = ogType === "article" ? JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": fullTitle,
    "description": description,
    "url": canonicalUrl,
    "image": {
      "@type": "ImageObject",
      "url": ogImage,
      "width": 1200,
      "height": 630,
    },
    "author": {
      "@type": "Person",
      "name": author,
      "url": "https://www.linkedin.com/in/manish0911/",
    },
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "url": SITE_URL,
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/FreeATS.jpg`,
      },
    },
    "datePublished": publishedDate || "2026-01-01",
    "dateModified": modifiedDate || publishedDate || "2026-05-01",
    "mainEntityOfPage": { "@type": "WebPage", "@id": canonicalUrl },
    "articleSection": category || "Resume Tips",
    "keywords": allKeywords,
  }) : null;

  const websiteSchema = ogType === "website" ? JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": SITE_NAME,
    "alternateName": "Free ATS Resume Checker",
    "url": SITE_URL,
    "description": description,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${SITE_URL}/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }) : null;

  const breadcrumbSchema = canonical && canonical !== "/" ? JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
      { "@type": "ListItem", "position": 2, "name": fullTitle.split("|")[0].trim(), "item": canonicalUrl },
    ],
  }) : null;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={canonicalUrl} />
      {noIndex
        ? <meta name="robots" content="noindex, nofollow" />
        : <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      }

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${SITE_NAME} — ${fullTitle.split("|")[0].trim()}`} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={`${SITE_NAME} — ${fullTitle.split("|")[0].trim()}`} />
      <meta name="twitter:site" content="@freeats" />
      <meta name="twitter:creator" content="@freeats" />

      {/* Article specific */}
      {ogType === "article" && publishedDate && (
        <meta property="article:published_time" content={publishedDate} />
      )}
      {ogType === "article" && (modifiedDate || publishedDate) && (
        <meta property="article:modified_time" content={modifiedDate || publishedDate} />
      )}
      {ogType === "article" && (
        <meta property="article:author" content={author} />
      )}
      {ogType === "article" && category && (
        <meta property="article:section" content={category} />
      )}

      {/* JSON-LD */}
      {articleSchema && (
        <script type="application/ld+json">{articleSchema}</script>
      )}
      {websiteSchema && (
        <script type="application/ld+json">{websiteSchema}</script>
      )}
      {breadcrumbSchema && (
        <script type="application/ld+json">{breadcrumbSchema}</script>
      )}
      {faqJsonLd && (
        <script type="application/ld+json">{faqJsonLd}</script>
      )}
      {appSchema && (
        <script type="application/ld+json">{appSchema}</script>
      )}
    </Helmet>
  );
};

export default SEO;
