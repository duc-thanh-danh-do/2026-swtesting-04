import { describe, expect, test, vi } from 'vitest'
import request from 'supertest'
import { app } from '../index'

describe('Dog API Controller', () => {
  test('GET /api/dogs/random returns success with mocked dog data', async () => {
    const originalFetch = global.fetch

    const mockDogData = {
      message: 'https://images.dog.ceo/breeds/terrier-welsh/lucy.jpg',
      status: 'success'
    }

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockDogData
    } as Response)

    global.fetch = mockFetch

    const response = await request(app)
      .get('/api/dogs/random')

    console.log(' Test 3: Test Response Status:', response.status)
    console.log('Test Response Body:', JSON.stringify(response.body, null, 2))

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('success', true)
    expect(response.body).toHaveProperty('data')
    expect(response.body.data.imageUrl).toBe(mockDogData.message)
    expect(response.body.data.status).toBe('success')
    expect(mockFetch).toHaveBeenCalledOnce()

    global.fetch = originalFetch
  })
})
