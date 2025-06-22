Hooks.on('renderTokenHUD', /** @param {HTMLFormElement} html */(_app, html) => {
  /** @type {HTMLDivElement} */
  const statusEffects = html.querySelector(".col.right .palette.status-effects");

  const qssQuickInput = document.createElement('input')
  qssQuickInput.type = "text";
  qssQuickInput.placeholder = game.i18n.localize("quick-status-select.TokenHud.quick-input.placeholder");
  qssQuickInput.classList.add("qss-quick-input");
  statusEffects.prepend(qssQuickInput);

  qssQuickInput.addEventListener('input', () => {
    const term = qssQuickInput.value.trim().toLowerCase();
    /** @type {NodeListOf<HTMLElement>} */
    const effects = statusEffects.querySelectorAll('.effect-control');
    for (const e of effects) {
      const id = e.dataset.statusId?.trim().toLowerCase();
      const label = (e.dataset.tooltipText || game.i18n.localize(e.dataset.tooltip))?.trim().toLowerCase();
      e.hidden = !(id.match(term) || label.match(term))
    }
  });

  qssQuickInput.addEventListener('keypress', e => {
    debug('got keypress:', e.key, game.qssSearchTerm);
    if (e.key === 'Enter' && qssQuickInput.value.trim()) {
      /** @type {NodeListOf<HTMLElement>} */
      const effects = statusEffects.querySelectorAll('.effect-control');
      for (const e of effects) {
        if (!e.hidden) {
          e.click();
          break;
        }
      }
    }
  });

  html
    .querySelector("button[data-palette='effects']")
    .addEventListener('mouseup', () => setTimeout(() => qssQuickInput.focus(), 0));
});

// Debug logging helper
export function debug(msg, ...args) {
  if (!game.user?.isGM || !foundry.utils.getProperty(CONFIG, "debug.qss")) return;
  console.debug(`quick-status-select | ${msg}`, ...args);
}
