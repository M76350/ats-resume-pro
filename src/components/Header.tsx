import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FileText, Menu, X, ChevronDown, LayoutTemplate, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setToolsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isToolsActive = pathname === "/templates" || pathname === "/editor";

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Blog", to: "/blog" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
  ];

  const toolLinks = [
    { label: "Resume Templates", to: "/templates", icon: LayoutTemplate, desc: "Browse ATS-friendly templates" },
    { label: "Resume Builder", to: "/editor", icon: PenLine, desc: "Build your resume from scratch" },
  ];

  return (
    <header className="border-b border-border bg-card/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <FileText className="w-6 h-6 text-primary" />
          <span className="font-display text-xl font-bold text-foreground tracking-tight">FreeATS</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                pathname === to ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {label}
            </Link>
          ))}

          {/* Tools dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setToolsOpen((o) => !o)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isToolsActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              Tools
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${toolsOpen ? "rotate-180" : ""}`} />
            </button>

            {toolsOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50">
                {toolLinks.map(({ label, to, icon: Icon, desc }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setToolsOpen(false)}
                    className={`flex items-start gap-3 px-4 py-3 hover:bg-muted transition-colors ${
                      pathname === to ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${pathname === to ? "text-primary" : "text-foreground"}`}>{label}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="hidden md:block">
          <Button size="sm" asChild>
            <Link to="/editor">Build Resume Free</Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-3 space-y-1">
          {navLinks.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === to ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {label}
            </Link>
          ))}

          {/* Mobile tools section */}
          <div className="pt-1 pb-1">
            <p className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Tools</p>
            {toolLinks.map(({ label, to, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === to ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="w-4 h-4" /> {label}
              </Link>
            ))}
          </div>

          <div className="pt-2">
            <Button size="sm" className="w-full" asChild>
              <Link to="/editor" onClick={() => setMobileOpen(false)}>Build Resume Free</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
