(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function(condition, format, a, b, c, d, e, f) {
  if ("development" !== 'production') {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

module.exports = invariant;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.satisfyOneOf = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _invariant = require("invariant");

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var entries = function entries(obj) {
    return Object.keys(obj).map(function (key) {
        return [key, obj[key]];
    });
};

var propValidates = function propValidates(_ref) {
    var _ref2 = _slicedToArray(_ref, 2);

    var name = _ref2[0];
    var propValidationFn = _ref2[1];
    return function (props, componentName) {
        return !(propValidationFn(props, name, componentName) instanceof Error);
    };
};

var satisfyOneOf = exports.satisfyOneOf = function satisfyOneOf(propSet) {
    (0, _invariant2.default)("object" === (typeof propSet === "undefined" ? "undefined" : _typeof(propSet)) && null != propSet, "Expected propSet to be an object");

    if (2 > Object.keys(propSet).length) {
        return propSet;
    }

    var propSetValidationFailed = "Expected one in [" + Object.keys(propSet).join(", ") + "] to pass validation";

    var satisfyOne = function satisfyOne(name, propValidationFn) {
        var restOfPropSet = entries(propSet).filter(function (_ref3) {
            var _ref4 = _slicedToArray(_ref3, 1);

            var propName = _ref4[0];
            return propName !== name;
        }).map(propValidates);

        return function (props, propName, componentName) {
            var shouldValidateLocally = null != props[propName];

            if (!shouldValidateLocally) {
                return restOfPropSet.some(function (isValid) {
                    return isValid(props, componentName);
                }) || new Error(propSetValidationFailed);
            }

            return propValidationFn(props, propName, componentName);
        };
    };

    return entries(propSet).reduce(function (props, _ref5) {
        var _ref6 = _slicedToArray(_ref5, 2);

        var name = _ref6[0];
        var propValidationFn = _ref6[1];
        return _extends({}, props, _defineProperty({}, name, satisfyOne(name, propValidationFn)));
    }, {});
};

},{"invariant":1}]},{},[2]);
