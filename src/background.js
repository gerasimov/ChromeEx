import { CONTENT, BACKGROUND, INCLUDE } from "./constants";

import Channel from "./channel";
import Deferred from "./deferred";

/**
 * @class PortManager
 */
class PortManager {
  constructor() {
    this.ports = {};
    this._current = null;
  }

  /**
   * @param {any} cur
   */
  set current(cur) {
    if (cur) {
      this._current = cur;
      return;
    }

    const lastPort = Object.keys(this.ports).sort().shift();
    this._current = lastPort ? this.ports[lastPort] : null;
  }

  /**
   * 
   */
  get current() {
    return this._current;
  }

  /**
   * @param {*} port 
   */
  push(port) {
    this.ports[port.sender.tab.id] = port;
    this.current = port;
  }

  /**
   * @param {*} port 
   */
  remove(port) {
    if (this.current === port) {
      this.current = null;
    }
    delete this.ports[port.sender.tab.id];
  }

  /**
   * @param {*} clb
   * @return {Array<Promise<any>>}
   */
  all(clb) {
    return Object.values(this.ports).map(clb);
  }
}

const ports = new PortManager();

/**
 * @class BackgroundChannel
 */
export default class BackgroundChannel extends Channel {
  /**
   * @method connect
   */
  connect() {
    window.chrome.runtime.onConnect.addListener(port => {
      port.onMessage.addListener(this._onMessage.bind(this));
      port.onDisconnect.addListener(() => ports.remove(port));
      ports.push(port);
    });
  }

  /**
     * @param {any} data
     * @param {number} to
     * @param {number} from
     * @param {any} port
     * @return {Promise<any>}
     */
  send(data, to, from = BACKGROUND, port = null) {
    const deferred = new Deferred(true);
    const params = {
      from,
      to,
      data,
      deferred: { id: deferred.id }
    };

    if (port) {
      port.postMessage(params);
    } else if (ports.current) {
      ports.current.postMessage(params);
    } else {
      deferred.reject();
    }
    return deferred.promise;
  }

  /**
     * @param {any} data
     * @param {number} to
     * @return {Promise<any>}
     */
  send2All(data, to) {
    return Promise.all(
      ports.all(port => this.send(data, to, BACKGROUND, port))
    );
  }

  /**
     * @param {any} data
     * @return {Promise}
     */
  sendToAllContent(data) {
    return this.send2All(data, CONTENT);
  }

  /**
     * @param {any} data
     * @return {Promise}
     */
  sendToAllInclude(data) {
    return this.send2All(data, INCLUDE);
  }
  /**
     * @param {any} data
     * @return {Promise}
     */
  sendToContent(data) {
    return this.send(data, CONTENT);
  }
  /**
     * @param {any} data
     * @return {Promise}
     */
  sendToInclude(data) {
    return this.send(data, INCLUDE);
  }
}
