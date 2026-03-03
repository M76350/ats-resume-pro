import { ATSAnalysis } from "@/lib/ats-analyzer";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, XCircle, TrendingUp, Target, FileText, Zap, PenLine } from "lucide-react";

interface ATSScorePanelProps {
  analysis: ATSAnalysis;
}

function ScoreColor({ score }: { score: number }) {
  if (score >= 80) return <span className="text-green-600 font-bold">{score}%</span>;
  if (score >= 60) return <span className="text-yellow-600 font-bold">{score}%</span>;
  return <span className="text-destructive font-bold">{score}%</span>;
}

function ScoreIcon({ score }: { score: number }) {
  if (score >= 80) return <CheckCircle2 className="w-5 h-5 text-green-600" />;
  if (score >= 60) return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
  return <XCircle className="w-5 h-5 text-destructive" />;
}

const ATSScorePanel = ({ analysis }: ATSScorePanelProps) => {
  const { ats_score, keyword_match, missing_keywords, format_issues, improvements, section_scores, word_count } = analysis;

  const scoreLabel = ats_score >= 80 ? "Excellent" : ats_score >= 60 ? "Good" : ats_score >= 40 ? "Needs Work" : "Poor";

  return (
    <div className="space-y-5">
      {/* Main Score */}
      <div className="text-center p-5 rounded-xl bg-accent/50 border border-border">
        <div className="flex items-center justify-center gap-2 mb-2">
          <ScoreIcon score={ats_score} />
          <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">ATS Score</span>
        </div>
        <div className="text-5xl font-display font-bold text-foreground">
          <ScoreColor score={ats_score} />
        </div>
        <p className="text-sm text-muted-foreground mt-1">{scoreLabel} — {word_count} words</p>
      </div>

      {/* Score Breakdown */}
      <div className="space-y-3">
        <h4 className="font-display font-bold text-sm text-foreground uppercase tracking-wide">Score Breakdown</h4>
        {[
          { label: "Sections Complete", value: section_scores.section_completeness, icon: FileText, weight: "20%" },
          { label: "Keyword Match", value: section_scores.keyword_match, icon: Target, weight: "30%" },
          { label: "Formatting", value: section_scores.formatting, icon: Zap, weight: "20%" },
          { label: "Quantified Results", value: section_scores.quantification, icon: TrendingUp, weight: "15%" },
          { label: "Action Verbs", value: section_scores.clarity, icon: PenLine, weight: "15%" },
        ].map(({ label, value, icon: Icon, weight }) => (
          <div key={label}>
            <div className="flex items-center justify-between mb-1">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Icon className="w-3.5 h-3.5" /> {label}
                <span className="opacity-60">({weight})</span>
              </span>
              <ScoreColor score={value} />
            </div>
            <Progress value={value} className="h-2" />
          </div>
        ))}
      </div>

      {/* Keyword Match */}
      {keyword_match > 0 && (
        <div>
          <h4 className="font-display font-bold text-sm text-foreground uppercase tracking-wide mb-2">
            Keyword Match: <ScoreColor score={keyword_match} />
          </h4>
          {missing_keywords.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">Missing keywords:</p>
              <div className="flex flex-wrap gap-1.5">
                {missing_keywords.map((kw) => (
                  <Badge key={kw} variant="outline" className="text-xs bg-destructive/10 text-destructive border-destructive/20">
                    {kw}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Format Issues */}
      {format_issues.length > 0 && (
        <div>
          <h4 className="font-display font-bold text-sm text-foreground uppercase tracking-wide mb-2">Formatting Issues</h4>
          <ul className="space-y-1.5">
            {format_issues.map((issue, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                <AlertTriangle className="w-3.5 h-3.5 text-yellow-600 mt-0.5 shrink-0" />
                {issue}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Improvements */}
      {improvements.length > 0 && (
        <div>
          <h4 className="font-display font-bold text-sm text-foreground uppercase tracking-wide mb-2">Suggestions</h4>
          <ul className="space-y-1.5">
            {improvements.map((imp, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                <TrendingUp className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                {imp}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ATSScorePanel;
