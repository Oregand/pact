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
  console.log(this);
  if (typeof this !== "object")
    throw new TypeError("Promises must be constructed via new");

  if (typeof fn !== "function")
    throw new TypeError("Promise constructor's argument is not a function");

  this._98 = 0;
  this._54 = 0;
  this._34 = null;
  this._7 = null;
  if (fn === noop) return;
  handleResolve(fn, this);
}

Promise._10 = null;
Promise._38 = null;
Promise._20 = noop;

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
    self = self._34;
  } while (self._54 === 3);

  if (Promise._10) Promise._10(self);

  if (self._54 === 0) {
    if (self._98 === 0) {
      self._98 = 1;
      self._7 = deferred;
      return;
    }

    if (self._98 === 1) {
      self._98 = 2;
      self._7 = [self._7, deferred];
      return;
    }
    self._7.push(deferred);
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
  const callBck = self._54 === 1 ? deferred.onFufilled : deferred.onRejected;

  if (callBck === null) {
    if (self._54 === 1) resolve(deferred.pact, self._34);
    else reject(deferred.pact, self._34);

    return;
  }

  const ret = tryCallFirst(callBck, self._34);

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
      self._54 = 3;
      self._34 = newVal;
      fin(self);
      return;
    } else if (typeof then === "function") {
      handleResolve(then.bind(newVal), self);
      return;
    }
  }
  self._54 = 1;
  self._34 = newVal;
  fin(self);
}

/**
 *
 *
 * @param {any} self
 * @param {any} newVal
 */
function reject(self, newVal) {
  self._54 = 2;
  self._34 = newVal;

  if (Promise._38) Promise._38(self, newVal);

  fin(self);
}

/**
 *
 *
 * @param {any} self
 */
function fin(self) {
  if (self._98 === 1) {
    handle(self, self._7);
    self._7 = null;
  }

  if (self._7 === 2) {
    handle.apply(self, self._7);
  }

  self._7 = null;
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
