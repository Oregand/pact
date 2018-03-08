"use strict";

import { Promise } from "./core";

export default Promise;

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
