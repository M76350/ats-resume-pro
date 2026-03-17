import { useState, useRef, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ResumeData, sampleResume, emptyResume } from "@/types/resume";
import ResumeForm from "@/components/ResumeForm";
import ResumePreview from "@/components/ResumePreview";
import ATSScorePanel from "@/components/ATSScorePanel";
import { analyzeResume } from "@/lib/ats-analyzer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText, Download, RotateCcw, Eye, BarChart3, ClipboardList,
  ArrowLeft, TrendingUp, Save,
} from "lucide-react";

const Editor = () => {
  const navigate = useNavigate();
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    const imported = sessionStorage.getItem("importedResume");
    if (imported) {
      sessionStorage.removeItem("importedResume");
      try { return JSON.parse(imported); } catch { /* fall through */ }
    }
    const flowType = sessionStorage.getItem("flowType");
    if (flowType === "create") {
      return emptyResume;
    }
    return emptyResume;
  });
  const [jobDescription, setJobDescription] = useState("");
  const [initialScore, setInitialScore] = useState<number | null>(null);
  const resumeRef = useRef<HTMLDivElement>(null);

  const analysis = useMemo(
    () => analyzeResume(resumeData, jobDescription),
    [resumeData, jobDescription]
  );

  useEffect(() => {
    if (initialScore === null) {
      setInitialScore(analysis.ats_score);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const scoreImprovement = initialScore !== null ? analysis.ats_score - initialScore : 0;

  const handlePrint = () => window.print();
  const handleReset = () => { setResumeData(emptyResume); setInitialScore(null); };
  const handleLoadSample = () => setResumeData(sampleResume);

  const handleSave = () => {
    sessionStorage.setItem("savedResume", JSON.stringify(resumeData));
    navigate("/preview");
  };

  const scoreBadgeColor =
    analysis.ats_score >= 80 ? "bg-green-600" :
    analysis.ats_score >= 60 ? "bg-yellow-600" : "bg-destructive";

  // Check if resume has meaningful content for save
  const isResumeReady = resumeData.fullName.trim().length > 0 &&
    (resumeData.summary.trim().length > 0 || resumeData.experiences.length > 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="no-print border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="mr-1">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <FileText className="w-5 h-5 text-primary" />
            <h1 className="font-display text-lg font-bold text-foreground tracking-tight">FreeATS</h1>
            <span className={`ml-2 text-xs font-semibold text-primary-foreground px-2 py-0.5 rounded-full ${scoreBadgeColor}`}>
              ATS: {analysis.ats_score}%
            </span>
            {scoreImprovement !== 0 && (
              <span className={`text-xs font-bold flex items-center gap-0.5 ${scoreImprovement > 0 ? "text-green-600" : "text-destructive"}`}>
                <TrendingUp className="w-3.5 h-3.5" />
                {scoreImprovement > 0 ? "+" : ""}{scoreImprovement}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleLoadSample}>
              <Eye className="w-4 h-4 mr-1" /> Sample
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-1" /> Reset
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Download className="w-4 h-4 mr-1" /> PDF
            </Button>
          </div>
        </div>
      </header>

      {/* 3-Panel Layout */}
      <main className="max-w-[1800px] mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col xl:flex-row gap-6">
          {/* Left Panel */}
          <div className="no-print w-full xl:w-[420px] xl:shrink-0">
            <div className="bg-card rounded-xl border border-border p-5 shadow-sm sticky top-[72px] max-h-[calc(100vh-96px)] overflow-y-auto">
              <Tabs defaultValue="editor" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="editor" className="text-xs gap-1">
                    <FileText className="w-3.5 h-3.5" /> Editor
                  </TabsTrigger>
                  <TabsTrigger value="jobdesc" className="text-xs gap-1">
                    <ClipboardList className="w-3.5 h-3.5" /> Job Desc
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="editor">
                  <ResumeForm data={resumeData} onChange={setResumeData} />
                </TabsContent>
                <TabsContent value="jobdesc">
                  <h2 className="font-display text-lg font-bold text-foreground mb-1">Job Description</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Paste the target job description for keyword matching.
                  </p>
                  <Textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the full job description here..."
                    rows={20}
                    className="text-sm"
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Center — Preview */}
          <div className="flex-1 min-w-0" ref={resumeRef}>
            <div className="no-print mb-3">
              <h2 className="font-display text-lg font-bold text-foreground">Live Preview</h2>
              <p className="text-sm text-muted-foreground">
                ATS-optimized layout. Fill in your details and save when ready.
              </p>
            </div>
            <ResumePreview data={resumeData} />

            {/* Save Button at bottom */}
            {isResumeReady && (
              <div className="no-print mt-6 flex justify-center">
                <Button size="lg" className="px-12 py-6 text-base shadow-lg" onClick={handleSave}>
                  <Save className="w-5 h-5 mr-2" /> Save & Preview
                </Button>
              </div>
            )}
          </div>

          {/* Right Panel — ATS Score */}
          <div className="no-print w-full xl:w-[320px] xl:shrink-0">
            <div className="bg-card rounded-xl border border-border p-5 shadow-sm sticky top-[72px] max-h-[calc(100vh-96px)] overflow-y-auto">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-4 h-4 text-primary" />
                <h2 className="font-display text-lg font-bold text-foreground">ATS Score</h2>
                {scoreImprovement > 0 && (
                  <span className="ml-auto text-xs font-bold text-green-600 bg-green-600/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" /> +{scoreImprovement} 🚀
                  </span>
                )}
              </div>
              <ATSScorePanel analysis={analysis} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Editor;
