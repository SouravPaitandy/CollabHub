import { Button } from "@/components/common/Button";

export default function FeatureCTA() {
  return (
    <section className="pt-20 bg-indigo-600 dark:bg-indigo-800">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to Transform Your Team&apos;s Collaboration?
        </h2>
        <p className="text-xl text-indigo-100 mb-8">
          Join thousands of teams already using Coordly to boost their
          productivity.
        </p>
        <Button
          href="/auth"
          className="bg-white text-indigo-600 hover:bg-indigo-50"
        >
          Get Started for Free
        </Button>
      </div>
      <hr className="my-8 border-t border-indigo-300 opacity-20" />

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Coordly. All rights reserved.
        </p>
        <p className="text-5xl font-extrabold mt-2 opacity-40">
          <span className="text-gray-600 dark:text-gray-400">
            Made with ❤️ by the Coordly Team
          </span>
        </p>
      </footer>
    </section>
  );
}
