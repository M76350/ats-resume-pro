import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ResumeData, sampleResume } from "@/types/resume";
import { Button } from "@/components/ui/button";
import ResumePreview from "@/components/ResumePreview";
import SEO from "@/components/SEO";
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
    desc: "Contemporary design with accent styling and stronger hierarchy.",
  },
  {
    id: "minimal",
    name: "Minimal",
    desc: "Refined, spacious layout with a premium editorial feel.",
  },
];

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
      } catch {
        setPreviewData(sampleResume);
      }
    }
  }, [flowType, importedRaw]);

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
      <SEO
        title="ATS Resume Templates — Classic, Modern & Minimal | FreeATS"
        description="Choose from 3 ATS-friendly resume templates: Classic, Modern, and Minimal. All templates are optimized to pass applicant tracking systems."
        canonical="/templates"
      />
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <FileText className="w-5 h-5 text-primary" />
            <span className="font-display text-lg font-bold text-foreground tracking-tight">Choose Template</span>
          </div>
        </div>
      </header>

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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground mb-3">
            Choose Your Template
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Yahi same structured resume preview editor me bhi open hoga. Jo template yahan select karoge, wahi live editor me apply hoga.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {templateStyles.map((tmpl) => (
            <button
              key={tmpl.id}
              type="button"
              onClick={() => !loading && handleSelect(tmpl.id)}
              className={`group relative overflow-hidden rounded-2xl border-2 bg-card text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                selected === tmpl.id
                  ? "border-primary shadow-2xl ring-2 ring-primary/20"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {selected === tmpl.id && (
                <div className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                  <Check className="h-4 w-4" />
                </div>
              )}

              <div className="border-b border-border bg-muted/40 p-4">
                <div className="mx-auto h-[360px] overflow-hidden rounded-xl border border-border bg-background shadow-lg">
                  <div className="origin-top-left scale-[0.33] pointer-events-none" style={{ width: "303%" }}>
                    <ResumePreview data={previewData} template={tmpl.id} />
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <h3 className="font-display text-xl font-bold text-foreground">{tmpl.name}</h3>
                  <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-medium text-accent-foreground">
                    ATS Ready
                  </span>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">{tmpl.desc}</p>
                <Button
                  type="button"
                  size="sm"
                  variant={selected === tmpl.id ? "default" : "outline"}
                  className="w-full"
                >
                  Use This Template
                </Button>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Templates;
