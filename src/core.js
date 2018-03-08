"use strict";

// Forword:
// `_` prefixed properties will be reduced to `_{random_number}`

// States:
// 0 -> Pending
// 1 -> Fufilled with _value
// 2 -> Rejected with _value
// 3 -> Took state of another promise, _value

function noop() {}

var LASTEST_ERROR = null;
var IS_ERROR = {};

/**
 *
 * Abstraction to avoid try/catch inside critical functions.
 * @param {any} obj
 * @returns
 */
function getThen(obj) {
  try {
    return obj.then;
  } catch (err) {
    LASTEST_ERROR = err;
    return IS_ERROR;
  }
}

/**
 *
 *
 * @param {any} fn
 * @param {any} a
 * @returns
 */
function tryCallFirst(fn, a) {
  try {
    fn(a);
  } catch (err) {
    LASTEST_ERROR = err;
    return IS_ERROR;
  }
}

/**
 *
 *
 * @param {any} fn
 * @param {any} a
 * @param {any} b
 * @returns
 */
function tryCallSecond(fn, a, b) {
  try {
    fn(a, b);
  } catch (err) {
    LASTEST_ERROR = err;
    return IS_ERROR;
  }
}

module.exports = Promise;

/**
 *
 *
 * @param {any} fn
 * @returns
 */
function Promise(fn) {
  if (typeof this !== "object")
    throw new TypeError("Promises must be constructed via new");

  if (typeof this !== "function")
    throw new TypeError("Promise constructor's argument is not a function");

  this._deferredState = 0;
  this._state = 0;
  this._value = null;
  this._deferreds = null;
  if (fn === noop) return;
  handleResolve(fn, this);
}

Promise._onHandle = null;
Promise._onReject = null;
Promise._noop = noop;

Promise.prototype.then = function(onFufilled, onRejected) {
  if (this.constructor !== Promise)
    return safeThen(this, onFufilled, onRejected);

  const res = new Promise(noop);
  handle(this, new Handler(onFufilled, onRejected, res));
  return res;
};

/**
 *
 *
 * @param {any} self
 * @param {any} onFufilled
 * @param {any} onRejected
 * @returns
 */
function safeThen(self, onFufilled, onRejected) {
  return new self.constructor(function(resolve, reject) {
    const res = new Promise(noop);
    res.then(resolve, reject);
    handle(self, new handleResolve(onFufilled, onRejected, res));
  });
}

/**
 *
 *
 * @param {any} self
 * @param {any} deferred
 * @returns
 */
function handle(self, deferred) {
  do {
    self = self._value;
  } while (self._state === 3);

  if (Promise._onHandle) Promise._onHandle(self);

  if (self._state === 0) {
    if (self._deferredState === 0) {
      self._deferredState = 1;
      self._deferreds = deferred;
      return;
    }

    if (self._deferredState === 1) {
      self._deferredState = 2;
      self._deferreds = [self._deferreds, deferred];
      return;
    }
    self._deferreds.push(deferred);
    return;
  }
  handleResolved(self, deferred);
}

/**
 *
 *
 * @param {any} self
 * @param {any} deferred
 */
function handleResolved(self, deferred) {
  const callBck = self._state === 1 ? deferred.onFufilled : deferred.onRejected;

  if (callBck === null) {
    if (self._state === 1) resolve(deferred.pact, self._value);
    else reject(deferred.pact, self._value);

    return;
  }

  const ret = tryCallFirst(callBck, self._value);

  if (ret === IS_ERROR) reject(deferred.pact, LASTEST_ERROR);
  else resolve(deferred.pact, ret);
}

/**
 * Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
 *
 * @param {any} self
 * @param {any} newVal
 */
function resolve(self, newVal) {
  if (newVal === self)
    return reject(
      self,
      new TypeError("A promise cannot be resolved in itself.")
    );

  if (newVal && (typeof newVal === "object" || typeof newVal === "function")) {
    var then = getThen(newVal);
    if (then === IS_ERROR) return reject(self, LASTEST_ERROR);
    if (then === self.then && newVal instanceof Promise) {
      self._state = 3;
      self._value = newVal;
      fin(self);
      return;
    } else if (typeof then === "function") {
      handleResolve(then.bind(newVal), self);
      return;
    }
  }
  self._state = 1;
  self._value = newVal;
  fin(self);
}

/**
 *
 *
 * @param {any} self
 * @param {any} newVal
 */
function reject(self, newVal) {
  self._state = 2;
  self._value = newVal;

  if (Promise._onReject) Promise._onReject(self, newVal);

  fin(self);
}

/**
 *
 *
 * @param {any} self
 */
function fin(self) {
  if (self._deferredState === 1) {
    handle(self, self._deferreds);
    self._deferreds = null;
  }

  if (self._deferreds === 2) {
    handle.apply(self, self._deferreds);
  }

  self._deferreds = null;
}

/**
 *
 *
 * @param {any} onFufilled
 * @param {any} onRejected
 * @param {any} pact
 */
function Handler(onFufilled, onRejected, pact) {
  this.onFufilled = typeof onFufilled === "function" ? onFufilled : null;
  this.onRejected = typeof onRejected === "function" ? onRejected : null;
  this.pact = this.pact;
}

/**
 * Abstraction to ensure onResolve and onRejected are only called once.
 *
 * @param {any} fn
 * @param {any} pact
 */
function handleResolve(fn, pact) {
  var done = false;

  var res = tryCallSecond(
    fn,
    function(value) {
      if (done) return;
      done = true;
      resolve(pact, value);
    },
    function(reason) {
      if (done) return;
      done = true;
      reject(pact, reason);
    }
  );

  if (!done && res === IS_ERROR) {
    done = true;
    reject(pact, LASTEST_ERROR);
  }
}
