const handlers = {};

/**
 * @class ChannelHandler
 */
export default class ChannelHandler {
  /**
   * @constructor
   * @param {ChannelHandlerStruct} handler
   */
  constructor(handler) {
    this.handler = handler.handler;
    this.name = handler.name;
  }
}

/**
   * @param {ChannerlHanlder} handler
   */
ChannelHandler.addHandler = handler =>
  (handlers[handler.name] = handler.handler);

/**
   * @param {Array} handlers
   */
ChannelHandler.addHandlers = (...handlers) =>
  handlers.forEach(ChannelHandler.addHandler);

/**
   * @param {ChannerlHanlder} handler
   * @param {any} data
   * @return {Promise}
   */
ChannelHandler.callHandler = (handler, data) => {
  if (!handler) {
    return Promise.reject(new Error());
  }
  const name = typeof handler === "string" ? handler : handler.name;
  const handlerFunc = handlers[name];

  if (typeof handlerFunc !== "function") {
    return Promise.reject(new Error("Not implemented"));
  }
  return handlerFunc(data);
};
