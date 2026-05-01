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

      const textItems = items
        .filter(item => item.str?.trim())
        .map(item => ({ str: item.str, x: item.transform[4], y: item.transform[5] }));

      if (!textItems.length) continue;

      const xs = textItems.map(i => i.x);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const isMultiColumn = (maxX - minX) > 300 && detectMultiColumn(textItems);

      if (isMultiColumn) {
        const midX = findColumnSplit(textItems);
        allText.push(itemsToLines(textItems.filter(i => i.x < midX)));
        allText.push(itemsToLines(textItems.filter(i => i.x >= midX)));
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

function detectMultiColumn(items: Array<{ x: number; y: number; str: string }>): boolean {
  const xs = items.map(i => i.x);
  const mid = (Math.min(...xs) + Math.max(...xs)) / 2;
  const left  = xs.filter(x => x < mid - 30).length;
  const right = xs.filter(x => x > mid + 30).length;
  return left > 5 && right > 5 && Math.min(left, right) / Math.max(left, right) > 0.2;
}

function findColumnSplit(items: Array<{ x: number; y: number; str: string }>): number {
  const xs = items.map(i => i.x).sort((a, b) => a - b);
  const minX = xs[0], maxX = xs[xs.length - 1];
  let bestGap = 0, bestSplit = (minX + maxX) / 2;
  for (let i = 0; i < xs.length - 1; i++) {
    const gap = xs[i + 1] - xs[i];
    const pos = (xs[i] + xs[i + 1]) / 2;
    if (pos > minX + (maxX - minX) * 0.25 && pos < minX + (maxX - minX) * 0.75 && gap > bestGap) {
      bestGap = gap; bestSplit = pos;
    }
  }
  return bestSplit;
}

function itemsToLines(items: Array<{ x: number; y: number; str: string }>): string {
  if (!items.length) return "";
  const lineMap = new Map<number, Array<{ x: number; str: string }>>();
  for (const item of items) {
    const y = Math.round(item.y / 3) * 3;
    if (!lineMap.has(y)) lineMap.set(y, []);
    lineMap.get(y)!.push({ x: item.x, str: item.str });
  }
  const lines: string[] = [];
  for (const y of [...lineMap.keys()].sort((a, b) => b - a)) {
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

// Date: handles "Sep 2025 – 28 Feb 2026", "2022 – 2025", "Jan 2025 – Aug 2025" etc.
const DATE_RE = /\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?|\d{1,2}\/\d{2,4}|\d{4})\b.{0,30}\b(\d{4}|present|current|ongoing|till\s+date|now|today)\b/i;

const DEGREE_RE = /\b(b\.?\s*s\.?c?|b\.?\s*a\.?|b\.?\s*e\.?|b\.?\s*tech|b\.?\s*com|b\.?\s*sc|m\.?\s*s\.?c?|m\.?\s*a\.?|m\.?\s*tech|m\.?\s*b\.?\s*a|m\.?\s*c\.?\s*a|m\.?\s*com|ph\.?\s*d|bachelor|master|associate|diploma|certificate|doctor|engineering|b\.?c\.?a|b\.?b\.?a|b\.?c\.?s|advance\s+diploma)\b/i;

// Bullet: includes · (middle dot U+00B7) and ⋄ (diamond) used in some PDFs
const BULLET_RE   = /^[•·⋄\-*▪▸◦›‣⁃→➤✓✔☑◆◇▶]\s*/u;
const NUMBERED_RE = /^\d+[.)]\s+/;

function isBullet(line: string) { return BULLET_RE.test(line) || NUMBERED_RE.test(line); }
function stripBullet(line: string) { return line.replace(BULLET_RE, "").replace(NUMBERED_RE, "").trim(); }

// ─── Section detection ───────────────────────────────────────────────

type SectionKey = "header" | "summary" | "skills" | "experience" | "education" | "projects" | "certifications" | "achievements" | "languages" | "interests";

function normalizeHeader(line: string): string {
  return line.replace(/\b([A-Z])\s(?=[A-Z]\b)/g, "$1").trim();
}

const SECTION_MAP: [RegExp, SectionKey][] = [
  [/^(professional\s+)?(summary|objective|profile|about\s*me|career\s+objective|professional\s+profile)/i, "summary"],
  [/^(technical\s+|core\s+|key\s+|relevant\s+|hard\s+|soft\s+)?skills?(\s+[&+]\s+\w+)?$|^competenc|^expertise|^technologies|^tools?\s*[&+]|^programming/i, "skills"],
  [/^(work\s+|professional\s+|relevant\s+)?experience|^employment(\s+history)?|^work\s+history|^career\s+history|^internship/i, "experience"],
  [/^education(al)?(\s+background|\s+qualification)?$|^academic(\s+background)?$|^qualification/i, "education"],
  [/^(personal\s+|key\s+|academic\s+|notable\s+)?projects?(\s+[&+]\s+\w+)?$/i, "projects"],
  [/^certif(ications?|icates?)|^licenses?|^professional\s+certif/i, "certifications"],
  [/^(key\s+)?achievements?|^accomplishments?|^awards?(\s+[&+]\s+honors?)?|^honors?/i, "achievements"],
  [/^languages?$/i, "languages"],
  [/^interests?|^hobbies|^activities/i, "interests"],
  [/^contact(\s+info(rmation)?)?$/i, "header"],
];

function detectSection(line: string): SectionKey | null {
  const stripped = line
    .replace(/^[\s\-–—=_*#|▬▪►◆•]+/, "")
    .replace(/[\s\-–—=_*#|▬▪►◆:•]+$/, "")
    .trim();
  if (!stripped || stripped.length > 80) return null;
  for (const v of [stripped, normalizeHeader(stripped)]) {
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
  if (PHONE_RE.test(l) && l.replace(PHONE_RE, "").replace(/[|•·⋄,\s\-–—()/+]/g, "").length < 10) return true;
  return false;
}

// ─── Skills line parser ───────────────────────────────────────────────
// Handles "Frontend  React.js, Next.js, Redux" → extracts just the values
function parseSkillLine(line: string): string {
  // Pattern: "Label   Value, Value, Value" where label is 1-3 words with big gap
  // Detect by checking if line starts with a short word(s) followed by spaces then content
  const match = line.match(/^([A-Za-z\s]{2,20})\s{2,}(.+)$/);
  if (match) {
    const label = match[1].trim();
    const value = match[2].trim();
    // Label should be short (1-3 words), value should be longer
    if (label.split(/\s+/).length <= 3 && value.length > label.length) {
      return `${label}: ${value}`;
    }
  }
  return line;
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
      .replace(/[|•·⋄,\-–—:/\\]/g, " ")
      .replace(/\s+/g, " ").trim();

    if (/developer|engineer|designer|manager|analyst|intern|consultant|architect|developer/i.test(candidate)) continue;

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
      .replace(/[|•·⋄,\-–—:]/g, " ").replace(/\s+/g, " ").trim().slice(0, 55);
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
    if (sec === "header") continue;
    if (current === "header") continue;
    if (!sections[current]) sections[current] = [];
    sections[current].push(line);
  }

  // ── Step 4: Summary ───────────────────────────────────────────
  if (sections.summary?.length) {
    data.summary = sections.summary
      .filter(l => !(DATE_RE.test(l) && l.length < 40))
      .map(l => isBullet(l) ? stripBullet(l) : l)
      .join(" ").replace(/\s+/g, " ").trim().slice(0, 800);
  }

  // ── Step 5: Skills ────────────────────────────────────────────
  if (sections.skills?.length) {
    // Handle "Label   Value" format (e.g. "Frontend  React.js, Next.js")
    const skillParts: string[] = [];
    for (const line of sections.skills) {
      if (isBullet(line)) {
        skillParts.push(stripBullet(line));
        continue;
      }
      if (DATE_RE.test(line) && line.length < 40) continue;
      // Check for "Category  Skills" pattern (tab or multiple spaces between label and value)
      const tabMatch = line.match(/^([A-Za-z][A-Za-z\s]{1,20})\t+(.+)$/) ||
                       line.match(/^([A-Za-z][A-Za-z\s]{1,20})\s{3,}(.+)$/);
      if (tabMatch) {
        // Keep both label and value: "Frontend: React.js, Next.js"
        skillParts.push(`${tabMatch[1].trim()}: ${tabMatch[2].trim()}`);
      } else {
        skillParts.push(line);
      }
    }
    data.skills = skillParts
      .filter(Boolean)
      .join(", ")
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
      .filter(Boolean).join("\n").slice(0, 600);
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

  // ── Step 10: Languages → skills ──────────────────────────────
  if (sections.languages?.length) {
    const langs = sections.languages
      .map(l => isBullet(l) ? stripBullet(l) : l)
      .filter(l => l.length > 0 && !/^\d/.test(l))
      .join(", ");
    if (langs.trim()) {
      data.skills = data.skills ? `${data.skills}, ${langs}`.slice(0, 800) : langs.slice(0, 800);
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

    // ── Bullet line ──────────────────────────────────────────────
    if (bullet) {
      if (!cur) cur = { title: "", company: "", location: "", dates: "", bullets: [] };
      cur.bullets.push(stripBullet(line));
      continue;
    }

    // ── Continuation of previous bullet (lowercase start, short) ─
    if (cur?.bullets.length && !hasDate && line.length < 80) {
      const fc = line[0];
      if (fc && fc === fc.toLowerCase() && /[a-z]/.test(fc)) {
        cur.bullets[cur.bullets.length - 1] += " " + line.trim();
        continue;
      }
    }

    // ── Line with date ────────────────────────────────────────────
    if (hasDate) {
      const dateMatch = line.match(DATE_RE)!;
      const datePart = dateMatch[0];
      const beforeDate = line.slice(0, line.indexOf(datePart)).trim();

      if (beforeDate.length > 2) {
        // "Company  Date" on same line → new entry
        flush();
        cur = { title: "", company: beforeDate, location: "", dates: datePart, bullets: [] };
      } else if (cur) {
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

    // ── Non-bullet, non-date line ─────────────────────────────────
    if (line.length <= 120) {
      if (!cur) cur = { title: "", company: "", location: "", dates: "", bullets: [] };

      if (!cur.company && !cur.title) {
        // Try "Title | Company" or "Title at Company" split
        const sepMatch = line.match(/^(.+?)\s*(?:\s+at\s+|\s*\|\s*|\s*–\s*|\s*—\s*)\s*(.+)$/i);
        if (sepMatch && sepMatch[2].length > 2 && !DATE_RE.test(sepMatch[2])) {
          cur.title = sepMatch[1].trim();
          cur.company = sepMatch[2].trim();
        } else {
          cur.company = line.trim();
        }
      } else if (cur.company && !cur.title) {
        cur.title = line.trim();
      } else if (cur.title && cur.company) {
        flush();
        cur = { title: "", company: line.trim(), location: "", dates: "", bullets: [] };
      } else {
        cur.bullets.push(line.trim());
      }
    } else {
      // Long line — treat as bullet continuation or new bullet
      if (!cur) cur = { title: "", company: "", location: "", dates: "", bullets: [] };
      if (cur.bullets.length > 0 && /^[a-z]/.test(line)) {
        cur.bullets[cur.bullets.length - 1] += " " + line.trim();
      } else {
        cur.bullets.push(line.trim());
      }
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
    } else if (line.length <= 100 && !DATE_RE.test(line)) {
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

    // Handle "School  Date" on same line (e.g. "Vivekananda Global University  2022 – 2025")
    if (hasDate && !hasDegree) {
      const dateMatch = line.match(DATE_RE);
      if (dateMatch) {
        const datePart = dateMatch[0];
        const beforeDate = line.slice(0, line.indexOf(datePart)).trim();
        if (beforeDate.length > 3) {
          // "School  Date" format
          if (cur && !cur.school) {
            cur.school = beforeDate;
            cur.dates = datePart;
          } else if (cur && cur.school && !cur.dates) {
            cur.dates = datePart;
          } else {
            if (cur) entries.push(cur);
            cur = { degree: "", school: beforeDate, dates: datePart, details: [] };
          }
          continue;
        }
      }
      // Pure date line
      if (cur && !cur.dates) { cur.dates = line.trim(); continue; }
    }

    if (hasDegree) {
      if (cur) entries.push(cur);
      // Try "Degree, School" split
      let degree = line, school = "";
      const sepM = line.match(/^(.+?)\s*(?:,|–|—|\|)\s*(.+)$/);
      if (sepM && !DEGREE_RE.test(sepM[2]) && sepM[2].length > 3) {
        degree = sepM[1].trim();
        school = sepM[2].trim();
      }
      cur = { degree, school, dates: "", details: [] };
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

  // Merge consecutive entries where one has school+dates and next has degree
  const merged: typeof entries = [];
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    const next = entries[i + 1];
    if (!e.degree && next?.degree && !next.school && !next.dates) {
      // e has school+dates, next has degree — merge
      merged.push({ degree: next.degree, school: e.school, dates: e.dates, details: [...e.details, ...next.details] });
      i++; // skip next
    } else {
      merged.push(e);
    }
  }

  return merged.slice(0, 4).map((e, i) => ({
    id: String(i + 1),
    degree: e.degree,
    school: e.school,
    dates: e.dates,
    details: e.details.join(", "),
  }));
}
