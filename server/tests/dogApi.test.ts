import { describe, expect, test } from 'vitest'
import request from 'supertest'
import { app } from '../index'

describe('Dog API', () => {
  test('GET /api/dogs/random returns dog image', async () => {
    const response = await request(app)
      .get('/api/dogs/random')
    
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('success', true)
    expect(response.body).toHaveProperty('data')
    expect(response.body.data).toHaveProperty('imageUrl')
    expect(response.body.data).toHaveProperty('status', 'success')
    expect(typeof response.body.data.imageUrl).toBe('string')
    expect(response.body.data.imageUrl).toMatch(/^https:\/\/images\.dog\.ceo\/breeds\//)
  })

  test('GET /api/dogs/random handles API errors gracefully', async () => {
    const response = await request(app)
      .get('/api/dogs/random')
    
    expect([200, 500]).toContain(response.status)
    
    if (response.status === 500) {
      expect(response.body).toHaveProperty('success', false)
      expect(response.body).toHaveProperty('error')
      expect(typeof response.body.error).toBe('string')
    }
  })

  test('GET /api/health returns server status', async () => {
    const response = await request(app)
      .get('/api/health')
    
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('status', 'Server is running')
  })

  test('GET /api/nonexistent returns 404', async () => {
    const response = await request(app)
      .get('/api/nonexistent')
    
    expect(response.status).toBe(404)
    expect(response.body).toHaveProperty('success', false)
    expect(response.body).toHaveProperty('error', 'Route not found')
  })
})
