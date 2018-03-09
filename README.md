# pact

This is a simple implementation of Promises. It is a super set of ES6 Promises designed to have readable, performant code and to provide just the extensions that are absolutely necessary for using promises today.

**N.B.** This promise exposes internals via underscore (`_`) prefixed properties. If you use these, your code will break with each new release.

## Installation

**Server:**

    $ npm install pact

## Usage

```javascript
var Promise = require("pact");

var promise = new Promise(function(resolve, reject) {
  get("http://www.google.com", function(err, res) {
    if (err) reject(err);
    else resolve(res);
  });
});
```

If you need [domains](https://iojs.org/api/domain.html) support, you should instead use:

```js
var Promise = require("promise/domains");
```

If you are in an environment that implements `setImmediate` and don't want the optimisations provided by asap, you can use:

```js
var Promise = require("promise/setimmediate");
```

If you only want part of the features, e.g. just a pure ES6 polyfill:

```js
var Promise = require("promise/lib/es6");
// or require('promise/domains/es6');
// or require('promise/setimmediate/es6');
```

## Unhandled Rejections

By default, promises silence any unhandled rejections.

You can enable logging of unhandled ReferenceErrors and TypeErrors via:

```js
require("promise/lib/reject").enable();
```

Due to the performance cost, you should only do this during development.

You can enable logging of all unhandled rejections if you need to debug an exception you think is being swallowed by promises:

```js
require("promise/lib/reject").enable({ allRejections: true });
```

Due to the high probability of false positives, I only recommend using this when debugging specific issues that you think may be being swallowed. For the preferred debugging method, see `Promise#done(onFulfilled, onRejected)`.

`rejection-tracking.enable(options)` takes the following options:

* allRejections (`boolean`) - track all exceptions, not just reference errors and type errors. Note that this has a high probability of resulting in false positives if your code loads data optimisticly
* whitelist (`Array<ErrorConstructor>`) - this defaults to `[ReferenceError, TypeError]` but you can override it with your own list of error constructors to track.
* `onUnhandled(id, error)` and `onHandled(id, error)` - you can use these to provide your own customised display for errors. Note that if possible you should indicate that the error was a false positive if `onHandled` is called. `onHandled` is only called if `onUnhandled` has already been called.

To reduce the chance of false-positives there is a delay of up to 2 seconds before errors are logged. This means that if you attach an error handler within 2 seconds, it won't be logged as a false positive. ReferenceErrors and TypeErrors are only subject to a 100ms delay due to the higher likelihood that the error is due to programmer error.

## API

Before all examples, you will need:

```js
var Promise = require("pact");
```

### new Promise(resolver)

This creates and returns a new promise. `resolver` must be a function. The `resolver` function is passed two arguments:

1.  `resolve` should be called with a single argument. If it is called with a non-promise value then the promise is fulfilled with that value. If it is called with a promise (A) then the returned promise takes on the state of that new promise (A).
2.  `reject` should be called with a single argument. The returned promise will be rejected with that argument.

### Static Functions

These methods are invoked by calling `Promise.methodName`.

#### Promise.resolve(value)

(deprecated aliases: `Promise.from(value)`, `Promise.cast(value)`)

Converts values and foreign promises into Promises/A+ promises. If you pass it a value then it returns a Promise for that value. If you pass it something that is close to a promise (such as a jQuery attempt at a promise) it returns a Promise that takes on the state of `value` (rejected or fulfilled).

#### Promise.reject(value)

Returns a rejected promise with the given value.

#### Promise.all(array)

Returns a promise for an array. If it is called with a single argument that `Array.isArray` then this returns a promise for a copy of that array with any promises replaced by their fulfilled values. e.g.

```js
Promise.all([Promise.resolve("a"), "b", Promise.resolve("c")]).then(function(
  res
) {
  assert(res[0] === "a");
  assert(res[1] === "b");
  assert(res[2] === "c");
});
```

### Prototype Methods

These methods are invoked on a promise instance by calling `myPromise.methodName`

### Promise#then(onFulfilled, onRejected)

This method follows the [Promises/A+ spec](http://promises-aplus.github.io/promises-spec/). It explains things very clearly so I recommend you read it.

Either `onFulfilled` or `onRejected` will be called and they will not be called more than once. They will be passed a single argument and will always be called asynchronously (in the next turn of the event loop).

If the promise is fulfilled then `onFulfilled` is called. If the promise is rejected then `onRejected` is called.

The call to `.then` also returns a promise. If the handler that is called returns a promise, the promise returned by `.then` takes on the state of that returned promise. If the handler that is called returns a value that is not a promise, the promise returned by `.then` will be fulfilled with that value. If the handler that is called throws an exception then the promise returned by `.then` is rejected with that exception.

#### Promise#catch(onRejected)

Sugar for `Promise#then(null, onRejected)`, to mirror `catch` in synchronous code.

#### Promise#done(onFulfilled, onRejected)

_Non Standard_

The same semantics as `.then` except that it does not return a promise and any exceptions are re-thrown so that they can be logged (crashing the application in non-browser environments)

## License

MIT
