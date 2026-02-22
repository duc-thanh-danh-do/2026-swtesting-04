import { describe, expect, test, vi } from 'vitest'
import request from 'supertest'
import { app } from '../index'

describe('Dog API Routes', () => {
  test('GET /api/dogs/random returns 200 with mocked dog data', async () => {
    const originalFetch = global.fetch

    const mockImageUrl = 'https://images.dog.ceo/breeds/terrier-australian/n02096294_4137.jpg'
    const mockDogData = {
      message: mockImageUrl,
      status: 'success'
    }

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockDogData
    } as Response)

    global.fetch = mockFetch

    const response = await request(app)
      .get('/api/dogs/random')

    console.log('Test 4: Test Response Status:', response.status)
    console.log('Test Response Body:', JSON.stringify(response.body, null, 2))

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('success', true)
    expect(response.body.data.imageUrl).toContain(mockImageUrl)
    expect(mockFetch).toHaveBeenCalledOnce()

    global.fetch = originalFetch
  })

  test('GET /api/dogs/random returns 500 for network error', async () => {
    const originalFetch = global.fetch

    const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'))

    global.fetch = mockFetch

    const response = await request(app)
      .get('/api/dogs/random')

    console.log('Test 5: Test Response Status:', response.status)
    console.log('Test Response Body:', JSON.stringify(response.body, null, 2))

    expect(response.status).toBe(500)
    expect(response.body).toHaveProperty('success', false)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toContain('Failed to fetch dog image: Network error')
    expect(mockFetch).toHaveBeenCalledOnce()

    global.fetch = originalFetch
  })
})
