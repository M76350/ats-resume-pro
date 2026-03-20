import { useParams, Link, Navigate } from "react-router-dom";
import { getBlogPost, getRelatedPosts } from "@/data/blogPosts";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ArrowLeft, ArrowRight, Upload, User, Calendar } from "lucide-react";

// Minimal markdown-to-JSX renderer (handles ## headings, **bold**, bullet lists)
function renderMarkdown(content: string) {
  const lines = content.trim().split("\n");
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={key++} className="font-display text-2xl font-bold text-foreground mt-8 mb-3">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={key++} className="font-display text-xl font-semibold text-foreground mt-6 mb-2">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      elements.push(
        <li key={key++} className="text-muted-foreground ml-4 mb-1 list-disc">
          <InlineMarkdown text={line.slice(2)} />
        </li>
      );
    } else if (line.startsWith("> ")) {
      elements.push(
        <blockquote key={key++} className="border-l-4 border-primary pl-4 italic text-muted-foreground my-3">
          <InlineMarkdown text={line.slice(2)} />
        </blockquote>
      );
    } else if (line.trim() === "") {
      elements.push(<div key={key++} className="h-2" />);
    } else {
      elements.push(
        <p key={key++} className="text-muted-foreground leading-relaxed mb-2">
          <InlineMarkdown text={line} />
        </p>
      );
    }
  }

  return elements;
}

function InlineMarkdown({ text }: { text: string }) {
  // Handle **bold** and `code`
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return <code key={i} className="bg-muted px-1 py-0.5 rounded text-sm font-mono text-primary">{part.slice(1, -1)}</code>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = getBlogPost(slug || "");

  if (!post) return <Navigate to="/blog" replace />;

  const relatedPosts = getRelatedPosts(post.slug, 3);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title={post.title}
        description={post.description}
        canonical={`/blog/${post.slug}`}
        ogType="article"
        author={post.author}
        publishedDate={post.date}
        keywords={`${post.category}, ATS resume, resume tips, ${post.title.toLowerCase()}`}
      />
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 w-full">
        {/* Back */}
        <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary">{post.category}</Badge>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" /> {post.readTime}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" /> {post.date}
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground mb-4 leading-tight">
            {post.title}
          </h1>
          <p className="text-lg text-muted-foreground mb-4">{post.description}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <User className="w-3.5 h-3.5" />
            <span>By <strong className="text-foreground">{post.author}</strong></span>
          </div>
        </div>

        {/* Content */}
        <article className="prose-custom">
          {renderMarkdown(post.content)}
        </article>

        {/* CTA */}
        <div className="mt-10 p-6 bg-primary/5 border border-primary/20 rounded-xl text-center">
          <h3 className="font-display text-xl font-bold text-foreground mb-2">
            Check Your ATS Score — It's Free
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Upload your resume and get an instant ATS compatibility score with actionable suggestions.
          </p>
          <Button asChild size="lg">
            <Link to="/">
              <Upload className="w-4 h-4 mr-2" /> Check My ATS Score
            </Link>
          </Button>
        </div>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="font-display text-xl font-bold text-foreground mb-4">Related Articles</h2>
            <div className="space-y-3">
              {relatedPosts.map((p) => (
                <Link
                  key={p.slug}
                  to={`/blog/${p.slug}`}
                  className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors group"
                >
                  <div>
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors text-sm">{p.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.readTime} · {p.category}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
