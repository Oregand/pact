# pact

This is a simple implementation of Promises. It is a super set of ES6 Promises designed to have readable, performant code and to provide just the extensions that are absolutely necessary for using promises today.

For detailed tutorials on its use, see www.promisejs.org

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
