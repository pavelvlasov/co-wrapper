# co-wrapper
Wrap each function in object with a thunk. Useful for generator-based flow control such as [co](https://github.com/visionmedia/co).
## How to use it
```js
var EventEmitter = require('events').EventEmitter,
  inherits = require('util').inherits;

var TestClass = module.exports = function() {
  EventEmitter.apply(this, arguments);
  // define some properties
  this._foo = 'foo';
  this._bar = 'bar';

  Object.defineProperty(this, 'foo', {
    get: function() {
      return this._foo;
    },
    set: function(val) {
      this._foo = val;
    }
  });

  Object.defineProperty(this, 'bar', {
    get: function() {
      return this._bar;
    },
    set: function(val) {
      this._bar = val;
    }
  });
};
inherits(TestClass, EventEmitter);

// define async function
TestClass.prototype.getFooBar = function(callback) {
  callback(null, this.foo + this.bar);
};

// define sync function
TestClass.prototype.getFooBarSync = function() {
  return this.foo + this.bar;
};

// wrap oroginal object with co-wrapper
var wrap = require('co-wrapper');
var wrapper = wrapper = wrap(testObj, {
  exclude: ['getFooBarSync'],
  isEventEmitter: true,
  properties: {
    foo: {
      get: '_foo',
      set: function(val) {
        testObj._foo = val;
      }
    },
    bar: {
      get: function() {
        return testObj._bar;
      },
      set: '_bar'
    }
  }
});

(function *() {
  console.log(yield wrapper.getFooBar());
})();

```

## Options
```js
{
  exclude: [], // object functions, that should be excluded
  isEventEmitter: true, // set to true, if object has event emitter functionality
  properties: {
    name: {
      get: function () {return this._foo}, // getters and setters can be String,
      // that defines source object property, or function
      set: '_foo' // function would be run in source object scope
      // other Object.defineProperty parameters
    }
  }
}
```

License: MIT
