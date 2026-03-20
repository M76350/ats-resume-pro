import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-7">
    <h2 className="font-display text-xl font-bold text-foreground mb-2">{title}</h2>
    <div className="text-muted-foreground text-sm leading-relaxed space-y-2">{children}</div>
  </div>
);

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-background flex flex-col">
    <SEO
      title="Privacy Policy | FreeATS"
      description="Read the FreeATS Privacy Policy to understand how we handle your data. We do not store or share your resume data."
      canonical="/privacy-policy"
    />
    <Header />

    <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 w-full">
      <h1 className="font-display text-4xl font-extrabold text-foreground mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: March 20, 2026</p>

      <Section title="1. Introduction">
        <p>Welcome to FreeATS ("we," "our," or "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website at freeats.vercel.app.</p>
      </Section>

      <Section title="2. Information We Collect">
        <p><strong className="text-foreground">Resume Data:</strong> When you upload a resume or use our builder, all processing happens entirely in your browser. We do not transmit, store, or have access to your resume content on our servers.</p>
        <p><strong className="text-foreground">Usage Data:</strong> We use Vercel Analytics to collect anonymous usage statistics such as page views, device type, and general location (country level). This data does not identify you personally.</p>
        <p><strong className="text-foreground">Contact Form:</strong> If you contact us, we collect your name and email address solely to respond to your inquiry.</p>
      </Section>

      <Section title="3. Cookies">
        <p>We use minimal cookies necessary for the website to function. We do not use tracking cookies or advertising cookies beyond what is required by our analytics provider.</p>
      </Section>

      <Section title="4. Google AdSense">
        <p>We may display advertisements served by Google AdSense. Google may use cookies to serve ads based on your prior visits to our website or other websites. You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-primary underline" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.</p>
      </Section>

      <Section title="5. Third-Party Services">
        <p>We use the following third-party services:</p>
        <ul className="list-disc ml-5 space-y-1">
          <li>Vercel — website hosting and analytics</li>
          <li>Google AdSense — advertising</li>
          <li>Google Analytics (if enabled) — usage analytics</li>
        </ul>
        <p>Each of these services has its own privacy policy governing their data practices.</p>
      </Section>

      <Section title="6. Data Retention">
        <p>We do not store your resume data. Contact form submissions are retained only as long as necessary to respond to your inquiry.</p>
      </Section>

      <Section title="7. Your Rights">
        <p>You have the right to access, correct, or delete any personal data we hold about you. To exercise these rights, contact us at support@freeats.vercel.app.</p>
      </Section>

      <Section title="8. Children's Privacy">
        <p>Our service is not directed to children under 13. We do not knowingly collect personal information from children under 13.</p>
      </Section>

      <Section title="9. Changes to This Policy">
        <p>We may update this Privacy Policy from time to time. We will notify you of any changes by updating the "Last updated" date at the top of this page.</p>
      </Section>

      <Section title="10. Contact Us">
        <p>If you have questions about this Privacy Policy, please contact us at support@freeats.vercel.app.</p>
      </Section>
    </main>

    <Footer />
  </div>
);

export default PrivacyPolicy;
