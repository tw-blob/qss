import { preloadTemplates } from '../module/preloadTemplates.js';
import { registerSettings } from '../module/settings.js';
import { log } from './log.js';
import { QuickStatusSelectHud } from './quick-select-hud.js';
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
Hooks.once('canvasReady', async () => {
    log('got canvas ready hook!', game, canvas);
    let user = game.user;
    if (!user)
        throw new Error('Token Action HUD | No user found.');
    if (!game.quickStatusSelect) {
        game.quickStatusSelect = new QuickStatusSelectHud();
        await game.quickStatusSelect.init(user);
    }
    game.quickStatusSelect.setTokensReference(canvas.tokens);
    Hooks.on('controlToken', (token, controlled) => {
        if (controlled) {
            game.quickStatusSelect.token = token;
        }
        game.quickStatusSelect.update();
    });
    Hooks.on('renderQuickStatusSelectHud', () => {
        // game.quickStatusSelect.applySettings();
        game.quickStatusSelect.trySetPos();
    });
    // Hooks.on('updateToken', (scene, token, diff, options, idUser) => {
    //   // If it's an X or Y change assume the token is just moving.
    //   if (diff.hasOwnProperty('y') || diff.hasOwnProperty('x')) return;
    //   if (game.quickStatusSelect.validTokenChange(token)) game.quickStatusSelect.update();
    // });
    // Hooks.on('deleteToken', (scene, token, change, userId) => {
    //   if (game.quickStatusSelect.validTokenChange(token)) game.quickStatusSelect.update();
    // });
    // Hooks.on('hoverToken', (token, hovered) => {
    //   if (game.quickStatusSelect.validTokenHover(token, hovered)) game.quickStatusSelect.update();
    // });
    // Hooks.on('updateActor', (actor) => {
    //   if (game.quickStatusSelect.validActorOrItemUpdate(actor)) game.quickStatusSelect.update();
    // });
    // Hooks.on('deleteActor', (actor) => {
    //   if (game.quickStatusSelect.validActorOrItemUpdate(actor)) game.quickStatusSelect.update();
    // });
    // Hooks.on('deleteOwnedItem', (source, item) => {
    //   let actor = source.data;
    //   if (game.quickStatusSelect.validActorOrItemUpdate(actor)) game.quickStatusSelect.update();
    // });
    // Hooks.on('createOwnedItem', (source, item) => {
    //   let actor = source.data;
    //   if (game.quickStatusSelect.validActorOrItemUpdate(actor)) game.quickStatusSelect.update();
    // });
    // Hooks.on('updateOwnedItem', (source, item) => {
    //   let actor = source.data;
    //   if (game.quickStatusSelect.validActorOrItemUpdate(actor)) game.quickStatusSelect.update();
    // });
    // Hooks.on('renderCompendium', (source, html) => {
    //   let metadata = source?.metadata;
    //   if (game.quickStatusSelect.isLinkedCompendium(`${metadata?.package}.${metadata?.name}`)) game.quickStatusSelect.update();
    // });
    // Hooks.on('deleteCompendium', (source, html) => {
    //   let metadata = source?.metadata;
    //   if (game.quickStatusSelect.isLinkedCompendium(`${metadata?.package}.${metadata?.name}`)) game.quickStatusSelect.update();
    // });
    // Hooks.on('createCombat', (combat) => {
    //   game.quickStatusSelect.update();
    // });
    // Hooks.on('deleteCombat', (combat) => {
    //   game.quickStatusSelect.update();
    // });
    // Hooks.on('updateCombat', (combat) => {
    //   game.quickStatusSelect.update();
    // });
    // Hooks.on('updateCombatant', (combat, combatant) => {
    //   game.quickStatusSelect.update();
    // });
    // Hooks.on('forceUpdateTokenActionHUD', () => {
    //   game.quickStatusSelect.update();
    // });
    game.quickStatusSelect.update();
});
