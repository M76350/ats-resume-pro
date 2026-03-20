import SEO from "@/components/SEO";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-7">
    <h2 className="font-display text-xl font-bold text-foreground mb-2">{title}</h2>
    <div className="text-muted-foreground text-sm leading-relaxed space-y-2">{children}</div>
  </div>
);

const TermsAndConditions = () => (
  <>
    <SEO
      title="Terms and Conditions | FreeATS"
      description="Read the FreeATS Terms and Conditions. By using our free ATS resume checker and builder, you agree to these terms."
      canonical="/terms-and-conditions"
    />

    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 w-full">
      <h1 className="font-display text-4xl font-extrabold text-foreground mb-2">Terms and Conditions</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: March 20, 2026</p>

      <Section title="1. Acceptance of Terms">
        <p>By accessing and using FreeATS (freeats.vercel.app), you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our service.</p>
      </Section>

      <Section title="2. Description of Service">
        <p>FreeATS provides a free online ATS resume checker and resume builder tool. The service analyzes resume content and provides scoring and suggestions based on common ATS criteria. The service is provided "as is" without any guarantees of employment outcomes.</p>
      </Section>

      <Section title="3. Use of Service">
        <p>You agree to use FreeATS only for lawful purposes. You must not:</p>
        <ul className="list-disc ml-5 space-y-1">
          <li>Use the service to upload malicious files or content</li>
          <li>Attempt to reverse engineer or scrape the service</li>
          <li>Use automated bots to access the service</li>
          <li>Violate any applicable laws or regulations</li>
        </ul>
      </Section>

      <Section title="4. Intellectual Property">
        <p>All content on FreeATS, including text, graphics, logos, and software, is the property of FreeATS and is protected by applicable intellectual property laws. You may not reproduce or distribute any content without our written permission.</p>
      </Section>

      <Section title="5. User Content">
        <p>Resume data you upload is processed entirely in your browser and is not stored on our servers. You retain full ownership of your resume content. By using our service, you grant us no rights to your resume data.</p>
      </Section>

      <Section title="6. Disclaimer of Warranties">
        <p>FreeATS is provided on an "as is" and "as available" basis. We make no warranties, express or implied, regarding the accuracy, reliability, or suitability of the ATS scoring for any particular job application or employer's ATS system.</p>
      </Section>

      <Section title="7. Limitation of Liability">
        <p>To the fullest extent permitted by law, FreeATS shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service, including but not limited to loss of employment opportunities.</p>
      </Section>

      <Section title="8. Third-Party Links">
        <p>Our website may contain links to third-party websites. We are not responsible for the content or privacy practices of those sites.</p>
      </Section>

      <Section title="9. Advertising">
        <p>FreeATS may display advertisements through Google AdSense. We are not responsible for the content of third-party advertisements.</p>
      </Section>

      <Section title="10. Changes to Terms">
        <p>We reserve the right to modify these Terms at any time. Continued use of the service after changes constitutes acceptance of the new Terms.</p>
      </Section>

      <Section title="11. Governing Law">
        <p>These Terms shall be governed by and construed in accordance with applicable laws. Any disputes shall be resolved through good-faith negotiation.</p>
      </Section>

      <Section title="12. Contact">
        <p>For questions about these Terms, contact us at support@freeats.vercel.app.</p>
      </Section>
    </main>
  </>
);

export default TermsAndConditions;
