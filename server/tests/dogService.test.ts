import { describe, expect, test, vi } from 'vitest'
import { getRandomDogImage } from '../services/dogService'

describe('dogService - getRandomDogImage', () => {
  test('Test 1: positive: returns mapped dog data from mocked Dog API', async () => {
    const originalFetch = global.fetch

    const mockDogData = {
      message: 'https://images.dog.ceo/breeds/terrier-welsh/lucy.jpg',
      status: 'success',
    }

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockDogData,
    } as Response)

    global.fetch = mockFetch

    const result = await getRandomDogImage()

    expect(result.imageUrl).toBe(mockDogData.message)
    expect(result.status).toBe('success')
    expect(mockFetch).toHaveBeenCalledOnce()

    global.fetch = originalFetch
  })

  test('Test 2 negative: rejects when Dog API returns ok=false', async () => {
    const originalFetch = global.fetch

    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    } as Response)

    global.fetch = mockFetch

    await expect(getRandomDogImage()).rejects.toThrow(
      'Failed to fetch dog image: Dog API returned status 500'
    )

    expect(mockFetch).toHaveBeenCalledOnce()
    global.fetch = originalFetch
  })
})