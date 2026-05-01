import { Link, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Home, BookOpen, FileText, ArrowLeft, Sparkles, Search } from "lucide-react";

// ── Floating emoji particles ──────────────────────────────────────────
const EMOJIS = ["📄", "🔍", "💼", "✨", "🚀", "📝", "🎯", "💡", "🤖", "⭐"];

interface Particle {
  id: number;
  emoji: string;
  x: number;
  duration: number;
  delay: number;
  size: number;
}

function useParticles(count = 12) {
  const [particles] = useState<Particle[]>(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      emoji: EMOJIS[i % EMOJIS.length],
      x: Math.random() * 100,
      duration: 6 + Math.random() * 8,
      delay: Math.random() * 5,
      size: 16 + Math.random() * 20,
    }))
  );
  return particles;
}

// ── Typewriter hook ───────────────────────────────────────────────────
const MESSAGES = [
  "This page got rejected by ATS 😅",
  "404: Missing keywords on this URL 🔍",
  "Even our AI couldn't find this one 🤖",
  "Page not found — your dream job still is! 💼",
  "This URL has a formatting issue 😬",
  "Oops! Wrong turn on the job hunt 🗺️",
];

function useTypewriter(messages: string[], speed = 55, pause = 2200) {
  const [display, setDisplay] = useState("");
  const [msgIdx, setMsgIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const current = messages[msgIdx];

    if (!deleting && charIdx < current.length) {
      timeoutRef.current = setTimeout(() => {
        setDisplay(current.slice(0, charIdx + 1));
        setCharIdx((c) => c + 1);
      }, speed);
    } else if (!deleting && charIdx === current.length) {
      timeoutRef.current = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timeoutRef.current = setTimeout(() => {
        setDisplay(current.slice(0, charIdx - 1));
        setCharIdx((c) => c - 1);
      }, speed / 2);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setMsgIdx((m) => (m + 1) % messages.length);
    }

    return () => clearTimeout(timeoutRef.current);
  }, [charIdx, deleting, msgIdx, messages, speed, pause]);

  return display;
}

// ── ATS Score fake-scan animation ────────────────────────────────────
function ATSScanCard() {
  const [scanning, setScanning] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [bars, setBars] = useState([0, 0, 0, 0]);

  const runScan = () => {
    if (scanning) return;
    setScanning(true);
    setScore(null);
    setBars([0, 0, 0, 0]);

    const targets = [92, 78, 85, 70];
    targets.forEach((target, i) => {
      let current = 0;
      const step = () => {
        current = Math.min(current + 3, target);
        setBars((prev) => {
          const next = [...prev];
          next[i] = current;
          return next;
        });
        if (current < target) setTimeout(step, 18 + i * 6);
      };
      setTimeout(step, i * 180);
    });

    setTimeout(() => {
      setScore(Math.floor(Math.random() * 15) + 82);
      setScanning(false);
    }, 1800);
  };

  const barLabels = ["Keywords", "Format", "Sections", "Verbs"];
  const barColors = ["bg-green-500", "bg-primary", "bg-blue-500", "bg-yellow-500"];

  return (
    <div
      className="bg-card border-2 border-border hover:border-primary/50 rounded-2xl p-5 mb-8 text-left shadow-sm cursor-pointer transition-all duration-300 hover:shadow-lg group"
      onClick={runScan}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">Mini ATS Scanner</p>
            <p className="text-xs text-muted-foreground">Click to run a demo scan ✨</p>
          </div>
        </div>
        {score !== null && (
          <div className="text-2xl font-display font-extrabold text-green-600 animate-bounce-once">
            {score}%
          </div>
        )}
        {scanning && (
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        )}
      </div>

      <div className="space-y-2">
        {barLabels.map((label, i) => (
          <div key={label}>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>{label}</span>
              <span>{bars[i]}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-75 ${barColors[i]}`}
                style={{ width: `${bars[i]}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {!scanning && score === null && (
        <p className="text-xs text-muted-foreground mt-3 text-center opacity-70">
          👆 Tap to see a demo ATS scan
        </p>
      )}
      {score !== null && (
        <p className="text-xs text-green-600 font-medium mt-3 text-center">
          🎉 Great score! Now check your real resume →
        </p>
      )}
    </div>
  );
}

// ── Main 404 page ─────────────────────────────────────────────────────
const NotFound = () => {
  const location = useLocation();
  const particles = useParticles(10);
  const typewriter = useTypewriter(MESSAGES);

  useEffect(() => {
    console.error("404:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <SEO
        title="404 — Page Not Found | FreeATS"
        description="The page you're looking for doesn't exist. Return to FreeATS to check your ATS resume score for free."
        noIndex={true}
      />

      {/* Floating emoji particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute bottom-0 select-none opacity-0"
            style={{
              left: `${p.x}%`,
              fontSize: `${p.size}px`,
              animation: `floatUp ${p.duration}s ${p.delay}s ease-in infinite`,
            }}
          >
            {p.emoji}
          </span>
        ))}
      </div>

      {/* Radial glow background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, hsl(var(--primary) / 0.07) 0%, transparent 70%)",
        }}
      />

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-16 min-h-[80vh]">
        <div className="text-center max-w-lg w-full">

          {/* Big 404 with glitch layers */}
          <div className="relative mb-2 select-none" aria-hidden="true">
            <div
              className="text-[130px] sm:text-[170px] font-display font-extrabold leading-none tracking-tighter"
              style={{
                background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.3) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 40px hsl(var(--primary) / 0.25))",
              }}
            >
              404
            </div>
            {/* Glitch copy 1 */}
            <div
              className="absolute inset-0 text-[130px] sm:text-[170px] font-display font-extrabold leading-none tracking-tighter opacity-20 text-red-500"
              style={{ animation: "glitch1 3s infinite", clipPath: "inset(30% 0 50% 0)" }}
              aria-hidden="true"
            >
              404
            </div>
            {/* Glitch copy 2 */}
            <div
              className="absolute inset-0 text-[130px] sm:text-[170px] font-display font-extrabold leading-none tracking-tighter opacity-20 text-blue-500"
              style={{ animation: "glitch2 3s infinite", clipPath: "inset(60% 0 10% 0)" }}
              aria-hidden="true"
            >
              404
            </div>
          </div>

          {/* Typewriter message */}
          <div className="h-8 mb-6 flex items-center justify-center">
            <span className="inline-flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-sm font-medium px-4 py-1.5 rounded-full border border-yellow-200 dark:border-yellow-700 min-w-[260px] justify-center">
              <span className="min-h-[1em]">{typewriter}</span>
              <span className="w-0.5 h-4 bg-yellow-600 dark:bg-yellow-400 animate-pulse rounded-full" />
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Whoops! Lost in the job hunt? 🗺️
          </h1>
          <p className="text-muted-foreground mb-1 leading-relaxed text-sm">
            The page{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono text-primary">
              {location.pathname}
            </code>{" "}
            doesn't exist.
          </p>
          <p className="text-muted-foreground mb-8 text-sm">
            But hey — while you're here, why not check your resume's ATS score? It's free. 👇
          </p>

          {/* Interactive mini ATS scan card */}
          <ATSScanCard />

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <Button asChild size="lg" className="shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow">
              <Link to="/">
                <Home className="w-4 h-4 mr-2" /> Back to Home
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/">
                <Search className="w-4 h-4 mr-2" /> Check ATS Score
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link to="/blog">
                <BookOpen className="w-4 h-4 mr-2" /> Read Blog
              </Link>
            </Button>
          </div>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Go back to previous page
          </button>

          {/* Fun footer note */}
          <div className="mt-10 flex items-center justify-center gap-2 text-xs text-muted-foreground/60">
            <Sparkles className="w-3 h-3" />
            <span>Error 404 — but your career doesn't have to be</span>
            <Sparkles className="w-3 h-3" />
          </div>
        </div>
      </main>

      {/* Keyframe animations injected via style tag */}
      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(0) rotate(0deg);   opacity: 0; }
          10%  { opacity: 0.7; }
          90%  { opacity: 0.4; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }

        @keyframes glitch1 {
          0%, 90%, 100% { transform: translate(0); }
          92%            { transform: translate(-4px, 2px); }
          94%            { transform: translate(4px, -2px); }
          96%            { transform: translate(-2px, 0); }
        }

        @keyframes glitch2 {
          0%, 90%, 100% { transform: translate(0); }
          93%            { transform: translate(4px, 1px); }
          95%            { transform: translate(-4px, -1px); }
          97%            { transform: translate(2px, 0); }
        }
      `}</style>
    </>
  );
};

export default NotFound;
