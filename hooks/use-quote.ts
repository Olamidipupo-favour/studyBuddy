import { useState, useEffect } from 'react'

type Quote = {
  id: number
  text: string
  author: string
}

export function useQuote() {
  const [quote, setQuote] = useState<Quote | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchQuote = async () => {
    try {
      const response = await fetch('/api/quotes')
      const data = await response.json()
      setQuote(data)
    } catch (error) {
      console.error('Error fetching quote:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchQuote()
    const interval = setInterval(fetchQuote, 10000)
    return () => clearInterval(interval)
  }, [])

  return { quote, isLoading }
} 