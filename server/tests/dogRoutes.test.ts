import { describe, expect, test, vi, beforeEach } from 'vitest'
import request from 'supertest'

vi.mock('../controllers/dogController', () => {
  return {
    getDogImage: vi.fn(),
  }
})

import { getDogImage } from '../controllers/dogController'

describe('Dog Routes', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  test('Test 4: GET /api/dogs/random returns 200 with mocked controller', async () => {
    const mockImageUrl = 'https://mocked-dog.jpg'

    ;(getDogImage as unknown as any).mockImplementation((_req: any, res: any) => {
      return res.status(200).json({
        success: true,
        data: {
          imageUrl: mockImageUrl,
          status: 'success',
        },
      })
    })

    const { app } = await import('../index')

    const response = await request(app).get('/api/dogs/random')

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.data.imageUrl).toContain(mockImageUrl)
    expect(getDogImage).toHaveBeenCalledOnce()
  })

  test('Test 5: GET /api/dogs/random returns 500 when controller returns error', async () => {
    ;(getDogImage as unknown as any).mockImplementation((_req: any, res: any) => {
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch dog image: Network error',
      })
    })

    const { app } = await import('../index')

    const response = await request(app).get('/api/dogs/random')

    expect(response.status).toBe(500)
    expect(response.body.success).toBe(false)
    expect(response.body.error).toBe('Failed to fetch dog image: Network error')
    expect(getDogImage).toHaveBeenCalledOnce()
  })
})