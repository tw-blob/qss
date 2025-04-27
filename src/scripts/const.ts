// Export isPF2e as it needs additonal CSS
export function isPF2E(): boolean {
   return game.system.id === 'pf2e';
}

function isLancer(): boolean {
    return game.system.id === 'lancer';
}

function MonksActive(): boolean {
    return game.modules.get('monks-little-details')?.active ?? false;
}

export const EFFECT_CONFIGS = [{
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

export const GENERIC_FALLBACK = {
    name: 'generic-fallback',
    containerSelector: 'img.effect-control',
    nameSelector: null,
    imgSelector: null,
    tooltipAttr: 'data-tooltip'
};