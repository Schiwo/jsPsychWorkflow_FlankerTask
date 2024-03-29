"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.csEreach = csEreach;

var _csMark = require("./csMark");

var _csMarked = require("./csMarked");

function csEreach(a, k, parent, w) {
  // a arrays
  var aindex = a._index;
  var aptr = a._ptr;
  var asize = a._size; // columns

  var n = asize[1]; // initialize top

  var top = n; // vars

  var p, p0, p1, len; // mark node k as visited

  (0, _csMark.csMark)(w, k); // loop values & index for column k

  for (p0 = aptr[k], p1 = aptr[k + 1], p = p0; p < p1; p++) {
    // A(i,k) is nonzero
    var i = aindex[p]; // only use upper triangular part of A

    if (i > k) {
      continue;
    } // traverse up etree


    for (len = 0; !(0, _csMarked.csMarked)(w, i); i = parent[i]) {
      // L(k,i) is nonzero, last n entries in w
      w[n + len++] = i; // mark i as visited

      (0, _csMark.csMark)(w, i);
    }

    while (len > 0) {
      // decrement top & len
      --top;
      --len; // push path onto stack, last n entries in w

      w[n + top] = w[n + len];
    }
  } // unmark all nodes


  for (p = top; p < n; p++) {
    // use stack value, last n entries in w
    (0, _csMark.csMark)(w, w[n + p]);
  } // unmark node k


  (0, _csMark.csMark)(w, k); // s[top..n-1] contains pattern of L(k,:)

  return top;
}