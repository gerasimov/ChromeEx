import {
  CONTENT,
  BACKGROUND,
  INCLUDE,
  INCLUDE_SEND,
  CONTENT_SEND
} from "./constants";
import { triggerCustomEvent, bindCustomEvent } from "./helpers";

import Channel from "./channel";
import Deferred from "./deferred";

const disconnected = false;

/**
 * @class Content
 */
export default class ContentChannel extends Channel {
  /**
     * @method connect
     */
  connect() {
    if (disconnected) {
      return;
    }
    bindCustomEvent(INCLUDE_SEND, e => this.onMessage(JSON.parse(e.detail)));

    this.port = window.chrome.runtime.connect();
    this.port.onMessage.addListener(this.onMessage.bind(this));
    this.port.onDisconnect.addListener(() => (disconnected = true));
  }

  /**
     * @param {any} response
     * @return {any}
     */
  onMessage(response) {
    const { from, to } = response;

    switch (to) {
      case CONTENT:
        return this._onMessage(response);
      case BACKGROUND:
      case INCLUDE:
      default:
        return this.send(response, to, from);
    }
  }

  /**
     * @param {Object} data
     * @param {Number} to
     * @param {Number} from
     * @param {any} port
     * @return {Promise}
     * @method send
     */
  send(data, to, from = CONTENT, port) {
    let params;

    const deferred = new Deferred(true);

    switch (from) {
      case CONTENT:
        params = { data, to, from, deferred: { id: deferred.id } };
        break;
      case BACKGROUND:
      case INCLUDE:
      default:
        params = data;
        deferred.resolve(`Resend from ${from || ""} to ${to}`);
        break;
    }

    switch (to) {
      case INCLUDE:
        triggerCustomEvent(CONTENT_SEND, JSON.stringify(params));
        break;
      case BACKGROUND:
        if (disconnected) {
          return deferred.reject();
        }
        this.port.postMessage(params);
        break;
      default:
        break;
    }
    return deferred.promise;
  }

  /**
     * @method sendToInclude
     * @param {any} data
     * @return {Promise}
     */
  sendToInclude(data) {
    return this.send(data, INCLUDE);
  }
  /**
     * @method sendToBackground
     * @param {any} data
     * @return {Promise}
     */
  sendToBackground(data) {
    return this.send(data, BACKGROUND);
  }
}
