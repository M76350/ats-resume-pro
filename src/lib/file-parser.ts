import { ResumeData, emptyResume } from "@/types/resume";

// ─── File readers ────────────────────────────────────────────────────

export async function parseFile(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return parsePDF(file);
  if (ext === "docx" || ext === "doc") return parseDOCX(file);
  if (ext === "txt" || ext === "text") return file.text();
  throw new Error("Unsupported file type. Please upload PDF, DOCX, or TXT.");
}

async function parsePDF(file: File): Promise<string> {
  try {
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

    const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
    const pages: string[] = [];

    for (let p = 1; p <= pdf.numPages; p++) {
      const page = await pdf.getPage(p);
      const content = await page.getTextContent();
      const items = content.items as Array<{ str: string; transform: number[] }>;

      // Group by Y coordinate (rounded to 3px buckets for robustness)
      const lineMap = new Map<number, Array<{ x: number; str: string }>>();
      for (const item of items) {
        if (!item.str?.trim()) continue;
        const y = Math.round(item.transform[5] / 3) * 3;
        if (!lineMap.has(y)) lineMap.set(y, []);
        lineMap.get(y)!.push({ x: item.transform[4], str: item.str });
      }

      const sortedYs = [...lineMap.keys()].sort((a, b) => b - a);
      const pageLines: string[] = [];
      for (const y of sortedYs) {
        const sorted = lineMap.get(y)!.sort((a, b) => a.x - b.x);
        // Join with space only if items are far apart (avoid double-spacing)
        let line = "";
        for (let i = 0; i < sorted.length; i++) {
          if (i === 0) { line = sorted[i].str; continue; }
          const gap = sorted[i].x - (sorted[i - 1].x + (sorted[i - 1].str.length * 5));
          line += (gap > 8 ? " " : "") + sorted[i].str;
        }
        line = line.trim();
        if (line) pageLines.push(line);
      }
      pages.push(pageLines.join("\n"));
    }
    return pages.join("\n");
  } catch (err) {
    console.error("PDF parsing error:", err);
    throw new Error("Failed to parse PDF. Please try DOCX or TXT format.");
  }
}

async function parseDOCX(file: File): Promise<string> {
  try {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
    return result.value;
  } catch (err) {
    console.error("DOCX parsing error:", err);
    throw new Error("Failed to parse DOCX. Please try PDF or TXT format.");
  }
}

// ─── Regex constants ─────────────────────────────────────────────────

const EMAIL_RE    = /[\w.+-]+@[\w.-]+\.\w{2,}/;
const PHONE_RE    = /(?:\+?\d{1,3}[\s\-.]?)?\(?\d{2,4}\)?[\s\-.]?\d{3,4}[\s\-.]?\d{3,4}/;
const LINKEDIN_RE = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w\-]+/i;
const GITHUB_RE   = /(?:https?:\/\/)?(?:www\.)?github\.com\/[\w\-]+/i;
const URL_RE      = /https?:\/\/[^\s]+/gi;

// Location: "City, ST" or "City, State" or just "City, Country"
const LOCATION_RE = /\b([A-Z][a-zA-Z\s]{1,20},\s*(?:[A-Z]{2}|[A-Z][a-zA-Z]{2,15}))\b/;

// Date range: "Jan 2020 – Present", "2019 - 2022", "03/2021 – Current" etc.
const DATE_RE = /\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?|\d{1,2}\/\d{2,4}|\d{4})\b.{0,20}\b(\d{4}|present|current|ongoing|till\s+date|now|today)\b/i;

// Degree keywords
const DEGREE_RE = /\b(b\.?\s*s\.?c?|b\.?\s*a\.?|b\.?\s*e\.?|b\.?\s*tech|b\.?\s*com|b\.?\s*sc|m\.?\s*s\.?c?|m\.?\s*a\.?|m\.?\s*tech|m\.?\s*b\.?\s*a|m\.?\s*c\.?\s*a|m\.?\s*com|ph\.?\s*d|bachelor|master|associate|diploma|certificate|doctor|engineering|b\.?c\.?a|b\.?b\.?a|b\.?c\.?s)\b/i;

// Bullet markers
const BULLET_RE = /^[•\-*▪▸◦›‣⁃→➤✓✔☑◆◇▶]\s+/;
const NUMBERED_RE = /^\d+[.)]\s+/;

function isBullet(line: string) { return BULLET_RE.test(line) || NUMBERED_RE.test(line); }
function stripBullet(line: string) { return line.replace(BULLET_RE, "").replace(NUMBERED_RE, "").trim(); }

// ─── Section detection ───────────────────────────────────────────────

type SectionKey = "header" | "summary" | "skills" | "experience" | "education" | "projects" | "certifications" | "achievements" | "languages" | "interests";

const SECTION_MAP: [RegExp, SectionKey][] = [
  [/^(professional\s+)?(summary|objective|profile|about\s*me|career\s+objective|professional\s+profile)/i, "summary"],
  [/^(technical\s+|core\s+|key\s+|relevant\s+|hard\s+|soft\s+)?skills?(\s+&\s+\w+)?$|^competenc|^expertise|^technologies|^tools?\s*&|^programming/i, "skills"],
  [/^(work\s+|professional\s+|relevant\s+)?experience|^employment(\s+history)?|^work\s+history|^career\s+history|^internship/i, "experience"],
  [/^education(al)?(\s+background|\s+qualification)?$|^academic(\s+background)?$|^qualification/i, "education"],
  [/^(personal\s+|key\s+|academic\s+|notable\s+)?projects?(\s+&\s+\w+)?$/i, "projects"],
  [/^certif(ications?|icates?)|^licenses?(\s+&\s+certif)?|^professional\s+certif/i, "certifications"],
  [/^(key\s+)?achievements?|^accomplishments?|^awards?\s*(&\s*honors?)?|^honors?/i, "achievements"],
  [/^languages?$/i, "languages"],
  [/^interests?|^hobbies|^activities/i, "interests"],
];

function detectSection(line: string): SectionKey | null {
  // Strip decorators: dashes, underscores, colons, asterisks, pipes
  const cleaned = line
    .replace(/^[\s\-–—=_*#|▬▪►◆]+/, "")
    .replace(/[\s\-–—=_*#|▬▪►◆:]+$/, "")
    .trim();
  if (!cleaned || cleaned.length > 70) return null;
  // Must be mostly uppercase or title-case (section headers usually are)
  const words = cleaned.split(/\s+/);
  const upperCount = words.filter(w => w[0] === w[0]?.toUpperCase()).length;
  if (upperCount < words.length * 0.5 && cleaned.length > 20) return null;
  for (const [pattern, key] of SECTION_MAP) {
    if (pattern.test(cleaned)) return key;
  }
  return null;
}

// ─── Contact line detection ──────────────────────────────────────────

function isContactLine(line: string): boolean {
  const l = line.trim();
  if (EMAIL_RE.test(l) && l.replace(EMAIL_RE, "").replace(/[|•·,\s\-–—()/]/g, "").length < 8) return true;
  if (LINKEDIN_RE.test(l)) return true;
  if (GITHUB_RE.test(l)) return true;
  let hits = 0;
  if (EMAIL_RE.test(l)) hits++;
  if (PHONE_RE.test(l)) hits++;
  if (LOCATION_RE.test(l)) hits++;
  if (LINKEDIN_RE.test(l)) hits++;
  return hits >= 2;
}

// ─── Main parser ─────────────────────────────────────────────────────

export function parseResumeText(rawText: string): ResumeData {
  // ── Pre-process ──────────────────────────────────────────────
  let text = rawText;

  // Fix common PDF artifacts: remove null bytes, normalize dashes
  text = text.replace(/\0/g, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // If very few newlines (blob PDF), inject breaks before section keywords
  const lineCount = text.split("\n").filter(l => l.trim()).length;
  if (lineCount <= 5 && text.length > 300) {
    text = text
      .replace(/\s+(summary|objective|profile|skills?|experience|employment|education|projects?|certif|achievements?|languages?)/gi, "\n$1")
      .replace(/([.!?])\s+([A-Z])/g, "$1\n$2");
  }

  // Normalize multiple blank lines to single
  text = text.replace(/\n{3,}/g, "\n\n");

  const rawLines = text.split("\n").map(l => l.trim());
  const lines = rawLines.filter(Boolean);

  const data: ResumeData = { ...emptyResume, experiences: [], projects: [], education: [] };
  if (!lines.length) return data;

  // ── Step 1: Extract contact info (scan ALL lines) ─────────────
  const usedIdx = new Set<number>();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!data.email) {
      const m = line.match(EMAIL_RE);
      if (m) { data.email = m[0].trim(); usedIdx.add(i); }
    }
    if (!data.phone) {
      const m = line.match(PHONE_RE);
      if (m && m[0].replace(/\D/g, "").length >= 7) {
        data.phone = m[0].trim();
        usedIdx.add(i);
      }
    }
    if (!data.linkedin) {
      const m = line.match(LINKEDIN_RE);
      if (m) { data.linkedin = m[0].trim(); usedIdx.add(i); }
    }
    if (!data.location) {
      const m = line.match(LOCATION_RE);
      if (m) { data.location = m[1].trim(); usedIdx.add(i); }
    }
  }

  // ── Step 2: Extract name ──────────────────────────────────────
  // Name is usually the first non-contact, non-section-header line
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    const line = lines[i];
    if (detectSection(line)) continue;
    if (isContactLine(line)) { usedIdx.add(i); continue; }

    // Strip embedded contact info
    let candidate = line
      .replace(EMAIL_RE, "")
      .replace(PHONE_RE, "")
      .replace(LINKEDIN_RE, "")
      .replace(GITHUB_RE, "")
      .replace(URL_RE, "")
      .replace(LOCATION_RE, "")
      .replace(/[|•·,\-–—:/\\]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (candidate.length >= 2 && candidate.length <= 55) {
      const isNameLike = /^[A-Za-z\s.''\-]+$/.test(candidate);
      const wc = candidate.split(/\s+/).length;
      if (isNameLike && wc >= 1 && wc <= 6) {
        data.fullName = candidate;
        usedIdx.add(i);
        break;
      }
    }
  }

  // Fallback name
  if (!data.fullName && lines.length > 0) {
    const first = lines[0]
      .replace(EMAIL_RE, "").replace(PHONE_RE, "").replace(LINKEDIN_RE, "")
      .replace(/[|•·,\-–—:]/g, " ").replace(/\s+/g, " ").trim().slice(0, 55);
    if (first) { data.fullName = first; usedIdx.add(0); }
  }

  // ── Step 3: Section splitting ─────────────────────────────────
  const sections: Record<string, string[]> = {};
  let current: SectionKey = "header";

  for (let i = 0; i < lines.length; i++) {
    if (usedIdx.has(i) && current === "header") continue;
    const line = lines[i];
    const sec = detectSection(line);
    if (sec) { current = sec; continue; }
    if (current === "header") continue;
    if (!sections[current]) sections[current] = [];
    sections[current].push(line);
  }

  // ── Step 4: Summary ───────────────────────────────────────────
  if (sections.summary?.length) {
    data.summary = sections.summary
      .map(l => isBullet(l) ? stripBullet(l) : l)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 800);
  }

  // ── Step 5: Skills ────────────────────────────────────────────
  if (sections.skills?.length) {
    // Skills can be comma-separated on one line, or one per line, or bullet list
    const skillLines = sections.skills.map(l => isBullet(l) ? stripBullet(l) : l);
    // If lines already contain commas, join with comma+space; else join with ", "
    const joined = skillLines.join(", ").replace(/,\s*,/g, ",").replace(/\s+/g, " ").trim();
    data.skills = joined.slice(0, 800);
  }

  // ── Step 6: Certifications ────────────────────────────────────
  const certLines = [
    ...(sections.certifications || []),
    ...(sections.achievements || []),
  ];
  if (certLines.length) {
    data.certifications = certLines
      .map(l => isBullet(l) ? stripBullet(l) : l)
      .filter(Boolean)
      .join("\n")
      .slice(0, 600);
  }

  // ── Step 7: Experience ────────────────────────────────────────
  if (sections.experience?.length) {
    data.experiences = parseExperiences(sections.experience);
  }

  // ── Step 8: Projects ──────────────────────────────────────────
  if (sections.projects?.length) {
    data.projects = parseProjects(sections.projects);
  }

  // ── Step 9: Education ─────────────────────────────────────────
  if (sections.education?.length) {
    data.education = parseEducation(sections.education);
  }

  // ── Step 10: Languages → append to skills ────────────────────
  if (sections.languages?.length) {
    const langs = sections.languages.map(l => isBullet(l) ? stripBullet(l) : l).join(", ");
    if (langs.trim()) {
      data.skills = data.skills
        ? `${data.skills}, ${langs}`.slice(0, 800)
        : langs.slice(0, 800);
    }
  }

  // ── Step 11: Fallback if nothing parsed ──────────────────────
  if (!data.summary && !data.skills && !data.experiences.length && !data.education.length) {
    const body = lines.filter((_, i) => !usedIdx.has(i));
    if (body.length) {
      data.summary = body.slice(0, 6).join(" ").replace(/\s+/g, " ").trim().slice(0, 600);
      if (body.length > 6) data.skills = body.slice(6, 12).join(", ").slice(0, 400);
    }
  }

  return data;
}

// ─── Experience parser ────────────────────────────────────────────────

function parseExperiences(lines: string[]) {
  type Entry = { title: string; company: string; location: string; dates: string; bullets: string[] };
  const entries: Entry[] = [];
  let cur: Entry | null = null;

  const flush = () => {
    if (cur && (cur.title || cur.company || cur.bullets.length)) entries.push(cur);
  };

  for (const line of lines) {
    const bullet = isBullet(line);
    const hasDate = DATE_RE.test(line);

    if (bullet) {
      // Bullet point → add to current entry
      if (!cur) cur = { title: "", company: "", location: "", dates: "", bullets: [] };
      cur.bullets.push(stripBullet(line));
      continue;
    }

    if (hasDate) {
      if (cur) {
        if (!cur.dates) {
          // Date line for current entry
          cur.dates = line.trim();
        } else {
          // New entry starting with a date line
          flush();
          cur = { title: "", company: "", location: "", dates: line.trim(), bullets: [] };
        }
      } else {
        cur = { title: "", company: "", location: "", dates: line.trim(), bullets: [] };
      }
      continue;
    }

    // Non-bullet, non-date line → title or company
    if (line.length <= 120) {
      if (cur && (cur.title || cur.bullets.length > 0)) {
        // Check if this looks like a new job title (not a continuation)
        const looksLikeTitle = /^[A-Z]/.test(line) && !line.endsWith(",");
        if (looksLikeTitle && cur.title) {
          flush();
          cur = null;
        }
      }

      if (!cur) {
        cur = { title: "", company: "", location: "", dates: "", bullets: [] };
      }

      if (!cur.title) {
        // Try to split "Title | Company" or "Title at Company" or "Title, Company"
        let title = line, company = "", location = "";
        const sepMatch = line.match(/^(.+?)\s*(?:\||–|—|,\s+(?=[A-Z])|\s+at\s+)\s*(.+)$/i);
        if (sepMatch) {
          title = sepMatch[1].trim();
          company = sepMatch[2].trim();
          // Extract location from company if present
          const locM = company.match(/,\s*([A-Z][a-zA-Z\s]+,\s*[A-Z]{2,})$/);
          if (locM) { location = locM[1]; company = company.replace(locM[0], "").trim(); }
        }
        cur.title = title;
        cur.company = company;
        cur.location = location;
      } else if (!cur.company) {
        // Second line after title → company name
        cur.company = line.trim();
      } else {
        // Extra line → treat as bullet
        cur.bullets.push(line.trim());
      }
    } else {
      // Long line → treat as bullet/description
      if (!cur) cur = { title: "", company: "", location: "", dates: "", bullets: [] };
      cur.bullets.push(line.trim());
    }
  }
  flush();

  return entries.slice(0, 8).map((e, i) => ({
    id: String(i + 1),
    title: e.title,
    company: e.company,
    location: e.location,
    dates: e.dates,
    bullets: e.bullets.slice(0, 8).join("\n"),
  }));
}

// ─── Projects parser ──────────────────────────────────────────────────

function parseProjects(lines: string[]) {
  type Entry = { name: string; description: string; bullets: string[] };
  const entries: Entry[] = [];
  let cur: Entry | null = null;

  for (const line of lines) {
    if (isBullet(line)) {
      if (!cur) cur = { name: "", description: "", bullets: [] };
      cur.bullets.push(stripBullet(line));
    } else if (line.length <= 100) {
      if (cur) entries.push(cur);
      cur = { name: line.trim(), description: "", bullets: [] };
    } else {
      if (!cur) cur = { name: "", description: "", bullets: [] };
      if (!cur.description) cur.description = line.trim();
      else cur.bullets.push(line.trim());
    }
  }
  if (cur) entries.push(cur);

  return entries.slice(0, 6).map((p, i) => ({
    id: String(i + 1),
    name: p.name,
    description: p.description,
    bullets: p.bullets.join("\n"),
  }));
}

// ─── Education parser ─────────────────────────────────────────────────

function parseEducation(lines: string[]) {
  type Entry = { degree: string; school: string; dates: string; details: string[] };
  const entries: Entry[] = [];
  let cur: Entry | null = null;

  for (const line of lines) {
    if (isBullet(line)) {
      if (cur) cur.details.push(stripBullet(line));
      continue;
    }

    if (DATE_RE.test(line)) {
      if (cur && !cur.dates) { cur.dates = line.trim(); continue; }
    }

    if (line.length <= 150) {
      const hasDegree = DEGREE_RE.test(line);
      const hasDate = DATE_RE.test(line);

      if (hasDegree) {
        if (cur) entries.push(cur);
        // Try to split "Degree, School" or "Degree — School"
        let degree = line, school = "";
        const sepM = line.match(/^(.+?)\s*(?:,|–|—|\|)\s*(.+)$/);
        if (sepM && !DEGREE_RE.test(sepM[2])) {
          degree = sepM[1].trim();
          school = sepM[2].trim();
        }
        cur = { degree, school, dates: "", details: [] };
      } else if (hasDate && cur && !cur.dates) {
        cur.dates = line.trim();
      } else if (cur) {
        if (!cur.school) cur.school = line.trim();
        else cur.details.push(line.trim());
      } else {
        cur = { degree: "", school: line.trim(), dates: "", details: [] };
      }
    } else if (cur) {
      cur.details.push(line.trim());
    }
  }
  if (cur) entries.push(cur);

  // Post-process: swap degree/school if misdetected
  for (const e of entries) {
    if (!e.degree && DEGREE_RE.test(e.school)) {
      e.degree = e.school;
      e.school = "";
    }
  }

  return entries.slice(0, 4).map((e, i) => ({
    id: String(i + 1),
    degree: e.degree,
    school: e.school,
    dates: e.dates,
    details: e.details.join(", "),
  }));
}
