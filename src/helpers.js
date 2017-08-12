/**
 * @param {string} eventType
 * @param {any} data
 * @param {any} el
 * @return {any}
 */
export const triggerCustomEvent = (eventType, data, el = window.document) =>
  el.dispatchEvent(
    new CustomEvent(eventType, {
      detail: data
    })
  );

/**
 * @param {string} type
 * @param {Function} handler
 * @param {any} el
 * @return {any}
 */
export const bindCustomEvent = (type, handler, el = window.document) =>
  el.addEventListener(type, handler);
