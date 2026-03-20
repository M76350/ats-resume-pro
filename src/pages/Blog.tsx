import { Link } from "react-router-dom";
import { blogPosts } from "@/data/blogPosts";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight } from "lucide-react";

const Blog = () => (
  <div className="min-h-screen bg-background flex flex-col">
    <SEO
      title="ATS Resume Blog — Tips, Guides & Career Advice | FreeATS"
      description="Read expert guides on ATS resumes, resume writing tips, job search strategies, and career advice. Free resources to help you land more interviews."
      canonical="/blog"
    />
    <Header />

    <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-12 w-full">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-extrabold text-foreground mb-3">
          ATS Resume Blog
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Expert guides on resume writing, ATS optimization, and job search strategies to help you land more interviews.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogPosts.map((post) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className="group bg-card border border-border rounded-xl p-6 hover:border-primary/50 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary" className="text-xs">{post.category}</Badge>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" /> {post.readTime}
              </span>
            </div>
            <h2 className="font-display text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
              {post.title}
            </h2>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{post.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{post.date}</span>
              <span className="flex items-center gap-1 text-xs text-primary font-medium">
                Read more <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>

    <Footer />
  </div>
);

export default Blog;
