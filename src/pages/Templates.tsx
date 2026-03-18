import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ResumeData, sampleResume, emptyResume } from "@/types/resume";
import { Button } from "@/components/ui/button";
import { FileText, ArrowLeft, Loader2, Check } from "lucide-react";

const templateStyles = [
  {
    id: "classic",
    name: "Classic",
    desc: "Traditional, clean layout — perfect for corporate roles.",
  },
  {
    id: "modern",
    name: "Modern",
    desc: "Contemporary design with accent sidebar elements.",
  },
  {
    id: "minimal",
    name: "Minimal",
    desc: "Ultra-clean, whitespace-focused for creative fields.",
  },
];

/* ── Structured Mini Resume Preview ──────────────────────── */
function MiniPreview({ data, templateId }: { data: ResumeData; templateId: string }) {
  const d = data.fullName ? data : sampleResume;
  const contactParts = [d.email, d.phone, d.location].filter(Boolean);

  // Classic: centered header, blue lines
  if (templateId === "classic") {
    return (
      <div className="bg-white text-[#1a1a1a] p-5 text-[6.5px] leading-[1.5] h-[300px] overflow-hidden font-[Arial,Helvetica,sans-serif] select-none">
        {/* Header */}
        <div className="text-center border-b-2 border-[#1e3a5f] pb-1.5 mb-2">
          <div className="font-bold text-[11px] text-[#1e3a5f] tracking-wide">{d.fullName}</div>
          <div className="text-[5.5px] text-[#555] mt-0.5">{contactParts.join("  •  ")}</div>
        </div>
        {/* Summary */}
        {d.summary && (
          <div className="mb-1.5">
            <div className="font-bold text-[7px] text-[#1e3a5f] uppercase tracking-[0.08em] border-b border-[#ccd6e0] pb-0.5 mb-0.5">Professional Summary</div>
            <div className="text-[5.5px] text-[#333] line-clamp-2">{d.summary}</div>
          </div>
        )}
        {/* Experience */}
        {d.experiences.length > 0 && (
          <div className="mb-1.5">
            <div className="font-bold text-[7px] text-[#1e3a5f] uppercase tracking-[0.08em] border-b border-[#ccd6e0] pb-0.5 mb-0.5">Work Experience</div>
            {d.experiences.slice(0, 2).map((exp) => (
              <div key={exp.id} className="mb-1">
                <div className="flex justify-between">
                  <span className="font-bold text-[6px]">{exp.title}</span>
                  <span className="text-[5px] text-[#777]">{exp.dates}</span>
                </div>
                <div className="text-[5.5px] italic text-[#555]">{exp.company}</div>
                {exp.bullets && (
                  <ul className="pl-2 mt-0.5">
                    {exp.bullets.split("\n").filter(Boolean).slice(0, 2).map((b, i) => (
                      <li key={i} className="text-[5px] text-[#444] flex gap-0.5 items-start">
                        <span className="mt-[2px] w-[2px] h-[2px] bg-[#1e3a5f] rounded-full shrink-0" />
                        <span className="line-clamp-1">{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
        {/* Skills */}
        {d.skills && (
          <div className="mb-1">
            <div className="font-bold text-[7px] text-[#1e3a5f] uppercase tracking-[0.08em] border-b border-[#ccd6e0] pb-0.5 mb-0.5">Skills</div>
            <div className="text-[5px] text-[#444] line-clamp-1">{d.skills}</div>
          </div>
        )}
        {/* Education */}
        {d.education.length > 0 && (
          <div>
            <div className="font-bold text-[7px] text-[#1e3a5f] uppercase tracking-[0.08em] border-b border-[#ccd6e0] pb-0.5 mb-0.5">Education</div>
            <div className="flex justify-between text-[5.5px]">
              <span className="font-bold">{d.education[0].degree}</span>
              <span className="text-[5px] text-[#777]">{d.education[0].dates}</span>
            </div>
            <div className="text-[5px] text-[#555]">{d.education[0].school}</div>
          </div>
        )}
      </div>
    );
  }

  // Modern: left accent bar, teal color scheme
  if (templateId === "modern") {
    return (
      <div className="bg-white text-[#1a1a1a] text-[6.5px] leading-[1.5] h-[300px] overflow-hidden font-[Arial,Helvetica,sans-serif] select-none flex">
        {/* Accent bar */}
        <div className="w-[4px] bg-[#0e7490] shrink-0" />
        <div className="p-4 pl-3 flex-1 overflow-hidden">
          {/* Header */}
          <div className="mb-2">
            <div className="font-bold text-[11px] text-[#0e7490]">{d.fullName}</div>
            <div className="text-[5.5px] text-[#666] mt-0.5">{contactParts.join("  |  ")}</div>
          </div>
          {/* Summary */}
          {d.summary && (
            <div className="mb-1.5">
              <div className="font-bold text-[7px] text-[#0e7490] uppercase tracking-[0.06em] mb-0.5 flex items-center gap-1">
                <span className="w-[8px] h-[1.5px] bg-[#0e7490] inline-block" /> Summary
              </div>
              <div className="text-[5.5px] text-[#333] line-clamp-2">{d.summary}</div>
            </div>
          )}
          {/* Experience */}
          {d.experiences.length > 0 && (
            <div className="mb-1.5">
              <div className="font-bold text-[7px] text-[#0e7490] uppercase tracking-[0.06em] mb-0.5 flex items-center gap-1">
                <span className="w-[8px] h-[1.5px] bg-[#0e7490] inline-block" /> Experience
              </div>
              {d.experiences.slice(0, 2).map((exp) => (
                <div key={exp.id} className="mb-1 pl-1 border-l border-[#b2e0eb]">
                  <div className="flex justify-between">
                    <span className="font-bold text-[6px]">{exp.title}</span>
                    <span className="text-[5px] text-[#888]">{exp.dates}</span>
                  </div>
                  <div className="text-[5.5px] text-[#666]">{exp.company}</div>
                  {exp.bullets && (
                    <ul className="mt-0.5">
                      {exp.bullets.split("\n").filter(Boolean).slice(0, 2).map((b, i) => (
                        <li key={i} className="text-[5px] text-[#444] flex gap-0.5 items-start">
                          <span className="text-[#0e7490] font-bold">›</span>
                          <span className="line-clamp-1">{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
          {/* Skills */}
          {d.skills && (
            <div className="mb-1">
              <div className="font-bold text-[7px] text-[#0e7490] uppercase tracking-[0.06em] mb-0.5 flex items-center gap-1">
                <span className="w-[8px] h-[1.5px] bg-[#0e7490] inline-block" /> Skills
              </div>
              <div className="text-[5px] text-[#444] line-clamp-1">{d.skills}</div>
            </div>
          )}
          {/* Education */}
          {d.education.length > 0 && (
            <div>
              <div className="font-bold text-[7px] text-[#0e7490] uppercase tracking-[0.06em] mb-0.5 flex items-center gap-1">
                <span className="w-[8px] h-[1.5px] bg-[#0e7490] inline-block" /> Education
              </div>
              <div className="text-[5.5px] font-bold">{d.education[0].degree}</div>
              <div className="text-[5px] text-[#666]">{d.education[0].school}</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Minimal: clean, lots of whitespace, dark gray
  return (
    <div className="bg-white text-[#222] p-5 text-[6.5px] leading-[1.6] h-[300px] overflow-hidden font-['Georgia',serif] select-none">
      {/* Header */}
      <div className="text-center mb-2.5">
        <div className="font-bold text-[12px] tracking-[0.15em] uppercase text-[#222]">{d.fullName}</div>
        <div className="text-[5.5px] text-[#888] mt-1 tracking-[0.05em]">{contactParts.join("   ·   ")}</div>
      </div>
      {/* Summary */}
      {d.summary && (
        <div className="mb-2">
          <div className="text-center text-[5.5px] text-[#555] italic line-clamp-2 max-w-[90%] mx-auto">{d.summary}</div>
        </div>
      )}
      {/* Divider */}
      <div className="border-t border-[#ddd] my-1.5" />
      {/* Experience */}
      {d.experiences.length > 0 && (
        <div className="mb-1.5">
          <div className="font-bold text-[6.5px] uppercase tracking-[0.12em] text-[#555] mb-0.5">Experience</div>
          {d.experiences.slice(0, 2).map((exp) => (
            <div key={exp.id} className="mb-1">
              <div className="flex justify-between">
                <span className="font-bold text-[6px]">{exp.title} — <span className="font-normal">{exp.company}</span></span>
                <span className="text-[5px] text-[#999]">{exp.dates}</span>
              </div>
              {exp.bullets && (
                <ul className="mt-0.5 pl-1">
                  {exp.bullets.split("\n").filter(Boolean).slice(0, 2).map((b, i) => (
                    <li key={i} className="text-[5px] text-[#555] leading-[1.4]">– {b.length > 60 ? b.slice(0, 60) + '…' : b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
      {/* Skills */}
      {d.skills && (
        <div className="mb-1">
          <div className="font-bold text-[6.5px] uppercase tracking-[0.12em] text-[#555] mb-0.5">Skills</div>
          <div className="text-[5px] text-[#555] line-clamp-1">{d.skills}</div>
        </div>
      )}
      {/* Education */}
      {d.education.length > 0 && (
        <div>
          <div className="font-bold text-[6.5px] uppercase tracking-[0.12em] text-[#555] mb-0.5">Education</div>
          <div className="text-[5.5px]">{d.education[0].degree} — {d.education[0].school}</div>
        </div>
      )}
    </div>
  );
}

const Templates = () => {
  const navigate = useNavigate();
  const [previewData, setPreviewData] = useState<ResumeData>(sampleResume);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const flowType = sessionStorage.getItem("flowType") || "create";
  const importedRaw = sessionStorage.getItem("importedResume");

  useEffect(() => {
    if (flowType === "improve" && importedRaw) {
      try {
        setPreviewData(JSON.parse(importedRaw));
      } catch { /* ignore */ }
    }
    // For create flow, always show sample data in preview cards
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelect = (templateId: string) => {
    setSelected(templateId);
    setLoading(true);
    sessionStorage.setItem("selectedTemplate", templateId);
    if (flowType === "create") {
      sessionStorage.removeItem("importedResume");
    }
    setTimeout(() => {
      navigate("/editor");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <FileText className="w-5 h-5 text-primary" />
            <span className="font-display text-lg font-bold text-foreground tracking-tight">Choose Template</span>
          </div>
        </div>
      </header>

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-lg font-display font-bold text-foreground">Preparing your editor...</p>
            <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: "80%" }} />
            </div>
          </div>
        </div>
      )}

      {/* Templates */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground mb-3">
            Choose Your Template
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            All templates are 100% ATS-friendly. Pick the style that suits your industry.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {templateStyles.map((tmpl) => (
            <div
              key={tmpl.id}
              onClick={() => !loading && handleSelect(tmpl.id)}
              className={`group relative bg-card rounded-2xl border-2 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl ${
                selected === tmpl.id
                  ? "border-primary shadow-xl ring-2 ring-primary/20"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {/* Selected badge */}
              {selected === tmpl.id && (
                <div className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-lg">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              )}

              {/* Resume preview - shadowed paper effect */}
              <div className="p-4 pb-0">
                <div className="rounded-lg overflow-hidden shadow-md border border-[#e5e7eb] transform transition-transform duration-300 group-hover:scale-[1.02]">
                  <MiniPreview data={previewData} templateId={tmpl.id} />
                </div>
              </div>

              {/* Info */}
              <div className="p-5 pt-4">
                <h3 className="font-display font-bold text-foreground text-lg mb-1">{tmpl.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{tmpl.desc}</p>
                <Button
                  size="sm"
                  className={`w-full transition-all ${
                    selected === tmpl.id
                      ? "bg-primary text-primary-foreground"
                      : "group-hover:bg-primary group-hover:text-primary-foreground"
                  }`}
                  variant={selected === tmpl.id ? "default" : "outline"}
                >
                  Use This Template
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Templates;
