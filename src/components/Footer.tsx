import { Link } from "react-router-dom";
import { FileText } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-card mt-16">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
        {/* Brand */}
        <div>
          <Link to="/" className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-primary" />
            <span className="font-display font-bold text-foreground">FreeATS</span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Free ATS resume checker and builder. Optimize your resume to pass applicant tracking systems and land more interviews.
          </p>
        </div>

        {/* Tools */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wide">Tools</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground transition-colors">ATS Checker</Link></li>
            <li><Link to="/templates" className="hover:text-foreground transition-colors">Resume Templates</Link></li>
            <li><Link to="/editor" className="hover:text-foreground transition-colors">Resume Builder</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wide">Resources</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
            <li><Link to="/about" className="hover:text-foreground transition-colors">About</Link></li>
            <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
            <li>
              <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                Sitemap
              </a>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wide">Legal</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms-and-conditions" className="hover:text-foreground transition-colors">Terms &amp; Conditions</Link></li>
            <li><Link to="/disclaimer" className="hover:text-foreground transition-colors">Disclaimer</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} FreeATS. All rights reserved.</p>
        <p>Free ATS Resume Checker &amp; Builder — 100% Free, No Sign Up Required.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
