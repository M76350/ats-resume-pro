import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { blogPosts } from "@/data/blogPosts";
import SEO from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight, ArrowLeft, User, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 6;

const Blog = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(() => ["All", ...Array.from(new Set(blogPosts.map((p) => p.category)))], []);
  const filtered = useMemo(() => activeCategory === "All" ? blogPosts : blogPosts.filter((p) => p.category === activeCategory), [activeCategory]);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <SEO
        title="ATS Resume Blog — Free Tips, Guides & Career Advice (2026) | FreeATS"
        description="Free expert guides on ATS resume optimization, resume writing tips, keyword strategies, and job search advice. Learn how to pass applicant tracking systems and land more interviews."
        canonical="/blog"
        keywords="ATS resume tips, resume writing guide, how to pass ATS, resume optimization tips, free resume advice, job search tips 2026, ATS keywords guide, resume format tips, how to improve resume, career advice free"
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 w-full">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="mb-8">
          <h1 className="font-display text-4xl font-extrabold text-foreground mb-3">ATS Resume Blog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">Expert guides on resume writing, ATS optimization, and job search strategies.</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button key={cat} onClick={() => { setActiveCategory(cat); setPage(1); }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                activeCategory === cat ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
              }`}
            >{cat}</button>
          ))}
        </div>

        <p className="text-sm text-muted-foreground mb-5">
          Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} articles
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {paginated.map((post) => (
            <Link key={post.slug} to={`/blog/${post.slug}`}
              className="group bg-card border border-border rounded-xl p-6 hover:border-primary/50 hover:shadow-md transition-all flex flex-col"
            >
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="w-3 h-3" /> {post.readTime}</span>
              </div>
              <h2 className="font-display text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2 flex-1">{post.title}</h2>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{post.description}</p>
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{post.date}</span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground"><User className="w-3 h-3" /> {post.author}</span>
                </div>
                <span className="flex items-center gap-1 text-xs text-primary font-medium">Read more <ArrowRight className="w-3 h-3" /></span>
              </div>
            </Link>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              <ChevronLeft className="w-4 h-4 mr-1" /> Prev
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${p === page ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
                >{p}</button>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default Blog;
