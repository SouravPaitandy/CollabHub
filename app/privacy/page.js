import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">
          Privacy Policy
        </h1>
        <div className="prose prose-indigo dark:prose-invert mx-auto">
          <p>Last updated: 15th August, 2024</p>
          
          <h2>1. Introduction</h2>
          <p>CollabHub (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our collaboration platform.</p>

          <h2>2. Information We Collect</h2>
          <p>We collect information that you provide directly to us, such as when you create an account, use our services, or contact us for support. This may include:</p>
          <ul>
            <li>Name and contact information</li>
            <li>Account credentials</li>
            <li>Profile information</li>
            <li>Content you create, upload, or share on our platform</li>
            <li>Communications with us or other users through our platform</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Send you technical notices, updates, security alerts, and support messages</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
          </ul>

          <h2>4. Information Sharing and Disclosure</h2>
          <p>We may share your information in the following situations:</p>
          <ul>
            <li>With your consent</li>
            <li>With other users as part of the collaboration features of our platform</li>
            <li>With service providers, partners, or contractors who perform services on our behalf</li>
            <li>In response to a request for information if we believe disclosure is in accordance with, or required by, any applicable law or legal process</li>
          </ul>

          <h2>5. Data Security</h2>
          <p>We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction.</p>

          <h2>6. Your Rights</h2>
          <p>Depending on your location, you may have certain rights regarding your personal information, such as the right to access, correct, or delete your data. To exercise these rights, please contact us using the information provided below.</p>

          <h2>7. Changes to This Privacy Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.</p>

          <h2>8. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please <Link href="/contact" className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">contact us</Link>.</p>
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