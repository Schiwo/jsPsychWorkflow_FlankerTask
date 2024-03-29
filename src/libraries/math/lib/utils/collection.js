"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.containsCollections = containsCollections;
exports.deepForEach = deepForEach;
exports.deepMap = deepMap;
exports.reduce = reduce;
exports.scatter = scatter;

var _is = require("./is");

var _IndexError = require("../error/IndexError");

var _array = require("./array");

function containsCollections(array) {
  for (var i = 0; i < array.length; i++) {
    if ((0, _is.isCollection)(array[i])) {
      return true;
    }
  }

  return false;
}
/**
 * Recursively loop over all elements in a given multi dimensional array
 * and invoke the callback on each of the elements.
 * @param {Array | Matrix} array
 * @param {Function} callback     The callback method is invoked with one
 *                                parameter: the current element in the array
 */


function deepForEach(array, callback) {
  if ((0, _is.isMatrix)(array)) {
    array = array.valueOf();
  }

  for (var i = 0, ii = array.length; i < ii; i++) {
    var value = array[i];

    if (Array.isArray(value)) {
      deepForEach(value, callback);
    } else {
      callback(value);
    }
  }
}
/**
 * Execute the callback function element wise for each element in array and any
 * nested array
 * Returns an array with the results
 * @param {Array | Matrix} array
 * @param {Function} callback   The callback is called with two parameters:
 *                              value1 and value2, which contain the current
 *                              element of both arrays.
 * @param {boolean} [skipZeros] Invoke callback function for non-zero values only.
 *
 * @return {Array | Matrix} res
 */


function deepMap(array, callback, skipZeros) {
  if (array && typeof array.map === 'function') {
    // TODO: replace array.map with a for loop to improve performance
    return array.map(function (x) {
      return deepMap(x, callback, skipZeros);
    });
  } else {
    return callback(array);
  }
}
/**
 * Reduce a given matrix or array to a new matrix or
 * array with one less dimension, applying the given
 * callback in the selected dimension.
 * @param {Array | Matrix} mat
 * @param {number} dim
 * @param {Function} callback
 * @return {Array | Matrix} res
 */


function reduce(mat, dim, callback) {
  var size = Array.isArray(mat) ? (0, _array.arraySize)(mat) : mat.size();

  if (dim < 0 || dim >= size.length) {
    // TODO: would be more clear when throwing a DimensionError here
    throw new _IndexError.IndexError(dim, size.length);
  }

  if ((0, _is.isMatrix)(mat)) {
    return mat.create(_reduce(mat.valueOf(), dim, callback));
  } else {
    return _reduce(mat, dim, callback);
  }
}
/**
 * Recursively reduce a matrix
 * @param {Array} mat
 * @param {number} dim
 * @param {Function} callback
 * @returns {Array} ret
 * @private
 */


function _reduce(mat, dim, callback) {
  var i, ret, val, tran;

  if (dim <= 0) {
    if (!Array.isArray(mat[0])) {
      val = mat[0];

      for (i = 1; i < mat.length; i++) {
        val = callback(val, mat[i]);
      }

      return val;
    } else {
      tran = _switch(mat);
      ret = [];

      for (i = 0; i < tran.length; i++) {
        ret[i] = _reduce(tran[i], dim - 1, callback);
      }

      return ret;
    }
  } else {
    ret = [];

    for (i = 0; i < mat.length; i++) {
      ret[i] = _reduce(mat[i], dim - 1, callback);
    }

    return ret;
  }
}
/**
 * Transpose a matrix
 * @param {Array} mat
 * @returns {Array} ret
 * @private
 */


function _switch(mat) {
  var I = mat.length;
  var J = mat[0].length;
  var i, j;
  var ret = [];

  for (j = 0; j < J; j++) {
    var tmp = [];

    for (i = 0; i < I; i++) {
      tmp.push(mat[i][j]);
    }

    ret.push(tmp);
  }

  return ret;
} // TODO: document function scatter


function scatter(a, j, w, x, u, mark, c, f, inverse, update, value) {
  // a arrays
  var avalues = a._values;
  var aindex = a._index;
  var aptr = a._ptr; // c arrays

  var cindex = c._index; // vars

  var k, k0, k1, i; // check we need to process values (pattern matrix)

  if (x) {
    // values in j
    for (k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
      // row
      i = aindex[k]; // check value exists in current j

      if (w[i] !== mark) {
        // i is new entry in j
        w[i] = mark; // add i to pattern of C

        cindex.push(i); // x(i) = A, check we need to call function this time

        if (update) {
          // copy value to workspace calling callback function
          x[i] = inverse ? f(avalues[k], value) : f(value, avalues[k]); // function was called on current row

          u[i] = mark;
        } else {
          // copy value to workspace
          x[i] = avalues[k];
        }
      } else {
        // i exists in C already
        x[i] = inverse ? f(avalues[k], x[i]) : f(x[i], avalues[k]); // function was called on current row

        u[i] = mark;
      }
    }
  } else {
    // values in j
    for (k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
      // row
      i = aindex[k]; // check value exists in current j

      if (w[i] !== mark) {
        // i is new entry in j
        w[i] = mark; // add i to pattern of C

        cindex.push(i);
      } else {
        // indicate function was called on current row
        u[i] = mark;
      }
    }
  }
}