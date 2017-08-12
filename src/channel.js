import Deferred from "./deferred";
import ChannelHandler from "./handler";

/**
 * @class Channel
 */
export default class Channel {
  /**
   * 
   * @param {*} data 
   * @param {*} to 
   * @param {*} from 
   * @param {*} port 
   */
  send(data, to, from, port = null) {
    return Promise.resolve();
  }

  /**
     * @method onmessage
     * @param {any} response
     * @param {any} port
     * @return {any}
     */
  _onMessage(response, port) {
    const { data, deferred, from } = response;
    const { handler } = data;
    const self = this;

    if (!handler) {
      return Deferred.runByType(data.deferred, data.result);
    }

    if (port) {
      data.tab = port.sender.tab;
    }

    const resultHandle = type => {
      return result => {
        return self.send(
          { result, deferred: { id: deferred.id, type } },
          from,
          undefined,
          port
        );
      };
    };

    return ChannelHandler.callHandler(handler, data)
      .then(resultHandle("resolve"))
      .catch(resultHandle("reject"));
  }

  /**
     * @param {{handler: string, args: Array}} param0 
     * @return {Promise}
     */
  self({ handler, args }) {
    const deferred = new Deferred();
    return ChannelHandler.callHandler(handler, {
      args
    })
      .then(deferred.resolve)
      .catch(deferred.reject);
  }
}
