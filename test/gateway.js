var Promise = require("../");

exports.deferred = function() {
  var resolve, reject;
  var pact = new Promise(function(_resolve, _reject) {
    resolve = _resolve;
    reject = _reject;
  });
  return {
    pact: pact,
    resolve: resolve,
    reject: reject
  };
};
exports.resolved = Promise.resolve;
exports.rejected = Promise.reject;
