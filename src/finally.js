"use strict";

var Promise = require("./core.js");

module.exports = Promise;
Promise.prototype.finally = function(fn) {
  return this.then(
    function(val) {
      return Promise.resolve(fn()).then(function() {
        return val;
      });
    },
    function(err) {
      return Promise.resolve(fn()).then(function() {
        throw err;
      });
    }
  );
};
