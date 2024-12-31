'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, User, Bot, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { backendUrl } from '@/lib/config'

export default function ChatPage() {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const { user } = useAppStore()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const userMessage = { id: Date.now(), text: newMessage, sender: 'user', timestamp: new Date() }
      setMessages(prevMessages => [...prevMessages, userMessage])
      setNewMessage('')
      setIsTyping(true)

      try {
        const response = await fetch(`${backendUrl}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: newMessage }),
        })
        const data = await response.json()
        setMessages(prevMessages => [...prevMessages, { id: Date.now(), text: data.message, sender: 'bot', timestamp: new Date() }])
      } catch (error) {
        console.error('Error sending message:', error)
        setMessages(prevMessages => [...prevMessages, { id: Date.now(), text: "Sorry, I couldn't process your request. Please try again.", sender: 'bot', timestamp: new Date() }])
      } finally {
        setIsTyping(false)
      }
    }
  }

  if (!user) {
    return null // or a loading spinner
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-green-800 dark:text-green-100">Chat with Study Buddy</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <div className="h-[60vh] overflow-y-auto mb-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${message.sender === 'user' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'} rounded-lg p-3 shadow`}>
                  <div className="flex items-center mb-1">
                    {message.sender === 'user' ? <User size={16} className="mr-2" /> : <Bot size={16} className="mr-2" />}
                    <span className="font-semibold">{message.sender === 'user' ? 'You' : 'Study Buddy'}</span>
                  </div>
                  <p className="text-sm">{message.text}</p>
                  <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <Clock size={12} className="mr-1" />
                    {format(message.timestamp, 'HH:mm')}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-3 shadow">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-grow"
          />
          <Button onClick={handleSendMessage} disabled={isTyping}>
            <Send size={18} className="mr-2" />
            Send
          </Button>
        </div>
      </div>
      <div className="bg-green-100 dark:bg-green-800 rounded-lg p-4 text-sm text-green-800 dark:text-green-100">
        <h2 className="font-semibold mb-2">Chat Tips:</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Ask questions about your study materials</li>
          <li>Request explanations for complex topics</li>
          <li>Get help with problem-solving</li>
          <li>Discuss study strategies and techniques</li>
        </ul>
      </div>
    </div>
  )
}

