"use strict";

var Promise = require("./core.js");

module.exports = Promise;
Promise.enableSynchronous = function() {
  Promise.prototype.isPending = function() {
    return this.getState() === 0;
  };

  Promise.prototype.isFulfilled = function() {
    return this.getState() === 1;
  };

  Promise.prototype.isRejected = function() {
    return this.getState() === 2;
  };

  Promise.prototype.getValue = function() {
    if (this._54 === 3) return this._34.getValue();

    if (!this.isFulfilled())
      throw new Error("Cannot get a value of an unfulfilled promise.");

    return this._34;
  };

  Promise.prototype.getReason = function() {
    if (this._54 === 3) return this._34.getReason();

    if (!this.isRejected())
      throw new Error(
        "Cannot get a rejection reason of a non-rejected promise."
      );

    return this._34;
  };

  Promise.prototype.getState = function() {
    if (this._54 === 3) return this._34.getState();

    if (this._54 === -1 || this._54 === -2) return 0;

    return this._54;
  };
};

Promise.disableSynchronous = function() {
  Promise.prototype.isPending = undefined;
  Promise.prototype.isFulfilled = undefined;
  Promise.prototype.isRejected = undefined;
  Promise.prototype.getValue = undefined;
  Promise.prototype.getReason = undefined;
  Promise.prototype.getState = undefined;
};
