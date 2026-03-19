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
    // Use a specific CDN URL that works both locally and in production
    const workerUrl = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const pages: string[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const text = textContent.items
        .map((item: any) => item.str)
        .join(" ");
      pages.push(text);
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

export function parseResumeText(text: string): ResumeData {
  // Normalize: split by newlines, trim, filter empty
  const rawLines = text.split(/\r?\n/).map((l) => l.trim());
  const lines = rawLines.filter(Boolean);
  const data: ResumeData = { ...emptyResume, experiences: [], projects: [], education: [] };

  if (lines.length === 0) return data;

  // --- Step 1: Extract contact info from ALL lines first ---
  const emailRegex = /[\w.+-]+@[\w.-]+\.\w{2,}/;
  const phoneRegex = /[\+]?[\d\s\-().]{7,15}\d/;
  const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w\-]+/i;
  const locationRegex = /([A-Z][a-z]+(?:\s[A-Z][a-z]+)*,\s*[A-Z]{2}(?:\s+\d{5})?)/;

  const contactLines = new Set<number>();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!data.email && emailRegex.test(line)) {
      data.email = line.match(emailRegex)?.[0] || "";
      contactLines.add(i);
    }
    if (!data.phone && phoneRegex.test(line)) {
      const match = line.match(phoneRegex)?.[0] || "";
      // Only accept if it has at least 10 digits
      if (match.replace(/\D/g, "").length >= 10) {
        data.phone = match.trim();
        contactLines.add(i);
      }
    }
    if (!data.linkedin && linkedinRegex.test(line)) {
      data.linkedin = line.match(linkedinRegex)?.[0] || "";
      contactLines.add(i);
    }
    if (!data.location && locationRegex.test(line)) {
      data.location = line.match(locationRegex)?.[1] || "";
      contactLines.add(i);
    }
  }

  // --- Step 2: Extract name from the first non-contact line ---
  // The name is typically the first line that isn't purely contact info
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    // Skip lines that are purely contact info
    if (emailRegex.test(line) && line.match(emailRegex)?.[0]?.length === line.length) continue;
    if (linkedinRegex.test(line)) continue;
    // Skip lines that look like section headers
    if (/^(summary|skills|experience|education|projects|certif|objective|profile)/i.test(line)) continue;
    // Skip lines that are just phone/email/location
    const stripped = line
      .replace(emailRegex, "")
      .replace(phoneRegex, "")
      .replace(linkedinRegex, "")
      .replace(/[|•·,\-]/g, "")
      .trim();
    if (stripped.length > 1 && stripped.length < 60 && !stripped.includes("@")) {
      // Check if it looks like a name (mostly letters)
      if (/^[A-Za-z\s.'-]+$/.test(stripped) || stripped.split(/\s+/).length <= 5) {
        data.fullName = stripped;
        contactLines.add(i);
        break;
      }
    }
    // If first line and nothing else matched, use it as name
    if (i === 0 && stripped.length > 0) {
      data.fullName = stripped.slice(0, 50);
      contactLines.add(i);
      break;
    }
  }

  // --- Step 3: Section detection ---
  type Section = "header" | "summary" | "skills" | "experience" | "education" | "projects" | "certifications";
  const sections: Record<string, string[]> = {};
  let currentSection: Section = "header";

  const sectionPatterns: [RegExp, Section][] = [
    [/^(professional\s+)?summary|^(career\s+)?objective|^profile/i, "summary"],
    [/^(technical\s+|core\s+|key\s+)?skills|^competencies|^expertise/i, "skills"],
    [/^(work\s+|professional\s+)?experience|^employment(\s+history)?|^work\s+history/i, "experience"],
    [/^education(al)?(\s+background)?/i, "education"],
    [/^(personal\s+|key\s+)?projects?/i, "projects"],
    [/^certif(ications?|icates?)|^licenses?(\s+(&|and)\s+certif)?/i, "certifications"],
  ];

  for (let i = 0; i < lines.length; i++) {
    if (contactLines.has(i)) continue;
    const line = lines[i];

    // Check if this line is a section header
    let isHeader = false;
    for (const [pattern, section] of sectionPatterns) {
      if (pattern.test(line)) {
        currentSection = section;
        isHeader = true;
        break;
      }
    }

    if (!isHeader && currentSection !== "header") {
      if (!sections[currentSection]) sections[currentSection] = [];
      sections[currentSection].push(line);
    }
  }

  // --- Step 4: Populate fields ---

  // Summary
  if (sections["summary"]?.length) {
    data.summary = sections["summary"].join(" ").slice(0, 500);
  }

  // Skills
  if (sections["skills"]?.length) {
    data.skills = sections["skills"].join(", ").replace(/,\s*,/g, ",").slice(0, 500);
  }

  // Certifications
  if (sections["certifications"]?.length) {
    data.certifications = sections["certifications"].join("\n").slice(0, 500);
  }

  // --- Step 5: Parse experience into structured entries ---
  if (sections["experience"]?.length) {
    const expLines = sections["experience"];
    const entries: { title: string; company: string; location: string; dates: string; bullets: string[] }[] = [];
    let current: typeof entries[0] | null = null;

    const datePattern = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december|\d{4})\b.*\b(\d{4}|present|current)\b/i;

    for (const line of expLines) {
      const isBullet = /^[•\-*▪▸◦›‣⁃]/.test(line);
      const hasDate = datePattern.test(line);

      if (isBullet) {
        // It's a bullet point
        if (current) {
          current.bullets.push(line.replace(/^[•\-*▪▸◦›‣⁃]\s*/, ""));
        }
      } else if (hasDate && current) {
        // It's a date line for current entry
        current.dates = line.trim();
      } else if (!isBullet && line.length < 100) {
        // Likely a new role/company line
        if (current && (current.title || current.bullets.length > 0)) {
          entries.push(current);
        }
        // Try to split "Title | Company" or "Title at Company" or "Title, Company"
        let title = line;
        let company = "";
        let location = "";

        const separators = [/ at /i, /\s*[|]\s*/, /\s*[–—-]\s+(?=[A-Z])/];
        for (const sep of separators) {
          if (sep.test(line)) {
            const parts = line.split(sep);
            title = parts[0].trim();
            company = parts.slice(1).join(" ").trim();
            break;
          }
        }

        // Extract location from company if present
        const locMatch = company.match(/,\s*([A-Z][a-z]+(?:\s[A-Z][a-z]+)*,\s*[A-Z]{2})$/);
        if (locMatch) {
          location = locMatch[1];
          company = company.replace(locMatch[0], "").trim();
        }

        current = { title, company, location, dates: "", bullets: [] };
      } else if (current) {
        // Long non-bullet line — treat as a bullet
        current.bullets.push(line);
      }
    }
    if (current && (current.title || current.bullets.length > 0)) {
      entries.push(current);
    }

    data.experiences = entries.slice(0, 6).map((e, i) => ({
      id: String(i + 1),
      title: e.title,
      company: e.company,
      location: e.location,
      dates: e.dates,
      bullets: e.bullets.slice(0, 6).join("\n"),
    }));
  }

  // --- Step 6: Parse projects ---
  if (sections["projects"]?.length) {
    const projLines = sections["projects"];
    const entries: { name: string; description: string; bullets: string[] }[] = [];
    let current: typeof entries[0] | null = null;

    for (const line of projLines) {
      const isBullet = /^[•\-*▪▸◦›‣⁃]/.test(line);
      if (isBullet) {
        if (current) current.bullets.push(line.replace(/^[•\-*▪▸◦›‣⁃]\s*/, ""));
      } else if (line.length < 80) {
        if (current) entries.push(current);
        current = { name: line, description: "", bullets: [] };
      } else {
        if (current) {
          if (!current.description) current.description = line;
          else current.bullets.push(line);
        }
      }
    }
    if (current) entries.push(current);

    data.projects = entries.slice(0, 4).map((p, i) => ({
      id: String(i + 1),
      name: p.name,
      description: p.description,
      bullets: p.bullets.join("\n"),
    }));
  }

  // --- Step 7: Parse education ---
  if (sections["education"]?.length) {
    const eduLines = sections["education"];
    const entries: { degree: string; school: string; dates: string; details: string[] }[] = [];
    let current: typeof entries[0] | null = null;
    const datePattern = /\b\d{4}\b/;

    for (const line of eduLines) {
      const isBullet = /^[•\-*▪▸◦›‣⁃]/.test(line);
      if (isBullet) {
        if (current) current.details.push(line.replace(/^[•\-*▪▸◦›‣⁃]\s*/, ""));
      } else if (datePattern.test(line) && current && !current.dates) {
        current.dates = line;
      } else if (!isBullet && line.length < 100) {
        if (current) entries.push(current);
        // Try to detect if degree or school
        const hasDegree = /\b(b\.?s\.?|b\.?a\.?|m\.?s\.?|m\.?a\.?|ph\.?d|bachelor|master|associate|diploma|certificate)/i.test(line);
        current = {
          degree: hasDegree ? line : "",
          school: hasDegree ? "" : line,
          dates: "",
          details: [],
        };
      } else if (current) {
        // Check if it's a school name for existing entry
        if (!current.school && !current.degree) {
          current.degree = line;
        } else if (!current.school) {
          current.school = line;
        } else {
          current.details.push(line);
        }
      }
    }
    if (current) entries.push(current);

    data.education = entries.slice(0, 4).map((e, i) => ({
      id: String(i + 1),
      degree: e.degree,
      school: e.school,
      dates: e.dates,
      details: e.details.join(", "),
    }));
  }

  // --- Fallback: if nothing was parsed into sections ---
  if (!data.summary && !data.skills && data.experiences.length === 0) {
    const bodyLines = lines.filter(
      (l, i) => !contactLines.has(i) && l !== data.fullName
    );
    if (bodyLines.length > 0) {
      data.summary = bodyLines.slice(0, 4).join(" ").slice(0, 400);
      if (bodyLines.length > 4) {
        data.skills = bodyLines.slice(4, 8).join(", ").slice(0, 300);
      }
    }
  }

  return data;
}
