import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Coordly",
  description:
    "We are committed to protecting your data. Read our Privacy Policy.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20 font-geist-sans">
      {/* Cosmic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[120px] animate-pulse-slow delay-1000" />
      </div>

      <main className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              <span className="text-xs font-medium text-primary uppercase tracking-widest">
                Data Protection
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold font-hacker mb-4 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground font-light">
              Effective Date: February 3, 2026
            </p>
          </div>

          {/* Content Card */}
          <div className="rounded-3xl bg-white/5 dark:bg-black/20 border border-black/5 dark:border-white/10 backdrop-blur-xl p-8 sm:p-12 shadow-2xl">
            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-hacker prose-headings:font-bold prose-p:font-light prose-p:text-muted-foreground prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-foreground">
              <h3>1. Introduction</h3>
              <p>
                Coordly (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;)
                respects your privacy and is committed to protecting it through
                our compliance with this policy. This policy describes the types
                of information we may collect from you or that you may provide
                when you visit the website Coordly.com (our &quot;Website&quot;)
                or use our cloud-based collaboration platform.
              </p>

              <h3>2. Information We Collect</h3>
              <p>
                We collect several types of information from and about users of
                our Website, including information:
              </p>
              <ul>
                <li>
                  <strong>Personal Data:</strong> Name, email address, postal
                  address, phone number, and other identifiers by which you may
                  be contacted online or offline.
                </li>
                <li>
                  <strong>Usage Data:</strong> Information about your internet
                  connection, the equipment you use to access our Services, and
                  usage details.
                </li>
                <li>
                  <strong>Content Data:</strong> Files, documents, chats, and
                  other content you upload or create in workspaces.
                </li>
              </ul>

              <h3>3. How We Use Your Information</h3>
              <p>
                We use information that we collect about you or that you provide
                to us, including any personal information:
              </p>
              <ul>
                <li>To present our Website and its contents to you.</li>
                <li>
                  To provide you with information, products, or services that
                  you request from us.
                </li>
                <li>
                  To fulfill any other purpose for which you provide it (e.g.,
                  authentication).
                </li>
                <li>
                  To notify you about changes to our Website or any products or
                  services we offer or provide though it.
                </li>
              </ul>

              <h3>4. Data Security</h3>
              <p>
                We have implemented measures designed to secure your personal
                information from accidental loss and from unauthorized access,
                use, alteration, and disclosure. All information you provide to
                us is stored on our secure servers behind firewalls. Any payment
                transactions will be encrypted using SSL technology.
              </p>

              <h3>5. Information Sharing</h3>
              <p>
                We do not sell, trade, or otherwise transfer to outside parties
                your Personally Identifiable Information unless we provide users
                with advance notice. This does not include website hosting
                partners and other parties who assist us in operating our
                website, conducting our business, or serving our users, so long
                as those parties agree to keep this information confidential.
              </p>

              <h3>6. Your Data Rights (GDPR & CCPA)</h3>
              <p>
                Depending on your location, you have the right to request access
                to, correction of, or deletion of your personal data. You may
                also have the right to object to or restrict certain processing
                of your data. To exercise these rights, please contact our Data
                Protection Officer.
              </p>

              <h3>7. Changes to Our Privacy Policy</h3>
              <p>
                It is our policy to post any changes we make to our privacy
                policy on this page. If we make material changes to how we treat
                our users&apos; personal information, we will notify you through
                a notice on the Website home page.
              </p>

              <h3>8. Contact Information</h3>
              <p>
                To ask questions or comment about this privacy policy and our
                privacy practices, contact us at:{" "}
                <Link
                  href="/contact"
                  className="no-underline text-primary hover:text-primary/80 transition-colors bg-primary/10 px-2 py-0.5 rounded-md"
                >
                  privacy@coordly
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
