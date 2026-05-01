import { useState, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { analyzeResume } from "@/lib/ats-analyzer";
import { parseFile, parseResumeText } from "@/lib/file-parser";
import { emptyResume, ResumeData } from "@/types/resume";
import {
  Upload, PenLine, CheckCircle2, AlertTriangle, XCircle,
  Target, TrendingUp, Sparkles, Shield, BarChart3, X, Loader2,
  BookOpen, ArrowRight, Zap, Users, Star, GraduationCap,
  Briefcase, RefreshCw, Code2, Quote,
} from "lucide-react";
import Atshome from "@/components/ui/atshome";
import SEO from "@/components/SEO";
import { blogPosts } from "@/data/blogPosts";

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

  // Pick relevant blog posts to suggest based on score
  const getBlogSuggestions = (score: number) => {
    if (score < 50) return blogPosts.filter(p => ["how-to-improve-ats-score", "common-resume-mistakes"].includes(p.slug));
    if (score < 75) return blogPosts.filter(p => ["how-to-improve-ats-score", "best-resume-format-2026"].includes(p.slug));
    return blogPosts.filter(p => ["best-resume-format-2026", "what-is-ats-resume"].includes(p.slug));
  };

  return (
    <>
      <SEO
        title="Free ATS Resume Checker & Builder (2026) — Instant Score | FreeATS"
        description="Free ATS resume checker and builder. Upload your resume (PDF, DOCX, TXT) and get an instant ATS compatibility score, keyword gap analysis, and actionable tips to pass applicant tracking systems. No sign-up. 100% free."
        canonical="/"
        keywords="free ATS resume checker, ATS resume score, check resume ATS, free resume builder, ATS friendly resume builder, resume keyword checker free, applicant tracking system checker, resume scanner free, ATS score checker online, free CV checker, resume optimizer free, ATS resume test, resume checker no sign up, best free ATS checker 2026, resume ATS score online"
      />

      {/* SEO: keyword-rich descriptive text for crawlers */}
      <section className="sr-only" aria-hidden="true">
        <h2>Free ATS Resume Checker — No Sign Up Required</h2>
        <p>
          FreeATS is a free ATS resume checker and resume builder that helps job seekers check their
          ATS score instantly. Upload your resume in PDF, DOCX, or TXT format and get a detailed
          ATS compatibility score with keyword gap analysis, formatting issues, and actionable
          improvement suggestions — all for free, with no account required.
        </p>
        <p>
          Our free resume checker analyzes your resume against 5 key criteria used by applicant
          tracking systems: section completeness, keyword match, formatting quality, quantified
          achievements, and action verb usage. Paste a job description to see exactly which keywords
          are missing from your resume.
        </p>
        <p>
          Build an ATS-friendly resume from scratch using our free resume builder. Choose from 3
          ATS-optimized templates — Classic, Modern, and Minimal — and download your resume as a
          PDF. No watermarks, no fees, no sign-up.
        </p>
        <p>
          Keywords: free ATS resume checker, ATS score checker online, resume builder free no sign up,
          check resume ATS score, ATS friendly resume builder, resume keyword checker free,
          applicant tracking system resume checker, free CV checker online, resume scanner free,
          ATS resume score checker, how to pass ATS, improve ATS score, free resume optimizer,
          ATS compatible resume template, resume checker online free 2026.
        </p>
      </section>

      {/* Hero */}
      <section id="upload-section" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center relative">
          <Badge variant="secondary" className="mb-4 text-xs font-medium px-3 py-1">
            <Sparkles className="w-3 h-3 mr-1" /> 100% Free — No Sign Up Required
          </Badge>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight tracking-tight mb-5">
            Free ATS Resume Checker<br className="hidden sm:block" />
            <span className="text-primary"> for Freshers & Job Seekers</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
            Upload your resume and get an instant ATS compatibility score — with keyword gap analysis, format check, and actionable tips to pass systems like Workday, Greenhouse, and Lever.
          </p>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto mb-10">
            No sign-up. No credit card. No data stored. Works on PDF, DOCX, and TXT.
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
            role="button"
            aria-label="Upload resume file"
          >
            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-base font-semibold text-foreground mb-1">Drop your resume here or click to upload</p>
            <p className="text-sm text-muted-foreground">Supports PDF, DOCX, and TXT files</p>
            <input ref={fileRef} type="file" accept=".pdf,.docx,.doc,.txt,.text" onChange={handleFileChange} className="hidden" aria-label="Resume file input" />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="text-base px-8 py-6 shadow-lg" onClick={() => fileRef.current?.click()}>
              <Upload className="w-5 h-5 mr-2" /> Upload Resume
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8 py-6" onClick={handleCreateNew}>
              <PenLine className="w-5 h-5 mr-2" /> Create Resume
            </Button>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> No sign-up needed</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> Resume not stored</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> Instant results</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> 100% free</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="font-display text-2xl font-bold text-foreground text-center mb-8">
          Everything You Need to Pass ATS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: BarChart3, title: "Instant ATS Score", desc: "Get a 0–100 score breakdown in seconds with detailed category analysis across 5 key criteria." },
            { icon: Target, title: "Keyword Matching", desc: "Paste a job description to find missing keywords and see exactly what to add to your resume." },
            { icon: Shield, title: "Format Checker", desc: "Ensure your resume uses ATS-friendly formatting — no tables, no columns, clean structure." },
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

      {/* Who is this for */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground text-center mb-3">
          Who is FreeATS For?
        </h2>
        <p className="text-center text-muted-foreground mb-10 max-w-xl mx-auto text-sm">
          Whether you're just starting out or switching careers, FreeATS helps you get past the first filter.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              icon: GraduationCap,
              title: "Freshers & Students",
              desc: "Just graduated? Build your first ATS-optimized resume with our free builder and land your first interview.",
              link: "/blog/resume-tips-for-freshers",
              linkText: "Fresher resume tips →",
            },
            {
              icon: Code2,
              title: "Software Developers",
              desc: "Make sure your tech skills, GitHub projects, and experience keywords pass ATS filters at top companies.",
              link: "/blog/resume-for-developers",
              linkText: "Developer resume guide →",
            },
            {
              icon: RefreshCw,
              title: "Career Switchers",
              desc: "Changing industries? Learn how to reframe your experience with the right keywords for your new field.",
              link: "/blog/ats-resume-for-career-change",
              linkText: "Career change guide →",
            },
            {
              icon: Briefcase,
              title: "Experienced Professionals",
              desc: "Senior roles are competitive. Ensure your resume highlights quantified achievements and passes ATS screening.",
              link: "/blog/how-to-improve-ats-score",
              linkText: "Improve your score →",
            },
          ].map(({ icon: Icon, title, desc, link, linkText }) => (
            <div key={title} className="bg-card rounded-xl border border-border p-5 flex flex-col">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display font-bold text-foreground mb-2 text-sm">{title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1">{desc}</p>
              <Link to={link} className="text-xs text-primary font-medium hover:underline">
                {linkText}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-primary text-primary-foreground py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { stat: "98%", label: "Fortune 500 companies use ATS" },
              { stat: "75%", label: "Resumes rejected before human review" },
              { stat: "6 sec", label: "Average recruiter scan time" },
              { stat: "3×", label: "More interviews with ATS-optimized resume" },
            ].map(({ stat, label }) => (
              <div key={label}>
                <div className="font-display text-3xl sm:text-4xl font-extrabold mb-1">{stat}</div>
                <div className="text-xs text-primary-foreground/80 leading-snug">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What is ATS section */}
      <section className="bg-card border-y border-border py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="font-display text-3xl font-extrabold text-foreground mb-4">
                What is an ATS Resume?
              </h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                An <strong className="text-foreground">Applicant Tracking System (ATS)</strong> is software used by over 98% of Fortune 500 companies to automatically screen resumes before a human ever reads them.
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                If your resume isn't optimized for ATS, it gets filtered out — no matter how qualified you are. Our free tool checks your resume against the same criteria ATS systems use.
              </p>
              <Link
                to="/blog/what-is-ats-resume"
                className="inline-flex items-center gap-1 text-primary text-sm font-medium hover:underline"
              >
                Learn more about ATS resumes <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {[
                { icon: Zap, label: "Instant keyword scanning" },
                { icon: BarChart3, label: "Section completeness check" },
                { icon: Target, label: "Job description matching" },
                { icon: TrendingUp, label: "Quantification analysis" },
                { icon: Shield, label: "Format compatibility check" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="font-display text-3xl font-extrabold text-foreground text-center mb-10">
          How It Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { step: "1", title: "Upload Your Resume", desc: "Upload a PDF, DOCX, or TXT file. Or build a new resume from scratch using our editor." },
            { step: "2", title: "Get Your ATS Score", desc: "Our analyzer checks 5 key criteria and gives you a score from 0–100 with detailed feedback." },
            { step: "3", title: "Improve & Download", desc: "Follow the suggestions, improve your resume in our editor, and download as a PDF." },
          ].map(({ step, title, desc }) => (
            <div key={step} className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-display font-bold text-lg flex items-center justify-center mx-auto mb-4">
                {step}
              </div>
              <h3 className="font-display font-bold text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-primary/5 border-y border-border py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-3xl font-extrabold text-foreground text-center mb-10">
            Benefits of an ATS-Optimized Resume
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: Star, title: "More Interview Calls", desc: "ATS-optimized resumes are 3x more likely to reach a human recruiter." },
              { icon: Target, title: "Better Keyword Match", desc: "Matching job description keywords increases your chances of passing automated filters." },
              { icon: Users, title: "Stand Out to Recruiters", desc: "Clean formatting and quantified achievements make your resume memorable." },
              { icon: TrendingUp, title: "Track Your Progress", desc: "See your score improve in real time as you make changes in our editor." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-4 bg-card rounded-xl border border-border">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm mb-1">{title}</h3>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="font-display text-3xl font-extrabold text-foreground text-center mb-4">
          Quick Tips to Improve Your ATS Score
        </h2>
        <p className="text-center text-muted-foreground mb-8 max-w-xl mx-auto">
          Follow these proven tips to boost your ATS score and land more interviews.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {[
            "Use standard section headings: Summary, Experience, Education, Skills",
            "Start bullet points with strong action verbs (Led, Built, Designed)",
            "Add numbers and metrics to at least 50% of your bullet points",
            "Tailor your resume keywords to match each job description",
            "Keep your resume to 1 page (2 pages for 10+ years experience)",
            "Use a clean, single-column layout — no tables or text boxes",
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-card border border-border rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground">{tip}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link
            to="/blog/how-to-improve-ats-score"
            className="inline-flex items-center gap-1 text-primary font-medium hover:underline"
          >
            Read the full guide: How to Improve Your ATS Score <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Blog section */}
      <section className="bg-card border-y border-border py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl font-bold text-foreground">Latest from the Blog</h2>
            <Link to="/blog" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {blogPosts.slice(0, 3).map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group bg-background border border-border rounded-xl p-5 hover:border-primary/50 hover:shadow-md transition-all"
              >
                <Badge variant="secondary" className="text-xs mb-3">{post.category}</Badge>
                <h3 className="font-display font-bold text-foreground text-sm mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{post.description}</p>
                <span className="text-xs text-primary font-medium flex items-center gap-1">
                  <BookOpen className="w-3 h-3" /> {post.readTime}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Atshome />

      {/* Comparison table */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="font-display text-3xl font-extrabold text-foreground text-center mb-3">
          FreeATS vs. Paid Tools
        </h2>
        <p className="text-center text-muted-foreground mb-10 max-w-xl mx-auto text-sm">
          Why pay $20–$50/month when you can get the same results for free?
        </p>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/60 border-b border-border">
                <th className="text-left px-5 py-3 font-semibold text-foreground">Feature</th>
                <th className="px-5 py-3 font-semibold text-primary text-center">FreeATS ✓</th>
                <th className="px-5 py-3 font-semibold text-muted-foreground text-center">Paid Tools</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Instant ATS Score (0–100)", true, true],
                ["Keyword Gap Analysis", true, true],
                ["Resume Builder", true, true],
                ["ATS-Friendly Templates", true, true],
                ["PDF Download", true, true],
                ["No Sign-Up Required", true, false],
                ["100% Free Forever", true, false],
                ["Resume Data Never Stored", true, false],
                ["Works in Browser (No Install)", true, false],
              ].map(([feature, free, paid], i) => (
                <tr key={i} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "bg-background" : "bg-card"}`}>
                  <td className="px-5 py-3 text-foreground">{feature as string}</td>
                  <td className="px-5 py-3 text-center">
                    {free ? <CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /> : <XCircle className="w-4 h-4 text-muted-foreground/40 mx-auto" />}
                  </td>
                  <td className="px-5 py-3 text-center">
                    {paid ? <CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /> : <XCircle className="w-4 h-4 text-destructive/60 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-4">
          * Paid tools include Zety, Novoresume, Resume.io — starting at $20–$50/month
        </p>
      </section>

      {/* Testimonials */}
      <section className="bg-card border-y border-border py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-3xl font-extrabold text-foreground text-center mb-3">
            What Job Seekers Say
          </h2>
          <p className="text-center text-muted-foreground mb-10 max-w-xl mx-auto text-sm">
            Real feedback from people who used FreeATS to improve their resumes.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                name: "Priya S.",
                role: "BCA Graduate, Pune",
                text: "I had no idea my resume was scoring only 42%. After following FreeATS suggestions, I got my score to 81% and landed 3 interview calls in a week.",
                stars: 5,
              },
              {
                name: "Rahul M.",
                role: "Software Engineer, Bangalore",
                text: "The keyword matching feature is brilliant. I pasted the job description and instantly saw which skills I was missing. Got into a product company after 2 months of applying.",
                stars: 5,
              },
              {
                name: "Anjali K.",
                role: "MBA Fresher, Delhi",
                text: "Free, no sign-up, and actually useful. I've tried paid tools before — FreeATS gives the same quality feedback without charging anything. Highly recommend.",
                stars: 5,
              },
            ].map(({ name, role, text, stars }) => (
              <div key={name} className="bg-background border border-border rounded-xl p-5 flex flex-col">
                <Quote className="w-6 h-6 text-primary/30 mb-3" />
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">"{text}"</p>
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="font-semibold text-foreground text-sm">{name}</p>
                <p className="text-xs text-muted-foreground">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 w-full">
        <h2 className="font-display text-3xl font-extrabold text-foreground text-center mb-3">
          Frequently Asked Questions
        </h2>
        <p className="text-center text-muted-foreground mb-10 max-w-xl mx-auto">
          Everything you need to know about ATS resumes and our free tool.
        </p>
        <div className="space-y-4">
          {[
            {
              q: "What is an ATS resume checker?",
              a: "An ATS resume checker analyzes your resume against the criteria used by Applicant Tracking Systems — the software employers use to automatically screen job applications. It checks for keyword match, formatting quality, section completeness, and more.",
            },
            {
              q: "Is FreeATS really free?",
              a: "Yes, 100% free. No sign-up, no credit card, no hidden fees. You can upload your resume and get an instant ATS score without creating an account.",
            },
            {
              q: "Does FreeATS store my resume data?",
              a: "No. All resume processing happens entirely in your browser. Your resume data never leaves your device and is never stored on our servers.",
            },
            {
              q: "What file formats does FreeATS support?",
              a: "FreeATS supports PDF, DOCX, DOC, and TXT files. For best results, use a text-based PDF or DOCX file.",
            },
            {
              q: "What does the ATS score mean?",
              a: "The ATS score (0–100) represents how well your resume is likely to perform in an ATS system. Scores above 80 are excellent, 60–80 is good, and below 60 needs improvement. The score is based on 5 criteria: section completeness, keyword match, formatting, quantification, and action verb usage.",
            },
            {
              q: "How do I improve my ATS score?",
              a: "The most impactful improvements are: (1) tailor your resume to the job description, (2) add a dedicated skills section, (3) use standard section headings, (4) quantify your achievements with numbers, and (5) use a clean single-column layout.",
            },
            {
              q: "Can I use FreeATS to build a resume from scratch?",
              a: "Yes! Click 'Create Resume' to use our resume builder. You can choose from 3 ATS-friendly templates, fill in your information, and download your resume as a PDF.",
            },
            {
              q: "How accurate is the ATS score?",
              a: "FreeATS uses scoring criteria based on research into how real ATS systems work. While no tool can perfectly replicate every employer's specific ATS, our scoring is based on the most common and impactful factors across major platforms like Workday, Greenhouse, and Lever.",
            },
          ].map(({ q, a }, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-display font-bold text-foreground mb-2">{q}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
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

                  {/* Internal blog links based on score */}
                  <div className="bg-muted/40 rounded-lg p-3 border border-border">
                    <p className="text-xs font-bold text-foreground uppercase tracking-wide mb-2 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-primary" /> Improve Your Score — Read These Guides
                    </p>
                    <div className="space-y-1.5">
                      {getBlogSuggestions(analysisResult.ats_score).map((post) => (
                        <Link
                          key={post.slug}
                          to={`/blog/${post.slug}`}
                          onClick={closeModal}
                          className="flex items-center justify-between text-xs text-primary hover:underline"
                        >
                          <span>{post.title}</span>
                          <ArrowRight className="w-3 h-3 shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>

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
    </>
  );
};

export default Landing;
