import { preloadTemplates } from '../module/preloadTemplates.js';
import { registerSettings } from '../module/settings.js';
import { log } from './log.js';
Hooks.once('init', async function () {
    log('Initializing quick-status-select');
    registerSettings();
    await preloadTemplates();
});
Hooks.once('setup', function () {
    // Do anything after initialization but before
    // ready
});
Hooks.once('ready', () => {
    log('got ready hook!');
});
Hooks.once('canvasReady', () => {
    log('got canvas ready hook!', game, canvas);
    Hooks.on('controlToken', (token, isSomething) => {
        log('got token control hook!', token, isSomething);
    });
});
