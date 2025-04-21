// components/Footer.js
"use client"
import Link from 'next/link';
import { useState } from 'react';

const FooterLink = ({ href, children }) => (
  <Link href={href} className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-300 transition-colors">
    {children}
  </Link>
);

const SocialIcon = ({ href, icon }) => (
  <Link href={href} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-300 transition-colors">
    {icon}
  </Link>
);

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <footer className="bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-200 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-indigo-600 dark:text-indigo-400">About CollabHub</h3>
            <p className="text-gray-600 dark:text-gray-400">Empowering teams to collaborate seamlessly and efficiently.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-indigo-600 dark:text-indigo-400">Quick Links</h3>
            <ul className="space-y-2">
              <li><FooterLink href="/about">About Us</FooterLink></li>
              <li><FooterLink href="/features">Features</FooterLink></li>
              <li><FooterLink href="/pricing">Pricing</FooterLink></li>
              <li><FooterLink href="/contact">Contact</FooterLink></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-indigo-600 dark:text-indigo-400">Legal</h3>
            <ul className="space-y-2">
              <li><FooterLink href="/terms">Terms of Service</FooterLink></li>
              <li><FooterLink href="/privacy">Privacy Policy</FooterLink></li>
              <li><FooterLink href="/cookies">Cookie Policy</FooterLink></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-indigo-600 dark:text-indigo-400">Stay Updated</h3>
            <form onSubmit={handleSubmit} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-gray-800 dark:text-gray-200 shadow-sm"
                required
              />
              <button
                type="submit"
                className="w-full px-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-md transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                Subscribe to Newsletter
              </button>
            </form>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400">&copy; 2024 CollabHub. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <SocialIcon href="https://twitter.com" icon={<TwitterIcon />} />
            <SocialIcon href="https://facebook.com" icon={<FacebookIcon />} />
            <SocialIcon href="https://linkedin.com" icon={<LinkedInIcon />} />
            <SocialIcon href="https://github.com" icon={<GitHubIcon />} />
          </div>
        </div>
      </div>
    </footer>
  );
}

// Simple icon components (you might want to use an icon library instead)
const TwitterIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>
);

const FacebookIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path></svg>
);

const LinkedInIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"></path></svg>
);

const GitHubIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path></svg>
);