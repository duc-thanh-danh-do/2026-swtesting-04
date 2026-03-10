import { describe, it, expect } from 'vitest'

describe('Call Dog API to get a random dog image', () => {
  it('should return random dog image', async () => {
    const response = await fetch('http://localhost:5000/api/dogs/random')

    expect(response.status).toBe(200)

    const body = await response.json()

    expect(body.success).toBe(true)
    expect(body.data).toBeDefined()
    expect(body.data.imageUrl).toBeDefined()
    expect(typeof body.data.imageUrl).toBe('string')
  })
})

describe('Call a GET request with invalid url', () => {
  it('should return 404 for invalid route', async () => {
    const response = await fetch('http://localhost:5000/api/dogs/invalid')

    expect(response.status).toBe(404)

    const body = await response.json()

    expect(body.error).toBeDefined()
    expect(body.error).toContain('Route not found')
  })
})