import { Link } from "react-router-dom";
import { FileText, Github, Linkedin, Mail } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-card mt-16">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 mb-10">

        {/* Brand — spans 2 cols on md */}
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-primary" />
            <span className="font-display font-bold text-foreground text-lg">FreeATS</span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-xs">
            Free ATS resume checker and builder. Check your ATS score, fix keyword gaps, and build
            an ATS-friendly resume — 100% free, no sign-up required.
          </p>
          {/* Social / author links */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/M76350"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/manish0911/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="mailto:manish@freeats.in"
              aria-label="Email"
              className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Tools */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 text-xs uppercase tracking-widest">Tools</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground transition-colors">Free ATS Checker</Link></li>
            <li><Link to="/templates" className="hover:text-foreground transition-colors">Resume Templates</Link></li>
            <li><Link to="/editor" className="hover:text-foreground transition-colors">Resume Builder</Link></li>
          </ul>
        </div>

        {/* Resume Guides */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 text-xs uppercase tracking-widest">Resume Guides</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/blog/resume-tips-for-freshers" className="hover:text-foreground transition-colors">Resume for Freshers</Link></li>
            <li><Link to="/blog/resume-for-developers" className="hover:text-foreground transition-colors">Resume for Developers</Link></li>
            <li><Link to="/blog/best-resume-format-2026" className="hover:text-foreground transition-colors">Best Resume Format 2026</Link></li>
            <li><Link to="/blog/how-to-improve-ats-score" className="hover:text-foreground transition-colors">Improve ATS Score</Link></li>
            <li><Link to="/blog/ats-keywords-guide" className="hover:text-foreground transition-colors">ATS Keywords Guide</Link></li>
            <li><Link to="/blog" className="hover:text-foreground transition-colors text-primary font-medium">All Blog Posts →</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 text-xs uppercase tracking-widest">Company</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground transition-colors">About FreeATS</Link></li>
            <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms-and-conditions" className="hover:text-foreground transition-colors">Terms &amp; Conditions</Link></li>
            <li><Link to="/disclaimer" className="hover:text-foreground transition-colors">Disclaimer</Link></li>
            <li>
              <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                Sitemap
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom keyword bar */}
      <div className="border-t border-border pt-6">
        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4 text-xs text-muted-foreground/60">
          {[
            "Free ATS Resume Checker",
            "ATS Score Checker Online",
            "Resume Builder Free",
            "ATS Friendly Resume",
            "Resume Keyword Checker",
            "Free CV Builder",
            "ATS Resume for Freshers",
            "Resume Format 2026",
          ].map((kw) => (
            <span key={kw}>{kw}</span>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} FreeATS by <a href="https://github.com/M76350" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Manish Kumar</a>. All rights reserved.</p>
          <p>Free ATS Resume Checker &amp; Builder — 100% Free, No Sign Up Required.</p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
