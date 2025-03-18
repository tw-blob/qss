declare global {
  interface Game {
    qssSearchTerm: string;
  }
}

Hooks.once('canvasReady', async () => {
  debug('got canvas ready hook!', game, canvas);
  let user = game.user;
  if (!user) {
    throw new Error('Quick Status Select | No user found.');
  }

  Hooks.on('renderTokenHUD', async (app, html, token) => {
    const statusEffects = $(document).find('.status-effects');
    let inputString = '';
    if (isPF2E()) {
      inputString = '<input class="qss-quick-input-pf2e" id="qss-quick-input" type="text" placeholder="filter conditions..." ></input>';
    } else {
      inputString = '<input class="qss-quick-input" id="qss-quick-input" type="text" placeholder="filter conditions..." ></input>';
    }
    statusEffects.prepend(inputString);
    const qssQuickInput = $(document).find('.qss-quick-input, .qss-quick-input-pf2e');
    qssQuickInput.on('keypress', (e) => {
      debug('got keypress: ', e.key, game.qssSearchTerm);
      if (e.key === 'Enter' && !!game.qssSearchTerm) {
        const searchTermTransformed = game.qssSearchTerm.trim().toLowerCase().capitalize();
        const allButtons = findAllStatusEffectButtons();
        const buttonsToShow = findStatusEffectButtonsContainingSearchTerm(allButtons, searchTermTransformed);
        const buttonToClick = buttonsToShow.first();
        debug('detected Enter key while searching!', searchTermTransformed, buttonsToShow, buttonToClick);
        debug('events: ', $.data(buttonToClick.children().first(), 'events'));
        buttonToClick.children().first().trigger('click');
        const effectsButton = findEffectsButton();
        effectsButton.trigger('click');
      }
    });
    qssQuickInput.on('search', (e) => {
      debug('search event', e);
    });
    qssQuickInput.on('click', (e) => {
      debug('click: ', e);
      e.preventDefault();
      return false;
    });
    qssQuickInput.on('input', (e) => {
      game.qssSearchTerm = qssQuickInput.val().toString();
      filterStatusButtons();
    });
    // bind to the click on the img tag because otherwise every click in the grid is handled.
    const effectsButton = findEffectsButton();
    debug('found effects button?: ', effectsButton);
    effectsButton.on('mouseup', (e) => {
      debug('effects button clicked, waiting to focus qssQuickInput');
      // wait 1 frame after the effects button is clicked because otherwise our input isn't on the dom yet.
      setTimeout(() => {
        qssQuickInput.focus();
      }, 0);
    });
  });
});

function findEffectsButton(): JQuery<HTMLElement> {
  return $('[data-action="effects"]');
}
function findAllStatusEffectButtons(): JQuery<HTMLElement> {
  if (isPF2E()) {
    return $(`div.effect-container, div.pf2e-effect-img-container`);
  }
  return $(`div.effect-container, img.effect-control`);
}

function findStatusEffectButtonsContainingSearchTerm(allButtons: JQuery<HTMLElement>, searchTerm: string): JQuery<HTMLElement> {
  debug('search term: ', searchTerm);
  if (isPF2E()) {
    const loweredSearchTerm = searchTerm.toLowerCase();
    debug('pf2e detected.');
    const all = allButtons;
    const children = all.children();
    const found = children.filter(`[data-effect*='${loweredSearchTerm}']`);
    const parents = found.parent();
    debug('found: ', all, children, found, parents);
    return parents;
  }
  return allButtons.filter(`[data-tooltip*='${searchTerm}']`);
}

function filterStatusButtons(): void {
  const searchTermTransformed = game.qssSearchTerm.trim().toLowerCase().capitalize();
  const allButtons = findAllStatusEffectButtons();
  debug('allButtons: ', allButtons);
  const buttonsToShow = findStatusEffectButtonsContainingSearchTerm(allButtons, searchTermTransformed);
  debug('found Buttons: ', buttonsToShow);
  if (!game.qssSearchTerm) {
    allButtons.css('display', 'block');
  } else {
    allButtons.css('display', 'none');
    buttonsToShow.css('display', 'block');
  }
}
function isPF2E(): boolean {
  return game.system.id === 'pf2e';
}
export function debug(msg: string, ...args: any[]): void {
  console.log(`quick-status-select | ${msg}`, ...args);
}
