import { EFFECT_CONFIGS, GENERIC_FALLBACK, isPF2E } from './const.js';
import { $ } from './utils.js';
// Helper functions
function findEffectsButton() {
    return $('[data-action="effects"]');
}
// Config logic
let cachedEffectConfig = null;
function getActiveEffectConfig() {
    if (cachedEffectConfig)
        return cachedEffectConfig;
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
function getTooltip($container, config) {
    var _a, _b;
    if (!config.tooltipAttr)
        return '';
    if (config.imgSelector) {
        return ((_a = $container.find(config.imgSelector).attr(config.tooltipAttr)) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || '';
    }
    else {
        return ((_b = $container.attr(config.tooltipAttr)) === null || _b === void 0 ? void 0 : _b.toLowerCase()) || '';
    }
}
function filterStatusButtons() {
    const config = getActiveEffectConfig();
    if (!config)
        return;
    const lowSearch = (game.qssSearchTerm || '').trim().toLowerCase();
    debug('filtering status buttons with search term:', lowSearch);
    $(config.containerSelector).each(function () {
        var _a;
        const $container = $(this);
        let nameText = '';
        let tooltip = getTooltip($container, config);
        if (config.nameSelector) {
            nameText = ((_a = $container.find(config.nameSelector).text()) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || '';
        }
        const matches = nameText.includes(lowSearch) || tooltip.includes(lowSearch);
        if (!lowSearch || matches) {
            $container.show();
        }
        else {
            $container.hide();
        }
    });
}
function triggerFirstMatchingEffect() {
    const config = getActiveEffectConfig();
    if (!config)
        return;
    const lowSearch = (game.qssSearchTerm || '').trim().toLowerCase();
    let firstMatch = null;
    $(config.containerSelector).each(function () {
        var _a;
        const $container = $(this);
        let nameText = '';
        let tooltip = getTooltip($container, config);
        if (config.nameSelector) {
            nameText = ((_a = $container.find(config.nameSelector).text()) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || '';
        }
        const matches = nameText.includes(lowSearch) || tooltip.includes(lowSearch);
        if (matches) {
            if (config.imgSelector) {
                firstMatch = $container.find(config.imgSelector).first();
            }
            else {
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
    }
    else {
        debug('no matching effects found');
    }
}
export function debug(msg, ...args) {
    if (!window.QSS_DEBUG)
        return;
    console.debug(`quick-status-select | ${msg}`, ...args);
}
// Main logic
Hooks.once('canvasReady', async () => {
    debug('got canvas ready hook!', game, canvas);
    const user = game.user;
    if (!user) {
        throw new Error('Quick Status Select | No user found.');
    }
    Hooks.on('renderTokenHUD', async (app, html, token) => {
        const inputString = isPF2E() ?
            `<input class="qss-quick-input-pf2e" id="qss-quick-input" type="text" placeholder="filter conditions…">` :
            `<input class="qss-quick-input" id="qss-quick-input" type="text" placeholder="filter conditions…">`;
        const $statusEffects = html.find('.status-effects');
        $statusEffects.prepend(inputString);
        const $qssInput = html.find('.qss-quick-input, .qss-quick-input-pf2e');
        $qssInput
            .off('input')
            .on('input', e => {
            game.qssSearchTerm = e.currentTarget.value;
            filterStatusButtons();
        });
        $qssInput
            .off('keypress')
            .on('keypress', e => {
            var _a;
            debug('got keypress:', e.key, game.qssSearchTerm);
            if (e.key === 'Enter' && ((_a = game.qssSearchTerm) === null || _a === void 0 ? void 0 : _a.trim())) {
                triggerFirstMatchingEffect();
            }
        });
        const $effectsButton = findEffectsButton();
        debug('found effects button?:', $effectsButton);
        $effectsButton
            .off('mouseup')
            .on('mouseup', () => {
            setTimeout(() => $qssInput.focus(), 0);
        });
    });
});
