import { test, expect } from '@playwright/test'

/**
 * E2E tests for Services component with real Sanity data
 * These tests run against the actual application with real CMS content
 */

test.describe('Services with Real CMS Data', () => {
  test('displays real services from Sanity CMS', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/')
    
    // Wait for services section to load
    await page.waitForSelector('#services', { timeout: 10000 })
    
    // Check for actual services from your Sanity dataset
    await expect(page.locator('text=Trade Show Displays')).toBeVisible()
    await expect(page.locator('text=Materials Handling Equipment')).toBeVisible()
    await expect(page.locator('text=Art Department Crew')).toBeVisible()
    
    // Verify the section title exists
    const sectionTitle = page.locator('#services h2')
    await expect(sectionTitle).toBeVisible()
    await expect(sectionTitle).toContainText('WHAT WE DO')
  })

  test('displays service descriptions', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('#services')
    
    // Check that service cards have descriptions
    const serviceCards = page.locator('#services .bg-zinc-900')
    const count = await serviceCards.count()
    
    // Should have at least 3 services
    expect(count).toBeGreaterThanOrEqual(3)
    
    // Each card should have title and description
    for (let i = 0; i < Math.min(count, 3); i++) {
      const card = serviceCards.nth(i)
      const title = card.locator('h3')
      const description = card.locator('p')
      
      await expect(title).toBeVisible()
      await expect(description).toBeVisible()
    }
  })

  test('shows View All Services link when limit is set', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('#services')
    
    // Check if View All Services CTA exists
    const viewAllLink = page.locator('a:has-text("View All Services")')
    const linkCount = await viewAllLink.count()
    
    // If there's a limit set on homepage, this should exist
    if (linkCount > 0) {
      await expect(viewAllLink).toBeVisible()
      await expect(viewAllLink).toHaveAttribute('href', '/services')
    }
  })
})

test.describe('Projects with Real CMS Data', () => {
  test('displays featured projects from Sanity', async ({ page }) => {
    await page.goto('/')
    
    // Wait for projects section
    await page.waitForSelector('text=FEATURED PROJECTS', { timeout: 10000 })
    
    // Check that project cards exist
    const projectCards = page.locator('.group.cursor-pointer')
    const count = await projectCards.count()
    
    expect(count).toBeGreaterThan(0)
  })

  test('opens project modal on click', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('text=FEATURED PROJECTS')
    
    // Click first project card
    const firstProject = page.locator('.group.cursor-pointer').first()
    await firstProject.click()
    
    // Modal should open
    await expect(page.locator('.fixed.inset-0')).toBeVisible()
    await expect(page.locator('text=Project Overview')).toBeVisible()
    
    // Close modal
    const closeButton = page.locator('button svg').first()
    await closeButton.click()
    
    // Modal should close
    await expect(page.locator('.fixed.inset-0')).not.toBeVisible()
  })
})

test.describe('Client Logos with Real Data', () => {
  test('displays client logos from Sanity', async ({ page }) => {
    await page.goto('/')
    
    // Wait for clients section
    await page.waitForSelector('#clients', { timeout: 10000 })
    
    // Check that client logos exist
    const clientLogos = page.locator('#clients img')
    const count = await clientLogos.count()
    
    // Should have at least one client logo
    expect(count).toBeGreaterThan(0)
    
    // View All Clients link should exist
    await expect(page.locator('a:has-text("View All Clients")')).toBeVisible()
  })
})

test.describe('Testimonials with Real Data', () => {
  test('displays testimonials from Sanity or fallback data', async ({ page }) => {
    await page.goto('/')
    
    // Scroll to testimonials section
    await page.evaluate(() => {
      const element = document.querySelector('.professional-card')
      if (element) {
        element.scrollIntoView()
      }
    })
    
    // Wait for testimonials
    await page.waitForSelector('.professional-card', { timeout: 10000 })
    
    // Check that testimonial cards exist
    const testimonialCards = page.locator('.professional-card')
    const count = await testimonialCards.count()
    
    // Should have at least one testimonial
    expect(count).toBeGreaterThan(0)
    
    // Each card should have quote and author
    const firstCard = testimonialCards.first()
    await expect(firstCard.locator('.italic')).toBeVisible() // Quote
    await expect(firstCard.locator('.font-semibold')).toBeVisible() // Author
  })
})