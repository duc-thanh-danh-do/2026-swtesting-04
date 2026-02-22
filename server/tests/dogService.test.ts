import { describe, expect, test, vi } from 'vitest'
import request from 'supertest'
import { app } from '../index'

describe('Dog API', () => {
  test('GET /api/dogs/random returns dog image', async () => {
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
    
    console.log(' test 1: Test Response Status:', response.status)
    console.log('Test Response Body:', JSON.stringify(response.body, null, 2))
    
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('success', true)
    expect(response.body.data).toHaveProperty('status', 'success')
    expect(response.body.data.imageUrl).toBe(mockDogData.message)
    expect(mockFetch).toHaveBeenCalledOnce()

    global.fetch = originalFetch
  })

  test('GET /api/dogs/random returns 500 when external API fails', async () => {
    const originalFetch = global.fetch

    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500
    } as Response)

    global.fetch = mockFetch

    const response = await request(app)
      .get('/api/dogs/random')

    console.log('Test 2: Test Response Status:', response.status)
    console.log('Test Response Body:', JSON.stringify(response.body, null, 2))

    expect(response.status).toBe(500)
    expect(response.body).toHaveProperty('success', false)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toContain('Failed to fetch dog image: Dog API returned status 500')
    expect(mockFetch).toHaveBeenCalledOnce()

    global.fetch = originalFetch
  })
})