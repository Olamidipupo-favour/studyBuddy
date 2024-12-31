import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-green-800 dark:text-green-100">About Study Buddy</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Study Buddy is an innovative learning platform designed to help students maximize their study potential. Our mission is to make learning more efficient, engaging, and accessible for everyone.
        </p>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Founded in 2023, Study Buddy combines cutting-edge technology with proven learning techniques to create a unique study experience. Our AI-powered assistant and collaborative features are designed to support students in their academic journey.
        </p>
        <h2 className="text-2xl font-semibold mb-4 text-green-700 dark:text-green-200">Our Values</h2>
        <ul className="list-disc list-inside mb-4 text-gray-700 dark:text-gray-300">
          <li>Innovation in Education</li>
          <li>Accessibility for All Learners</li>
          <li>Continuous Improvement</li>
          <li>Community and Collaboration</li>
        </ul>
        <Button asChild>
          <Link href="/contact">Get in Touch</Link>
        </Button>
      </div>
    </div>
  )
}

