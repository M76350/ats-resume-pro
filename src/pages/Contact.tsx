import { useState } from "react";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, CheckCircle2 } from "lucide-react";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, connect to a form service (Formspree, EmailJS, etc.)
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title="Contact FreeATS — Get in Touch"
        description="Have a question, feedback, or partnership inquiry? Contact the FreeATS team. We'd love to hear from you."
        canonical="/contact"
      />
      <Header />

      <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 py-12 w-full">
        <h1 className="font-display text-4xl font-extrabold text-foreground mb-3">Contact Us</h1>
        <p className="text-muted-foreground mb-8">
          Have a question, feedback, or partnership inquiry? We'd love to hear from you.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-card border border-border rounded-xl p-4 flex items-start gap-3">
            <Mail className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-foreground text-sm">Email</p>
              <p className="text-sm text-muted-foreground">support@freeats.vercel.app</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 flex items-start gap-3">
            <MessageSquare className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-foreground text-sm">Response Time</p>
              <p className="text-sm text-muted-foreground">Within 24–48 hours</p>
            </div>
          </div>
        </div>

        {submitted ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h2 className="font-display text-xl font-bold text-foreground mb-2">Message Sent!</h2>
            <p className="text-muted-foreground text-sm">Thanks for reaching out. We'll get back to you within 24–48 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="What's this about?"
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Tell us more..."
                rows={5}
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full" size="lg">Send Message</Button>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
