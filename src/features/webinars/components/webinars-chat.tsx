import { useState } from 'react'
import { format } from 'date-fns'
import { Send, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Message = {
  id: number
  user: string
  text: string
  createdAt: Date
  isMine: boolean
}

export function WebinarChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      user: 'Иван Иванов',
      text: 'Добрый день!',
      createdAt: new Date(),
      isMine: false,
    },
    {
      id: 2,
      user: 'Вы',
      text: 'Здравствуйте 👋',
      createdAt: new Date(),
      isMine: true,
    },
  ])

  const [input, setInput] = useState('')

  const sendMessage = () => {
    if (!input.trim()) return

    const newMessage: Message = {
      id: Date.now(),
      user: 'Вы',
      text: input,
      createdAt: new Date(),
      isMine: true,
    }

    setMessages((prev) => [...prev, newMessage])
    setInput('')
  }

  return (
    <div className='flex h-full flex-col rounded-2xl border border-slate-200 bg-white shadow-sm'>
      {/* Header */}
      <div className='flex items-center gap-2 border-b border-slate-100 px-4 py-3'>
        <MessageCircle size={18} />
        <span className='font-medium'>Чат</span>
      </div>

      {/* Messages */}
      <div className='flex-1 space-y-4 overflow-y-auto px-4 py-4'>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}
          >
            <div className='flex max-w-[75%] gap-2'>
              {!msg.isMine && (
                <div className='flex size-8 items-center justify-center rounded-full bg-slate-200 text-xs font-medium'>
                  {msg.user.charAt(0)}
                </div>
              )}

              <div
                className={`rounded-2xl px-4 py-2 text-sm ${
                  msg.isMine
                    ? 'rounded-br-sm bg-primary text-white'
                    : 'rounded-bl-sm bg-slate-100 text-slate-800'
                } `}
              >
                <div>{msg.text}</div>
                <div className='mt-1 text-[10px] opacity-70'>
                  {format(msg.createdAt, 'HH:mm')}
                </div>
              </div>

              {msg.isMine && (
                <div className='flex size-8 items-center justify-center rounded-full bg-primary/20 text-xs font-medium'>
                  В
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className='flex gap-2 border-t border-slate-100 p-3'>
        <Input
          placeholder='Введите сообщение...'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <Button onClick={sendMessage}>
          <Send size={16} />
        </Button>
      </div>
    </div>
  )
}
