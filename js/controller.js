"use strict";

let keyAction = {};

keyAction[37] = function(){ move(MoveDir.LEFT) };
keyAction[39] = function(){ move(MoveDir.RIGHT) };
keyAction[40] = function(){ move(MoveDir.DOWN) };
keyAction[38] = function(){ move(MoveDir.UP) };
keyAction[90] = function(){ dig(DigDir.LEFT) };
keyAction[88] = function(){ dig(DigDir.RIGHT) };
keyAction[82] = function(){ init() };

document.body.onkeydown = function(e) {
  "use strict";
  if (keyAction[ e.keyCode ] != undefined) {
    keyAction[ e.keyCode ]();
    // render();
  }
};
