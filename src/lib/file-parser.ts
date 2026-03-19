import { ResumeData, emptyResume } from "@/types/resume";

export async function parseFile(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase();

  if (ext === "pdf") {
    return parsePDF(file);
  } else if (ext === "docx" || ext === "doc") {
    return parseDOCX(file);
  } else if (ext === "txt" || ext === "text") {
    return file.text();
  }
  throw new Error("Unsupported file type. Please upload PDF, DOCX, or TXT.");
}

async function parsePDF(file: File): Promise<string> {
  try {
    const pdfjsLib = await import("pdfjs-dist");
    const workerUrl = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const pages: string[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const items = textContent.items as any[];

      // Group text items by their Y position to reconstruct lines
      const lineMap = new Map<number, { x: number; str: string }[]>();
      for (const item of items) {
        if (!item.str || item.str.trim() === "") continue;
        // Round Y to nearest 2px to group items on the same line
        const y = Math.round(item.transform[5] / 2) * 2;
        if (!lineMap.has(y)) lineMap.set(y, []);
        lineMap.get(y)!.push({ x: item.transform[4], str: item.str });
      }

      // Sort by Y descending (PDF coords are bottom-up), then X ascending within each line
      const sortedYs = Array.from(lineMap.keys()).sort((a, b) => b - a);
      const pageLines: string[] = [];
      for (const y of sortedYs) {
        const items = lineMap.get(y)!.sort((a, b) => a.x - b.x);
        const lineText = items.map((it) => it.str).join(" ").trim();
        if (lineText) pageLines.push(lineText);
      }
      pages.push(pageLines.join("\n"));
    }

    return pages.join("\n");
  } catch (err) {
    console.error("PDF parsing error:", err);
    throw new Error("Failed to parse PDF. Please try a different file or use TXT/DOCX format.");
  }
}

async function parseDOCX(file: File): Promise<string> {
  try {
    const mammoth = await import("mammoth");
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (err) {
    console.error("DOCX parsing error:", err);
    throw new Error("Failed to parse DOCX. Please try a different file or use TXT/PDF format.");
  }
}

// ─── Section patterns ───────────────────────────────────────────────
type Section = "header" | "summary" | "skills" | "experience" | "education" | "projects" | "certifications";

const SECTION_PATTERNS: [RegExp, Section][] = [
  [/^(professional\s+|career\s+)?(summary|objective|profile|about\s*me)/i, "summary"],
  [/^(technical\s+|core\s+|key\s+|relevant\s+)?skills|^competenc|^expertise|^technologies/i, "skills"],
  [/^(work\s+|professional\s+)?experience|^employment|^work\s+history|^career\s+history/i, "experience"],
  [/^education(al)?(\s+background)?|^academic/i, "education"],
  [/^(personal\s+|key\s+|academic\s+)?projects?/i, "projects"],
  [/^certif(ications?|icates?)|^licenses?(\s+(&|and)\s+certif)?|^awards?\s*((&|and)\s*certif)?/i, "certifications"],
];

// ─── Contact regex helpers ──────────────────────────────────────────
const EMAIL_RE = /[\w.+-]+@[\w.-]+\.\w{2,}/;
const PHONE_RE = /(?:\+?\d{1,3}[\s-]?)?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}/;
const LINKEDIN_RE = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w\-]+/i;
const LOCATION_RE = /([A-Z][a-zA-Z\s]+,\s*[A-Z]{2}(?:\s+\d{5})?)/;

function detectSection(line: string): Section | null {
  const cleaned = line.replace(/^[\s\-–—:_*#|]+/, "").replace(/[\s\-–—:_*#|]+$/, "").trim();
  if (cleaned.length === 0 || cleaned.length > 60) return null;
  for (const [pattern, section] of SECTION_PATTERNS) {
    if (pattern.test(cleaned)) return section;
  }
  return null;
}

function isBulletLine(line: string): boolean {
  return /^[•\-*▪▸◦›‣⁃→➤✓✔☑]\s*/.test(line) || /^\d+[.)]\s/.test(line);
}

function cleanBullet(line: string): string {
  return line.replace(/^[•\-*▪▸◦›‣⁃→➤✓✔☑]\s*/, "").replace(/^\d+[.)]\s*/, "").trim();
}

const DATE_RE = /\b(jan(uary)?|feb(ruary)?|mar(ch)?|apr(il)?|may|jun(e)?|jul(y)?|aug(ust)?|sep(t(ember)?)?|oct(ober)?|nov(ember)?|dec(ember)?|\d{1,2}\/\d{2,4}|\d{4})\b.*\b(\d{4}|present|current|ongoing|till\s+date|now)\b/i;

function isContactLine(line: string): boolean {
  const l = line.trim();
  // Pure email/phone/linkedin lines
  if (EMAIL_RE.test(l) && l.replace(EMAIL_RE, "").replace(/[|•·,\s\-–—]/g, "").length < 5) return true;
  if (LINKEDIN_RE.test(l)) return true;
  // Lines with multiple contact items mixed together
  let contactParts = 0;
  if (EMAIL_RE.test(l)) contactParts++;
  if (PHONE_RE.test(l)) contactParts++;
  if (LOCATION_RE.test(l)) contactParts++;
  if (contactParts >= 2) return true;
  return false;
}

// ─── Main parser ────────────────────────────────────────────────────
export function parseResumeText(text: string): ResumeData {
  // Normalize text: handle cases where PDF gives one big blob
  let normalizedText = text;
  
  // If text has very few newlines relative to its length, try to split on double spaces or common patterns
  const lineCount = text.split(/\r?\n/).filter(l => l.trim()).length;
  if (lineCount <= 3 && text.length > 200) {
    // Likely a single-blob PDF extraction — try to split on section keywords
    normalizedText = text
      .replace(/(summary|objective|profile|skills|experience|education|projects?|certif)/gi, "\n$1")
      .replace(/([.!?])\s+([A-Z])/g, "$1\n$2");
  }

  const rawLines = normalizedText.split(/\r?\n/).map((l) => l.trim());
  const lines = rawLines.filter(Boolean);
  const data: ResumeData = { ...emptyResume, experiences: [], projects: [], education: [] };

  if (lines.length === 0) return data;

  // ── Step 1: Extract contact info ──────────────────────────────
  const contactLineIdx = new Set<number>();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!data.email) {
      const m = line.match(EMAIL_RE);
      if (m) { data.email = m[0]; contactLineIdx.add(i); }
    }
    if (!data.phone) {
      const m = line.match(PHONE_RE);
      if (m && m[0].replace(/\D/g, "").length >= 10) { data.phone = m[0].trim(); contactLineIdx.add(i); }
    }
    if (!data.linkedin) {
      const m = line.match(LINKEDIN_RE);
      if (m) { data.linkedin = m[0]; contactLineIdx.add(i); }
    }
    if (!data.location) {
      const m = line.match(LOCATION_RE);
      if (m) { data.location = m[1]; contactLineIdx.add(i); }
    }
  }

  // ── Step 2: Extract name (FIRST few lines, skip contact/section headers) ──
  for (let i = 0; i < Math.min(8, lines.length); i++) {
    const line = lines[i];
    // Skip section headers
    if (detectSection(line)) continue;
    // Skip pure contact lines
    if (isContactLine(line)) continue;
    // Strip out any embedded contact info
    let candidate = line
      .replace(EMAIL_RE, "")
      .replace(PHONE_RE, "")
      .replace(LINKEDIN_RE, "")
      .replace(LOCATION_RE, "")
      .replace(/[|•·,\-–—:]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    // Name should be short, mostly letters
    if (candidate.length >= 2 && candidate.length <= 50) {
      const isNameLike = /^[A-Za-z\s.'\-]+$/.test(candidate);
      const wordCount = candidate.split(/\s+/).length;
      if (isNameLike && wordCount >= 1 && wordCount <= 5) {
        data.fullName = candidate;
        contactLineIdx.add(i);
        break;
      }
    }
  }

  // If no name found, use first line trimmed to 50 chars as last resort
  if (!data.fullName && lines.length > 0) {
    let first = lines[0]
      .replace(EMAIL_RE, "").replace(PHONE_RE, "").replace(LINKEDIN_RE, "")
      .replace(/[|•·,\-–—:]/g, " ").replace(/\s+/g, " ").trim();
    if (first.length > 50) first = first.slice(0, 50);
    if (first.length > 0) {
      data.fullName = first;
      contactLineIdx.add(0);
    }
  }

  // ── Step 3: Split lines into sections ─────────────────────────
  const sections: Record<string, string[]> = {};
  let currentSection: Section = "header";

  for (let i = 0; i < lines.length; i++) {
    if (contactLineIdx.has(i) && currentSection === "header") continue;
    const line = lines[i];
    const detected = detectSection(line);
    if (detected) {
      currentSection = detected;
      continue; // skip the header line itself
    }
    if (currentSection !== "header") {
      if (!sections[currentSection]) sections[currentSection] = [];
      sections[currentSection].push(line);
    }
  }

  // ── Step 4: Populate summary ──────────────────────────────────
  if (sections["summary"]?.length) {
    data.summary = sections["summary"]
      .map(l => cleanBullet(l))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 600);
  }

  // ── Step 5: Populate skills ───────────────────────────────────
  if (sections["skills"]?.length) {
    data.skills = sections["skills"]
      .map(l => cleanBullet(l))
      .join(", ")
      .replace(/,\s*,/g, ",")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 600);
  }

  // ── Step 6: Populate certifications ───────────────────────────
  if (sections["certifications"]?.length) {
    data.certifications = sections["certifications"]
      .map(l => cleanBullet(l))
      .filter(Boolean)
      .join("\n")
      .slice(0, 500);
  }

  // ── Step 7: Parse experience ──────────────────────────────────
  if (sections["experience"]?.length) {
    data.experiences = parseExperiences(sections["experience"]);
  }

  // ── Step 8: Parse projects ────────────────────────────────────
  if (sections["projects"]?.length) {
    data.projects = parseProjects(sections["projects"]);
  }

  // ── Step 9: Parse education ───────────────────────────────────
  if (sections["education"]?.length) {
    data.education = parseEducation(sections["education"]);
  }

  // ── Step 10: Fallback — if no sections detected, distribute text ──
  if (!data.summary && !data.skills && data.experiences.length === 0 && data.education.length === 0) {
    const bodyLines = lines.filter((_, i) => !contactLineIdx.has(i) && lines[i] !== data.fullName);
    if (bodyLines.length > 0) {
      // Try to at least put some text in summary
      data.summary = bodyLines.slice(0, 5).join(" ").replace(/\s+/g, " ").trim().slice(0, 500);
      if (bodyLines.length > 5) {
        data.skills = bodyLines.slice(5, 10).join(", ").slice(0, 300);
      }
    }
  }

  return data;
}

// ─── Experience parser ──────────────────────────────────────────────
function parseExperiences(lines: string[]) {
  const entries: { title: string; company: string; location: string; dates: string; bullets: string[] }[] = [];
  let current: typeof entries[0] | null = null;

  for (const line of lines) {
    const bullet = isBulletLine(line);
    const hasDate = DATE_RE.test(line);

    if (bullet) {
      if (current) current.bullets.push(cleanBullet(line));
    } else if (hasDate) {
      if (current) {
        if (!current.dates) {
          current.dates = line.trim();
        } else {
          // New entry with date
          entries.push(current);
          current = { title: line.trim(), company: "", location: "", dates: "", bullets: [] };
        }
      } else {
        current = { title: "", company: "", location: "", dates: line.trim(), bullets: [] };
      }
    } else if (line.length < 100 && !bullet) {
      // Likely a title/company line
      if (current && (current.title || current.bullets.length > 0)) {
        entries.push(current);
      }

      let title = line;
      let company = "";
      let location = "";

      // Split "Title | Company" or "Title at Company" or "Title — Company"
      const separators = [/\s+at\s+/i, /\s*[|]\s*/, /\s*[–—]\s+/];
      for (const sep of separators) {
        if (sep.test(line)) {
          const parts = line.split(sep);
          title = parts[0].trim();
          company = parts.slice(1).join(" ").trim();
          break;
        }
      }

      // Try extracting location from company
      const locMatch = company.match(/,\s*([A-Z][a-zA-Z\s]+,\s*[A-Z]{2})$/);
      if (locMatch) {
        location = locMatch[1];
        company = company.replace(locMatch[0], "").trim();
      }

      current = { title, company, location, dates: "", bullets: [] };
    } else if (current) {
      current.bullets.push(line.trim());
    }
  }
  if (current && (current.title || current.bullets.length > 0)) {
    entries.push(current);
  }

  return entries.slice(0, 6).map((e, i) => ({
    id: String(i + 1),
    title: e.title,
    company: e.company,
    location: e.location,
    dates: e.dates,
    bullets: e.bullets.slice(0, 8).join("\n"),
  }));
}

// ─── Projects parser ────────────────────────────────────────────────
function parseProjects(lines: string[]) {
  const entries: { name: string; description: string; bullets: string[] }[] = [];
  let current: typeof entries[0] | null = null;

  for (const line of lines) {
    if (isBulletLine(line)) {
      if (current) current.bullets.push(cleanBullet(line));
    } else if (line.length < 80) {
      if (current) entries.push(current);
      current = { name: line.trim(), description: "", bullets: [] };
    } else {
      if (current) {
        if (!current.description) current.description = line.trim();
        else current.bullets.push(line.trim());
      }
    }
  }
  if (current) entries.push(current);

  return entries.slice(0, 4).map((p, i) => ({
    id: String(i + 1),
    name: p.name,
    description: p.description,
    bullets: p.bullets.join("\n"),
  }));
}

// ─── Education parser ───────────────────────────────────────────────
function parseEducation(lines: string[]) {
  const entries: { degree: string; school: string; dates: string; details: string[] }[] = [];
  let current: typeof entries[0] | null = null;
  const DEGREE_RE = /\b(b\.?s\.?|b\.?a\.?|b\.?e\.?|b\.?tech|m\.?s\.?|m\.?a\.?|m\.?tech|m\.?b\.?a|ph\.?d|bachelor|master|associate|diploma|certificate|doctor|engineering)\b/i;

  for (const line of lines) {
    if (isBulletLine(line)) {
      if (current) current.details.push(cleanBullet(line));
    } else if (DATE_RE.test(line) && current && !current.dates) {
      current.dates = line.trim();
    } else if (line.length < 120 && !isBulletLine(line)) {
      if (current) entries.push(current);
      const hasDegree = DEGREE_RE.test(line);
      current = {
        degree: hasDegree ? line.trim() : "",
        school: hasDegree ? "" : line.trim(),
        dates: "",
        details: [],
      };
    } else if (current) {
      if (!current.school) current.school = line.trim();
      else current.details.push(line.trim());
    }
  }
  if (current) entries.push(current);

  // Post-process: if degree is empty but school has degree-like text, swap
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
