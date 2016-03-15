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
        var restOfPropSet = Object.entries(propSet).filter(function (_ref3) {
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

    return Object.entries(propSet).reduce(function (props, _ref5) {
        var _ref6 = _slicedToArray(_ref5, 2);

        var name = _ref6[0];
        var propValidationFn = _ref6[1];
        return _extends({}, props, _defineProperty({}, name, satisfyOne(name, propValidationFn)));
    }, {});
};