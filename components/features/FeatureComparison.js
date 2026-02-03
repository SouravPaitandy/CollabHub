import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";

const features = [
  "Real-time Chat",
  "Video Conferencing",
  "Interactive Whiteboard",
  "Time Tracking",
  "Secure File Sharing",
  "Analytics Dashboard",
  "Unlimited Projects",
  "24/7 Support",
];

export default function FeatureComparison() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="bg-white/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl">
        <div className="p-8 text-center border-b border-black/10 dark:border-white/10">
          <h2 className="text-3xl font-bold font-hacker text-foreground mb-4">
            How We Compare
          </h2>
          <p className="text-muted-foreground font-geist-sans">
            See why teams choose Coordly over the rest.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary/5">
                <th className="py-6 px-8 font-bold font-hacker text-foreground uppercase tracking-wider text-sm">
                  Feature
                </th>
                <th className="py-6 px-8 font-bold font-hacker text-primary uppercase tracking-wider text-sm text-center">
                  Coordly
                </th>
                <th className="py-6 px-8 font-bold font-hacker text-muted-foreground uppercase tracking-wider text-sm text-center">
                  Competitors
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {features.map((feature, index) => (
                <tr key={index} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-8 text-foreground font-medium font-geist-sans">
                    {feature}
                  </td>
                  <td className="py-4 px-8 text-center">
                    <div className="flex justify-center">
                      <CheckIcon className="w-6 h-6 text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                    </div>
                  </td>
                  <td className="py-4 px-8 text-center">
                    <div className="flex justify-center">
                      {index < 5 ? (
                        <CheckIcon className="w-5 h-5 text-muted-foreground/50" />
                      ) : (
                        <XMarkIcon className="w-5 h-5 text-red-500/70" />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
