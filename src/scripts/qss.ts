import { registerSettings } from '../module/settings.js';
import { preloadTemplates } from '../module/preloadTemplates.js';

Hooks.once('init', async function () {
  console.log('quick-status-select | Initializing quick-status-select');

  registerSettings();

  await preloadTemplates();

  // Register custom sheets (if any)
});

Hooks.once('setup', function () {
  // Do anything after initialization but before
  // ready
});

Hooks.once('ready', function () {
  // Do anything once the module is ready
});
