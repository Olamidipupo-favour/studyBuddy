"use client"

import { useState, useRef, useEffect } from "react"
import { 
  MessageCircle, 
  Minimize2, 
  Maximize2, 
  Send, 
  Paperclip, 
  Mic,
  ChevronDown,
  File,
  Image,
  FileText,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useSession } from "next-auth/react"
import { useAuthStore } from "@/lib/auth-store"
import { cn } from "@/lib/utils"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Message = {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
  attachment?: {
    type: string
    url: string
    name: string
  }
}

const ALLOWED_ATTACHMENTS = [
  { type: 'image/*', icon: Image, label: 'Image' },
  { type: 'application/pdf', icon: FileText, label: 'PDF' },
  { type: 'text/*', icon: File, label: 'Document' },
]

export function FAB() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! How can I help you with your studies today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ])
  const [isRecording, setIsRecording] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const { data: session } = useSession()
  const accessToken = useAuthStore((state) => state.accessToken)

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    
    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, newMessage])
    setMessage("")

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm processing your message...",
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1000)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Handle file upload logic here
    const newMessage: Message = {
      id: Date.now().toString(),
      content: "Sent an attachment",
      sender: 'user',
      timestamp: new Date(),
      attachment: {
        type: file.type,
        url: URL.createObjectURL(file),
        name: file.name
      }
    }
    
    setMessages(prev => [...prev, newMessage])
  }

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording)
    // Handle voice recording logic
  }

  const toggleChat = () => {
    if (isMinimized) {
      setIsMinimized(false)
    } else {
      setIsOpen(!isOpen)
    }
  }

  const handleMinimize = () => {
    setIsMinimized(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  // Don't render anything if not authenticated
  if (!session?.user || !accessToken) {
    return null
  }

  return (
    <>
      {/* Full screen chat overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-background transition-transform duration-300 flex flex-col",
          !isOpen && "translate-y-full",
          isMinimized && !isDrawerOpen && "translate-y-[calc(100%-64px)]",
          isMinimized && "pointer-events-none"
        )}
        style={{ zIndex: isDrawerOpen ? 200 : 100 }}
      >
        {/* Chat header */}
        <div className={cn(
          "h-16 border-b flex items-center justify-between px-4 bg-indigo-600 text-white",
          isMinimized && "pointer-events-auto"
        )}>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Study Buddy AI</h2>
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white hover:bg-indigo-700">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="z-[200]">
                <DrawerHeader>
                  <DrawerTitle>Chat Settings</DrawerTitle>
                </DrawerHeader>
                <div className="p-4">
                  <p>Settings content goes here...</p>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-indigo-700"
            onClick={isMinimized ? () => setIsMinimized(false) : handleMinimize}
          >
            {isMinimized ? <Maximize2 className="h-5 w-5" /> : <Minimize2 className="h-5 w-5" />}
          </Button>
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-100 dark:bg-gray-900">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex items-start",
                  msg.sender === 'user' && "justify-end"
                )}
              >
                <div
                  className={cn(
                    "rounded-lg p-3 max-w-[80%] shadow",
                    msg.sender === 'user' 
                      ? "bg-indigo-600 text-white" 
                      : "bg-white dark:bg-gray-800"
                  )}
                >
                  <p className="text-sm">{msg.content}</p>
                  {msg.attachment && (
                    <div className="mt-2 p-2 bg-black/10 rounded">
                      <a 
                        href={msg.attachment.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs flex items-center gap-1 hover:underline"
                      >
                        <Paperclip className="h-3 w-3" />
                        {msg.attachment.name}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message input */}
        <div className="p-4 border-t bg-background">
          <form 
            className="flex items-end gap-2"
            onSubmit={handleSubmit}
          >
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="icon"
                    className="h-11 w-11"
                  >
                    <Paperclip className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="z-[150]">
                  {ALLOWED_ATTACHMENTS.map((type) => (
                    <DropdownMenuItem
                      key={type.type}
                      onSelect={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2"
                    >
                      <type.icon className="h-4 w-4" />
                      <span>{type.label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-11 w-11 opacity-50 cursor-not-allowed"
                disabled
              >
                <Mic className="h-5 w-5" />
              </Button>
            </div>
            
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message... (Shift + Enter for new line)"
              className="flex-1 min-h-[44px] max-h-[200px] resize-none"
              rows={1}
            />
            <Button 
              type="submit" 
              size="icon" 
              className="bg-indigo-600 hover:bg-indigo-700 h-11 w-11 shrink-0"
              disabled={!message.trim() && !isRecording}
            >
              <Send className="h-4 w-4 text-white" />
            </Button>
          </form>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept={ALLOWED_ATTACHMENTS.map(t => t.type).join(",")}
            onChange={handleFileUpload}
          />
        </div>
      </div>

      {/* FAB button */}
      <div 
        className="fixed bottom-6 right-6"
        style={{ zIndex: isMinimized ? 150 : 50 }}
      >
        <Button
          variant="default"
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg bg-indigo-600 hover:bg-indigo-700 transition-all"
          onClick={toggleChat}
        >
          <MessageCircle className="h-6 w-6 text-white" />
          <span className="sr-only">Open chat</span>
        </Button>
      </div>
    </>
  )
} 