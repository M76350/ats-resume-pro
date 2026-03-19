import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { analyzeResume } from "@/lib/ats-analyzer";
import { parseFile, parseResumeText } from "@/lib/file-parser";
import { emptyResume, ResumeData } from "@/types/resume";
import {
  FileText, Upload, PenLine, CheckCircle2, AlertTriangle,
  XCircle, Target, Zap, TrendingUp, Sparkles, Shield, BarChart3, X, Loader2,
} from "lucide-react";
import Atshome from "@/components/ui/atshome";

const Landing = () => {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [analysisResult, setAnalysisResult] = useState<ReturnType<typeof analyzeResume> | null>(null);
  const [parsedData, setParsedData] = useState<ResumeData | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const processFile = useCallback(async (file: File) => {
    setShowModal(true);
    setLoading(true);
    setLoadingText("Parsing your resume...");
    setAnalysisResult(null);
    setParsedData(null);

    try {
      const text = await parseFile(file);
      setLoadingText("Analyzing ATS compatibility...");
      // small delay for UX
      await new Promise((r) => setTimeout(r, 800));
      const parsed = parseResumeText(text);
      setParsedData(parsed);
      const result = analyzeResume(parsed, "");
      setAnalysisResult(result);
    } catch (err: any) {
      alert(err.message || "Failed to parse file");
      setShowModal(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  }, [processFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleImprove = () => {
    if (parsedData) {
      sessionStorage.setItem("importedResume", JSON.stringify(parsedData));
      sessionStorage.setItem("flowType", "improve");
    }
    navigate("/templates");
  };

  const handleCreateNew = () => {
    sessionStorage.setItem("flowType", "create");
    sessionStorage.removeItem("importedResume");
    navigate("/templates");
  };

  const closeModal = () => {
    setShowModal(false);
    setAnalysisResult(null);
    setParsedData(null);
    setLoading(false);
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
            <span className="font-display text-xl font-bold text-foreground tracking-tight">FreeATS</span>
          </div>
          <Button size="sm" onClick={handleCreateNew}>
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
            Upload your resume (PDF, DOCX, TXT) and get an instant ATS compatibility score with actionable suggestions.
          </p>

          {/* Upload area */}
          <div
            className={`max-w-lg mx-auto border-2 border-dashed rounded-2xl p-10 mb-6 transition-colors cursor-pointer ${
              dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            }`}
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-base font-semibold text-foreground mb-1">
              Drop your resume here or click to upload
            </p>
            <p className="text-sm text-muted-foreground">
              Supports PDF, DOCX, and TXT files
            </p>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.docx,.doc,.txt,.text"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="text-base px-8 py-6 shadow-lg" onClick={() => fileRef.current?.click()}>
              <Upload className="w-5 h-5 mr-2" /> Upload Resume
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8 py-6" onClick={handleCreateNew}>
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-display text-lg font-bold text-foreground">
                {loading ? "Analyzing Resume..." : "ATS Score Result"}
              </h2>
              {!loading && (
                <Button variant="ghost" size="sm" onClick={closeModal}>
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="p-5">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                  <Loader2 className="w-12 h-12 text-primary animate-spin" />
                  <p className="text-base font-semibold text-foreground">{loadingText}</p>
                  <div className="w-64">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: "70%" }} />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">This may take a few seconds...</p>
                </div>
              ) : analysisResult ? (
                <div className="space-y-5">
                  {/* Score */}
                  <div className="text-center p-6 rounded-xl bg-accent/50 border border-border">
                    <ScoreIcon score={analysisResult.ats_score} />
                    <div className={`text-5xl font-display font-bold mt-2 ${scoreColor(analysisResult.ats_score)}`}>
                      {analysisResult.ats_score}%
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      ATS Compatibility Score — {analysisResult.word_count} words
                    </p>
                  </div>

                  {/* Breakdown */}
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

                  {/* Issues */}
                  {analysisResult.format_issues.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-foreground uppercase tracking-wide mb-2">⚠️ Formatting Issues</h4>
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

                  {/* Suggestions */}
                  {analysisResult.improvements.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-foreground uppercase tracking-wide mb-2">💡 Suggestions</h4>
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
                    <Button className="flex-1" size="lg" onClick={handleImprove}>
                      <Sparkles className="w-4 h-4 mr-2" /> Improve Resume
                    </Button>
                    <Button className="flex-1" size="lg" variant="outline" onClick={handleCreateNew}>
                      <PenLine className="w-4 h-4 mr-2" /> Create New
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
      <Atshome />

    </div>
  );
};

export default Landing;
