"use strict";

// load("library.js")

const W = 12, H = 12;
var field;
var interval;

var char_x = 0, char_y = 11;

const dx = [1, 0, -1, 0]
const dy = [0, 1, 0, -1]

const sampledata =
  "000004000000" +
  "311110311113" +
  "310013310013" +
  "311113011113" +
  "004003000400" +
  "110311113011" +
  "013310013310" +
  "113011110311" +
  "043000000340" +
  "311113311113" +
  "310013310013" +
  "311113311113";

// 0空間 1煉瓦(消) 2ブロック(固) 3はしご 4ロープ 5出口 6お宝 7キャラ

const MoveDir = {
  RIGHT : 0,
  DOWN : 1,
  LEFT : 2,
  UP : 3
};

const DigDir = {
  RIGHT : 0,
  LEFT : 1
};

const Tile = {
  BLANK : 0,
  BRICK : 1,
  BLOCK : 2,
  LADDER : 3,
  ROPE : 4,
  // EXIT : 5,
  // GOLD : 6,
  // CHAR : 7
};

function newGame() {
  // clearInterval(interval);
  init();
  clearInterval(interval);
}

function init() {
  field = makeArray([H, W], 0);
  for(var y of range(H)) {
    for(var x of range(W)) {
      field[y][x] = parseInt(sampledata[y * W + x]);
      // console.log((y * W + x) +  ", " + sampledata[y * W + x]);
    }
  }
}

function movable(y, x) {
  return (0 <= x && x < W && 0 <= y && y < H
          && [Tile.BRICK, Tile.BLOCK].indexOf(field[y][x]) == -1);
}

function move(dir) {
  if(dir == MoveDir.UP && field[char_y][char_x] != Tile.LADDER) {
    return;
  }
  var xp = char_x + dx[dir], yp = char_y + dy[dir];
  if(movable(yp, xp)) {
    char_x = xp, char_y = yp;
  }
  fall();
}

function isInAir(){
  return ([Tile.LADDER, Tile.ROPE].indexOf(field[char_y][char_x]) == -1
    && char_y < H-1
    && [Tile.BRICK, Tile.BLOCK, Tile.LADDER].indexOf(field[char_y+1][char_x]) == -1);
}

function fall() {
  while(isInAir()) {
    char_y = char_y + 1;
  }
}

function dig(dir) {
  console.log("dig" + dir)
  var tgt_x = char_x + [1, -1][dir], tgt_y = char_y + 1;
  if(0 <= tgt_x && tgt_x < W && 0 <= tgt_y && tgt_y < H &&
  field[tgt_y][tgt_x] == Tile.BRICK &&
  field[tgt_y-1][tgt_x] != Tile.BRICK && field[tgt_y-1][tgt_x] != Tile.BLOCK) {
    field[tgt_y][tgt_x] = Tile.BLANK;
  }
}

newGame();
