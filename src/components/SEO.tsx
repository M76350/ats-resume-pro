import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  noIndex?: boolean;
  publishedDate?: string;
  author?: string;
  keywords?: string;
}

export const SITE_URL = "https://ats-resume-pro-swart.vercel.app";
export const SITE_NAME = "FreeATS";
const DEFAULT_IMAGE = `${SITE_URL}/FreeATS.jpg`;

const SEO = ({
  title,
  description,
  canonical,
  ogImage = DEFAULT_IMAGE,
  ogType = "website",
  noIndex = false,
  publishedDate,
  author = "Manish Yadav",
  keywords,
}: SEOProps) => {
  const fullTitle = title.includes("FreeATS") ? title : `${title} | FreeATS`;
  const canonicalUrl = canonical ? `${SITE_URL}${canonical}` : SITE_URL;

  const articleSchema = ogType === "article" ? JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": fullTitle,
    "description": description,
    "url": canonicalUrl,
    "image": ogImage,
    "author": { "@type": "Person", "name": author },
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "url": SITE_URL,
    },
    "datePublished": publishedDate || "2026-01-01",
    "dateModified": publishedDate || "2026-03-20",
  }) : null;

  const websiteSchema = ogType === "website" ? JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": SITE_NAME,
    "url": SITE_URL,
    "description": description,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${SITE_URL}/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }) : null;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
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
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@freeats" />

      {/* Article specific */}
      {ogType === "article" && publishedDate && (
        <meta property="article:published_time" content={publishedDate} />
      )}
      {ogType === "article" && (
        <meta property="article:author" content={author} />
      )}

      {/* JSON-LD */}
      {articleSchema && (
        <script type="application/ld+json">{articleSchema}</script>
      )}
      {websiteSchema && (
        <script type="application/ld+json">{websiteSchema}</script>
      )}
    </Helmet>
  );
};

export default SEO;
