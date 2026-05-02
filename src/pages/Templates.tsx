import { useState, useCallback, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ResumeData, sampleResume } from "@/types/resume";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ResumePreview from "@/components/ResumePreview";
import SEO from "@/components/SEO";
import { parseFile, parseResumeText } from "@/lib/file-parser";
import {
  FileText, Loader2, Check, Upload, PenLine,
  GraduationCap, Briefcase, X, Sparkles, CheckCircle2,
  Shield, Zap, Star,
} from "lucide-react";

// ── Template definitions ─────────────────────────────────────────────
// ── 6 UNIQUE Fresher templates ────────────────────────────────────────
const FRESHER_TEMPLATES = [
  { id: "classic",  name: "Classic",  tag: "Most Popular",    tagColor: "bg-blue-100 text-blue-700",   desc: "Clean, traditional single-column layout. Perfect for campus placements and first jobs.",       bestFor: "BCA, B.Tech, MBA Freshers" },
  { id: "bold",     name: "Bold",     tag: "Stand Out",       tagColor: "bg-purple-100 text-purple-700",desc: "Strong purple header bar. Makes your resume memorable and eye-catching.",                    bestFor: "Creative & Tech Freshers" },
  { id: "compact",  name: "Compact",  tag: "Space Efficient", tagColor: "bg-green-100 text-green-700",  desc: "Green accent, fits more content on one page. Great for projects & internships.",             bestFor: "Engineering Students" },
  { id: "impact",   name: "Impact",   tag: "High Energy",     tagColor: "bg-orange-100 text-orange-700",desc: "Bold orange left-border accent. Energetic and modern — great for tech & startup roles.",     bestFor: "IT & Software Freshers" },
  { id: "clean",    name: "Clean",    tag: "Fresh Look",      tagColor: "bg-teal-100 text-teal-700",    desc: "Teal header bar with clean white body. Simple, modern, and highly readable.",                bestFor: "Design & Commerce Freshers" },
  { id: "sharp",    name: "Sharp",    tag: "Bold Sidebar",    tagColor: "bg-indigo-100 text-indigo-700",desc: "Dark indigo sidebar with white text. Projects and skills stand out immediately.",            bestFor: "CS & Engineering Students" },
];

// ── 6 UNIQUE Experienced templates ───────────────────────────────────
const EXPERIENCED_TEMPLATES = [
  { id: "executive", name: "Executive", tag: "Senior Roles",   tagColor: "bg-blue-100 text-blue-700",   desc: "Two-column sidebar layout. Highlights leadership, skills, and career progression.",          bestFor: "Managers & Senior Engineers" },
  { id: "navy",      name: "Navy",      tag: "Corporate",      tagColor: "bg-slate-100 text-slate-700",  desc: "Deep navy header with clean white body. Professional and authoritative.",                   bestFor: "Corporate & Finance Roles" },
  { id: "slate",     name: "Slate",     tag: "Modern Pro",     tagColor: "bg-gray-100 text-gray-700",    desc: "Gray sidebar with clean main content area. Balanced and highly professional.",              bestFor: "Product Managers & Developers" },
  { id: "elegant",   name: "Elegant",   tag: "Premium",        tagColor: "bg-amber-100 text-amber-700",  desc: "Warm serif premium layout. Perfect for finance, consulting, and leadership roles.",         bestFor: "Finance & Consulting Pros" },
  { id: "crisp",     name: "Crisp",     tag: "Sharp & Clean",  tagColor: "bg-blue-100 text-blue-700",    desc: "Blue gradient underline header. Clean, modern, and highly ATS-compatible.",                 bestFor: "Tech & Product Leaders" },
  { id: "minimal",   name: "Minimal",   tag: "Editorial",      tagColor: "bg-gray-100 text-gray-700",    desc: "Refined spacious serif layout. Lets your experience and achievements speak for themselves.", bestFor: "Senior Designers & Academics" },
];

// ── Flow choice modal ─────────────────────────────────────────────────
interface FlowModalProps {
  templateName: string;
  onClose: () => void;
  onUpload: (file: File) => void;
  onCreate: () => void;
  uploading: boolean;
}

function FlowModal({ templateName, onClose, onUpload, onCreate, uploading }: FlowModalProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
    e.target.value = "";
  };
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h2 className="font-display text-lg font-bold text-foreground">
              Start with <span className="text-primary">{templateName}</span> Template
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">How would you like to proceed?</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <div className="p-5 space-y-3">
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-full flex items-start gap-4 p-4 rounded-xl border-2 border-border hover:border-primary/60 hover:bg-primary/5 transition-all text-left group"
          >
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
              {uploading ? <Loader2 className="w-5 h-5 text-primary animate-spin" /> : <Upload className="w-5 h-5 text-primary" />}
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm mb-0.5">
                {uploading ? "Importing your resume..." : "Upload Existing Resume"}
              </p>
              <p className="text-xs text-muted-foreground">Upload PDF, DOCX, or TXT — we'll auto-fill the editor with your data.</p>
            </div>
          </button>
          <input ref={fileRef} type="file" accept=".pdf,.docx,.doc,.txt,.text" onChange={handleFile} className="hidden" />
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <button
            onClick={onCreate}
            className="w-full flex items-start gap-4 p-4 rounded-xl border-2 border-border hover:border-primary/60 hover:bg-primary/5 transition-all text-left group"
          >
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
              <PenLine className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm mb-0.5">Create from Scratch</p>
              <p className="text-xs text-muted-foreground">Start with a blank editor and fill in your details step by step.</p>
            </div>
          </button>
        </div>
        <div className="px-5 pb-5 flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-600" /> No sign-up</span>
          <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-green-600" /> Data never stored</span>
          <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-primary" /> Instant start</span>
        </div>
      </div>
    </div>
  );
}

// ── Template card ─────────────────────────────────────────────────────
type TemplateDef = typeof FRESHER_TEMPLATES[0];
interface TemplateCardProps {
  tmpl: TemplateDef;
  previewData: ResumeData;
  selected: string | null;
  onSelect: (id: string) => void;
  loading: boolean;
}

function TemplateCard({ tmpl, previewData, selected, onSelect, loading }: TemplateCardProps) {
  const isSelected = selected === tmpl.id;
  return (
    <button
      type="button"
      onClick={() => !loading && onSelect(tmpl.id)}
      className={`group relative overflow-hidden rounded-2xl border-2 bg-card text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${isSelected ? "border-primary shadow-2xl ring-2 ring-primary/20" : "border-border hover:border-primary/50"}`}
    >
      {isSelected && (
        <div className="absolute right-3 top-3 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
          <Check className="h-3.5 w-3.5" />
        </div>
      )}
      <div className="border-b border-border bg-muted/40 p-3">
        <div className="mx-auto h-[300px] overflow-hidden rounded-xl border border-border bg-background shadow-md">
          <div className="origin-top-left scale-[0.33] pointer-events-none" style={{ width: "303%" }}>
            <ResumePreview data={previewData} template={tmpl.id} />
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <h3 className="font-display text-lg font-bold text-foreground">{tmpl.name}</h3>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${tmpl.tagColor}`}>{tmpl.tag}</span>
        </div>
        <p className="text-xs text-muted-foreground mb-2 leading-relaxed">{tmpl.desc}</p>
        <p className="text-xs text-primary font-medium mb-3">✓ Best for: {tmpl.bestFor}</p>
        <Button type="button" size="sm" variant={isSelected ? "default" : "outline"} className="w-full">
          {isSelected ? "Selected ✓" : "Use This Template"}
        </Button>
      </div>
    </button>
  );
}

// ── Main page ─────────────────────────────────────────────────────────
const Templates = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"fresher" | "experienced">("fresher");
  const [selected, setSelected] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(false);

  // Check if user came from Landing with an already-uploaded resume
  const hasImportedResume = !!sessionStorage.getItem("importedResume");
  const flowType = sessionStorage.getItem("flowType") || "create";
  const isImproveFlow = flowType === "improve" && hasImportedResume;

  const handleSelect = (templateId: string) => {
    setSelected(templateId);
    sessionStorage.setItem("selectedTemplate", templateId);

    if (isImproveFlow) {
      // Resume already uploaded from Landing — skip modal, go straight to editor
      setGlobalLoading(true);
      setTimeout(() => navigate("/editor"), 800);
    } else {
      // Fresh visit to /templates — show Upload or Create modal
      setShowModal(true);
    }
  };

  const handleUpload = useCallback(async (file: File) => {
    setUploading(true);
    try {
      const text = await parseFile(file);
      const parsed = parseResumeText(text);
      sessionStorage.setItem("importedResume", JSON.stringify(parsed));
      sessionStorage.setItem("flowType", "improve");
      setGlobalLoading(true);
      setTimeout(() => navigate("/editor"), 1000);
    } catch (err: any) {
      alert(err.message || "Failed to parse file. Please try PDF, DOCX, or TXT.");
      setUploading(false);
    }
  }, [navigate]);

  const handleCreate = () => {
    sessionStorage.setItem("flowType", "create");
    sessionStorage.removeItem("importedResume");
    setShowModal(false);
    setGlobalLoading(true);
    setTimeout(() => navigate("/editor"), 1000);
  };

  const currentTemplates = activeTab === "fresher" ? FRESHER_TEMPLATES : EXPERIENCED_TEMPLATES;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Free ATS Resume Templates — Freshers & Experienced (2026)"
        description="12 free ATS-friendly resume templates for freshers & experienced professionals. Classic, Bold, Executive & more. No sign-up. Download as PDF instantly."
        canonical="/templates"
        keywords="free ATS resume templates, resume template for freshers, resume template for experienced, ATS friendly resume template 2026, free resume template India, best resume template for freshers, executive resume template free"
      />

      {globalLoading && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-background/90 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-lg font-display font-bold text-foreground">Preparing your editor...</p>
            <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: "80%" }} />
            </div>
          </div>
        </div>
      )}

      {showModal && selected && (
        <FlowModal
          templateName={currentTemplates.find(t => t.id === selected)?.name || selected}
          onClose={() => setShowModal(false)}
          onUpload={handleUpload}
          onCreate={handleCreate}
          uploading={uploading}
        />
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Page header */}
        <div className="text-center mb-10">
          <Badge variant="secondary" className="mb-4 text-xs font-medium px-3 py-1">
            <Sparkles className="w-3 h-3 mr-1" /> 6 Templates — All ATS Optimized
          </Badge>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground mb-3">
            {isImproveFlow ? "Choose a Template for Your Resume" : "Choose Your Resume Template"}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm leading-relaxed">
            {isImproveFlow
              ? "Your resume has been uploaded. Pick a template and we'll open it in the editor with your data pre-filled."
              : "All templates are ATS-compatible, single-column, and print-ready. Select a template, then upload your existing resume or build from scratch."
            }
          </p>
          {isImproveFlow && (
            <div className="mt-4 inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-medium px-4 py-2 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> Resume uploaded — just pick a template to continue
            </div>
          )}
        </div>

        {/* Tab switcher */}
        <div className="flex items-center justify-center mb-8">
          <div className="inline-flex bg-muted rounded-xl p-1 gap-1">
            <button
              onClick={() => { setActiveTab("fresher"); setSelected(null); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === "fresher" ? "bg-card text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"}`}
            >
              <GraduationCap className="w-4 h-4" /> For Freshers
            </button>
            <button
              onClick={() => { setActiveTab("experienced"); setSelected(null); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === "experienced" ? "bg-card text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Briefcase className="w-4 h-4" /> For Experienced
            </button>
          </div>
        </div>

        {/* Tab description banner */}
        {activeTab === "fresher" ? (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 flex items-start gap-3 max-w-2xl mx-auto">
            <GraduationCap className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-0.5">Templates for Freshers & Students</p>
              <p className="text-xs text-blue-700">Optimized for campus placements, first jobs, and internships. Highlights education, projects, and skills prominently.</p>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-8 flex items-start gap-3 max-w-2xl mx-auto">
            <Briefcase className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-900 mb-0.5">Templates for Experienced Professionals</p>
              <p className="text-xs text-amber-700">Designed for 2+ years experience. Highlights work history, achievements, and leadership with stronger visual hierarchy.</p>
            </div>
          </div>
        )}

        {/* Template grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {currentTemplates.map((tmpl) => (
            <TemplateCard
              key={`${activeTab}-${tmpl.id}`}
              tmpl={tmpl}
              previewData={sampleResume}
              selected={selected}
              onSelect={handleSelect}
              loading={globalLoading}
            />
          ))}
        </div>

        {/* ── Section 1: Why ATS Templates Matter ── */}
        <section className="bg-card border border-border rounded-2xl p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <Badge variant="secondary" className="mb-3 text-xs">Why It Matters</Badge>
              <h2 className="font-display text-2xl font-extrabold text-foreground mb-4">
                Why Use an ATS-Friendly Resume Template?
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Over <strong className="text-foreground">98% of Fortune 500 companies</strong> use Applicant Tracking Systems (ATS) to automatically screen resumes. A poorly formatted resume — with tables, columns, or graphics — gets rejected before a human ever reads it.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                All FreeATS templates are built with a <strong className="text-foreground">single-column, text-based layout</strong> that ATS systems can parse perfectly. No tables, no text boxes, no graphics — just clean, structured content that both software and recruiters love.
              </p>
              <Link to="/blog/what-is-ats-resume" className="text-sm text-primary font-medium hover:underline">
                Learn how ATS systems work →
              </Link>
            </div>
            <div className="space-y-3">
              {[
                { title: "Single-column layout", desc: "ATS reads top-to-bottom without confusion" },
                { title: "Standard section headings", desc: "Summary, Experience, Education, Skills" },
                { title: "No tables or graphics", desc: "Pure text that every ATS can parse" },
                { title: "Print-ready PDF output", desc: "Download as PDF with one click" },
                { title: "Real-time ATS scoring", desc: "See your score improve as you type" },
              ].map(({ title, desc }) => (
                <div key={title} className="flex items-start gap-3 p-3 bg-background rounded-lg border border-border">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{title}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 2: Fresher vs Experienced ── */}
        <section className="mb-8">
          <h2 className="font-display text-2xl font-extrabold text-foreground text-center mb-3">
            Which Template is Right for You?
          </h2>
          <p className="text-center text-muted-foreground text-sm mb-8 max-w-xl mx-auto">
            The right template depends on your experience level and the role you're applying for.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-display text-lg font-bold text-blue-900">Fresher Templates</h3>
              </div>
              <p className="text-sm text-blue-800 leading-relaxed mb-4">
                Designed for students, recent graduates, and candidates with 0–2 years of experience. These templates put <strong>Education and Projects</strong> front and center.
              </p>
              <ul className="space-y-2 text-sm text-blue-700">
                {["Highlights education & GPA prominently", "Projects section before experience", "Skills section optimized for tech keywords", "Compact layout fits everything on 1 page", "Ideal for campus placements & first jobs"].map(p => (
                  <li key={p} className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />{p}</li>
                ))}
              </ul>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="font-display text-lg font-bold text-amber-900">Experienced Templates</h3>
              </div>
              <p className="text-sm text-amber-800 leading-relaxed mb-4">
                Built for professionals with 2+ years of experience. These templates lead with a strong <strong>Professional Summary and Work Experience</strong>.
              </p>
              <ul className="space-y-2 text-sm text-amber-700">
                {["Work experience is the hero section", "Executive sidebar for senior roles", "Stronger visual hierarchy for leadership", "Optimized for Workday, Greenhouse, Lever", "Ideal for mid-senior level applications"].map(p => (
                  <li key={p} className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />{p}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── Section 3: How it works ── */}
        <section className="bg-primary/5 border border-border rounded-2xl p-8 mb-8">
          <h2 className="font-display text-2xl font-extrabold text-foreground text-center mb-8">
            How to Build Your Resume in 3 Steps
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: "1", icon: Star, title: "Pick a Template", desc: "Choose the template that fits your experience level and target role. All templates are ATS-optimized." },
              { step: "2", icon: Upload, title: "Upload or Create", desc: "Upload your existing resume to auto-fill the editor, or start fresh with a blank form." },
              { step: "3", icon: FileText, title: "Edit & Download", desc: "Fill in your details, check your live ATS score, and download your resume as a PDF." },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-display font-bold text-lg flex items-center justify-center mx-auto mb-3">
                  {step}
                </div>
                <Icon className="w-5 h-5 text-primary mx-auto mb-2" />
                <h3 className="font-display font-bold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 4: CTA ── */}
        <section className="text-center py-8">
          <h2 className="font-display text-2xl font-extrabold text-foreground mb-3">
            Ready to Build Your ATS Resume?
          </h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
            Pick a template above and start building. 100% free — no sign-up, no credit card, no watermarks.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              <Sparkles className="w-4 h-4 mr-2" /> Choose a Template
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/check-resume-score">
                <Upload className="w-4 h-4 mr-2" /> Check My ATS Score First
              </Link>
            </Button>
          </div>
        </section>

      </main>
    </div>
  );
};

export default Templates;
