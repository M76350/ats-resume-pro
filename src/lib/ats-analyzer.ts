import { ResumeData } from "@/types/resume";

export interface ATSAnalysis {
  ats_score: number;
  keyword_match: number;
  missing_keywords: string[];
  format_issues: string[];
  improvements: string[];
  section_scores: {
    section_completeness: number;
    keyword_match: number;
    formatting: number;
    quantification: number;
    clarity: number;
  };
  word_count: number;
}

function getResumeText(data: ResumeData): string {
  const parts = [
    data.fullName,
    data.email,
    data.phone,
    data.location,
    data.linkedin,
    data.summary,
    data.skills,
    ...data.experiences.flatMap((e) => [e.title, e.company, e.location, e.dates, e.bullets]),
    ...data.projects.flatMap((p) => [p.name, p.description, p.bullets]),
    ...data.education.flatMap((e) => [e.degree, e.school, e.dates, e.details]),
    data.certifications,
  ];
  return parts.filter(Boolean).join(" ");
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "is", "are", "was", "were", "be", "been",
    "being", "have", "has", "had", "do", "does", "did", "will", "would",
    "could", "should", "may", "might", "must", "shall", "can", "need",
    "dare", "ought", "used", "this", "that", "these", "those", "i", "you",
    "he", "she", "it", "we", "they", "me", "him", "her", "us", "them",
    "my", "your", "his", "its", "our", "their", "what", "which", "who",
    "whom", "when", "where", "why", "how", "all", "each", "every", "both",
    "few", "more", "most", "other", "some", "such", "no", "not", "only",
    "own", "same", "so", "than", "too", "very", "just", "because", "as",
    "until", "while", "about", "between", "through", "during", "before",
    "after", "above", "below", "up", "down", "out", "off", "over", "under",
    "again", "further", "then", "once", "here", "there", "any", "if",
    "experience", "work", "role", "team", "ability", "looking", "join",
    "company", "position", "required", "preferred", "requirements",
    "responsibilities", "qualifications", "years", "strong", "including",
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));

  // Count frequency
  const freq: Record<string, number> = {};
  words.forEach((w) => {
    freq[w] = (freq[w] || 0) + 1;
  });

  // Also extract multi-word phrases (bigrams)
  const rawWords = text.toLowerCase().replace(/[^a-z0-9+#.\s-]/g, " ").split(/\s+/);
  for (let i = 0; i < rawWords.length - 1; i++) {
    const bigram = `${rawWords[i]} ${rawWords[i + 1]}`;
    if (bigram.length > 5 && !stopWords.has(rawWords[i]) && !stopWords.has(rawWords[i + 1])) {
      freq[bigram] = (freq[bigram] || 0) + 1;
    }
  }

  return Object.entries(freq)
    .filter(([, count]) => count >= 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([word]) => word);
}

const ACTION_VERBS = [
  "led", "managed", "developed", "built", "designed", "implemented",
  "created", "improved", "increased", "reduced", "optimized", "achieved",
  "delivered", "launched", "spearheaded", "architected", "established",
  "streamlined", "transformed", "automated", "mentored", "collaborated",
  "drove", "generated", "negotiated", "executed", "pioneered",
];

export function analyzeResume(data: ResumeData, jobDescription: string): ATSAnalysis {
  const resumeText = getResumeText(data);
  const resumeLower = resumeText.toLowerCase();
  const wordCount = countWords(resumeText);

  // 1. Section Completeness (20%)
  const sections = {
    contact: !!(data.fullName && data.email && data.phone),
    summary: data.summary.trim().length > 20,
    skills: data.skills.trim().length > 10,
    experience: data.experiences.length > 0 && data.experiences.some((e) => e.title && e.company),
    education: data.education.length > 0 && data.education.some((e) => e.degree && e.school),
  };
  const sectionCount = Object.values(sections).filter(Boolean).length;
  const sectionScore = Math.round((sectionCount / 5) * 100);

  // 2. Keyword Match (30%)
  let keywordScore = 0;
  let keywordMatchPercent = 0;
  const missingKeywords: string[] = [];

  if (jobDescription.trim()) {
    const jdKeywords = extractKeywords(jobDescription);
    const matched = jdKeywords.filter((kw) => resumeLower.includes(kw));
    keywordMatchPercent = jdKeywords.length > 0 ? Math.round((matched.length / jdKeywords.length) * 100) : 0;
    keywordScore = keywordMatchPercent;
    missingKeywords.push(
      ...jdKeywords.filter((kw) => !resumeLower.includes(kw)).slice(0, 10)
    );
  } else {
    keywordScore = 50; // neutral if no JD
    keywordMatchPercent = 0;
  }

  // 3. Formatting (20%)
  const formatIssues: string[] = [];
  let formatScore = 100;

  if (wordCount > 750) {
    formatIssues.push(`Resume is ${wordCount} words (max 750 for one page)`);
    formatScore -= 20;
  }
  if (wordCount < 150 && wordCount > 0) {
    formatIssues.push("Resume seems too short — add more detail");
    formatScore -= 15;
  }
  const summaryWords = countWords(data.summary);
  if (summaryWords > 60) {
    formatIssues.push("Summary exceeds 3 lines — keep it concise");
    formatScore -= 10;
  }
  data.experiences.forEach((exp) => {
    const bulletCount = exp.bullets.split("\n").filter(Boolean).length;
    if (bulletCount > 4) {
      formatIssues.push(`"${exp.title || "Experience"}" has ${bulletCount} bullets (max 4)`);
      formatScore -= 10;
    }
  });
  if (!data.fullName) {
    formatIssues.push("Missing full name");
    formatScore -= 10;
  }
  formatScore = Math.max(0, formatScore);

  // 4. Quantification (15%)
  const allBullets = [
    ...data.experiences.flatMap((e) => e.bullets.split("\n").filter(Boolean)),
    ...data.projects.flatMap((p) => p.bullets.split("\n").filter(Boolean)),
  ];
  const quantifiedBullets = allBullets.filter((b) => /\d+/.test(b));
  const quantScore = allBullets.length > 0
    ? Math.round((quantifiedBullets.length / allBullets.length) * 100)
    : 0;

  // 5. Clarity / Action Verbs (15%)
  const bulletsWithVerbs = allBullets.filter((b) => {
    const firstWord = b.trim().split(/\s/)[0]?.toLowerCase();
    return ACTION_VERBS.some((v) => firstWord?.startsWith(v));
  });
  const clarityScore = allBullets.length > 0
    ? Math.round((bulletsWithVerbs.length / allBullets.length) * 100)
    : 0;

  // Weighted total
  const atsScore = Math.round(
    sectionScore * 0.2 +
    keywordScore * 0.3 +
    formatScore * 0.2 +
    quantScore * 0.15 +
    clarityScore * 0.15
  );

  // Improvements
  const improvements: string[] = [];
  if (!sections.contact) improvements.push("Complete your contact information (name, email, phone)");
  if (!sections.summary) improvements.push("Add a professional summary (2-3 lines)");
  if (!sections.skills) improvements.push("Add a skills section with relevant technologies");
  if (!sections.experience) improvements.push("Add at least one work experience entry");
  if (!sections.education) improvements.push("Add your education details");
  if (quantScore < 50) improvements.push("Add numbers/metrics to more bullet points (e.g., 'increased revenue by 30%')");
  if (clarityScore < 50) improvements.push("Start bullet points with strong action verbs (Led, Built, Designed, etc.)");
  if (missingKeywords.length > 0) improvements.push("Incorporate missing keywords from the job description naturally");
  if (wordCount > 750) improvements.push("Reduce content to fit within 750 words for a single page");

  return {
    ats_score: Math.min(100, Math.max(0, atsScore)),
    keyword_match: keywordMatchPercent,
    missing_keywords: missingKeywords,
    format_issues: formatIssues,
    improvements,
    section_scores: {
      section_completeness: sectionScore,
      keyword_match: keywordScore,
      formatting: formatScore,
      quantification: quantScore,
      clarity: clarityScore,
    },
    word_count: wordCount,
  };
}
