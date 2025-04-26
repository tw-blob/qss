// Setup quick input field on canvas ready
Hooks.once('canvasReady', async () => {
  debug('got canvas ready hook!', game, canvas);

  let user = game.user;
  if (!user) {
      throw new Error('Quick Status Select | No user found.');
  }

  Hooks.on('renderTokenHUD', async (app, html, token) => {
      const statusEffects = $(document).find('.status-effects');
      const inputString = `<input class="qss-quick-input" id="qss-quick-input" type="text" placeholder="filter conditions...">`;
      statusEffects.prepend(inputString);

      const qssQuickInput = $('#qss-quick-input');

      qssQuickInput.off('input').on('input', (e) => {
          game.qssSearchTerm = qssQuickInput.val().toString();
          filterStatusButtons();
      });

      qssQuickInput.off('keypress').on('keypress', (e) => {
          debug('got keypress:', e.key, game.qssSearchTerm);
          if (e.key === 'Enter' && !!game.qssSearchTerm) {
              triggerFirstMatchingEffect();
          }
      });

      const effectsButton = findEffectsButton();
      debug('found effects button?:', effectsButton);

      effectsButton.on('mouseup', () => {
          setTimeout(() => {
              qssQuickInput.focus();
          }, 0);
      });
  });
});

// Helpers to detect system and modules
function findEffectsButton() {
  return $('[data-action="effects"]');
}

function isPF2E() {
  return game.system.id === 'pf2e';
}

function isLancer() {
  return game.system.id === 'lancer';
}

function MonksActive() {
  return game.modules.get('monks-little-details')?.active;
}

// Define effect configurations for different systems and modules
const EFFECT_CONFIGS = [
  {
      name: 'lancer+monks',
      condition: () => isLancer() && MonksActive(),
      containerSelector: 'div.effect-container',
      nameSelector: '.effect-name',
      imgSelector: 'img.effect-control',
      tooltipAttr: 'data-tooltip'
  },
  {
      name: 'lancer',
      condition: () => isLancer(),
      containerSelector: 'img.effect-control',
      nameSelector: null,
      imgSelector: null,
      tooltipAttr: 'data-tooltip'
  },
  {
      name: 'pf2e+monks',
      condition: () => isPF2E() && MonksActive(),
      containerSelector: 'picture.effect-control',
      nameSelector: '.effect-name',
      imgSelector: 'picture.effect-control',
      tooltipAttr: 'title'
  },
  {
      name: 'pf2e',
      condition: () => isPF2E(),
      containerSelector: 'picture.effect-control',
      nameSelector: null,
      imgSelector: null,
      tooltipAttr: 'title'
  }
];

// Fallback effect config if no specific one matches
const GENERIC_FALLBACK = {
  name: 'generic-fallback',
  containerSelector: 'img.effect-control',
  nameSelector: null,
  imgSelector: null,
  tooltipAttr: 'data-tooltip'
};

let cachedEffectConfig = null;

// Pick the active configuration based on system and modules
function getActiveEffectConfig() {
  if (cachedEffectConfig) return cachedEffectConfig;

  for (const config of EFFECT_CONFIGS) {
      if (config.condition()) {
          cachedEffectConfig = config;
          debug('using effect config:', config.name);
          return cachedEffectConfig;
      }
  }

  cachedEffectConfig = GENERIC_FALLBACK;
  debug('using effect config:', cachedEffectConfig.name);
  return cachedEffectConfig;
}

// Extract tooltip text from a container
function getTooltip($container, config) {
  if (!config.tooltipAttr) return '';

  if (config.imgSelector) {
      return $container.find(config.imgSelector).attr(config.tooltipAttr)?.toLowerCase() || '';
  } else {
      return $container.attr(config.tooltipAttr)?.toLowerCase() || '';
  }
}

// Filter status buttons based on the search term
function filterStatusButtons() {
  const config = getActiveEffectConfig();
  if (!config) return;

  const lowSearch = (game.qssSearchTerm || '').trim().toLowerCase();
  debug('filtering status buttons with search term:', lowSearch);

  $(config.containerSelector).each(function() {
      const $container = $(this);
      let nameText = '';
      let tooltip = getTooltip($container, config);

      if (config.nameSelector) {
          nameText = $container.find(config.nameSelector).text()?.toLowerCase() || '';
      }

      const matches = nameText.includes(lowSearch) || tooltip.includes(lowSearch);

      if (!lowSearch || matches) {
          $container.show();
      } else {
          $container.hide();
      }
  });
}

// Trigger the first effect that matches the search term
function triggerFirstMatchingEffect() {
  const config = getActiveEffectConfig();
  if (!config) return;

  const lowSearch = (game.qssSearchTerm || '').trim().toLowerCase();
  let firstMatch = null;

  $(config.containerSelector).each(function() {
      const $container = $(this);
      let nameText = '';
      let tooltip = getTooltip($container, config);

      if (config.nameSelector) {
          nameText = $container.find(config.nameSelector).text()?.toLowerCase() || '';
      }

      const matches = nameText.includes(lowSearch) || tooltip.includes(lowSearch);

      if (matches) {
          if (config.imgSelector) {
              firstMatch = $container.find(config.imgSelector).first();
          } else {
              firstMatch = $container;
          }
          return false;
      }
  });

  if (firstMatch) {
      debug('triggering first matching effect:', firstMatch);
      firstMatch.trigger('click');

      const effectsButton = findEffectsButton();
      effectsButton.trigger('click');
  } else {
      debug('no matching effects found');
  }
}

// Debug logging helper
export function debug(msg, ...args) {
  if (!game.user?.isGM || !window.QSS_DEBUG) return;
  console.debug(`quick-status-select | ${msg}`, ...args);
}