import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { FileText, Target, Shield, Zap } from "lucide-react";

const About = () => (
  <div className="min-h-screen bg-background flex flex-col">
    <SEO
      title="About FreeATS — Free ATS Resume Checker & Builder"
      description="Learn about FreeATS — a free, no-signup ATS resume checker and builder that helps job seekers optimize their resumes to pass applicant tracking systems."
      canonical="/about"
    />
    <Header />

    <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 w-full">
      <h1 className="font-display text-4xl font-extrabold text-foreground mb-4">About FreeATS</h1>
      <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
        FreeATS is a free, no-signup-required ATS resume checker and builder designed to help job seekers at every level optimize their resumes and land more interviews.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
        {[
          { icon: FileText, title: "What We Do", desc: "We analyze your resume against ATS scoring criteria — section completeness, keyword matching, formatting, quantification, and action verbs — and give you an instant score with actionable suggestions." },
          { icon: Target, title: "Our Mission", desc: "To make professional resume optimization accessible to everyone, regardless of budget. No paywalls, no subscriptions, no sign-up required." },
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

      <div className="text-center">
        <Button size="lg" asChild>
          <Link to="/">Try FreeATS — It's Free</Link>
        </Button>
      </div>
    </main>

    <Footer />
  </div>
);

export default About;
