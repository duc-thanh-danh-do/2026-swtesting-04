import { describe, expect, test, vi } from 'vitest'
import { getDogImage } from '../controllers/dogController'
import * as dogService from '../services/dogService'

describe('dogController - getDogImage', () => {
  test('Test 3 returns success true with mocked service data', async () => {
    const mockDogData = {
      imageUrl: 'https://mocked-dog.jpg',
      status: 'success'
    }

    vi.spyOn(dogService, 'getRandomDogImage')
      .mockResolvedValue(mockDogData)

    const req = {}
    const json = vi.fn()
    const res = { json }

    await getDogImage(req as any, res as any)

    expect(dogService.getRandomDogImage).toHaveBeenCalledOnce()

    expect(json).toHaveBeenCalledWith({
      success: true,
      data: mockDogData
    })
  })
})