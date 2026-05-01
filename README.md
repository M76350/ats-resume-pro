# FreeATS — Free ATS Resume Checker & Builder

> **100% Free. No Sign-Up. No Data Stored.**
> Upload your resume, get an instant ATS score, fix keyword gaps, and build an ATS-optimized resume — all in your browser.

**Live Site:** [https://ats-resume-pro-swart.vercel.app](https://ats-resume-pro-swart.vercel.app)
**Author & Owner:** [Manish Kumar](https://github.com/M76350) — [@M76350](https://github.com/M76350)
**LinkedIn:** [linkedin.com/in/manish0911](https://www.linkedin.com/in/manish0911/)

---

## What is FreeATS?

FreeATS is a free, browser-based **ATS resume checker and resume builder** built for job seekers who want to pass Applicant Tracking Systems (ATS) without paying for expensive tools.

Over **98% of Fortune 500 companies** use ATS software to automatically screen resumes before a human ever reads them. If your resume isn't optimized, it gets filtered out — no matter how qualified you are. FreeATS solves that problem for free.

### Why FreeATS exists

Most ATS checkers charge $20–$50/month. Manish Kumar built FreeATS because every job seeker — regardless of budget — deserves access to professional-grade resume optimization tools. Everything on FreeATS is free, forever.

---

## Features

| Feature | Details |
|---|---|
| **Instant ATS Score** | 0–100 score based on 5 weighted criteria |
| **Keyword Gap Analysis** | Paste a job description to find missing keywords |
| **Format Checker** | Detects formatting issues that break ATS parsers |
| **Resume Builder** | Full form-based editor with live preview |
| **3 ATS Templates** | Classic, Modern, Minimal — all ATS-compatible |
| **PDF Download** | Download your resume as a PDF (print-based) |
| **File Upload** | Supports PDF, DOCX, DOC, and TXT |
| **No Sign-Up** | Zero accounts, zero emails, zero friction |
| **Privacy First** | All processing happens in your browser — data never leaves your device |

---

## ATS Scoring Criteria

FreeATS scores resumes across 5 criteria based on how real ATS systems evaluate applications:

```
Section Completeness   20%  — Contact, Summary, Skills, Experience, Education
Keyword Match          30%  — Keywords from job description found in resume
Formatting Quality     20%  — Word count, bullet count, summary length
Quantified Results     15%  — Bullet points containing numbers/metrics
Action Verb Usage      15%  — Bullets starting with strong action verbs
─────────────────────────────
Total                 100%
```

**Score interpretation:**
- `80–100` → Excellent — likely to pass most ATS systems
- `60–79` → Good — minor improvements recommended
- `40–59` → Needs Work — significant gaps to address
- `0–39` → Poor — major restructuring needed

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS v3 + shadcn/ui (Radix UI) |
| Routing | React Router v6 |
| PDF Parsing | pdfjs-dist 4.4.168 |
| DOCX Parsing | mammoth.js |
| SEO | react-helmet-async |
| Analytics | Vercel Analytics |
| Testing | Vitest + Testing Library |
| Deployment | Vercel |

---

## Project Structure

```
ats-resume-pro/
├── public/
│   ├── sitemap.xml          # Full sitemap for all pages + blog posts
│   ├── robots.txt           # Crawler rules
│   └── FreeATS.ico          # Favicon
├── src/
│   ├── components/
│   │   ├── ATSScorePanel.tsx    # Score breakdown panel (Editor sidebar)
│   │   ├── Header.tsx           # Global navigation with Tools dropdown
│   │   ├── Footer.tsx           # Site footer with links
│   │   ├── ResumeForm.tsx       # Full resume form editor
│   │   ├── ResumePreview.tsx    # Live resume preview (3 templates)
│   │   ├── SEO.tsx              # SEO component with Schema.org JSON-LD
│   │   └── ui/                  # shadcn/ui component library (50 components)
│   ├── data/
│   │   └── blogPosts.ts         # 40+ long-form blog articles on ATS/resume topics
│   ├── lib/
│   │   ├── ats-analyzer.ts      # Core ATS scoring engine
│   │   └── file-parser.ts       # PDF/DOCX/TXT resume parser
│   ├── pages/
│   │   ├── Landing.tsx          # Homepage — upload checker + marketing content
│   │   ├── Templates.tsx        # Template picker (3 templates)
│   │   ├── Editor.tsx           # 3-panel resume builder
│   │   ├── Preview.tsx          # Final preview + PDF download
│   │   ├── Blog.tsx             # Blog listing with category filter + pagination
│   │   ├── BlogPost.tsx         # Individual blog post with related articles
│   │   ├── About.tsx            # About page with E-E-A-T signals
│   │   └── Contact.tsx          # Contact form
│   └── types/
│       └── resume.ts            # TypeScript interfaces for resume data
└── index.html                   # Entry HTML with full SEO meta tags + Schema.org
```

---

## Getting Started (Local Development)

### Prerequisites

You need either **Node.js** (v18+) or **Bun** installed.

- Node.js: [https://nodejs.org](https://nodejs.org) — download the LTS version
- Bun: `powershell -c "irm bun.sh/install.ps1 | iex"` (Windows) or `curl -fsSL https://bun.sh/install | bash` (Mac/Linux)

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/M76350/ats-resume-pro.git

# 2. Navigate into the project
cd ats-resume-pro

# 3. Install dependencies
npm install
# or with Bun (faster)
bun install

# 4. Start the development server
npm run dev
# or
bun dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Available Scripts

```bash
npm run dev          # Start development server (hot reload)
npm run build        # Production build
npm run preview      # Preview production build locally
npm run lint         # Run ESLint
npm run test         # Run tests (Vitest, single run)
npm run test:watch   # Run tests in watch mode
```

---

## SEO Architecture

FreeATS is built with SEO as a first-class concern, targeting high-intent keywords like:

- `free ATS resume checker`
- `ATS score checker online`
- `resume builder free no sign up`
- `check resume ATS score`
- `ATS friendly resume builder`
- `resume keyword checker free`
- `how to pass ATS`
- `improve ATS score`
- `free resume checker online`
- `ATS compatible resume template`

### SEO implementation details

**`index.html`** — Static meta tags load before JavaScript, ensuring crawlers always see full SEO data:
- Title, description, 20+ keywords
- Open Graph + Twitter Card tags
- Schema.org: `WebApplication`, `Organization`, `FAQPage` (rich results eligible)

**`SEO.tsx` component** — Per-page dynamic SEO via `react-helmet-async`:
- Unique title + description per page
- Page-specific keywords merged with site-wide base keywords
- Schema.org: `BlogPosting` (articles), `WebSite` (homepage), `BreadcrumbList` (inner pages)
- `article:published_time`, `article:modified_time`, `article:section` for blog posts

**Blog content** — 40+ long-form articles (800–1500 words each) covering:
- ATS basics and how ATS systems work
- Resume writing tips for freshers, developers, IT professionals, career changers
- Industry-specific resume guides (marketing, finance, healthcare, data science, etc.)
- Job search strategy, LinkedIn optimization, cover letter writing

**`sitemap.xml`** — All 45+ URLs with `lastmod`, `changefreq`, and `priority` values

**`robots.txt`** — Allows all public pages, disallows `/editor` and `/preview` (app-only pages)

---

## How the Resume Parser Works

The file parser (`src/lib/file-parser.ts`) extracts structured resume data from uploaded files:

1. **PDF** — Uses `pdfjs-dist` to extract text items, groups them by Y-coordinate to reconstruct lines, then sorts by position to maintain reading order
2. **DOCX** — Uses `mammoth.js` to extract raw text from Word documents
3. **TXT** — Direct text read via `File.text()`

After text extraction, a regex-based section detector identifies:
- Contact info (email, phone, LinkedIn, location) via pattern matching
- Name detection from the first few lines
- Section boundaries (Summary, Experience, Education, Skills, Projects, Certifications)
- Experience entries with title/company/date/bullet parsing
- Education entries with degree/school/date detection

---

## How the ATS Analyzer Works

The scoring engine (`src/lib/ats-analyzer.ts`) runs entirely in the browser:

```
1. Extract all text from ResumeData object
2. Score Section Completeness — check presence of 5 key sections
3. Score Keyword Match — extract keywords from job description (bigrams + unigrams),
   check how many appear in resume text
4. Score Formatting — word count limits, bullet count per job, summary length
5. Score Quantification — % of bullets containing numbers/metrics
6. Score Action Verbs — % of bullets starting with known action verbs
7. Compute weighted total score
8. Generate improvement suggestions based on failing criteria
```

No API calls. No server. Everything runs locally in the user's browser.

---

## Resume Templates

### Classic
- Font: Arial/Helvetica
- Color: Navy `#1e3a5f`
- Style: Traditional corporate layout with underlined section headers
- Best for: Finance, law, corporate roles

### Modern
- Font: Arial/Helvetica
- Color: Teal `#0e7490`
- Style: Left accent strip, subtle left border on experience entries
- Best for: Tech, startups, creative industries

### Minimal
- Font: Georgia/Times New Roman (serif)
- Color: Neutral gray `#555`
- Style: Spacious editorial layout, italic summary, uppercase small-caps headers
- Best for: Design, academia, senior professionals

All three templates are single-column, ATS-compatible, and print-ready.

---

## Deployment

The project is deployed on **Vercel** with automatic deployments on every push to `main`.

```bash
# Build for production
npm run build

# Output directory: dist/
# Deploy to Vercel, Netlify, or any static host
```

The `dist/` folder is a fully static site — no server required.

---

## Contributing

Contributions are welcome. If you find a bug or want to suggest an improvement:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## License

MIT License — free to use, modify, and distribute.

---

## Author

**Manish Kumar**
Full Stack Developer — Creator & Owner of FreeATS

- GitHub: [@M76350](https://github.com/M76350)
- LinkedIn: [linkedin.com/in/manish0911](https://www.linkedin.com/in/manish0911/)
- Email: manish@freeats.in
- Website: [ats-resume-pro-swart.vercel.app](https://ats-resume-pro-swart.vercel.app)

---

*FreeATS — Because every job seeker deserves a fair shot.*

