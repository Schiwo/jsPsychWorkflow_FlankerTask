"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSumTransform = void 0;

var _is = require("../../utils/is");

var _factory = require("../../utils/factory");

var _errorTransform = require("./utils/errorTransform");

var _sum = require("../../function/statistics/sum");

var name = 'sum';
var dependencies = ['typed', 'config', 'add', '?bignumber', '?fraction'];
var createSumTransform =
/* #__PURE__ */
(0, _factory.factory)(name, dependencies, function (_ref) {
  var typed = _ref.typed,
      config = _ref.config,
      add = _ref.add,
      bignumber = _ref.bignumber,
      fraction = _ref.fraction;
  var sum = (0, _sum.createSum)({
    typed: typed,
    config: config,
    add: add,
    bignumber: bignumber,
    fraction: fraction
  });
  return typed(name, {
    '...any': function any(args) {
      // change last argument dim from one-based to zero-based
      if (args.length === 2 && (0, _is.isCollection)(args[0])) {
        var dim = args[1];

        if ((0, _is.isNumber)(dim)) {
          args[1] = dim - 1;
        } else if ((0, _is.isBigNumber)(dim)) {
          args[1] = dim.minus(1);
        }
      }

      try {
        return sum.apply(null, args);
      } catch (err) {
        throw (0, _errorTransform.errorTransform)(err);
      }
    }
  });
}, {
  isTransformFunction: true
});
exports.createSumTransform = createSumTransform;