"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateBundle = validateBundle;
exports.createSnapshotFromFactories = createSnapshotFromFactories;
exports.validateTypeOf = validateTypeOf;

var _assert = _interopRequireDefault(require("assert"));

var allIsFunctions = _interopRequireWildcard(require("./is"));

var _create = require("../core/create");

var _string = require("./string");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function validateBundle(expectedBundleStructure, bundle) {
  var originalWarn = console.warn;

  console.warn = function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (args.join(' ').indexOf('is moved to') !== -1 && args.join(' ').indexOf('Please use the new location instead') !== -1) {
      // Ignore warnings like:
      // Warning: math.type.isNumber is moved to math.isNumber in v6.0.0. Please use the new location instead.
      return;
    }

    originalWarn.apply(console, args);
  };

  try {
    var issues = []; // see whether all expected functions and objects are there

    traverse(expectedBundleStructure, function (expectedType, path) {
      var actualValue = get(bundle, path);
      var actualType = validateTypeOf(actualValue);
      var message = actualType === 'undefined' ? 'Missing entry in bundle. ' + "Path: ".concat(JSON.stringify(path), ", expected type: ").concat(expectedType, ", actual type: ").concat(actualType) : 'Unexpected entry type in bundle. ' + "Path: ".concat(JSON.stringify(path), ", expected type: ").concat(expectedType, ", actual type: ").concat(actualType);

      if (actualType !== expectedType) {
        issues.push({
          actualType: actualType,
          expectedType: expectedType,
          message: message
        });
        console.warn(message);
      }
    }); // see whether there are any functions or objects that shouldn't be there

    traverse(bundle, function (actualValue, path) {
      var actualType = validateTypeOf(actualValue);
      var expectedType = get(expectedBundleStructure, path) || 'undefined'; // FIXME: ugly to have these special cases

      if (path.join('.').indexOf('docs.') !== -1) {
        // ignore the contents of docs
        return;
      }

      if (path.join('.').indexOf('all.') !== -1) {
        // ignore the contents of all dependencies
        return;
      }

      var message = expectedType === 'undefined' ? 'Unknown entry in bundle. ' + 'Is there a new function added which is missing in this snapshot test? ' + "Path: ".concat(JSON.stringify(path), ", expected type: ").concat(expectedType, ", actual type: ").concat(actualType) : 'Unexpected entry type in bundle. ' + "Path: ".concat(JSON.stringify(path), ", expected type: ").concat(expectedType, ", actual type: ").concat(actualType);

      if (actualType !== expectedType) {
        issues.push({
          actualType: actualType,
          expectedType: expectedType,
          message: message
        });
        console.warn(message);
      }
    }); // assert on the first issue (if any)

    if (issues.length > 0) {
      var _issues$ = issues[0],
          actualType = _issues$.actualType,
          expectedType = _issues$.expectedType,
          message = _issues$.message;
      console.warn("".concat(issues.length, " bundle issues found"));

      _assert["default"].strictEqual(actualType, expectedType, message);
    }
  } finally {
    console.warn = originalWarn;
  }
}
/**
 * Based on an object with factory functions, create the expected
 * structures for ES6 export and a mathjs instance.
 * @param {Object} factories
 * @return {{expectedInstanceStructure: Object, expectedES6Structure: Object}}
 */


function createSnapshotFromFactories(factories) {
  var math = (0, _create.create)(factories);
  var allFactoryFunctions = {};
  var allFunctionsConstantsClasses = {};
  var allFunctionsConstants = {};
  var allTransformFunctions = {};
  var allDependencyCollections = {};
  var allClasses = {};
  var allNodeClasses = {};
  Object.keys(factories).forEach(function (factoryName) {
    var factory = factories[factoryName];
    var name = factory.fn;
    var isTransformFunction = factory.meta && factory.meta.isTransformFunction;
    var isClass = !isLowerCase(name[0]) && validateTypeOf(math[name]) === 'Function';
    var dependenciesName = factory.fn + (isTransformFunction ? 'Transform' : '') + 'Dependencies';
    allFactoryFunctions[factoryName] = 'Function';
    allFunctionsConstantsClasses[name] = validateTypeOf(math[name]);
    allDependencyCollections[dependenciesName] = 'Object';

    if (isTransformFunction) {
      allTransformFunctions[name] = 'Function';
    }

    if (isClass) {
      if ((0, _string.endsWith)(name, 'Node')) {
        allNodeClasses[name] = 'Function';
      } else {
        allClasses[name] = 'Function';
      }
    } else {
      allFunctionsConstants[name] = validateTypeOf(math[name]);
    }
  });
  var embeddedDocs = {};
  Object.keys(factories).forEach(function (factoryName) {
    var factory = factories[factoryName];
    var name = factory.fn;

    if (isLowerCase(factory.fn[0])) {
      // ignore class names starting with upper case
      embeddedDocs[name] = 'Object';
    }
  });
  embeddedDocs = exclude(embeddedDocs, ['equalScalar', 'apply', 'addScalar', 'multiplyScalar', 'eye', 'print', 'divideScalar', 'parse', 'compile', 'parser', 'chain', 'reviver']);
  var allTypeChecks = {};
  Object.keys(allIsFunctions).forEach(function (name) {
    if (name.indexOf('is') === 0) {
      allTypeChecks[name] = 'Function';
    }
  });
  var allErrorClasses = {
    ArgumentsError: 'Function',
    DimensionError: 'Function',
    IndexError: 'Function'
  };

  var expectedInstanceStructure = _objectSpread({}, allFunctionsConstantsClasses, {
    on: 'Function',
    off: 'Function',
    once: 'Function',
    emit: 'Function',
    "import": 'Function',
    "var": 'Function',
    eval: 'Function',
    "typeof": 'Function',
    config: 'Function',
    create: 'Function',
    factory: 'Function'
  }, allTypeChecks, {}, allErrorClasses, {
    expression: {
      transform: _objectSpread({}, allTransformFunctions),
      mathWithTransform: _objectSpread({}, exclude(allFunctionsConstants, ['chain']), {
        config: 'Function'
      }),
      // deprecated stuff:
      // docs: embeddedDocs,
      node: _objectSpread({}, allNodeClasses),
      parse: 'Function',
      Parser: 'Function'
    },
    // deprecated stuff:
    type: _objectSpread({}, allTypeChecks, {}, allClasses),
    json: {
      reviver: 'Function'
    },
    error: _objectSpread({}, allErrorClasses)
  });

  var expectedES6Structure = _objectSpread({}, exclude(allFunctionsConstantsClasses, ['typeof', 'eval', 'var', 'E', 'false', 'Infinity', 'NaN', 'null', 'PI', 'true']), {
    create: 'Function',
    config: 'Function',
    factory: 'Function',
    deprecatedEval: 'Function',
    deprecatedImport: 'Function',
    deprecatedVar: 'Function',
    deprecatedTypeof: 'Function',
    _true: 'boolean',
    _false: 'boolean',
    _null: 'null',
    _Infinity: 'number',
    _NaN: 'number'
  }, allTypeChecks, {}, allErrorClasses, {}, allDependencyCollections, {}, allFactoryFunctions, {
    docs: embeddedDocs,
    // deprecated stuff:
    expression: {
      node: _objectSpread({}, allNodeClasses),
      parse: 'Function',
      Parser: 'Function'
    },
    type: _objectSpread({}, allTypeChecks, {}, allClasses),
    json: {
      reviver: 'Function'
    },
    error: _objectSpread({}, allErrorClasses)
  });

  return {
    expectedInstanceStructure: expectedInstanceStructure,
    expectedES6Structure: expectedES6Structure
  };
}

function validateTypeOf(x) {
  if (x && x.type === 'Unit') {
    return 'Unit';
  }

  if (x && x.type === 'Complex') {
    return 'Complex';
  }

  if (Array.isArray(x)) {
    return 'Array';
  }

  if (x === null) {
    return 'null';
  }

  if (typeof x === 'function') {
    return 'Function';
  }

  if (_typeof(x) === 'object') {
    return 'Object';
  }

  return _typeof(x);
}

function traverse(obj) {
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (value, path) {};
  var path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  // FIXME: ugly to have these special cases
  if (path.length > 0 && path[0].indexOf('Dependencies') !== -1) {
    // special case for objects holding a collection of dependencies
    callback(obj, path);
  } else if (validateTypeOf(obj) === 'Array') {
    obj.map(function (item, index) {
      return traverse(item, callback, path.concat(index));
    });
  } else if (validateTypeOf(obj) === 'Object') {
    Object.keys(obj).forEach(function (key) {
      // FIXME: ugly to have these special cases
      // ignore special case of deprecated docs
      if (key === 'docs' && path.join('.') === 'expression') {
        return;
      }

      traverse(obj[key], callback, path.concat(key));
    });
  } else {
    callback(obj, path);
  }
}

function get(object, path) {
  var child = object;

  for (var i = 0; i < path.length; i++) {
    var key = path[i];
    child = child ? child[key] : undefined;
  }

  return child;
}
/**
 * Create a copy of the provided `object` and delete
 * all properties listed in `excludedProperties`
 * @param {Object} object
 * @param {string[]} excludedProperties
 * @return {Object}
 */


function exclude(object, excludedProperties) {
  var strippedObject = _extends({}, object);

  excludedProperties.forEach(function (excludedProperty) {
    delete strippedObject[excludedProperty];
  });
  return strippedObject;
}

function isLowerCase(text) {
  return typeof text === 'string' && text.toLowerCase() === text;
}