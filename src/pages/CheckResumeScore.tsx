import { useState, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { analyzeResume } from "@/lib/ats-analyzer";
import { parseFile, parseResumeText } from "@/lib/file-parser";
import { emptyResume, ResumeData } from "@/types/resume";
import SEO from "@/components/SEO";
import {
  Upload, CheckCircle2, AlertTriangle, XCircle, Target,
  TrendingUp, Sparkles, BarChart3, X, Loader2, BookOpen,
  ArrowRight, PenLine, Shield, FileText, Lock, Zap,
} from "lucide-react";
import { blogPosts } from "@/data/blogPosts";

const CheckResumeScore = () => {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [analysisResult, setAnalysisResult] = useState<ReturnType<typeof analyzeResume> | null>(null);
  const [parsedData, setParsedData] = useState<ResumeData | null>(null);

  const processFile = useCallback(async (file: File) => {
    setLoading(true);
    setLoadingText("Parsing your resume...");
    setAnalysisResult(null);
    setParsedData(null);
    try {
      const text = await parseFile(file);
      setLoadingText("Analyzing ATS compatibility...");
      await new Promise((r) => setTimeout(r, 800));
      const parsed = parseResumeText(text);
      setParsedData(parsed);
      const result = analyzeResume(parsed, "");
      setAnalysisResult(result);
    } catch (err: any) {
      alert(err.message || "Failed to parse file. Please try PDF, DOCX, or TXT.");
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

  const handleReset = () => {
    setAnalysisResult(null);
    setParsedData(null);
  };

  const scoreColor = (s: number) =>
    s >= 80 ? "text-green-600" : s >= 60 ? "text-yellow-600" : "text-destructive";

  const scoreBg = (s: number) =>
    s >= 80 ? "bg-green-50 border-green-200" : s >= 60 ? "bg-yellow-50 border-yellow-200" : "bg-red-50 border-red-200";

  const ScoreIcon = ({ score }: { score: number }) =>
    score >= 80 ? <CheckCircle2 className="w-8 h-8 text-green-600" /> :
    score >= 60 ? <AlertTriangle className="w-8 h-8 text-yellow-600" /> :
    <XCircle className="w-8 h-8 text-destructive" />;

  const scoreLabel = (s: number) =>
    s >= 80 ? "Excellent — Ready to Apply!" :
    s >= 60 ? "Good — Minor Improvements Needed" :
    s >= 40 ? "Needs Work — Follow Suggestions Below" :
    "Poor — Major Improvements Required";

  const getBlogSuggestions = (score: number) => {
    if (score < 50) return blogPosts.filter(p => ["how-to-improve-ats-score", "common-resume-mistakes"].includes(p.slug));
    if (score < 75) return blogPosts.filter(p => ["how-to-improve-ats-score", "best-resume-format-2026"].includes(p.slug));
    return blogPosts.filter(p => ["best-resume-format-2026", "what-is-ats-resume"].includes(p.slug));
  };

  return (
    <>
      <SEO
        title="Check Your Resume ATS Score Free — Instant Results | FreeATS"
        description="Upload your resume and get an instant ATS compatibility score. Free resume ATS checker — no sign-up, no data stored. Find missing keywords and fix formatting issues in seconds."
        canonical="/check-resume-score"
        keywords="check resume ATS score, free ATS score checker, resume score checker online, ATS resume test free, check my resume score, resume compatibility checker, free resume scanner"
      />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 w-full">

        {/* Page header */}
        <div className="text-center mb-10">
          <Badge variant="secondary" className="mb-4 text-xs font-medium px-3 py-1">
            <Sparkles className="w-3 h-3 mr-1" /> Free — No Sign Up Required
          </Badge>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground leading-tight mb-4">
            Check Your Resume <span className="text-primary">ATS Score</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Upload your resume below and get an instant ATS compatibility score with keyword analysis,
            formatting feedback, and actionable suggestions — completely free.
          </p>
        </div>

        {/* Trust signals */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-green-600" /> Resume never stored</span>
          <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-primary" /> Instant results</span>
          <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-primary" /> PDF, DOCX, TXT</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> 100% free</span>
        </div>

        {/* ── UPLOAD STATE ── */}
        {!loading && !analysisResult && (
          <>
            {/* Drop zone */}
            <div
              className={`border-2 border-dashed rounded-2xl p-12 mb-6 text-center transition-all cursor-pointer ${
                dragOver
                  ? "border-primary bg-primary/5 scale-[1.01]"
                  : "border-border hover:border-primary/50 hover:bg-muted/30"
              }`}
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              role="button"
              aria-label="Upload resume file"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <p className="text-base font-semibold text-foreground mb-1">
                Drop your resume here or click to upload
              </p>
              <p className="text-sm text-muted-foreground mb-4">Supports PDF, DOCX, DOC, and TXT</p>
              <Button size="lg" className="px-8">
                <Upload className="w-4 h-4 mr-2" /> Upload Resume
              </Button>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.docx,.doc,.txt,.text"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Resume file input"
              />
            </div>

            {/* Or create new */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">Don't have a resume yet?</p>
              <Button variant="outline" size="lg" onClick={handleCreateNew}>
                <PenLine className="w-4 h-4 mr-2" /> Build a Free ATS Resume
              </Button>
            </div>

            {/* How it works mini */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: Upload, step: "1", title: "Upload Resume", desc: "PDF, DOCX, or TXT — processed entirely in your browser." },
                { icon: BarChart3, step: "2", title: "Get ATS Score", desc: "Instant 0–100 score across 5 key ATS criteria." },
                { icon: TrendingUp, step: "3", title: "Fix & Improve", desc: "Follow suggestions, improve your resume, download PDF." },
              ].map(({ icon: Icon, step, title, desc }) => (
                <div key={step} className="bg-card border border-border rounded-xl p-4 text-center">
                  <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground font-display font-bold text-sm flex items-center justify-center mx-auto mb-3">
                    {step}
                  </div>
                  <h3 className="font-semibold text-foreground text-sm mb-1">{title}</h3>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── LOADING STATE ── */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-muted flex items-center justify-center">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            </div>
            <p className="text-lg font-display font-bold text-foreground">{loadingText}</p>
            <div className="w-64 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: "70%" }} />
            </div>
            <p className="text-sm text-muted-foreground">Analyzing against ATS criteria...</p>
          </div>
        )}

        {/* ── RESULTS STATE ── */}
        {!loading && analysisResult && (
          <div className="space-y-6">

            {/* Main score card */}
            <div className={`rounded-2xl border-2 p-8 text-center ${scoreBg(analysisResult.ats_score)}`}>
              <ScoreIcon score={analysisResult.ats_score} />
              <div className={`text-6xl font-display font-extrabold mt-3 mb-1 ${scoreColor(analysisResult.ats_score)}`}>
                {analysisResult.ats_score}%
              </div>
              <p className="font-semibold text-foreground mb-1">{scoreLabel(analysisResult.ats_score)}</p>
              <p className="text-sm text-muted-foreground">{analysisResult.word_count} words detected in your resume</p>
            </div>

            {/* Score breakdown */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h2 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" /> Score Breakdown
              </h2>
              <div className="space-y-3">
                {[
                  { label: "Section Completeness", value: analysisResult.section_scores.section_completeness, weight: "20%" },
                  { label: "Keyword Match", value: analysisResult.section_scores.keyword_match, weight: "30%" },
                  { label: "Formatting", value: analysisResult.section_scores.formatting, weight: "20%" },
                  { label: "Quantified Results", value: analysisResult.section_scores.quantification, weight: "15%" },
                  { label: "Action Verbs", value: analysisResult.section_scores.clarity, weight: "15%" },
                ].map(({ label, value, weight }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>{label} <span className="opacity-50">({weight})</span></span>
                      <span className={scoreColor(value)}>{value}%</span>
                    </div>
                    <Progress value={value} className="h-2" />
                  </div>
                ))}
              </div>
            </div>

            {/* Formatting issues */}
            {analysisResult.format_issues.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-5">
                <h2 className="font-display font-bold text-foreground mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" /> Formatting Issues
                </h2>
                <ul className="space-y-2">
                  {analysisResult.format_issues.map((issue, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <AlertTriangle className="w-3.5 h-3.5 text-yellow-600 mt-0.5 shrink-0" />
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggestions */}
            {analysisResult.improvements.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-5">
                <h2 className="font-display font-bold text-foreground mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" /> How to Improve Your Score
                </h2>
                <ul className="space-y-2">
                  {analysisResult.improvements.map((imp, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                      {imp}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Blog suggestions */}
            <div className="bg-accent/40 border border-border rounded-xl p-5">
              <h2 className="font-display font-bold text-foreground mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" /> Read These Guides to Improve
              </h2>
              <div className="space-y-2">
                {getBlogSuggestions(analysisResult.ats_score).map((post) => (
                  <Link
                    key={post.slug}
                    to={`/blog/${post.slug}`}
                    className="flex items-center justify-between p-3 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors group"
                  >
                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {post.title}
                    </span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0" />
                  </Link>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="flex-1" size="lg" onClick={handleImprove}>
                <Sparkles className="w-4 h-4 mr-2" /> Improve This Resume
              </Button>
              <Button className="flex-1" size="lg" variant="outline" onClick={handleCreateNew}>
                <PenLine className="w-4 h-4 mr-2" /> Build New Resume
              </Button>
              <Button size="lg" variant="ghost" onClick={handleReset}>
                <X className="w-4 h-4 mr-2" /> Check Another
              </Button>
            </div>

            {/* Keyword tip */}
            <div className="bg-card border border-border rounded-xl p-4 flex items-start gap-3">
              <Target className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">Boost your score with Job Description Matching</p>
                <p className="text-xs text-muted-foreground">
                  Paste a job description in the{" "}
                  <Link to="/editor" className="text-primary hover:underline font-medium">Resume Editor</Link>
                  {" "}to see exactly which keywords are missing from your resume.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bottom CTA — always visible */}
        {!loading && (
          <div className="mt-14 text-center border-t border-border pt-10">
            <p className="text-sm text-muted-foreground mb-4">
              Want to build a new ATS-optimized resume from scratch?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" variant="outline">
                <Link to="/templates">
                  <Shield className="w-4 h-4 mr-2" /> Browse ATS Templates
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <Link to="/blog">
                  <BookOpen className="w-4 h-4 mr-2" /> Read Resume Guides
                </Link>
              </Button>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default CheckResumeScore;
