import { useState, useRef, useMemo } from "react";
import { ResumeData, sampleResume, emptyResume } from "@/types/resume";
import ResumeForm from "@/components/ResumeForm";
import ResumePreview from "@/components/ResumePreview";
import ATSScorePanel from "@/components/ATSScorePanel";
import { analyzeResume } from "@/lib/ats-analyzer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, RotateCcw, Eye, BarChart3, ClipboardList } from "lucide-react";

const Index = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(sampleResume);
  const [jobDescription, setJobDescription] = useState("");
  const resumeRef = useRef<HTMLDivElement>(null);

  const analysis = useMemo(
    () => analyzeResume(resumeData, jobDescription),
    [resumeData, jobDescription]
  );

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    setResumeData(emptyResume);
  };

  const handleLoadSample = () => {
    setResumeData(sampleResume);
  };

  const scoreBadgeColor =
    analysis.ats_score >= 80
      ? "bg-green-600"
      : analysis.ats_score >= 60
        ? "bg-yellow-600"
        : "bg-destructive";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="no-print border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            <h1 className="font-display text-xl font-bold text-foreground tracking-tight">
              ResumeBuilder
            </h1>
            <span className={`ml-2 text-xs font-semibold text-primary-foreground px-2 py-0.5 rounded-full ${scoreBadgeColor}`}>
              ATS: {analysis.ats_score}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleLoadSample}>
              <Eye className="w-4 h-4 mr-1" /> Sample
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-1" /> Reset
            </Button>
            <Button size="sm" onClick={handlePrint}>
              <Download className="w-4 h-4 mr-1" /> Download PDF
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Panel - Form & JD & ATS */}
          <div className="no-print w-full lg:w-[480px] lg:shrink-0">
            <div className="bg-card rounded-xl border border-border p-5 shadow-sm sticky top-[72px] max-h-[calc(100vh-96px)] overflow-y-auto">
              <Tabs defaultValue="editor" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="editor" className="text-xs gap-1">
                    <FileText className="w-3.5 h-3.5" /> Editor
                  </TabsTrigger>
                  <TabsTrigger value="jobdesc" className="text-xs gap-1">
                    <ClipboardList className="w-3.5 h-3.5" /> Job Desc
                  </TabsTrigger>
                  <TabsTrigger value="ats" className="text-xs gap-1">
                    <BarChart3 className="w-3.5 h-3.5" /> ATS Score
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="editor">
                  <h2 className="font-display text-lg font-bold text-foreground mb-1">
                    Your Information
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Fill in your details below. The preview updates live.
                  </p>
                  <ResumeForm data={resumeData} onChange={setResumeData} />
                </TabsContent>

                <TabsContent value="jobdesc">
                  <h2 className="font-display text-lg font-bold text-foreground mb-1">
                    Job Description
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Paste the target job description to get keyword analysis and ATS optimization tips.
                  </p>
                  <Textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the full job description here..."
                    rows={20}
                    className="text-sm"
                  />
                </TabsContent>

                <TabsContent value="ats">
                  <h2 className="font-display text-lg font-bold text-foreground mb-1">
                    ATS Analysis
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    {jobDescription.trim()
                      ? "Scored against your target job description."
                      : "Add a job description for keyword matching."}
                  </p>
                  <ATSScorePanel analysis={analysis} />
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="flex-1 min-w-0" ref={resumeRef}>
            <div className="no-print mb-3">
              <h2 className="font-display text-lg font-bold text-foreground">
                Live Preview
              </h2>
              <p className="text-sm text-muted-foreground">
                ATS-optimized single-column layout. Use "Download PDF" to save.
              </p>
            </div>
            <ResumePreview data={resumeData} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
