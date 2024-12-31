import { CheckCircle } from 'lucide-react'

export default function FeaturesPage() {
  const features = [
    "AI-powered study assistant",
    "Subject organization and management",
    "Collaborative study groups",
    "Progress tracking and analytics",
    "Customizable study schedules",
    "Resource sharing and curation",
    "Mobile-friendly interface",
    "Dark mode for comfortable studying",
  ]

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-green-800 dark:text-green-100">Features</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          Study Buddy offers a comprehensive set of features designed to enhance your learning experience:
        </p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-gray-700 dark:text-gray-300">
              <CheckCircle className="text-green-500 mr-2" size={20} />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

