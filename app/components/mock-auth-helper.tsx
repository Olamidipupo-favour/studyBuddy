"use client"

export function MockAuthHelper() {
  if (process.env.NEXT_PUBLIC_USE_MOCK_AUTH !== 'true') {
    return null
  }

  return (
    <div className="fixed top-4 left-4 p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg shadow-lg text-sm">
      <h3 className="font-bold mb-2">Mock Credentials:</h3>
      <ul className="space-y-1">
        <li>Student: student@student.edu / password123</li>
        <li>Teacher: teacher@teacher.edu / password123</li>
        <li>Admin: admin@admin.edu / password123</li>
      </ul>
    </div>
  )
} 