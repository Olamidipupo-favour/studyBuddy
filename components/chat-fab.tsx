'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MessageCircle, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ChatFAB() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <motion.div
        className="fixed bottom-4 right-4 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          size="lg"
          className="rounded-full w-16 h-16"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </Button>
      </motion.div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-4 w-80 h-96 bg-white dark:bg-green-800 rounded-lg shadow-lg z-40 overflow-hidden"
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
          >
            <div className="h-full flex flex-col">
              <div className="bg-green-100 dark:bg-green-700 p-4">
                <h2 className="text-lg font-semibold text-green-800 dark:text-green-100">Chat</h2>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {/* Chat messages will go here */}
              </div>
              <div className="p-4 border-t border-green-200 dark:border-green-600">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="w-full px-3 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-green-700 dark:text-green-100"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

