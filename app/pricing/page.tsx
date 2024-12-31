import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

export default function PricingPage() {
  const plans = [
    {
      name: "Basic",
      price: "Free",
      features: [
        "Access to AI study assistant",
        "Basic subject organization",
        "Limited chat interactions",
      ],
      cta: "Get Started",
    },
    {
      name: "Pro",
      price: "$9.99/month",
      features: [
        "Unlimited AI assistant usage",
        "Advanced subject management",
        "Collaborative study groups",
        "Progress analytics",
      ],
      cta: "Upgrade to Pro",
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: [
        "All Pro features",
        "Dedicated support",
        "Custom integrations",
        "Team management",
      ],
      cta: "Contact Sales",
    },
  ]

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-800 dark:text-green-100">Pricing Plans</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col">
            <h2 className="text-2xl font-semibold mb-4 text-green-700 dark:text-green-200">{plan.name}</h2>
            <p className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">{plan.price}</p>
            <ul className="mb-6 flex-grow">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center mb-2 text-gray-700 dark:text-gray-300">
                  <Check className="text-green-500 mr-2" size={20} />
                  {feature}
                </li>
              ))}
            </ul>
            <Button className="w-full">{plan.cta}</Button>
          </div>
        ))}
      </div>
    </div>
  )
}

