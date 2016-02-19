function range(x, y, z) {
  "use strict";
  if(z == undefined) { z = 1; }
  if(y == undefined) { y = x, x = 0; }
  assert(z != 0, "arg 3 must not be zero.");
  let result = [];
  for(; (z > 0 ? x < y : y < x); x += z) {
    result.push(x);
  }
  return result;
}

function makeArray(dim, val) {
  "use strict";
  if(val == undefined) { val = 0; }
  if(dim.length == 0) {
    return val;
  } else { assert(dim.length >= 1);
    let n = dim[0];
    let odim = dim.slice(1);
    let result = [];
    for(let i of range(n)) {
      result.push(makeArray(odim, val));
    }
    return result;
  }
}

function assert(b, msg) {
  "use strict";
  if(msg == undefined) { msg = "assertion error."; }
  if(!b) { throw msg; }
}

Array.prototype.sum = function() {
  "use strict";
  return this.reduce(function(x,y){return x + y;}, 0);
};
