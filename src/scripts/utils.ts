export function $(selector: string | HTMLElement | JQuery < HTMLElement > ): JQuery < HTMLElement > {
  return window.jQuery(selector as any);
}