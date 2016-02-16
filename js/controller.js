"use strict";

document.body.onkeydown = function( e ) {
  var keys = {
    37: function(){ move(2); }, // Left
    39: function(){ move(0); }, // Right
    40: function(){ move(1); }, // Down
    38: function(){ move(3); }, // Up
    90: function(){ dig(DigDir.LEFT); }, // Z
    88: function(){ dig(DigDir.RIGHT); }  // X
  };

  if (typeof keys[ e.keyCode ] != 'undefined') {
    keys[ e.keyCode ]();
    render();
  }
};
