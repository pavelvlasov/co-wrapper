'use strict';

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
