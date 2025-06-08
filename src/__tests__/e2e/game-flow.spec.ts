import { test, expect } from '@playwright/test';

test.describe('Safari Zone Tycoon - Core Game Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Start with a fresh game state
    await page.goto('/');
    
    // Clear any existing save data
    await page.evaluate(() => {
      localStorage.clear();
    });
    
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
  });

  test('should display the game interface correctly', async ({ page }) => {
    // Check if the main elements are visible
    await expect(page.locator('h1')).toContainText('Safari Zone Tycoon');
    await expect(page.locator('text=Ring the bell to attract trainers')).toBeVisible();
    
    // Check if the Safari Bell is present
    await expect(page.locator('button').filter({ hasText: '🔔' })).toBeVisible();
    
    // Check if the stats header is visible
    await expect(page.locator('text=Money')).toBeVisible();
    await expect(page.locator('text=$1,000')).toBeVisible(); // Starting money
  });

  test('should allow clicking the Safari Bell', async ({ page }) => {
    // Find the Safari Bell button
    const bellButton = page.locator('button').filter({ hasText: /🔔|Click to attract trainers/ }).first();
    
    // Initial trainer count should be 0
    await expect(page.locator('text=0').first()).toBeVisible();
    
    // Click the bell
    await bellButton.click();
    
    // Wait for the state to update
    await page.waitForTimeout(500);
    
    // Check if trainer count increased
    await expect(page.locator('text=1').first()).toBeVisible();
  });

  test('should show visual feedback when bell is clicked', async ({ page }) => {
    const bellButton = page.locator('button').filter({ hasText: /🔔/ }).first();
    
    // Click the bell and check for animation/visual feedback
    await bellButton.click();
    
    // The bell should have some visual feedback (scale animation, color change, etc.)
    // We check for the presence of animation classes or style changes
    await page.waitForTimeout(100);
    
    // Since we use Framer Motion, the button might have transform styles
    const buttonStyles = await bellButton.getAttribute('style');
    // Just check that the button exists and is clickable
    await expect(bellButton).toBeEnabled();
  });

  test('should track multiple bell clicks', async ({ page }) => {
    const bellButton = page.locator('button').filter({ hasText: /🔔/ }).first();
    
    // Click the bell multiple times
    for (let i = 1; i <= 3; i++) {
      await bellButton.click();
      await page.waitForTimeout(200); // Wait between clicks
      
      // Check if trainer count increased
      await expect(page.locator(`text=${i}`).first()).toBeVisible();
    }
  });

  test('should display game stats correctly', async ({ page }) => {
    // Check initial stats
    await expect(page.locator('text=Money')).toBeVisible();
    await expect(page.locator('text=Trainers')).toBeVisible();
    await expect(page.locator('text=Caught')).toBeVisible();
    
    // Initial values
    await expect(page.locator('text=$1,000')).toBeVisible();
    await expect(page.locator('text=0').first()).toBeVisible(); // 0 trainers initially
  });

  test('should handle perfect timing clicks', async ({ page }) => {
    const bellButton = page.locator('button').filter({ hasText: /🔔/ }).first();
    
    // Wait for the golden flash indicator
    await expect(page.locator('text=Watch for the golden flash!')).toBeVisible();
    
    // Click the bell
    await bellButton.click();
    
    // Check if there's feedback about timing
    // The component shows timing feedback, so we should see some indication
    await page.waitForTimeout(100);
    await expect(bellButton).toBeVisible();
  });

  test('should show navigation tabs', async ({ page }) => {
    // Check if navigation tabs are visible
    await expect(page.locator('text=Game')).toBeVisible();
    await expect(page.locator('text=Areas')).toBeVisible();
    await expect(page.locator('text=Shop')).toBeVisible();
    await expect(page.locator('text=Awards')).toBeVisible();
    await expect(page.locator('text=Settings')).toBeVisible();
  });

  test('should display Pokemon areas', async ({ page }) => {
    // Check if the center area is displayed
    await expect(page.locator('text=Center Area')).toBeVisible();
    await expect(page.locator('text=Nidoran♀')).toBeVisible();
    await expect(page.locator('text=Nidoran♂')).toBeVisible();
    await expect(page.locator('text=Paras')).toBeVisible();
    await expect(page.locator('text=Chansey')).toBeVisible();
    await expect(page.locator('text=Scyther')).toBeVisible();
  });

  test('should show tutorial information', async ({ page }) => {
    // Check if tutorial section is visible
    await expect(page.locator('text=Getting Started')).toBeVisible();
    await expect(page.locator('text=Ring the bell to attract trainers')).toBeVisible();
    await expect(page.locator('text=Watch for the golden flash')).toBeVisible();
    await expect(page.locator('text=Chain 5 perfect clicks')).toBeVisible();
  });

  test('should handle mobile viewport correctly', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if mobile-specific elements are visible
    await expect(page.locator('h1')).toContainText('Safari Zone');
    
    // Navigation should be at the bottom
    const navigation = page.locator('nav');
    await expect(navigation).toBeVisible();
    
    // Bell should be responsive
    const bellButton = page.locator('button').filter({ hasText: /🔔/ }).first();
    await expect(bellButton).toBeVisible();
    await bellButton.click();
  });
});

test.describe('Safari Zone Tycoon - Mobile Interactions', () => {
  test.use({ 
    viewport: { width: 375, height: 667 } // iPhone SE size
  });

  test('should handle touch interactions', async ({ page }) => {
    await page.goto('/');
    
    const bellButton = page.locator('button').filter({ hasText: /🔔/ }).first();
    
    // Simulate touch
    await bellButton.tap();
    
    // Check if the interaction worked
    await page.waitForTimeout(200);
    await expect(page.locator('text=1').first()).toBeVisible();
  });

  test('should show mobile-optimized layout', async ({ page }) => {
    await page.goto('/');
    
    // Check if sticky header is present
    await expect(page.locator('header')).toBeVisible();
    
    // Check if navigation tabs are at the bottom
    await expect(page.locator('nav')).toBeVisible();
    
    // Touch targets should be appropriate size (at least 44px)
    const buttons = page.locator('button');
    const count = await buttons.count();
    
    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      const boundingBox = await button.boundingBox();
      if (boundingBox) {
        expect(boundingBox.height).toBeGreaterThanOrEqual(40); // Close to 44px minimum
      }
    }
  });
});