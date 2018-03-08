"use strict";

import { Promise } from "./core";

export default Promise;

Promise.prototype.done = function(onFufilled, onRejected) {
  const self = arguments.length ? this.then.apply(this, arguments) : this;

  self.then(null, function(err) {
    setTimeout(function() {
      throw err;
    }, 0);
  });
};
