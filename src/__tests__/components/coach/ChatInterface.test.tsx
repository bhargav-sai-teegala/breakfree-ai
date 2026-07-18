import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ChatInterface } from '@/components/coach/ChatInterface'
import { ReactNode } from 'react'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children: ReactNode; [key: string]: unknown }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: ReactNode }) => <>{children}</>,
}))

// Mock MessageBubble to simplify DOM
vi.mock('./MessageBubble', () => ({
  MessageBubble: ({ message }: { message: { content: string } }) => <div data-testid="msg-bubble">{message.content}</div>,
}))

beforeEach(() => {
  window.HTMLElement.prototype.scrollIntoView = vi.fn()
})

describe('ChatInterface', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
  })

  it('renders initial welcome message if no initial messages', () => {
    render(<ChatInterface initialMessages={[]} habitId={null} />)
    expect(screen.getByText(/Hi! I'm your BreakFree AI coach/i)).toBeInTheDocument()
  })

  it('renders provided initial messages', () => {
    render(<ChatInterface initialMessages={[
      { id: '1', role: 'user', content: 'Hello', user_id: '', habit_id: null, type: 'chat', created_at: '' },
      { id: '2', role: 'model', content: 'Hi there', user_id: '', habit_id: null, type: 'chat', created_at: '' }
    ]} habitId={null} />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
    expect(screen.getByText('Hi there')).toBeInTheDocument()
  })

  it('handles sending a message and streaming response', async () => {
    // Mock the fetch to return a streaming response
    const mockEncoder = new TextEncoder()
    const mockStream = new ReadableStream({
      start(controller) {
        controller.enqueue(mockEncoder.encode('data: {"text":"I hear you"}\n'))
        controller.enqueue(mockEncoder.encode('data: [DONE]\n'))
        controller.close()
      }
    })

    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      body: mockStream
    })

    render(<ChatInterface initialMessages={[]} habitId={null} />)
    
    // Type in input and send
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'I feel stressed' } })
    
    const sendButton = screen.getByRole('button', { name: /send/i })
    fireEvent.click(sendButton)

    // User message should appear immediately
    expect(screen.getByText('I feel stressed')).toBeInTheDocument()

    // AI message should stream in
    await waitFor(() => {
      expect(screen.getByText('I hear you')).toBeInTheDocument()
    })
  })

  it('handles network error gracefully', async () => {
    ;(global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Network error'))

    render(<ChatInterface initialMessages={[]} habitId={null} />)
    
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'Test error' } })
    fireEvent.click(screen.getByRole('button', { name: /send/i }))

    await waitFor(() => {
      expect(screen.getByText(/I had trouble connecting/i)).toBeInTheDocument()
    })
  })
})
