'use client'

import { useState } from 'react'
import { getChatResponse } from './actions'

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hi! I am your HR assistant. Ask me about your tasks or projects.' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    setMessages((msgs) => [...msgs, { role: 'user', content: input }])
    setLoading(true)

    try {
      const response = await getChatResponse(input)
      setMessages((msgs) => [...msgs, { role: 'ai', content: response.content }])
    } catch (error) {
      setMessages((msgs) => [...msgs, { 
        role: 'ai', 
        content: "I apologize, but I encountered an error while processing your request. Please try again."
      }])
    } finally {
      setLoading(false)
      setInput('')
    }
  }

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">AI Chat Assistant</h1>
      <div className="border rounded-md p-4 h-96 overflow-y-auto bg-gray-50 dark:bg-zinc-900 dark:text-white mb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={
              msg.role === 'ai'
                ? 'text-blue-700 dark:text-blue-300 mb-2 text-left'
                : 'text-gray-900 dark:text-gray-100 mb-2 text-right'
            }
          >
            <span
              className={
                'block px-2 py-1 rounded inline-block max-w-[80%]' +
                (msg.role === 'ai'
                  ? ' bg-white dark:bg-zinc-800'
                  : ' bg-white dark:bg-zinc-700')
              }
            >
              {msg.content}
            </span>
          </div>
        ))}
        {loading && <div className="text-blue-400">AI is typing...</div>}
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2 bg-white dark:bg-zinc-800 dark:text-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your tasks or projects..."
        />
        <button
          type="submit"
          className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          Send
        </button>
      </form>
    </div>
  )
} 