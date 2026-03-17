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
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

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
}

async function parseDOCX(file: File): Promise<string> {
  const mammoth = await import("mammoth");
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

export function parseResumeText(text: string): ResumeData {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const data: ResumeData = { ...emptyResume, experiences: [], projects: [], education: [] };

  if (lines.length === 0) return data;

  // Extract name (first line)
  data.fullName = lines[0];

  // Extract email, phone, linkedin, location
  for (const line of lines) {
    if (!data.email && /[\w.-]+@[\w.-]+\.\w+/.test(line)) {
      data.email = line.match(/[\w.-]+@[\w.-]+\.\w+/)?.[0] || "";
    }
    if (!data.phone && /\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/.test(line)) {
      data.phone = line.match(/\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/)?.[0] || "";
    }
    if (!data.linkedin && /linkedin\.com/i.test(line)) {
      data.linkedin = line.match(/(linkedin\.com\S*)/i)?.[0] || "";
    }
  }

  // Simple section detection
  const sectionHeaders: Record<string, string> = {};
  const sectionOrder: string[] = [];
  let currentSection = "header";

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const lower = line.toLowerCase();

    if (/^(professional\s+)?summary/i.test(line) || /^(career\s+)?objective/i.test(line)) {
      currentSection = "summary";
      sectionOrder.push(currentSection);
    } else if (/^skills?/i.test(line) || /^(technical|core)\s+skills/i.test(line)) {
      currentSection = "skills";
      sectionOrder.push(currentSection);
    } else if (/^(work\s+)?experience/i.test(line) || /^employment/i.test(line)) {
      currentSection = "experience";
      sectionOrder.push(currentSection);
    } else if (/^education/i.test(line)) {
      currentSection = "education";
      sectionOrder.push(currentSection);
    } else if (/^(projects?|personal\s+projects?)/i.test(line)) {
      currentSection = "projects";
      sectionOrder.push(currentSection);
    } else if (/^certif/i.test(line)) {
      currentSection = "certifications";
      sectionOrder.push(currentSection);
    } else {
      if (!sectionHeaders[currentSection]) sectionHeaders[currentSection] = "";
      sectionHeaders[currentSection] += line + "\n";
    }
  }

  // Populate data
  if (sectionHeaders["summary"]) {
    data.summary = sectionHeaders["summary"].trim().slice(0, 300);
  }
  if (sectionHeaders["skills"]) {
    data.skills = sectionHeaders["skills"].trim().slice(0, 300);
  }
  if (sectionHeaders["certifications"]) {
    data.certifications = sectionHeaders["certifications"].trim();
  }

  // Parse experience lines into entries
  if (sectionHeaders["experience"]) {
    const expLines = sectionHeaders["experience"].trim().split("\n").filter(Boolean);
    // Simple heuristic: group into chunks
    let currentExp: { title: string; bullets: string[] } = { title: "", bullets: [] };
    const exps: typeof currentExp[] = [];

    for (const line of expLines) {
      // If line looks like a title (no bullet marker, relatively short)
      if (!line.startsWith("•") && !line.startsWith("-") && !line.startsWith("*") && line.length < 80) {
        if (currentExp.title) exps.push(currentExp);
        currentExp = { title: line, bullets: [] };
      } else {
        currentExp.bullets.push(line.replace(/^[•\-*]\s*/, ""));
      }
    }
    if (currentExp.title) exps.push(currentExp);

    data.experiences = exps.slice(0, 4).map((e, i) => ({
      id: String(i + 1),
      title: e.title,
      company: "",
      location: "",
      dates: "",
      bullets: e.bullets.slice(0, 4).join("\n"),
    }));
  }

  // Parse education
  if (sectionHeaders["education"]) {
    const eduLines = sectionHeaders["education"].trim().split("\n").filter(Boolean);
    data.education = [{
      id: "1",
      degree: eduLines[0] || "",
      school: eduLines[1] || "",
      dates: eduLines[2] || "",
      details: eduLines.slice(3).join(", "),
    }];
  }

  // Fallback: if no sections detected, use body as summary
  if (!data.summary && !data.skills && data.experiences.length === 0) {
    const bodyLines = lines.slice(1).filter(
      (l) => !l.includes(data.email) && !l.includes(data.phone)
    );
    data.summary = bodyLines.slice(0, 3).join(" ").slice(0, 300);
    data.skills = bodyLines.slice(3, 6).join(", ").slice(0, 200);
  }

  return data;
}
