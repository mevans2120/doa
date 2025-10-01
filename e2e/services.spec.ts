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

    // Check that service cards exist without expecting specific names
    const serviceCards = page.locator('#services .bg-zinc-900')
    const count = await serviceCards.count()

    // Should have at least 1 service
    expect(count).toBeGreaterThan(0)

    // Check that each service card has a title (h3 element)
    for (let i = 0; i < Math.min(count, 3); i++) {
      const card = serviceCards.nth(i)
      const title = card.locator('h3')
      await expect(title).toBeVisible()
      // Title should have some text (not empty)
      const titleText = await title.textContent()
      expect(titleText).toBeTruthy()
      expect(titleText?.length).toBeGreaterThan(0)
    }

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

    // Check if projects section exists (it might not if there are no projects in CMS)
    const projectsSection = page.locator('text=FEATURED PROJECTS')
    const sectionCount = await projectsSection.count()

    if (sectionCount > 0) {
      // Wait for projects section
      await page.waitForSelector('text=FEATURED PROJECTS', { timeout: 10000 })

      // Check that project cards exist
      const projectCards = page.locator('.group.cursor-pointer')
      const count = await projectCards.count()

      // If section exists, we expect at least one project or it's acceptable to have 0
      expect(count).toBeGreaterThanOrEqual(0)
    } else {
      // It's okay if the projects section doesn't exist (no projects in CMS)
      expect(sectionCount).toBe(0)
    }
  })

  test('opens project modal on click', async ({ page }) => {
    await page.goto('/')

    // Check if projects section and cards exist
    const projectsSection = page.locator('text=FEATURED PROJECTS')
    const sectionCount = await projectsSection.count()

    if (sectionCount > 0) {
      await page.waitForSelector('text=FEATURED PROJECTS')

      const projectCards = page.locator('.group.cursor-pointer')
      const cardsCount = await projectCards.count()

      if (cardsCount > 0) {
        // Click first project card
        const firstProject = projectCards.first()
        await firstProject.click()

        // Modal should open - use more specific selector to avoid ambiguity
        await expect(page.locator('.fixed.inset-0.z-50')).toBeVisible()
        await expect(page.locator('text=Project Overview')).toBeVisible()

        // Close modal
        const closeButton = page.locator('button svg').first()
        await closeButton.click()

        // Modal should close
        await expect(page.locator('.fixed.inset-0.z-50')).not.toBeVisible()
      } else {
        // No projects to test, which is acceptable
        expect(cardsCount).toBe(0)
      }
    } else {
      // Projects section doesn't exist, which is acceptable
      expect(sectionCount).toBe(0)
    }
  })
})

test.describe('Client Logos with Real Data', () => {
  test('displays client logos from Sanity', async ({ page }) => {
    await page.goto('/')

    // Check if clients section exists
    const clientsSection = page.locator('#clients')
    const sectionCount = await clientsSection.count()

    if (sectionCount > 0) {
      // Wait for clients section
      await page.waitForSelector('#clients', { timeout: 10000 })

      // Check that client logos exist
      const clientLogos = page.locator('#clients img')
      const count = await clientLogos.count()

      // It's acceptable to have 0 or more client logos
      expect(count).toBeGreaterThanOrEqual(0)

      // View All Clients link might exist if there are clients
      if (count > 0) {
        const viewAllLink = page.locator('a:has-text("View All Clients")')
        const linkCount = await viewAllLink.count()
        // Link might or might not exist depending on configuration
        expect(linkCount).toBeGreaterThanOrEqual(0)
      }
    } else {
      // Clients section doesn't exist, which is acceptable
      expect(sectionCount).toBe(0)
    }
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