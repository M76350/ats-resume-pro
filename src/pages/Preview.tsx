import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ResumeData, emptyResume } from "@/types/resume";
import { analyzeResume } from "@/lib/ats-analyzer";
import ResumePreview from "@/components/ResumePreview";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  FileText, ArrowLeft, Download, CheckCircle2, TrendingUp, Loader2,
} from "lucide-react";

const Preview = () => {
  const navigate = useNavigate();
  const [resumeData, setResumeData] = useState<ResumeData>(emptyResume);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = sessionStorage.getItem("savedResume");
    if (saved) {
      try {
        setResumeData(JSON.parse(saved));
      } catch { /* ignore */ }
    }
    // Simulated preparation
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const analysis = analyzeResume(resumeData, "");

  const handleDownload = () => {
    window.print();
  };

  const handleBack = () => {
    navigate("/editor");
  };

  const scoreColor =
    analysis.ats_score >= 80 ? "text-green-600" :
    analysis.ats_score >= 60 ? "text-yellow-600" : "text-destructive";

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-lg font-display font-bold text-foreground">Preparing your resume...</p>
          <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: "90%" }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="no-print border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <FileText className="w-5 h-5 text-primary" />
            <span className="font-display text-lg font-bold text-foreground tracking-tight">Final Preview</span>
          </div>
          <Button size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-1" /> Download PDF
          </Button>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Resume Preview */}
          <div className="flex-1 min-w-0">
            <ResumePreview data={resumeData} />
          </div>

          {/* Side panel */}
          <div className="no-print w-full lg:w-[320px] lg:shrink-0">
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm sticky top-[72px]">
              {/* Score */}
              <div className="text-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto mb-2" />
                <h2 className="font-display text-xl font-bold text-foreground mb-1">Resume Ready!</h2>
                <div className={`text-4xl font-display font-bold ${scoreColor}`}>
                  {analysis.ats_score}%
                </div>
                <p className="text-sm text-muted-foreground mt-1">ATS Score</p>
              </div>

              {/* Score breakdown */}
              <div className="space-y-3 mb-6">
                {[
                  { label: "Sections", val: analysis.section_scores.section_completeness },
                  { label: "Formatting", val: analysis.section_scores.formatting },
                  { label: "Quantified", val: analysis.section_scores.quantification },
                  { label: "Action Verbs", val: analysis.section_scores.clarity },
                ].map(({ label, val }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>{label}</span>
                      <span>{val}%</span>
                    </div>
                    <Progress value={val} className="h-1.5" />
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button className="w-full" size="lg" onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-2" /> Finish & Download PDF
                </Button>
                <Button className="w-full" variant="outline" size="sm" onClick={handleBack}>
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back to Editor
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Preview;
