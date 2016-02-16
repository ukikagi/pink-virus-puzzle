"use strict";

var keyAction = {};

document.body.onkeydown = function(e) {
  var keys = {
    37: function(){ move(MoveDir.LEFT); },  // Left
    39: function(){ move(MoveDir.RIGHT); }, // Right
    40: function(){ move(MoveDir.DOWN); },  // Down
    38: function(){ move(MoveDir.UP); },    // Up
    90: function(){ dig(DigDir.LEFT); },    // Z
    88: function(){ dig(DigDir.RIGHT); },   // X
    82: function(){ init(); }    // R
  };

  if (typeof keys[ e.keyCode ] != 'undefined') {
    keys[ e.keyCode ]();
    // render();
  }
};
