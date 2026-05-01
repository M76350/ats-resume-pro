import { ResumeData } from "@/types/resume";

interface ResumePreviewProps {
  data: ResumeData;
  template?: string;
}

const ResumePreview = ({ data, template = "classic" }: ResumePreviewProps) => {
  const hasCertifications = data.certifications.trim().length > 0;
  const hasProjects = data.projects.length > 0;
  const hasExperiences = data.experiences.length > 0;
  const hasEducation = data.education.length > 0;
  const hasSkills = data.skills.trim().length > 0;
  const hasSummary = data.summary.trim().length > 0;
  const contactParts = [data.email, data.phone, data.location, data.linkedin].filter(Boolean);
  const props = { data, contactParts, hasSummary, hasSkills, hasExperiences, hasProjects, hasEducation, hasCertifications };

  if (template === "modern")        return <ModernTemplate {...props} />;
  if (template === "minimal")       return <MinimalTemplate {...props} />;
  if (template === "bold")          return <BoldTemplate {...props} />;
  if (template === "executive")     return <ExecutiveTemplate {...props} />;
  if (template === "compact")       return <CompactTemplate {...props} />;
  if (template === "elegant")       return <ElegantTemplate {...props} />;
  return <ClassicTemplate {...props} />;
};

interface TemplateProps {
  data: ResumeData;
  contactParts: string[];
  hasSummary: boolean;
  hasSkills: boolean;
  hasExperiences: boolean;
  hasProjects: boolean;
  hasEducation: boolean;
  hasCertifications: boolean;
}

/* ═══════════════════════════════════════════
   CLASSIC TEMPLATE
   ═══════════════════════════════════════════ */
function ClassicTemplate({ data, contactParts, hasSummary, hasSkills, hasExperiences, hasProjects, hasEducation, hasCertifications }: TemplateProps) {
  return (
    <div className="resume-page p-[40px] w-full max-w-[210mm] mx-auto min-h-[297mm] shadow-lg border border-border" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
      {data.fullName && (
        <div className="text-center mb-1" style={{ borderBottom: "2px solid #1e3a5f", paddingBottom: "8px" }}>
          <h1 style={{ color: "#1e3a5f", fontSize: "22pt", margin: 0, fontWeight: 700, letterSpacing: "0.02em" }}>{data.fullName}</h1>
          {contactParts.length > 0 && (
            <p style={{ fontSize: "10pt", color: "#555", marginTop: "4px" }}>{contactParts.join("  •  ")}</p>
          )}
        </div>
      )}

      {hasSummary && (
        <Section title="Professional Summary" color="#1e3a5f" style="classic">
          <p>{data.summary}</p>
        </Section>
      )}

      {hasSkills && (
        <Section title="Skills" color="#1e3a5f" style="classic">
          <p>{data.skills}</p>
        </Section>
      )}

      {hasExperiences && (
        <Section title="Work Experience" color="#1e3a5f" style="classic">
          {data.experiences.map((exp) => (
            <ExperienceBlock key={exp.id} exp={exp} />
          ))}
        </Section>
      )}

      {hasProjects && (
        <Section title="Projects" color="#1e3a5f" style="classic">
          {data.projects.map((proj) => (
            <div key={proj.id} className="mb-2">
              <span className="font-bold">{proj.name}</span>
              {proj.description && <span> — {proj.description}</span>}
              {proj.bullets.trim() && <BulletList text={proj.bullets} />}
            </div>
          ))}
        </Section>
      )}

      {hasEducation && (
        <Section title="Education" color="#1e3a5f" style="classic">
          {data.education.map((edu) => (
            <EducationBlock key={edu.id} edu={edu} />
          ))}
        </Section>
      )}

      {hasCertifications && (
        <Section title="Certifications" color="#1e3a5f" style="classic">
          <BulletList text={data.certifications} />
        </Section>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   MODERN TEMPLATE
   ═══════════════════════════════════════════ */
function ModernTemplate({ data, contactParts, hasSummary, hasSkills, hasExperiences, hasProjects, hasEducation, hasCertifications }: TemplateProps) {
  const accent = "#0e7490";
  return (
    <div className="resume-page w-full max-w-[210mm] mx-auto min-h-[297mm] shadow-lg border border-border flex" style={{ fontFamily: "Arial, Helvetica, sans-serif", padding: 0 }}>
      {/* Left accent strip */}
      <div style={{ width: "6px", background: accent, flexShrink: 0 }} />
      <div className="p-[36px] pl-[30px] flex-1">
        {data.fullName && (
          <div className="mb-3">
            <h1 style={{ color: accent, fontSize: "24pt", margin: 0, fontWeight: 700 }}>{data.fullName}</h1>
            {contactParts.length > 0 && (
              <p style={{ fontSize: "10pt", color: "#666", marginTop: "4px" }}>{contactParts.join("  |  ")}</p>
            )}
          </div>
        )}

        {hasSummary && (
          <Section title="Summary" color={accent} style="modern">
            <p>{data.summary}</p>
          </Section>
        )}

        {hasSkills && (
          <Section title="Skills" color={accent} style="modern">
            <p>{data.skills}</p>
          </Section>
        )}

        {hasExperiences && (
          <Section title="Experience" color={accent} style="modern">
            {data.experiences.map((exp) => (
              <div key={exp.id} className="mb-3" style={{ borderLeft: `2px solid ${accent}22`, paddingLeft: "10px" }}>
                <ExperienceBlock exp={exp} />
              </div>
            ))}
          </Section>
        )}

        {hasProjects && (
          <Section title="Projects" color={accent} style="modern">
            {data.projects.map((proj) => (
              <div key={proj.id} className="mb-2" style={{ borderLeft: `2px solid ${accent}22`, paddingLeft: "10px" }}>
                <span className="font-bold">{proj.name}</span>
                {proj.description && <span> — {proj.description}</span>}
                {proj.bullets.trim() && <BulletList text={proj.bullets} marker="›" />}
              </div>
            ))}
          </Section>
        )}

        {hasEducation && (
          <Section title="Education" color={accent} style="modern">
            {data.education.map((edu) => (
              <EducationBlock key={edu.id} edu={edu} />
            ))}
          </Section>
        )}

        {hasCertifications && (
          <Section title="Certifications" color={accent} style="modern">
            <BulletList text={data.certifications} marker="›" />
          </Section>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MINIMAL TEMPLATE
   ═══════════════════════════════════════════ */
function MinimalTemplate({ data, contactParts, hasSummary, hasSkills, hasExperiences, hasProjects, hasEducation, hasCertifications }: TemplateProps) {
  return (
    <div className="resume-page p-[48px] w-full max-w-[210mm] mx-auto min-h-[297mm] shadow-lg border border-border" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
      {data.fullName && (
        <div className="text-center mb-4">
          <h1 style={{ fontSize: "22pt", margin: 0, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#222" }}>{data.fullName}</h1>
          {contactParts.length > 0 && (
            <p style={{ fontSize: "9.5pt", color: "#888", marginTop: "6px", letterSpacing: "0.04em" }}>{contactParts.join("   ·   ")}</p>
          )}
        </div>
      )}

      {hasSummary && (
        <div className="text-center mb-4" style={{ maxWidth: "85%", margin: "0 auto 16px" }}>
          <p style={{ fontStyle: "italic", fontSize: "10.5pt", color: "#555", lineHeight: 1.6 }}>{data.summary}</p>
        </div>
      )}

      <div style={{ borderTop: "1px solid #ddd", marginBottom: "14px" }} />

      {hasSkills && (
        <Section title="Skills" color="#555" style="minimal">
          <p>{data.skills}</p>
        </Section>
      )}

      {hasExperiences && (
        <Section title="Experience" color="#555" style="minimal">
          {data.experiences.map((exp) => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <span className="font-bold">{exp.title} — <span className="font-normal">{exp.company}</span></span>
                <span style={{ fontSize: "9pt", color: "#999" }}>{exp.dates}</span>
              </div>
              {exp.location && <div style={{ fontSize: "9.5pt", color: "#777" }}>{exp.location}</div>}
              {exp.bullets.trim() && <BulletList text={exp.bullets} marker="–" />}
            </div>
          ))}
        </Section>
      )}

      {hasProjects && (
        <Section title="Projects" color="#555" style="minimal">
          {data.projects.map((proj) => (
            <div key={proj.id} className="mb-2">
              <span className="font-bold">{proj.name}</span>
              {proj.description && <span> — {proj.description}</span>}
              {proj.bullets.trim() && <BulletList text={proj.bullets} marker="–" />}
            </div>
          ))}
        </Section>
      )}

      {hasEducation && (
        <Section title="Education" color="#555" style="minimal">
          {data.education.map((edu) => (
            <div key={edu.id} className="mb-1">
              <span className="font-bold">{edu.degree}</span> — {edu.school}
              {edu.dates && <span style={{ fontSize: "9pt", color: "#999", marginLeft: "8px" }}>{edu.dates}</span>}
              {edu.details && <div style={{ fontSize: "9.5pt", color: "#777" }}>{edu.details}</div>}
            </div>
          ))}
        </Section>
      )}

      {hasCertifications && (
        <Section title="Certifications" color="#555" style="minimal">
          <BulletList text={data.certifications} marker="–" />
        </Section>
      )}
    </div>
  );
}

/* ── Shared Sub-components ──────────────────── */

function Section({ title, color, style, children }: { title: string; color: string; style: "classic" | "modern" | "minimal" | "bold" | "executive" | "compact" | "elegant"; children: React.ReactNode }) {
  if (style === "modern" || style === "executive") {
    return (
      <div className="mt-3">
        <h2 style={{ fontSize: "12pt", color, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px", fontWeight: 700 }}>
          <span style={{ width: "14px", height: "2px", background: color, display: "inline-block" }} />
          {title}
        </h2>
        {children}
      </div>
    );
  }
  if (style === "minimal" || style === "elegant") {
    return (
      <div className="mb-3">
        <h2 style={{ fontSize: "10pt", color, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px", fontWeight: 700 }}>{title}</h2>
        {children}
      </div>
    );
  }
  if (style === "bold") {
    return (
      <div style={{ marginBottom: "12px" }}>
        <h2 style={{ fontSize: "11pt", color, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: `2px solid ${color}`, paddingBottom: "2px", marginBottom: "5px" }}>{title}</h2>
        {children}
      </div>
    );
  }
  if (style === "compact") {
    return (
      <div style={{ marginBottom: "10px" }}>
        <h2 style={{ fontSize: "10pt", color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px", borderBottom: `1px solid ${color}44`, paddingBottom: "2px" }}>{title}</h2>
        {children}
      </div>
    );
  }
  // classic
  return (
    <div>
      <h2 style={{ fontSize: "13pt", color, textTransform: "uppercase", letterSpacing: "0.03em", borderBottom: `1.5px solid ${color}33`, paddingBottom: "2px", marginTop: "14px", marginBottom: "4px", fontWeight: 700 }}>{title}</h2>
      {children}
    </div>
  );
}

function ExperienceBlock({ exp }: { exp: { title: string; company: string; location: string; dates: string; bullets: string } }) {
  return (
    <div className="mb-2">
      <div className="flex justify-between items-baseline">
        <span className="font-bold">{exp.title}</span>
        <span style={{ fontSize: "10pt", color: "#777" }}>{exp.dates}</span>
      </div>
      <div className="flex justify-between items-baseline">
        <span className="italic">{exp.company}</span>
        <span style={{ fontSize: "10pt", color: "#777" }}>{exp.location}</span>
      </div>
      {exp.bullets.trim() && <BulletList text={exp.bullets} />}
    </div>
  );
}

function EducationBlock({ edu }: { edu: { degree: string; school: string; dates: string; details: string } }) {
  return (
    <div className="mb-1">
      <div className="flex justify-between items-baseline">
        <span className="font-bold">{edu.degree}</span>
        <span style={{ fontSize: "10pt", color: "#777" }}>{edu.dates}</span>
      </div>
      <div>{edu.school}</div>
      {edu.details && <div style={{ fontSize: "10pt", color: "#666" }}>{edu.details}</div>}
    </div>
  );
}

function BulletList({ text, marker }: { text: string; marker?: string }) {
  const items = text.split("\n").filter(Boolean);
  if (marker) {
    return (
      <ul style={{ margin: "2px 0", paddingLeft: "14px", listStyle: "none" }}>
        {items.map((b, i) => (
          <li key={i} style={{ marginBottom: "1px" }}>
            <span style={{ marginRight: "4px", fontWeight: 600 }}>{marker}</span>{b}
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className="list-disc" style={{ margin: "2px 0", paddingLeft: "18px" }}>
      {items.map((b, i) => (
        <li key={i} style={{ marginBottom: "1px" }}>{b}</li>
      ))}
    </ul>
  );
}

/* ═══════════════════════════════════════════
   BOLD TEMPLATE  (Fresher — strong header bar)
   ═══════════════════════════════════════════ */
function BoldTemplate({ data, contactParts, hasSummary, hasSkills, hasExperiences, hasProjects, hasEducation, hasCertifications }: TemplateProps) {
  const accent = "#7c3aed";
  return (
    <div className="resume-page w-full max-w-[210mm] mx-auto min-h-[297mm] shadow-lg border border-border" style={{ fontFamily: "Arial, Helvetica, sans-serif", padding: 0 }}>
      {/* Bold header bar */}
      <div style={{ background: accent, padding: "28px 36px 20px", color: "#fff" }}>
        {data.fullName && <h1 style={{ fontSize: "24pt", margin: 0, fontWeight: 800, letterSpacing: "0.01em" }}>{data.fullName}</h1>}
        {contactParts.length > 0 && <p style={{ fontSize: "9.5pt", marginTop: "6px", opacity: 0.85 }}>{contactParts.join("  ·  ")}</p>}
      </div>
      <div style={{ padding: "24px 36px" }}>
        {hasSummary && <Section title="About Me" color={accent} style="bold"><p>{data.summary}</p></Section>}
        {hasSkills && <Section title="Skills" color={accent} style="bold"><p>{data.skills}</p></Section>}
        {hasEducation && (
          <Section title="Education" color={accent} style="bold">
            {data.education.map((edu) => <EducationBlock key={edu.id} edu={edu} />)}
          </Section>
        )}
        {hasExperiences && (
          <Section title="Experience" color={accent} style="bold">
            {data.experiences.map((exp) => <ExperienceBlock key={exp.id} exp={exp} />)}
          </Section>
        )}
        {hasProjects && (
          <Section title="Projects" color={accent} style="bold">
            {data.projects.map((proj) => (
              <div key={proj.id} className="mb-2">
                <span className="font-bold">{proj.name}</span>
                {proj.description && <span> — {proj.description}</span>}
                {proj.bullets.trim() && <BulletList text={proj.bullets} />}
              </div>
            ))}
          </Section>
        )}
        {hasCertifications && <Section title="Certifications" color={accent} style="bold"><BulletList text={data.certifications} /></Section>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   EXECUTIVE TEMPLATE  (Experienced — two-tone sidebar)
   ═══════════════════════════════════════════ */
function ExecutiveTemplate({ data, contactParts, hasSummary, hasSkills, hasExperiences, hasProjects, hasEducation, hasCertifications }: TemplateProps) {
  const accent = "#1e3a5f";
  const sidebar = "#f0f4f8";
  return (
    <div className="resume-page w-full max-w-[210mm] mx-auto min-h-[297mm] shadow-lg border border-border flex" style={{ fontFamily: "Arial, Helvetica, sans-serif", padding: 0 }}>
      {/* Sidebar */}
      <div style={{ width: "200px", background: sidebar, padding: "32px 18px", flexShrink: 0, borderRight: "1px solid #dde3ea" }}>
        {data.fullName && <h1 style={{ fontSize: "14pt", color: accent, fontWeight: 800, marginBottom: "6px", lineHeight: 1.2 }}>{data.fullName}</h1>}
        {contactParts.length > 0 && (
          <div style={{ fontSize: "8.5pt", color: "#555", marginBottom: "16px", lineHeight: 1.7 }}>
            {contactParts.map((c, i) => <div key={i}>{c}</div>)}
          </div>
        )}
        {hasSkills && (
          <div style={{ marginBottom: "14px" }}>
            <h2 style={{ fontSize: "9pt", color: accent, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: "6px" }}>Skills</h2>
            <p style={{ fontSize: "8.5pt", color: "#444", lineHeight: 1.6 }}>{data.skills}</p>
          </div>
        )}
        {hasEducation && (
          <div>
            <h2 style={{ fontSize: "9pt", color: accent, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: "6px" }}>Education</h2>
            {data.education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: "8px", fontSize: "8.5pt", color: "#444" }}>
                <div style={{ fontWeight: 700 }}>{edu.degree}</div>
                <div>{edu.school}</div>
                <div style={{ color: "#888" }}>{edu.dates}</div>
              </div>
            ))}
          </div>
        )}
        {hasCertifications && (
          <div style={{ marginTop: "14px" }}>
            <h2 style={{ fontSize: "9pt", color: accent, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: "6px" }}>Certifications</h2>
            <p style={{ fontSize: "8.5pt", color: "#444", lineHeight: 1.6 }}>{data.certifications}</p>
          </div>
        )}
      </div>
      {/* Main content */}
      <div style={{ flex: 1, padding: "32px 28px" }}>
        {hasSummary && <Section title="Executive Summary" color={accent} style="executive"><p>{data.summary}</p></Section>}
        {hasExperiences && (
          <Section title="Professional Experience" color={accent} style="executive">
            {data.experiences.map((exp) => <ExperienceBlock key={exp.id} exp={exp} />)}
          </Section>
        )}
        {hasProjects && (
          <Section title="Key Projects" color={accent} style="executive">
            {data.projects.map((proj) => (
              <div key={proj.id} className="mb-2">
                <span className="font-bold">{proj.name}</span>
                {proj.description && <span> — {proj.description}</span>}
                {proj.bullets.trim() && <BulletList text={proj.bullets} />}
              </div>
            ))}
          </Section>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPACT TEMPLATE  (Fresher — space-efficient)
   ═══════════════════════════════════════════ */
function CompactTemplate({ data, contactParts, hasSummary, hasSkills, hasExperiences, hasProjects, hasEducation, hasCertifications }: TemplateProps) {
  const accent = "#059669";
  return (
    <div className="resume-page p-[32px] w-full max-w-[210mm] mx-auto min-h-[297mm] shadow-lg border border-border" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
      {data.fullName && (
        <div style={{ borderLeft: `4px solid ${accent}`, paddingLeft: "12px", marginBottom: "12px" }}>
          <h1 style={{ color: "#111", fontSize: "20pt", margin: 0, fontWeight: 800 }}>{data.fullName}</h1>
          {contactParts.length > 0 && <p style={{ fontSize: "9pt", color: "#666", marginTop: "3px" }}>{contactParts.join("  |  ")}</p>}
        </div>
      )}
      {hasSummary && <Section title="Objective" color={accent} style="compact"><p>{data.summary}</p></Section>}
      {hasSkills && <Section title="Technical Skills" color={accent} style="compact"><p>{data.skills}</p></Section>}
      {hasEducation && (
        <Section title="Education" color={accent} style="compact">
          {data.education.map((edu) => <EducationBlock key={edu.id} edu={edu} />)}
        </Section>
      )}
      {hasProjects && (
        <Section title="Projects" color={accent} style="compact">
          {data.projects.map((proj) => (
            <div key={proj.id} className="mb-2">
              <span className="font-bold">{proj.name}</span>
              {proj.description && <span> — {proj.description}</span>}
              {proj.bullets.trim() && <BulletList text={proj.bullets} />}
            </div>
          ))}
        </Section>
      )}
      {hasExperiences && (
        <Section title="Experience" color={accent} style="compact">
          {data.experiences.map((exp) => <ExperienceBlock key={exp.id} exp={exp} />)}
        </Section>
      )}
      {hasCertifications && <Section title="Certifications" color={accent} style="compact"><BulletList text={data.certifications} /></Section>}
    </div>
  );
}

/* ═══════════════════════════════════════════
   ELEGANT TEMPLATE  (Experienced — serif premium)
   ═══════════════════════════════════════════ */
function ElegantTemplate({ data, contactParts, hasSummary, hasSkills, hasExperiences, hasProjects, hasEducation, hasCertifications }: TemplateProps) {
  const accent = "#92400e";
  return (
    <div className="resume-page p-[44px] w-full max-w-[210mm] mx-auto min-h-[297mm] shadow-lg border border-border" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
      {data.fullName && (
        <div style={{ textAlign: "center", marginBottom: "16px", paddingBottom: "12px", borderBottom: `2px solid ${accent}` }}>
          <h1 style={{ fontSize: "23pt", margin: 0, fontWeight: 700, color: "#1a1a1a", letterSpacing: "0.06em" }}>{data.fullName}</h1>
          {contactParts.length > 0 && <p style={{ fontSize: "9.5pt", color: "#777", marginTop: "5px", letterSpacing: "0.03em" }}>{contactParts.join("   •   ")}</p>}
        </div>
      )}
      {hasSummary && (
        <div style={{ textAlign: "center", marginBottom: "14px" }}>
          <p style={{ fontStyle: "italic", fontSize: "10.5pt", color: "#555", lineHeight: 1.65, maxWidth: "88%", margin: "0 auto" }}>{data.summary}</p>
        </div>
      )}
      {hasSkills && <Section title="Core Competencies" color={accent} style="elegant"><p>{data.skills}</p></Section>}
      {hasExperiences && (
        <Section title="Professional Experience" color={accent} style="elegant">
          {data.experiences.map((exp) => <ExperienceBlock key={exp.id} exp={exp} />)}
        </Section>
      )}
      {hasProjects && (
        <Section title="Notable Projects" color={accent} style="elegant">
          {data.projects.map((proj) => (
            <div key={proj.id} className="mb-2">
              <span className="font-bold">{proj.name}</span>
              {proj.description && <span> — {proj.description}</span>}
              {proj.bullets.trim() && <BulletList text={proj.bullets} marker="–" />}
            </div>
          ))}
        </Section>
      )}
      {hasEducation && (
        <Section title="Education" color={accent} style="elegant">
          {data.education.map((edu) => <EducationBlock key={edu.id} edu={edu} />)}
        </Section>
      )}
      {hasCertifications && <Section title="Certifications & Awards" color={accent} style="elegant"><BulletList text={data.certifications} marker="–" /></Section>}
    </div>
  );
}

export default ResumePreview;
