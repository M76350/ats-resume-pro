import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { analyzeResume } from "@/lib/ats-analyzer";
import { emptyResume, ResumeData } from "@/types/resume";
import {
  FileText,
  Upload,
  PenLine,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Target,
  Zap,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Shield,
  BarChart3,
  X,
} from "lucide-react";

function parseResumeText(text: string): ResumeData {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const data: ResumeData = { ...emptyResume, experiences: [], projects: [], education: [] };

  // Try to extract name (first non-empty line)
  if (lines.length > 0) data.fullName = lines[0];

  // Try to find email, phone
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

  // Collect rest as summary
  const bodyLines = lines.slice(1).filter(
    (l) => !l.includes(data.email) && !l.includes(data.phone)
  );
  data.summary = bodyLines.slice(0, 3).join(" ").slice(0, 300);
  data.skills = bodyLines.slice(3, 6).join(", ").slice(0, 200);

  return data;
}

const Landing = () => {
  const navigate = useNavigate();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [pastedText, setPastedText] = useState("");
  const [analysisResult, setAnalysisResult] = useState<ReturnType<typeof analyzeResume> | null>(null);
  const [parsedData, setParsedData] = useState<ResumeData | null>(null);

  const handleAnalyze = useCallback(() => {
    if (!pastedText.trim()) return;
    const parsed = parseResumeText(pastedText);
    setParsedData(parsed);
    const result = analyzeResume(parsed, "");
    setAnalysisResult(result);
  }, [pastedText]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setPastedText(text);
    };
    reader.readAsText(file);
  }, []);

  const handleImproveResume = () => {
    if (parsedData) {
      sessionStorage.setItem("importedResume", JSON.stringify(parsedData));
    }
    navigate("/editor");
  };

  const scoreColor = (s: number) =>
    s >= 80 ? "text-green-600" : s >= 60 ? "text-yellow-600" : "text-destructive";

  const ScoreIcon = ({ score }: { score: number }) =>
    score >= 80 ? <CheckCircle2 className="w-6 h-6 text-green-600" /> :
    score >= 60 ? <AlertTriangle className="w-6 h-6 text-yellow-600" /> :
    <XCircle className="w-6 h-6 text-destructive" />;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            <span className="font-display text-xl font-bold text-foreground tracking-tight">
              FreeATS
            </span>
          </div>
          <Button size="sm" onClick={() => navigate("/editor")}>
            <PenLine className="w-4 h-4 mr-1" /> Create Resume
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center relative">
          <Badge variant="secondary" className="mb-4 text-xs font-medium px-3 py-1">
            <Sparkles className="w-3 h-3 mr-1" /> 100% Free — No Sign Up Required
          </Badge>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight tracking-tight mb-5">
            Check Your <span className="text-primary">ATS Score</span> Instantly
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Upload your resume and get an instant ATS compatibility score with
            actionable suggestions to beat applicant tracking systems.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="text-base px-8 py-6 shadow-lg"
              onClick={() => setShowUploadModal(true)}
            >
              <Upload className="w-5 h-5 mr-2" /> Upload Resume
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base px-8 py-6"
              onClick={() => navigate("/editor")}
            >
              <PenLine className="w-5 h-5 mr-2" /> Create Resume
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: BarChart3, title: "Instant ATS Score", desc: "Get a 0–100 score breakdown in seconds with detailed category analysis." },
            { icon: Target, title: "Keyword Matching", desc: "Compare your resume against job descriptions to find missing keywords." },
            { icon: Shield, title: "Format Checker", desc: "Ensure your resume is ATS-friendly with clean, parseable formatting." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-card rounded-xl border border-border p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-bold text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-display text-lg font-bold text-foreground">
                {analysisResult ? "ATS Score Result" : "Upload Your Resume"}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowUploadModal(false);
                  setAnalysisResult(null);
                  setPastedText("");
                  setParsedData(null);
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-5">
              {!analysisResult ? (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                    <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-3">
                      Upload a .txt file or paste your resume text below
                    </p>
                    <input
                      type="file"
                      accept=".txt,.text"
                      onChange={handleFileUpload}
                      className="text-sm text-muted-foreground"
                    />
                  </div>
                  <Textarea
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder="Or paste your full resume text here..."
                    rows={10}
                    className="text-sm"
                  />
                  <Button
                    className="w-full"
                    size="lg"
                    disabled={!pastedText.trim()}
                    onClick={handleAnalyze}
                  >
                    <Zap className="w-4 h-4 mr-2" /> Analyze Resume
                  </Button>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Score Circle */}
                  <div className="text-center p-6 rounded-xl bg-accent/50 border border-border">
                    <ScoreIcon score={analysisResult.ats_score} />
                    <div className={`text-5xl font-display font-bold mt-2 ${scoreColor(analysisResult.ats_score)}`}>
                      {analysisResult.ats_score}%
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      ATS Compatibility Score — {analysisResult.word_count} words
                    </p>
                  </div>

                  {/* Quick Insights */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { label: "Sections", val: analysisResult.section_scores.section_completeness },
                      { label: "Formatting", val: analysisResult.section_scores.formatting },
                      { label: "Quantified", val: analysisResult.section_scores.quantification },
                      { label: "Action Verbs", val: analysisResult.section_scores.clarity },
                    ].map(({ label, val }) => (
                      <div key={label} className="bg-muted/50 rounded-lg p-3">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>{label}</span>
                          <span className={scoreColor(val)}>{val}%</span>
                        </div>
                        <Progress value={val} className="h-1.5" />
                      </div>
                    ))}
                  </div>

                  {/* Format Issues */}
                  {analysisResult.format_issues.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-foreground uppercase tracking-wide mb-2">
                        ⚠️ Formatting Issues
                      </h4>
                      <ul className="space-y-1">
                        {analysisResult.format_issues.map((issue, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <AlertTriangle className="w-3.5 h-3.5 text-yellow-600 mt-0.5 shrink-0" />
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Improvements */}
                  {analysisResult.improvements.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-foreground uppercase tracking-wide mb-2">
                        💡 Suggestions
                      </h4>
                      <ul className="space-y-1">
                        {analysisResult.improvements.map((imp, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <TrendingUp className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                            {imp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* CTAs */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button className="flex-1" size="lg" onClick={handleImproveResume}>
                      <Sparkles className="w-4 h-4 mr-2" /> Improve Resume
                    </Button>
                    <Button className="flex-1" size="lg" variant="outline" onClick={() => navigate("/editor")}>
                      <PenLine className="w-4 h-4 mr-2" /> Open Editor
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;
