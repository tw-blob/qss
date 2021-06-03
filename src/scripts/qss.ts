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
    statusEffects.prepend('<input class="qss-quick-input" id="qss-quick-input" type="search" placeholder="filter conditions..." ></input>');
    const qssQuickInput = $(document).find('.qss-quick-input');
    qssQuickInput.on('input', (e) => {
      game.qssSearchTerm = qssQuickInput.val().toString();
      filterStatusButtons();
    });
    // bind to the click on the img tag because otherwise every click in the grid is handled.
    const effectsButton = html.find('.control-icon[data-action="effects"]');
    effectsButton.mouseup((e) => {
      // wait 1 frame after the effects button is clicked because otherwise our input isn't on the dom yet.
      setTimeout(() => {
        qssQuickInput.focus();
      }, 0);
    });
  });
});

function filterStatusButtons(): void {
  const searchTermTransformed = game.qssSearchTerm.trim().toLowerCase().capitalize();
  let allButtons: JQuery<HTMLElement>;
  let buttonsToFilter: JQuery<HTMLElement>;
  buttonsToFilter = $(`.control-icon [title*='${searchTermTransformed}']`);
  if (isPF2E()) {
    allButtons = $('.effect-control, .pf2e-effect-control');
  } else {
    allButtons = $('.effect-container, .effect-control');
  }
  if (!game.qssSearchTerm) {
    allButtons.css('display', 'block');
  } else {
    allButtons.css('display', 'none');
    buttonsToFilter.css('display', 'block');
  }
}
function isPF2E(): boolean {
  return game.system.id === 'pf2e';
}
export function debug(msg: string, ...args: any[]): void {
  console.log(`quick-status-select | ${msg}`, ...args);
}
