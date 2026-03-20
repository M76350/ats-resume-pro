import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Home, BookOpen, FileText, ArrowLeft, RefreshCw } from "lucide-react";

const funMessages = [
  "Looks like this resume got rejected by ATS 😅",
  "404: This page didn't pass the keyword check 🔍",
  "Oops! Even our ATS couldn't find this page 🤖",
  "This URL has a formatting issue we can't fix 😬",
  "Page not found — but your dream job still is! 💼",
];

const NotFound = () => {
  const location = useLocation();
  const [msg] = useState(() => funMessages[Math.floor(Math.random() * funMessages.length)]);
  const [dots, setDots] = useState(0);

  useEffect(() => {
    console.error("404:", location.pathname);
    const t = setInterval(() => setDots((d) => (d + 1) % 4), 500);
    return () => clearInterval(t);
  }, [location.pathname]);

  return (
    <>
      <SEO
        title="Page Not Found | FreeATS"
        description="The page you're looking for doesn't exist. Return to FreeATS to check your ATS resume score for free."
        noIndex={true}
      />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-lg w-full">

          {/* Animated 404 */}
          <div className="relative mb-6 select-none">
            <div className="text-[120px] sm:text-[160px] font-display font-extrabold leading-none text-primary/10 tracking-tighter">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-card border-2 border-primary/30 rounded-2xl px-6 py-3 shadow-xl">
                <span className="font-display text-2xl sm:text-3xl font-extrabold text-primary">
                  Oops{".".repeat(dots)}
                </span>
              </div>
            </div>
          </div>

          {/* Fun message */}
          <div className="mb-3">
            <span className="inline-block bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-sm font-medium px-4 py-1.5 rounded-full border border-yellow-200 dark:border-yellow-700">
              {msg}
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-3 mt-4">
            Page Not Found
          </h1>
          <p className="text-muted-foreground mb-2 leading-relaxed">
            The page at <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary">{location.pathname}</code> doesn't exist.
          </p>
          <p className="text-muted-foreground mb-8 text-sm">
            But hey — while you're here, why not check your resume's ATS score? It's free.
          </p>

          {/* ATS score mini-card */}
          <div className="bg-card border border-border rounded-2xl p-5 mb-8 text-left shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">Check Your ATS Score</p>
                <p className="text-xs text-muted-foreground">Free · No sign-up · Instant results</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 h-2 bg-green-500/80 rounded-full" />
              <div className="flex-1 h-2 bg-yellow-400/80 rounded-full" />
              <div className="flex-1 h-2 bg-primary/60 rounded-full" />
              <div className="flex-1 h-2 bg-muted rounded-full" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Most resumes score below 60% — find out where yours stands.</p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg">
              <Link to="/"><Home className="w-4 h-4 mr-2" /> Go Home</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/blog"><BookOpen className="w-4 h-4 mr-2" /> Read Blog</Link>
            </Button>
            <Button size="lg" variant="ghost" onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
            </Button>
          </div>

          {/* Reload hint */}
          <p className="mt-6 text-xs text-muted-foreground flex items-center justify-center gap-1">
            <RefreshCw className="w-3 h-3" /> Think this is a mistake?{" "}
            <button onClick={() => window.location.reload()} className="text-primary hover:underline ml-1">
              Reload the page
            </button>
          </p>
        </div>
      </main>
    </>
  );
};

export default NotFound;
