'use strict';

var TestClass = require('./testClass'),
  assert = require('assert'),
  wrap = require('../index');

var testObj = new TestClass();
var wrapper;

describe('Wrapped object', function() {
  it('create', function() {
    wrapper = wrap(testObj, {
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
    wrapper.isWrapper = true;
  });

  it('should contains `foo` property', function() {
    assert.equal(wrapper.foo, 'foo');
    wrapper.foo = 'new';
    assert.equal(wrapper.foo, 'new');
    assert.equal(testObj._foo, 'new');
  });

  it('should contains `bar` property', function() {
    assert.equal(wrapper.bar, 'bar');
    wrapper.bar = 'new';
    assert.equal(wrapper.bar, 'new');
    assert.equal(testObj._bar, 'new');
  });

  it('should be event emitter', function(done) {
    wrapper.on('myevent', function(val) {
      assert.equal(val, 'success');
      done();
    });
    wrapper.emit('myevent', 'success');
  });

  it('should have sync method', function() {
    assert.equal(wrapper.getFooBarSync(), 'newnew');
  });

  it('should have wrapper async method', function *() {
    var fooBar = yield wrapper.getFooBar();
    assert.equal(fooBar, 'newnew');
  });
});
