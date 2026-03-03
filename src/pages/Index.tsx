import { useState, useRef } from "react";
import { ResumeData, sampleResume, emptyResume } from "@/types/resume";
import ResumeForm from "@/components/ResumeForm";
import ResumePreview from "@/components/ResumePreview";
import { Button } from "@/components/ui/button";
import { FileText, Download, RotateCcw, Eye } from "lucide-react";

const Index = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(sampleResume);
  const resumeRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    setResumeData(emptyResume);
  };

  const handleLoadSample = () => {
    setResumeData(sampleResume);
  };

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
          {/* Form Panel */}
          <div className="no-print w-full lg:w-[480px] lg:shrink-0">
            <div className="bg-card rounded-xl border border-border p-5 shadow-sm sticky top-[72px] max-h-[calc(100vh-96px)] overflow-y-auto">
              <h2 className="font-display text-lg font-bold text-foreground mb-1">
                Your Information
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Fill in your details below. The preview updates live.
              </p>
              <ResumeForm data={resumeData} onChange={setResumeData} />
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
