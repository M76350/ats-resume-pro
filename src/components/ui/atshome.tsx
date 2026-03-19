import React, { useEffect, useState } from "react";

export default function Atshome() {
  const maxScore = 92;
  const maxTotal = 100;
  const animationDuration = 4000;

  const [score, setScore] = useState(0);

  useEffect(() => {
    let start = null;
    let rafId;

    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const currentScore = Math.floor(Math.min(progress / animationDuration, 1) * maxScore);
      setScore(currentScore);

      if (progress < animationDuration) {
        rafId = requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          start = null;
          rafId = requestAnimationFrame(animate);
        }, 2000);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (score / maxTotal) * circumference;

  const features = [
    {
      title: "Keyword Optimization",
      desc: "Identify the most impactful keywords recruiters and ATS systems look for and ensure they're included effectively.",
    },
    {
      title: "Formatting Analysis",
      desc: "Ensure your resume layout is ATS-friendly with clear section headings and proper formatting.",
    },
    {
      title: "Impactful Achievements",
      desc: "Highlight quantifiable accomplishments to make your resume stand out in ATS scans.",
    },
  ];

  return (
    <div className="flex flex-col justify-center items-center bg-gradient-to-tr from-green-50 to-blue-50 p-6 font-sans">
      <div className="container w-full bg-white rounded-3xl shadow-xl p-10 flex flex-col md:flex-row items-center gap-12">
        {/* Left: Circle + Resume Image + Score */}
        <div className="flex flex-col items-center space-y-8 w-full md:w-1/2 relative">
          <svg className="transform -rotate-90 z-10" width="220" height="220" viewBox="0 0 220 220">
            <circle
              className="text-gray-300"
              strokeWidth="15"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="110"
              cy="110"
            />
            <circle
              className="text-green-500 transition-all duration-1500 ease-out"
              strokeWidth="15"
              strokeLinecap="round"
              stroke="url(#gradient)"
              fill="transparent"
              r={radius}
              cx="110"
              cy="110"
              strokeDasharray={circumference}
              strokeDashoffset={progressOffset}
            />
            <defs>
              <linearGradient id="gradient" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#16a34a" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute top-[78px] -z-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-bounce-slow w-24 h-28 md:w-32 md:h-32 rounded-lg overflow-hidden shadow-lg">
            <img
              src="/FreeAtschecker.jpg"
              alt="Resume scanning"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="text-5xl font-extrabold text-green-700 select-none">
            {score}{" "}
            <span className="text-5xl font-extrabold text-gray-500">/ {maxTotal}</span>
          </div>
          <div className="text-gray-600 text-sm select-none">ATS Compatibility Score</div>
        </div>

        {/* Right: Features */}
        <div className="w-full md:w-1/2 space-y-8">
          <h2 className="text-3xl font-bold text-gray-900">Optimize Your Resume for ATS with FreeATS</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            FreeATS boosts your interview chances by analyzing your resume with advanced ATS scanning technology. Check keywords, formatting, and key resume elements to ensure your application passes automated screening.
          </p>

          <div className="space-y-6">
            {features.map(({ title, desc }) => (
              <div key={title} className="flex gap-5">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  {title[0]}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{title}</h3>
                  <p className="text-gray-600">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-14 text-gray-500 text-xs select-none max-w-xl text-center mx-auto">
        Powered by FreeATS &mdash; Your ATS Resume Optimization Partner.
      </div>

      <style>
        {`
          @keyframes bounce-slow {
            0%, 100% { transform: translate(-50%, -50%) translateY(0); }
            50% { transform: translate(-50%, -50%) translateY(-10px); }
          }
          .animate-bounce-slow { animation: bounce-slow 2s infinite; }
        `}
      </style>
    </div>
  );
}