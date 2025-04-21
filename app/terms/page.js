import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">
          Terms of Service
        </h1>
        <div className="prose prose-indigo dark:prose-invert mx-auto">
          <p>Last updated: 15th August, 2024</p>
          
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing or using CollabHub&apos;s services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our services.</p>

          <h2>2. Description of Service</h2>
          <p>CollabHub provides a collaboration platform that includes features such as real-time chat, video conferencing, and interactive whiteboards. We reserve the right to modify, suspend, or discontinue any part of the service at any time.</p>

          <h2>3. User Accounts</h2>
          <p>You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.</p>

          <h2>4. User Conduct</h2>
          <p>You agree not to use the service for any unlawful purpose or in any way that interrupts, damages, or impairs the service. You may not use the service to transmit any viruses, malware, or other malicious code.</p>

          <h2>5. Intellectual Property</h2>
          <p>The service and its original content, features, and functionality are owned by CollabHub and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.</p>

          <h2>6. Termination</h2>
          <p>We may terminate or suspend your account and access to the service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>

          <h2>7. Limitation of Liability</h2>
          <p>In no event shall CollabHub, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.</p>

          <h2>8. Changes to Terms</h2>
          <p>We reserve the right to modify or replace these Terms at any time. It is your responsibility to check the Terms periodically for changes.</p>

          <h2>9. Contact Us</h2>
          <p>If you have any questions about these Terms, please <Link href="/contact" className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">contact us</Link>.</p>
        </div>
      </div>
      
      {/* Footer */}
      <hr className="my-8 border-t border-indigo-300 opacity-20" />
      <footer className="py-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          &copy; {new Date().getFullYear()} CollabHub. All rights reserved.
        </p>
        <p className="text-5xl font-extrabold mt-2 opacity-40">
          <span className="text-gray-600 dark:text-gray-400">Made with ❤️ by the CollabHub Team</span>
        </p>
      </footer>
    </div>
  );
}