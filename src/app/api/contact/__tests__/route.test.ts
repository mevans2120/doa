import { NextRequest } from 'next/server'
import { POST } from '../route'
import { Resend } from 'resend'

// Mock Resend
jest.mock('resend', () => {
  return {
    Resend: jest.fn().mockImplementation(() => ({
      emails: {
        send: jest.fn(),
      },
    })),
  }
})

// Mock Sanity client
jest.mock('../../../../../sanity/lib/client', () => ({
  client: {
    fetch: jest.fn(),
  },
}))

// Mock React Email render
jest.mock('@react-email/render', () => ({
  render: jest.fn().mockResolvedValue('<html>Test Email</html>'),
}))

describe('/api/contact', () => {
  let mockResendSend: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    process.env.RESEND_API_KEY = 're_test_key_123'
    process.env.RESEND_FROM_EMAIL = 'contact@departmentofart.com'
    process.env.CONTACT_FORM_TO_EMAIL = 'admin@departmentofart.com'

    // Get mock send function
    const ResendMock = Resend as jest.MockedClass<typeof Resend>
    const resendInstance = new ResendMock('re_test_key_123')
    mockResendSend = resendInstance.emails.send as jest.Mock
  })

  afterEach(() => {
    delete process.env.RESEND_API_KEY
    delete process.env.RESEND_FROM_EMAIL
    delete process.env.CONTACT_FORM_TO_EMAIL
  })

  describe('Success Cases', () => {
    it('should send emails successfully with valid data', async () => {
      // Mock successful email sends
      mockResendSend
        .mockResolvedValueOnce({
          data: { id: 'admin-email-123' },
          error: null
        })
        .mockResolvedValueOnce({
          data: { id: 'autoreply-email-456' },
          error: null
        })

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'Test message',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.adminEmailId).toBe('admin-email-123')
      expect(data.data.autoReplyId).toBe('autoreply-email-456')
      expect(mockResendSend).toHaveBeenCalledTimes(2)
    })

    it('should succeed even if auto-reply fails (non-blocking)', async () => {
      // Admin email succeeds, auto-reply fails
      mockResendSend
        .mockResolvedValueOnce({
          data: { id: 'admin-email-123' },
          error: null
        })
        .mockResolvedValueOnce({
          data: null,
          error: { message: 'Auto-reply failed', name: 'EmailError' }
        })

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'Test message',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.adminEmailId).toBe('admin-email-123')
      expect(data.data.autoReplyId).toBeNull()
    })
  })

  describe('Error Cases', () => {
    it('should fail if admin email fails', async () => {
      // Mock admin email failure
      mockResendSend.mockResolvedValueOnce({
        data: null,
        error: {
          message: 'Invalid API key',
          name: 'AuthenticationError'
        }
      })

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'Test message',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBeUndefined()
      expect(data.error).toBeDefined()
      expect(mockResendSend).toHaveBeenCalledTimes(1)
    })

    it('should return 400 for missing required fields', async () => {
      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: 'John Doe',
          // missing email and message
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Missing required fields')
      expect(mockResendSend).not.toHaveBeenCalled()
    })

    it('should return 400 for invalid email format', async () => {
      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: 'John Doe',
          email: 'not-an-email',
          message: 'Test message',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid email address')
      expect(mockResendSend).not.toHaveBeenCalled()
    })

    it('should return 400 for message too long', async () => {
      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'a'.repeat(5001), // Over 5000 character limit
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Message is too long (max 5000 characters)')
      expect(mockResendSend).not.toHaveBeenCalled()
    })
  })

  describe('Rate Limiting', () => {
    it('should block requests after 5 submissions from same IP', async () => {
      mockResendSend.mockResolvedValue({
        data: { id: 'test-123' },
        error: null
      })

      const ip = '192.168.1.1'

      // Make 5 successful requests
      for (let i = 0; i < 5; i++) {
        const request = new NextRequest('http://localhost:3000/api/contact', {
          method: 'POST',
          headers: { 'x-forwarded-for': ip },
          body: JSON.stringify({
            name: `User ${i}`,
            email: `user${i}@example.com`,
            message: 'Test message',
          }),
        })

        const response = await POST(request)
        expect(response.status).toBe(200)
      }

      // 6th request should be rate limited
      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: { 'x-forwarded-for': ip },
        body: JSON.stringify({
          name: 'User 6',
          email: 'user6@example.com',
          message: 'Test message',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(429)
      expect(data.error).toContain('Too many requests')
    })
  })

  describe('Configuration', () => {
    it('should return warning when Resend not configured', async () => {
      delete process.env.RESEND_API_KEY

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'Test message',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.warning).toBeDefined()
      expect(mockResendSend).not.toHaveBeenCalled()
    })
  })
})
