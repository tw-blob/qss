Hooks.once('init', async function () {
    console.log('foundryQuickStatusModule | Initializing foundryQuickStatusModule');
    // Assign custom classes and constants here
    // Register custom module settings
    //registerSettings();
    // Preload Handlebars templates
    //await preloadTemplates();
    // Register custom sheets (if any)
});
Hooks.once('setup', function () {
    // Do anything after initialization but before
    // ready
});
Hooks.once('ready', function () {
    // Do anything once the module is ready
});
export {};
// Add any additional hooks if necessary
/**
 *
 * {
  "name": "foundryQuickStatusModule",
  "title": "foundryQuickStatusModule",
  "description": "quick status select module",
  // "systems": ["dnd5e"],
  "version": "1.0.0",
  "author": "exodu",
  "esmodules": ["foundryQuickStatusModule.js"],
  "styles": ["foundryQuickStatusModule.css"],
  // "languages": ["en"],
  "minimumCoreVersion": "0.7.8"
  // "compatibleCoreVersion": "0.7.9",
  // "url": "https://github.com/jeremiahverba/qss",
  // "manifest": "https://github.com/jeremiahverba/qss/master/src/module.json",
  // "download": "https://github.com/jeremiahverba/qss/v1.0.0/package/foundryQuickStatusModule-v1.0.0.zip",
  // "readme": "",
  // "bugs": ""
}

 */
