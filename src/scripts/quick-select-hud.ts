import { log } from './log';

export class QuickStatusSelectHud extends Application {
  i18n = (toTranslate) => game.i18n.localize(toTranslate);

  refresh_timeout = null;
  tokens = null;
  selectedToken = null;
  selectedTokens = [];
  rendering = false;
  categoryHovered = '';
  defaultLeftPos = 150;
  defaultTopPos = 80;

  constructor() {
    super();
  }

  async init(user) {}

  updateSettings() {
    this.update();
  }

  setTokensReference(tokens) {
    this.tokens = tokens;
  }

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template: '/modules/quick-status-select/templates/qss.hbs',
      id: 'quick-status-select-hud',
      classes: [],
      width: 200,
      height: 20,
      left: 150,
      top: 80,
      popOut: false,
      minimizable: false,
      resizable: false,
      title: 'quick-status-select',
      dragDrop: [],
      tabs: [],
      scrollY: [],
    });
  }

  getScale() {
    const scale = 1;
    if (scale < 0.8) {
      return 0.8;
    }
    if (scale > 2) {
      return 2;
    }
    return scale;
  }

  /** @override */
  getData(options = {}) {
    const data = super.getData();
    data.id = 'quick-status-select';
    data.scale = this.getScale();
    data.statuses = CONFIG.statusEffects;
    log('data: ', data);
    return data;
  }

  /** @override */
  activateListeners(html) {
    log('activate listeners: ', html);
    const quickStatusSelectHud = '#quick-status-select';
    const repositionIcon = '#qss-reposition';
    const action = '.qss-action';

    const handleClick = (e) => {
      let target = e.target;

      if (target.tagName !== 'BUTTON') {
        target = e.currentTarget.children[0];
      }
    };

    html.find(action).on('click', (e) => {
      handleClick(e);
    });

    html.find(action).contextmenu((e) => {
      handleClick(e);
    });

    html.find(repositionIcon).mousedown((ev) => {
      ev.preventDefault();
      ev = ev || window.event;

      let hud = $(document.body).find(quickStatusSelectHud);
      let marginLeft = parseInt(hud.css('marginLeft').replace('px', ''));
      let marginTop = parseInt(hud.css('marginTop').replace('px', ''));

      dragElement(document.getElementById('quick-status-select'));
      let pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;

      function dragElement(elmnt) {
        elmnt.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
          e = e || window.event;
          e.preventDefault();
          pos3 = e.clientX;
          pos4 = e.clientY;

          document.onmouseup = closeDragElement;
          document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
          e = e || window.event;
          e.preventDefault();
          // calculate the new cursor position:
          pos1 = pos3 - e.clientX;
          pos2 = pos4 - e.clientY;
          pos3 = e.clientX;
          pos4 = e.clientY;
          // set the element's new position:
          elmnt.style.top = elmnt.offsetTop - pos2 - marginTop + 'px';
          elmnt.style.left = elmnt.offsetLeft - pos1 - marginLeft + 'px';
          elmnt.style.position = 'fixed';
          elmnt.style.zIndex = 100;
        }

        function closeDragElement() {
          // stop moving when mouse button is released:
          elmnt.onmousedown = null;
          document.onmouseup = null;
          document.onmousemove = null;
          let xPos = elmnt.offsetLeft - pos1 > window.innerWidth ? window.innerWidth : elmnt.offsetLeft - pos1;
          let yPos = elmnt.offsetTop - pos2 > window.innerHeight - 20 ? window.innerHeight - 100 : elmnt.offsetTop - pos2;
          xPos = xPos < 0 ? 0 : xPos;
          yPos = yPos < 0 ? 0 : yPos;
          if (xPos != elmnt.offsetLeft - pos1 || yPos != elmnt.offsetTop - pos2) {
            elmnt.style.top = yPos + 'px';
            elmnt.style.left = xPos + 'px';
          }
          log(`Setting position to x: ${xPos}px, y: ${yPos}px, and saving in user flags.`);
          game.user.update({ flags: { 'quick-status-select': { hudPos: { top: yPos, left: xPos } } } });
        }
      }
    });

    $(document).find('.qss-filterholder').parents('.qss-subcategory').css('cursor', 'pointer');
  }

  trySetPos() {
    let hudTitle = $(document).find('#qss-hudTitle');
    if (hudTitle.length > 0) hudTitle.css('top', -hudTitle[0].getBoundingClientRect().height);

    let token = this.tokens && this.tokens.length && this.tokens[0];
    if (token) {
      this.setHoverPos(token);
    } else {
      this.setUserPos();
    }
    this.rendering = false;
    this.rendering = false;
  }

  //   applySettings() {
  //     if (!settings.get('dropdown')) {
  //       $(document).find('.qss-content').css({
  //         bottom: '40px',
  //         'flex-direction': 'column-reverse',
  //       });
  //     }
  //   }

  setUserPos() {
    log('attempting to update position...');
    if (!(game.user.data.flags['quick-status-select'] && game.user.data.flags['quick-status-select'].hudPos)) {
      return;
    }
    this.getElementAndSetPosition();
  }

  getElementAndSetPosition(): boolean {
    let pos = game.user.data.flags['quick-status-select'].hudPos;
    let defaultLeftPos = this.defaultLeftPos;
    let defaultTopPos = this.defaultTopPos;
    let elmnt = document.getElementById('quick-status-select');
    log('attempting to get element: ', elmnt, pos, defaultLeftPos, defaultTopPos);
    if (elmnt) {
      elmnt.style.bottom = null;
      elmnt.style.top = pos.top < 5 || pos.top > window.innerHeight + 5 ? defaultTopPos + 'px' : pos.top + 'px';
      elmnt.style.left = pos.left < 5 || pos.left > window.innerWidth + 5 ? defaultLeftPos + 'px' : pos.left + 'px';
      elmnt.style.position = 'fixed';
      elmnt.style.zIndex = '100';
      return true;
    }
    return false;
  }

  setHoverPos(token) {
    let elmnt = $('#quick-status-select');
    if (elmnt) {
      elmnt.css('bottom', null);
      elmnt.css('left', token.worldTransform.tx + (token.data.width * canvas.dimensions.size + 55) * canvas.scene._viewPosition.scale + 'px');
      elmnt.css('top', token.worldTransform.ty + 0 + 'px');
      elmnt.css('position', 'fixed');
      elmnt.css('zIndex', 100);
    }
  }

  async resetHud() {
    await this.resetFlags();
    this.resetPosition();
  }

  resetPosition() {
    game.user.update({ flags: { 'quick-status-select': { hudPos: { top: 80, left: 150 } } } });
    this.update();
  }

  async resetFlags() {
    this.update();
  }

  update() {
    // Delay refresh because switching tokens could cause a controlToken(false) then controlToken(true) very fast
    if (this.refresh_timeout) clearTimeout(this.refresh_timeout);
    this.refresh_timeout = setTimeout(this.updateHud.bind(this), 100);
  }

  async updateHud() {
    log('Updating HUD');
    this.rendering = true;
    this.render(true);
  }

  _getTargetToken(controlled) {
    if (controlled.length > 1) return null;

    if (controlled.length === 0 && canvas.tokens?.placeables && game.user.character) {
      let character = game.user.character;
      let token = canvas?.tokens?.placeables.find((t) => t.actor?._id === character?._id);
      if (token) return token;

      return null;
    }

    let ct = controlled[0];

    if (!ct) return null;

    if (this._userHasPermission(ct)) return ct;

    return null;
  }

  _userHasPermission(token: Token) {
    let actor = token.actor;
    let user = game.user;
    return game.user.isGM || actor?.hasPerm(user, 'OWNER');
  }
}
