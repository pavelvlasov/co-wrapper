'use strict';

var thunkify = require('thunkify');

module.exports = function(source, options) {
  // wrapper object
  var wrapper = {},
    options = options || {},
    exclude = options.exclude || [],
    properties = options.properties || {};

  Object.keys(source).forEach(function(key) {
    wrapper[key] = source[key];
  });

  if (options.isEventEmitter) {
    // wrap event emitter methods
    Object.keys(require('events').EventEmitter.prototype)
    .forEach(function(key) {
      if (!isFunction(source[key])) return;
      wrapper[key] = source[key].bind(source);
    });
  }

  // define wrapper properties
  Object.keys(properties).forEach(function(propertyName) {
    var property = properties[propertyName],
      propertyObj = {},
      func;

    Object.keys(property).forEach(function(key) {
      if ((key === 'set') || (key === 'get')) return;
      propertyObj[key] = property[key];
    });
    
    if (property.get) {
      if (isFunction(property.get)) {
        func = property.get;
      } else {
        func = function() {
          return source[property.get];
        };
      }
      func.bind(source);
      propertyObj.get = func;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
    }
    if (property.set) {                                                                                                           
      if (isFunction(property.set)) {
        func = property.set;                                    
      } else {                          
        func = function(val) {
          source[property.set] = val;
        };                      
      }
      func.bind(source);
      propertyObj.set = func;
    }                                 
    Object.defineProperty(wrapper, propertyName, propertyObj);
  });

  // wrap source prototype
  var sourcePrototype = Object.getPrototypeOf(source);
  Object.keys(sourcePrototype).forEach(function(key) {
    if (!isFunction(sourcePrototype[key])) return;
    var func = source[key].bind(source);
    if (exclude.indexOf(key) === -1) {
      func = thunkify(func);
    }
    wrapper[key] = func;
  });

  function isFunction(val) {
    return typeof val === 'function';
  }

  return wrapper;
};
