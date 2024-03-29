"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.improveErrorMessage = improveErrorMessage;

var _is = require("../../../utils/is");

function improveErrorMessage(err, fnName, value) {
  // TODO: add information with the index (also needs transform in expression parser)
  var details;

  if (String(err).indexOf('Unexpected type') !== -1) {
    details = arguments.length > 2 ? ' (type: ' + (0, _is.typeOf)(value) + ', value: ' + JSON.stringify(value) + ')' : ' (type: ' + err.data.actual + ')';
    return new TypeError('Cannot calculate ' + fnName + ', unexpected type of argument' + details);
  }

  if (String(err).indexOf('complex numbers') !== -1) {
    details = arguments.length > 2 ? ' (type: ' + (0, _is.typeOf)(value) + ', value: ' + JSON.stringify(value) + ')' : '';
    return new TypeError('Cannot calculate ' + fnName + ', no ordering relation is defined for complex numbers' + details);
  }

  return err;
}