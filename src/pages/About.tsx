import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { FileText, Target, Shield, Zap, Mail, Github, Linkedin, User } from "lucide-react";

const About = () => (
  <>
    <SEO
      title="About FreeATS — Free ATS Resume Checker & Builder"
      description="Learn about FreeATS, built by Manish Yadav. A free, no-signup ATS resume checker and builder helping job seekers optimize resumes to pass applicant tracking systems."
      canonical="/about"
      keywords="about FreeATS, Manish Yadav, ATS resume checker, free resume builder"
    />

    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 w-full">
      <h1 className="font-display text-4xl font-extrabold text-foreground mb-4">About FreeATS</h1>
      <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
        FreeATS is a free, no-signup-required ATS resume checker and builder designed to help job seekers at every level optimize their resumes and land more interviews.
      </p>

      {/* Author / E-E-A-T Section */}
      <div className="bg-card border border-border rounded-xl p-6 mb-8 flex flex-col sm:flex-row gap-5 items-start">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <User className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-foreground mb-1">Manish Yadav</h2>
          <p className="text-sm text-primary font-medium mb-2">Full Stack Developer &amp; Creator of FreeATS</p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            Manish Yadav is a Full Stack Developer with expertise in React, TypeScript, Node.js, and modern web technologies. He built FreeATS to solve a real problem he experienced during his own job search — the frustration of not knowing why resumes weren't getting responses.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            With a deep understanding of how ATS systems work and what recruiters look for, Manish designed FreeATS to give every job seeker — regardless of budget — access to professional-grade resume optimization tools.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="mailto:manish@freeats.in" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <Mail className="w-3.5 h-3.5" /> manish@freeats.in
            </a>
            <a href="https://www.linkedin.com/in/manish0911/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <Linkedin className="w-3.5 h-3.5" /> LinkedIn
            </a>
            <a href="https://github.com/M76350" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <Github className="w-3.5 h-3.5" /> GitHub
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
        {[
          { icon: FileText, title: "What We Do", desc: "We analyze your resume against ATS scoring criteria — section completeness, keyword matching, formatting, quantification, and action verbs — and give you an instant score with actionable suggestions." },
          { icon: Target, title: "Our Mission", desc: "To make professional resume optimization accessible to everyone, regardless of budget. No paywalls, no subscriptions, no sign-up required. Ever." },
          { icon: Shield, title: "Your Privacy", desc: "We do not store your resume data. All processing happens in your browser. Your personal information never leaves your device." },
          { icon: Zap, title: "Why It's Free", desc: "We believe everyone deserves a fair shot at their dream job. Quality resume tools shouldn't be locked behind expensive subscriptions." },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-5 h-5 text-primary" />
              <h2 className="font-display font-bold text-foreground">{title}</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <h2 className="font-display text-xl font-bold text-foreground mb-3">How FreeATS Works</h2>
        <ol className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-3"><span className="font-bold text-primary shrink-0">1.</span> Upload your resume (PDF, DOCX, or TXT) or build one from scratch using our editor.</li>
          <li className="flex gap-3"><span className="font-bold text-primary shrink-0">2.</span> Our analyzer checks your resume across 5 key ATS criteria and generates a score from 0–100.</li>
          <li className="flex gap-3"><span className="font-bold text-primary shrink-0">3.</span> Optionally paste a job description to get keyword-specific matching and gap analysis.</li>
          <li className="flex gap-3"><span className="font-bold text-primary shrink-0">4.</span> Follow the suggestions to improve your score, then download your optimized resume as a PDF.</li>
        </ol>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <h2 className="font-display text-xl font-bold text-foreground mb-3">Our Technology</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          FreeATS is built with React, TypeScript, and Vite — a modern, fast web stack. All resume processing happens client-side using JavaScript, which means your data never leaves your browser.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          We use pdfjs-dist for PDF parsing and mammoth.js for DOCX parsing. Our ATS scoring algorithm is based on extensive research into how real ATS systems evaluate resumes, including analysis of Workday, Greenhouse, Lever, and Taleo.
        </p>
      </div>

      <div className="text-center">
        <Button size="lg" asChild>
          <Link to="/">Try FreeATS — It's Free</Link>
        </Button>
      </div>
    </main>
  </>
);

export default About;
