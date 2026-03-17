import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ResumeData, sampleResume, emptyResume } from "@/types/resume";
import { Button } from "@/components/ui/button";
import { FileText, ArrowLeft, Loader2 } from "lucide-react";

const templateStyles = [
  {
    id: "classic",
    name: "Classic",
    desc: "Traditional, clean layout — perfect for corporate roles.",
    accent: "hsl(220, 65%, 28%)",
    headerStyle: "text-center border-b-2 pb-2",
  },
  {
    id: "modern",
    name: "Modern",
    desc: "Contemporary design with a subtle accent bar.",
    accent: "hsl(200, 70%, 40%)",
    headerStyle: "text-left border-l-4 pl-3",
  },
  {
    id: "minimal",
    name: "Minimal",
    desc: "Ultra-clean, whitespace-focused for creative fields.",
    accent: "hsl(0, 0%, 20%)",
    headerStyle: "text-center",
  },
];

function MiniPreview({ data, style }: { data: ResumeData; style: typeof templateStyles[0] }) {
  const hasData = data.fullName.trim().length > 0;
  return (
    <div className="bg-white text-black p-4 text-[7px] leading-[1.4] h-[260px] overflow-hidden font-[Arial,Helvetica,sans-serif]">
      <div className={style.headerStyle} style={{ borderColor: style.accent, color: style.accent }}>
        <div className="font-bold text-[10px]">{hasData ? data.fullName : "Your Name"}</div>
        <div className="text-[6px] opacity-70">
          {hasData ? [data.email, data.phone].filter(Boolean).join(" | ") : "email@example.com | (555) 123-4567"}
        </div>
      </div>
      <div className="mt-2">
        <div className="font-bold text-[7px] uppercase tracking-wider mb-0.5" style={{ color: style.accent }}>
          Summary
        </div>
        <div className="text-[6px] opacity-80 line-clamp-2">
          {hasData ? data.summary : "Your professional summary goes here..."}
        </div>
      </div>
      <div className="mt-1.5">
        <div className="font-bold text-[7px] uppercase tracking-wider mb-0.5" style={{ color: style.accent }}>
          Experience
        </div>
        {(hasData && data.experiences.length > 0) ? (
          data.experiences.slice(0, 2).map((exp) => (
            <div key={exp.id} className="mb-1">
              <div className="font-bold text-[6px]">{exp.title}</div>
              <div className="text-[5px] opacity-60">{exp.company}</div>
            </div>
          ))
        ) : (
          <div className="text-[6px] opacity-50">Your work experience...</div>
        )}
      </div>
      <div className="mt-1.5">
        <div className="font-bold text-[7px] uppercase tracking-wider mb-0.5" style={{ color: style.accent }}>
          Education
        </div>
        <div className="text-[6px] opacity-50">
          {(hasData && data.education.length > 0) ? data.education[0].degree : "Your degree..."}
        </div>
      </div>
    </div>
  );
}

const Templates = () => {
  const navigate = useNavigate();
  const [previewData, setPreviewData] = useState<ResumeData>(emptyResume);
  const [loading, setLoading] = useState(false);
  const flowType = sessionStorage.getItem("flowType") || "create";
  const importedRaw = sessionStorage.getItem("importedResume");

  useEffect(() => {
    if (flowType === "create" && importedRaw) {
      // Show imported data briefly then clear it
      try {
        const imported = JSON.parse(importedRaw);
        setPreviewData(imported);
        const timer = setTimeout(() => {
          setPreviewData(emptyResume);
          sessionStorage.removeItem("importedResume");
        }, 3000);
        return () => clearTimeout(timer);
      } catch { /* ignore */ }
    } else if (flowType === "improve" && importedRaw) {
      try {
        setPreviewData(JSON.parse(importedRaw));
      } catch { /* ignore */ }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelect = (templateId: string) => {
    setLoading(true);
    sessionStorage.setItem("selectedTemplate", templateId);
    // If creating new, ensure imported data is cleared
    if (flowType === "create") {
      sessionStorage.removeItem("importedResume");
    }
    // Loading animation before navigating
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
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground mb-3">
            Choose Your Template
          </h1>
          <p className="text-muted-foreground">
            All templates are ATS-friendly. Pick the one that matches your style.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {templateStyles.map((tmpl) => (
            <div
              key={tmpl.id}
              onClick={() => handleSelect(tmpl.id)}
              className="group bg-card rounded-xl border border-border overflow-hidden cursor-pointer hover:border-primary hover:shadow-lg transition-all"
            >
              <div className="border-b border-border">
                <MiniPreview data={previewData} style={tmpl} />
              </div>
              <div className="p-4">
                <h3 className="font-display font-bold text-foreground mb-1">{tmpl.name}</h3>
                <p className="text-xs text-muted-foreground mb-3">{tmpl.desc}</p>
                <Button size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground" variant="outline">
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
