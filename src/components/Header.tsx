import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FileText, Menu, X, ChevronDown, LayoutTemplate, BarChart3, BookOpen, Info, Mail } from "lucide-react";

const Header = () => {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setResourcesOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isResourcesActive = ["/blog", "/about", "/contact"].includes(pathname);

  const mainLinks = [
    { label: "Templates", to: "/templates", icon: LayoutTemplate },
    { label: "ATS Checker", to: "/check-resume-score", icon: BarChart3 },
  ];

  const resourceLinks = [
    { label: "Blog", to: "/blog", icon: BookOpen, desc: "Resume tips & career advice" },
    { label: "About Us", to: "/about", icon: Info, desc: "Our mission & story" },
    { label: "Contact", to: "/contact", icon: Mail, desc: "Get in touch with us" },
  ];

  return (
    <header className="border-b border-border bg-card/90 backdrop-blur-sm sticky top-0 z-50 transition-shadow duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 shrink-0 group"
        >
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
            <FileText className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground tracking-tight">
            Free<span className="text-primary">ATS</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {mainLinks.map(({ label, to, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                pathname === to
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </Link>
          ))}

          {/* Resources dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setResourcesOpen((o) => !o)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                isResourcesActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              Resources
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${resourcesOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown */}
            <div
              className={`absolute top-full left-0 mt-2 w-60 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50 transition-all duration-200 origin-top ${
                resourcesOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
              }`}
            >
              {resourceLinks.map(({ label, to, icon: Icon, desc }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setResourcesOpen(false)}
                  className={`flex items-start gap-3 px-4 py-3 hover:bg-muted transition-colors group ${
                    pathname === to ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${pathname === to ? "text-primary" : "text-foreground"}`}>{label}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <div className={`transition-transform duration-200 ${mobileOpen ? "rotate-90" : ""}`}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden border-t border-border bg-card overflow-hidden transition-all duration-300 ${
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-3 space-y-1">
          {mainLinks.map(({ label, to, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === to
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </Link>
          ))}

          <div className="pt-1 pb-1">
            <p className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Resources</p>
            {resourceLinks.map(({ label, to, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === to
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="w-4 h-4" /> {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
