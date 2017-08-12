const instances = [];

/**
 * @class Deferred
 */
export default class Deferred {
  /**
     * @param {Boolean} idRequired
     * @constructor
     */
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = (...args) => {
        resolve(...args);
        Deferred.removeById(this.id);
        return this.promise;
      };
      this.reject = (...args) => {
        reject(...args);
        Deferred.removeById(this.id);
        return this.promise;
      };
    });

    this.id = instances.push(this) - 1;
  }
}

/**
 * @param {DeferredCaller} deferredCaller
 * @param {any} data
 * @return {any}
 */
Deferred.runByType = function runByType(deferredCaller, data) {
  const { id, type } = deferredCaller;
  const deferred = instances[id];

  if (!deferred) {
    return false;
  }
  if (type === "resolve") {
    return deferred.resolve(data);
  } else if (type === "reject") {
    return deferred.reject(data);
  } else {
    return removeById(id);
  }
};

/**
     * @param {number} id
     * @return {boolean}
     */
Deferred.removeById = function removeById(id) {
  instances.splice(id, 1);
};

/**
 *
 * @param {Function} fn
 * @return {Promise}
 */
export function promisify(fn) {
  return ({ args }) => {
    const deferred = new Deferred();
    fn(...args, deferred.resolve);
    return deferred.promise;
  };
}
