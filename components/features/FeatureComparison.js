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
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          How We Compare
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="py-4 px-6 font-semibold text-gray-900 dark:text-white">
                  Feature
                </th>
                <th className="py-4 px-6 font-semibold text-gray-900 dark:text-white">
                  Coordly
                </th>
                <th className="py-4 px-6 font-semibold text-gray-900 dark:text-white">
                  Competitors
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr
                  key={index}
                  className={
                    index % 2 === 0
                      ? "bg-white dark:bg-gray-800"
                      : "bg-gray-50 dark:bg-gray-700"
                  }
                >
                  <td className="py-4 px-6 text-gray-900 dark:text-white">
                    {feature}
                  </td>
                  <td className="py-4 px-6">
                    <CheckIcon className="w-6 h-6 text-green-500" />
                  </td>
                  <td className="py-4 px-6">
                    {index < 5 ? (
                      <CheckIcon className="w-6 h-6 text-green-500" />
                    ) : (
                      <XMarkIcon className="w-6 h-6 text-red-500" />
                    )}
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
