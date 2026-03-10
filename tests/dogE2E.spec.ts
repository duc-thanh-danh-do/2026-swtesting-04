import { test, expect } from '@playwright/test'

const mockSuccessResponse = {
  success: true,
  data: {
    imageUrl: 'https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg',
    status: 'success'
  }
}

test('Testing Dog image loads on page load', async ({ page }) => {

  await page.route('http://localhost:5000/api/dogs/random', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockSuccessResponse)
    })
  })

  await page.goto('http://localhost:5173')
  const img = page.locator('img')

  await expect(img).toBeVisible()
  await expect(img).toHaveAttribute('src', /images\.dog\.ceo/)
})


test('Testing Dog image loads when button is clicked', async ({ page }) => {

  await page.route('http://localhost:5000/api/dogs/random', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockSuccessResponse)
    })
  })

  await page.goto('http://localhost:5173')
  await page.getByRole('button', { name: 'Get Another Dog' }).click()
  const img = page.locator('img')

  await expect(img).toBeVisible()
  await expect(img).toHaveAttribute('src', /images\.dog\.ceo/)
})


test('Testing behavior when API fails', async ({ page }) => {

  await page.route('http://localhost:5000/api/dogs/random', async route => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Server error' })
    })
  })

  await page.goto('http://localhost:5173')

  await expect(page.locator('.error')).toBeVisible()
  await expect(page.getByText('Error:')).toBeVisible()
})