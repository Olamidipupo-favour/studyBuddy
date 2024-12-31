import { NextResponse } from 'next/server'

const quotes = [
  {
    id: 1,
    text: "Education is not preparation for life; education is life itself.",
    author: "John Dewey"
  },
  {
    id: 2,
    text: "The beautiful thing about learning is that no one can take it away from you.",
    author: "B.B. King"
  },
  {
    id: 3,
    text: "Knowledge is power.",
    author: "Francis Bacon"
  },
  {
    id: 4,
    text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
    author: "Dr. Seuss"
  },
  {
    id: 5,
    text: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
    author: "Mahatma Gandhi"
  }
]

export async function GET() {
  // Randomly select a quote
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
  return NextResponse.json(randomQuote)
} 