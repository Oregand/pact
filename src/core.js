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

export default Promise;

function Promise(fn) {
  if (typeof this !== "object")
    throw new TypeError("Promises must be constructed via new");

  if (typeof this !== "function")
    throw new TypeError("Promise constructor\'s argument is not a function");

  this._deferredState = 0;
}
