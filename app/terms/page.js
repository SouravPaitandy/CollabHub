import Link from "next/link";

export const metadata = {
  title: "Terms of Service | Coordly",
  description: "Read the Terms of Service for using the Coordly platform.",
};

export default function TermsOfServicePage() {
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
                Legal Documentation
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold font-hacker mb-4 tracking-tight">
              Terms of Service
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
                Welcome to Coordly (&quot;Company&quot;, &quot;we&quot;,
                &quot;our&quot;, &quot;us&quot;). By accessing or using our
                websites, mobile applications, or other products or services
                (collectively, the &quot;Services&quot;), you agree to be bound
                by these Terms of Service. If you do not agree to these terms,
                including the mandatory arbitration provision and class action
                waiver in Section 15, you may not use our Services.
              </p>

              <h3>2. Account Registration</h3>
              <p>
                To use certain features of the Service, you may be required to
                register for an account. You agree to provide accurate, current,
                and complete information during the registration process and to
                update such information to keep it accurate, current, and
                complete. You are responsible for safeguarding your password and
                for all activities that occur under your account.
              </p>

              <h3>3. Use of Services</h3>
              <p>
                You agree to use the Services only for lawful purposes such as
                team collaboration, project management, and communication. You
                agree not to engage in any prohibited activities, including but
                not limited to: imitating or impersonating others, distributing
                malware, or violating intellectual property rights.
              </p>

              <h3>4. User Content</h3>
              <p>
                Our Services allow you to post, link, store, share and otherwise
                make available certain information, text, graphics, videos, or
                other material (&quot;User Content&quot;). You retain ownership
                of any intellectual property rights that you hold in that User
                Content. By posting User Content using our Services, you grant
                us the right and license to use, modify, publicly perform,
                publicly display, reproduce, and distribute such User Content on
                and through the Services solely for the purpose of operating and
                providing the Services to you.
              </p>

              <h3>5. Intellectual Property</h3>
              <p>
                The Service and its original content (excluding User Content),
                features, and functionality are and will remain the exclusive
                property of Coordly Inc. and its licensors. The Service is
                protected by copyright, trademark, and other laws of both the
                United States and foreign countries.
              </p>

              <h3>6. Termination</h3>
              <p>
                We may terminate or suspend your account and bar access to the
                Service immediately, without prior notice or liability, under
                our sole discretion, for any reason whatsoever and without
                limitation, including but not limited to a breach of the Terms.
              </p>

              <h3>7. Limitation of Liability</h3>
              <p>
                To the maximum extent permitted by law, in no event shall
                Coordly Inc., nor its directors, employees, partners, agents,
                suppliers, or affiliates, be liable for any indirect,
                incidental, special, consequential or punitive damages,
                including without limitation, loss of profits, data, use,
                goodwill, or other intangible losses, resulting from (i) your
                access to or use of or inability to access or use the Service;
                (ii) any conduct or content of any third party on the Service.
              </p>

              <h3>8. Governing Law</h3>
              <p>
                These Terms shall be governed and construed in accordance with
                the laws of the State of Delaware, United States, without regard
                to its conflict of law provisions.
              </p>

              <h3>9. Contact Us</h3>
              <p>
                If you have any questions about these Terms, please contact our
                legal team at{" "}
                <Link
                  href="/contact"
                  className="no-underline text-primary hover:text-primary/80 transition-colors bg-primary/10 px-2 py-0.5 rounded-md"
                >
                  legal@coordly
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
