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
    const allText: string[] = [];

    for (let p = 1; p <= pdf.numPages; p++) {
      const page = await pdf.getPage(p);
      const content = await page.getTextContent();
      const items = content.items as Array<{ str: string; transform: number[] }>;

      // Collect all text items with position
      const textItems = items
        .filter(item => item.str?.trim())
        .map(item => ({
          str: item.str,
          x: item.transform[4],
          y: item.transform[5],
        }));

      if (!textItems.length) continue;

      // Detect if this is a multi-column layout
      const xs = textItems.map(i => i.x);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const pageWidth = maxX - minX;
      const isMultiColumn = pageWidth > 300 && detectMultiColumn(textItems);

      if (isMultiColumn) {
        // Split into columns and process each separately
        const midX = findColumnSplit(textItems);
        const leftItems  = textItems.filter(i => i.x < midX);
        const rightItems = textItems.filter(i => i.x >= midX);
        allText.push(itemsToLines(leftItems));
        allText.push(itemsToLines(rightItems));
      } else {
        allText.push(itemsToLines(textItems));
      }
    }

    return allText.join("\n");
  } catch (err) {
    console.error("PDF parsing error:", err);
    throw new Error("Failed to parse PDF. Please try DOCX or TXT format.");
  }
}

// Detect if page has 2 columns by checking X distribution
function detectMultiColumn(items: Array<{ x: number; y: number; str: string }>): boolean {
  const xs = items.map(i => i.x);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const mid = (minX + maxX) / 2;
  const leftCount  = xs.filter(x => x < mid - 30).length;
  const rightCount = xs.filter(x => x > mid + 30).length;
  // If both sides have significant content, it's multi-column
  return leftCount > 5 && rightCount > 5 && Math.min(leftCount, rightCount) / Math.max(leftCount, rightCount) > 0.2;
}

// Find the X coordinate that best splits two columns
function findColumnSplit(items: Array<{ x: number; y: number; str: string }>): number {
  const xs = items.map(i => i.x).sort((a, b) => a - b);
  const minX = xs[0];
  const maxX = xs[xs.length - 1];
  const mid = (minX + maxX) / 2;

  // Find the gap around the middle
  let bestGap = 0;
  let bestSplit = mid;
  for (let i = 0; i < xs.length - 1; i++) {
    const gap = xs[i + 1] - xs[i];
    const pos = (xs[i] + xs[i + 1]) / 2;
    // Only consider splits near the middle third of the page
    if (pos > minX + (maxX - minX) * 0.25 && pos < minX + (maxX - minX) * 0.75) {
      if (gap > bestGap) {
        bestGap = gap;
        bestSplit = pos;
      }
    }
  }
  return bestSplit;
}

// Convert positioned text items to newline-separated lines
function itemsToLines(items: Array<{ x: number; y: number; str: string }>): string {
  if (!items.length) return "";
  // Group by Y (3px buckets)
  const lineMap = new Map<number, Array<{ x: number; str: string }>>();
  for (const item of items) {
    const y = Math.round(item.y / 3) * 3;
    if (!lineMap.has(y)) lineMap.set(y, []);
    lineMap.get(y)!.push({ x: item.x, str: item.str });
  }
  const sortedYs = [...lineMap.keys()].sort((a, b) => b - a);
  const lines: string[] = [];
  for (const y of sortedYs) {
    const sorted = lineMap.get(y)!.sort((a, b) => a.x - b.x);
    let line = sorted[0].str;
    for (let i = 1; i < sorted.length; i++) {
      const gap = sorted[i].x - (sorted[i - 1].x + sorted[i - 1].str.length * 5.5);
      line += (gap > 6 ? " " : "") + sorted[i].str;
    }
    line = line.trim();
    if (line) lines.push(line);
  }
  return lines.join("\n");
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
const LINKEDIN_RE = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w\-./]+/i;
const GITHUB_RE   = /(?:https?:\/\/)?(?:www\.)?github\.com\/[\w\-]+/i;
const URL_RE      = /https?:\/\/[^\s]+/gi;
const LOCATION_RE = /\b([A-Z][a-zA-Z\s]{1,20},\s*(?:[A-Z]{2}|[A-Z][a-zA-Z]{2,15}))\b/;
const DATE_RE     = /\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?|\d{1,2}\/\d{2,4}|\d{4})\b.{0,25}\b(\d{4}|present|current|ongoing|till\s+date|now|today)\b/i;
const DEGREE_RE   = /\b(b\.?\s*s\.?c?|b\.?\s*a\.?|b\.?\s*e\.?|b\.?\s*tech|b\.?\s*com|b\.?\s*sc|m\.?\s*s\.?c?|m\.?\s*a\.?|m\.?\s*tech|m\.?\s*b\.?\s*a|m\.?\s*c\.?\s*a|m\.?\s*com|ph\.?\s*d|bachelor|master|associate|diploma|certificate|doctor|engineering|b\.?c\.?a|b\.?b\.?a|b\.?c\.?s|advance\s+diploma)\b/i;

const BULLET_RE   = /^[•\-*▪▸◦›‣⁃→➤✓✔☑◆◇▶]\s*/;
const NUMBERED_RE = /^\d+[.)]\s+/;

function isBullet(line: string) { return BULLET_RE.test(line) || NUMBERED_RE.test(line); }
function stripBullet(line: string) { return line.replace(BULLET_RE, "").replace(NUMBERED_RE, "").trim(); }

// ─── Section detection ───────────────────────────────────────────────

type SectionKey = "header" | "summary" | "skills" | "experience" | "education" | "projects" | "certifications" | "achievements" | "languages" | "interests";

// Handles spaced headers like "W O R K  E X P E R I E N C E"
function normalizeHeader(line: string): string {
  // Remove spaced letters: "W O R K" → "WORK"
  return line.replace(/\b([A-Z])\s(?=[A-Z]\b)/g, "$1").trim();
}

const SECTION_MAP: [RegExp, SectionKey][] = [
  [/^(professional\s+)?(summary|objective|profile|about\s*me|career\s+objective|professional\s+profile|p\s*r\s*o\s*f\s*i\s*l\s*e)/i, "summary"],
  [/^(technical\s+|core\s+|key\s+|relevant\s+|hard\s+|soft\s+)?skills?(\s+[&+]\s+\w+)?$|^competenc|^expertise|^technologies|^tools?\s*[&+]|^programming|^s\s*k\s*i\s*l\s*l\s*s/i, "skills"],
  [/^(work\s+|professional\s+|relevant\s+)?experience|^employment(\s+history)?|^work\s+history|^career\s+history|^internship|^w\s*o\s*r\s*k/i, "experience"],
  [/^education(al)?(\s+background|\s+qualification)?$|^academic(\s+background)?$|^qualification|^e\s*d\s*u\s*c\s*a\s*t\s*i\s*o\s*n/i, "education"],
  [/^(personal\s+|key\s+|academic\s+|notable\s+)?projects?(\s+[&+]\s+\w+)?$/i, "projects"],
  [/^certif(ications?|icates?)|^licenses?|^professional\s+certif|^c\s*e\s*r\s*t\s*i\s*f/i, "certifications"],
  [/^(key\s+)?achievements?|^accomplishments?|^awards?(\s+[&+]\s+honors?)?|^honors?/i, "achievements"],
  [/^languages?$|^l\s*a\s*n\s*g\s*u\s*a\s*g\s*e\s*s/i, "languages"],
  [/^interests?|^hobbies|^activities/i, "interests"],
  [/^contact(\s+info(rmation)?)?$|^c\s*o\s*n\s*t\s*a\s*c\s*t/i, "header"],
];

function detectSection(line: string): SectionKey | null {
  const stripped = line
    .replace(/^[\s\-–—=_*#|▬▪►◆•]+/, "")
    .replace(/[\s\-–—=_*#|▬▪►◆:•]+$/, "")
    .trim();
  if (!stripped || stripped.length > 80) return null;

  // Try original and de-spaced version
  const variants = [stripped, normalizeHeader(stripped)];

  for (const v of variants) {
    for (const [pattern, key] of SECTION_MAP) {
      if (pattern.test(v)) return key;
    }
  }
  return null;
}

function isContactLine(line: string): boolean {
  const l = line.trim();
  if (EMAIL_RE.test(l)) return true;
  if (LINKEDIN_RE.test(l)) return true;
  if (GITHUB_RE.test(l)) return true;
  if (PHONE_RE.test(l) && l.replace(PHONE_RE, "").replace(/[|•·,\s\-–—()/+]/g, "").length < 10) return true;
  return false;
}

// ─── Main parser ─────────────────────────────────────────────────────

export function parseResumeText(rawText: string): ResumeData {
  let text = rawText
    .replace(/\0/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\n{3,}/g, "\n\n");

  // Blob PDF fallback
  const lineCount = text.split("\n").filter(l => l.trim()).length;
  if (lineCount <= 5 && text.length > 300) {
    text = text
      .replace(/\s+(summary|objective|profile|skills?|experience|employment|education|projects?|certif|achievements?|languages?)/gi, "\n$1")
      .replace(/([.!?])\s+([A-Z])/g, "$1\n$2");
  }

  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  const data: ResumeData = { ...emptyResume, experiences: [], projects: [], education: [] };
  if (!lines.length) return data;

  const usedIdx = new Set<number>();

  // ── Step 1: Contact info ──────────────────────────────────────
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!data.email) {
      const m = line.match(EMAIL_RE);
      if (m) { data.email = m[0].trim(); usedIdx.add(i); }
    }
    if (!data.phone) {
      const m = line.match(PHONE_RE);
      if (m && m[0].replace(/\D/g, "").length >= 7) { data.phone = m[0].trim(); usedIdx.add(i); }
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

  // ── Step 2: Name ──────────────────────────────────────────────
  for (let i = 0; i < Math.min(12, lines.length); i++) {
    const line = lines[i];
    if (detectSection(line)) continue;
    if (isContactLine(line)) { usedIdx.add(i); continue; }

    let candidate = line
      .replace(EMAIL_RE, "").replace(PHONE_RE, "")
      .replace(LINKEDIN_RE, "").replace(GITHUB_RE, "")
      .replace(URL_RE, "").replace(LOCATION_RE, "")
      .replace(/[|•·,\-–—:/\\]/g, " ")
      .replace(/\s+/g, " ").trim();

    // Skip lines that look like job titles (contain common title words)
    if (/developer|engineer|designer|manager|analyst|intern|consultant|architect/i.test(candidate)) continue;

    if (candidate.length >= 2 && candidate.length <= 55) {
      const isNameLike = /^[A-Za-z\s.''\-]+$/.test(candidate);
      const wc = candidate.split(/\s+/).length;
      if (isNameLike && wc >= 1 && wc <= 5) {
        data.fullName = candidate;
        usedIdx.add(i);
        break;
      }
    }
  }

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
    if (sec && sec !== "header") { current = sec; continue; }
    if (sec === "header") continue; // skip "CONTACT" header lines
    if (current === "header") continue;
    if (!sections[current]) sections[current] = [];
    sections[current].push(line);
  }

  // ── Step 4: Summary ───────────────────────────────────────────
  if (sections.summary?.length) {
    // Filter out lines that look like they belong to other sections
    const summaryLines = sections.summary.filter(l => {
      // Skip lines that are clearly job titles or company names mixed in
      if (DATE_RE.test(l) && l.length < 40) return false;
      return true;
    });
    data.summary = summaryLines
      .map(l => isBullet(l) ? stripBullet(l) : l)
      .join(" ").replace(/\s+/g, " ").trim().slice(0, 800);
  }

  // ── Step 5: Skills ────────────────────────────────────────────
  if (sections.skills?.length) {
    // Each line is a skill or comma-separated skills
    const skillLines = sections.skills
      .map(l => isBullet(l) ? stripBullet(l) : l)
      .filter(l => l.length > 0 && !DATE_RE.test(l));
    data.skills = skillLines.join(", ")
      .replace(/,\s*,/g, ",")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 800);
  }

  // ── Step 6: Certifications + Achievements ────────────────────
  const certLines = [...(sections.certifications || []), ...(sections.achievements || [])];
  if (certLines.length) {
    data.certifications = certLines
      .map(l => isBullet(l) ? stripBullet(l) : l)
      .filter(l => l.length > 0)
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
    const langs = sections.languages
      .map(l => isBullet(l) ? stripBullet(l) : l)
      .filter(l => l.length > 0 && !/^\d/.test(l))
      .join(", ");
    if (langs.trim()) {
      data.skills = data.skills
        ? `${data.skills}, ${langs}`.slice(0, 800)
        : langs.slice(0, 800);
    }
  }

  // ── Step 11: Fallback ─────────────────────────────────────────
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
    if (cur && (cur.title || cur.company || cur.bullets.length)) {
      entries.push({ ...cur });
      cur = null;
    }
  };

  for (const line of lines) {
    const bullet = isBullet(line);
    const hasDate = DATE_RE.test(line);

    if (bullet) {
      if (!cur) cur = { title: "", company: "", location: "", dates: "", bullets: [] };
      cur.bullets.push(stripBullet(line));
      continue;
    }

    if (hasDate) {
      if (cur) {
        if (!cur.dates) {
          cur.dates = line.trim();
        } else {
          flush();
          cur = { title: "", company: "", location: "", dates: line.trim(), bullets: [] };
        }
      } else {
        cur = { title: "", company: "", location: "", dates: line.trim(), bullets: [] };
      }
      continue;
    }

    if (line.length <= 120) {
      // Check if this is a new entry (starts with capital, has company-like pattern)
      if (cur?.title && cur.company) {
        // Looks like a new job title
        flush();
      }

      if (!cur) cur = { title: "", company: "", location: "", dates: "", bullets: [] };

      if (!cur.title) {
        // Try to split "Title | Company" or "Title at Company"
        let title = line, company = "", location = "";
        const sepMatch = line.match(/^(.+?)\s*(?:\s+at\s+|\s*\|\s*|\s*–\s*|\s*—\s*)\s*(.+)$/i);
        if (sepMatch && sepMatch[2].length > 2) {
          title = sepMatch[1].trim();
          company = sepMatch[2].trim();
          const locM = company.match(/,\s*([A-Z][a-zA-Z\s]+,\s*[A-Z]{2,})$/);
          if (locM) { location = locM[1]; company = company.replace(locM[0], "").trim(); }
        }
        cur.title = title;
        cur.company = company;
        cur.location = location;
      } else if (!cur.company) {
        cur.company = line.trim();
      } else {
        cur.bullets.push(line.trim());
      }
    } else {
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

    const hasDate = DATE_RE.test(line);
    const hasDegree = DEGREE_RE.test(line);

    if (hasDegree) {
      if (cur) entries.push(cur);
      let degree = line, school = "";
      // Try "Degree, School" or "Degree — School"
      const sepM = line.match(/^(.+?)\s*(?:,|–|—|\|)\s*(.+)$/);
      if (sepM && !DEGREE_RE.test(sepM[2]) && sepM[2].length > 3) {
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
  }
  if (cur) entries.push(cur);

  for (const e of entries) {
    if (!e.degree && DEGREE_RE.test(e.school)) {
      e.degree = e.school; e.school = "";
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
