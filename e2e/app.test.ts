import {device, element, by, expect as detoxExpect} from 'detox';

describe('Blueprints Pro E2E Tests', () => {
  beforeAll(async () => {
    await device.launchApp({
      permissions: {notifications: 'YES'},
    });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show home screen after launch', async () => {
    await detoxExpect(element(by.text('Blueprints Pro'))).toBeVisible();
  });

  it('should navigate between tabs', async () => {
    await element(by.text('Library')).tap();
    await detoxExpect(element(by.text('Library'))).toBeVisible();

    await element(by.text('Projects')).tap();
    await detoxExpect(element(by.text('Projects'))).toBeVisible();

    await element(by.text('More')).tap();
    await detoxExpect(element(by.text('More'))).toBeVisible();

    await element(by.text('Home')).tap();
    await detoxExpect(element(by.text('Blueprints Pro'))).toBeVisible();
  });

  it('should open settings screen', async () => {
    await element(by.text('More')).tap();
    await element(by.text('Settings')).tap();
    await detoxExpect(element(by.text('Settings'))).toBeVisible();
  });

  it('should handle theme toggle', async () => {
    await element(by.text('More')).tap();
    await element(by.text('Settings')).tap();
    await element(by.id('theme-toggle')).tap();
    // Verify theme changed (would need specific UI elements to check)
    await element(by.id('theme-toggle')).tap();
  });

  it('should create a new blueprint', async () => {
    await element(by.id('add-blueprint-button')).tap();
    await element(by.id('blueprint-title-input')).typeText('Test Blueprint');
    await element(by.id('blueprint-description-input')).typeText('Test Description');
    await element(by.id('create-blueprint-button')).tap();
    await detoxExpect(element(by.text('Test Blueprint'))).toBeVisible();
  });

  it('should search for blueprints', async () => {
    await element(by.text('Library')).tap();
    await element(by.id('search-input')).typeText('Test');
    await detoxExpect(element(by.id('blueprint-list'))).toBeVisible();
  });

  it('should handle blueprint gestures', async () => {
    await element(by.id('blueprint-item-0')).tap();
    await detoxExpect(element(by.id('blueprint-detail'))).toBeVisible();

    // Test swipe gesture
    await element(by.id('blueprint-detail')).swipe('left');

    // Test pinch gesture (zoom)
    await element(by.id('blueprint-canvas')).pinch(2, 'slow');

    // Navigate back
    await element(by.id('back-button')).tap();
  });

  it('should export blueprint in multiple formats', async () => {
    await element(by.id('blueprint-item-0')).tap();
    await element(by.id('export-button')).tap();

    await detoxExpect(element(by.text('Export'))).toBeVisible();

    await element(by.id('export-format-json')).tap();
    await element(by.id('confirm-export-button')).tap();

    await detoxExpect(element(by.text('Export Complete'))).toBeVisible();
  });

  it('should handle offline data persistence', async () => {
    // Create a blueprint
    await element(by.id('add-blueprint-button')).tap();
    await element(by.id('blueprint-title-input')).typeText('Offline Test');
    await element(by.id('create-blueprint-button')).tap();

    // Restart app to test persistence
    await device.reloadReactNative();

    // Verify blueprint still exists
    await element(by.text('Library')).tap();
    await detoxExpect(element(by.text('Offline Test'))).toBeVisible();
  });
});
