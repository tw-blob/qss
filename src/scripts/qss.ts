import { preloadTemplates } from '../module/preloadTemplates.js';
import { registerSettings } from '../module/settings.js';
import { log } from './log.js';
import { QuickStatusSelectHud } from './quick-select-hud.js';

declare global {
  interface Game {
    quickStatusSelect: QuickStatusSelectHud;
  }
}

Hooks.once('init', async function () {
  log('Initializing quick-status-select');
  registerSettings();
  await preloadTemplates();
});

Hooks.once('canvasReady', async () => {
  log('got canvas ready hook!', game, canvas);
  let user = game.user;
  if (!user) {
    throw new Error('Quick Status Select HUD | No user found.');
  }

  if (!game.quickStatusSelect) {
    game.quickStatusSelect = new QuickStatusSelectHud();
  }
  game.quickStatusSelect.setTokensReference(canvas.tokens);

  Hooks.on('controlToken', (token, controlled) => {
    log('on control token: ', token, controlled);
    if (controlled && hasPermission(token)) {
      game.quickStatusSelect.selectedTokens.push(token);
    } else {
      game.quickStatusSelect.selectedTokens.findSplice((t) => t.id === token.id);
      game.quickStatusSelect.close();
    }
  });

  Hooks.on('renderQuickStatusSelectHud', () => {
    game.quickStatusSelect.setQssPosition();
  });

  Hooks.on('renderTokenHUD', (app, html, token) => {
    const defaultStatusEffects = html.find('.status-effects');
    defaultStatusEffects.hide();
    const effectsButton = html.find('.control-icon.effects');
    effectsButton.mouseup((ev) => {
      ev.preventDefault();
      ev = ev || window.event;
      game.quickStatusSelect.render(true);
    });
  });
  game.quickStatusSelect.updateHud();
});

function hasPermission(token: Token): boolean {
  let actor = token.actor;
  let user = game.user;
  return game.user.isGM || actor?.hasPerm(user, 'OWNER');
}
