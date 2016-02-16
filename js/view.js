"use strict";

var canvas = document.getElementsByTagName("canvas")[0];
var ctx = canvas.getContext("2d");
var CANVAS_W = 400, CANVAS_H = 400;
var BLOCK_W = CANVAS_W / W, BLOCK_H = CANVAS_H / H;

const Color = [, "DarkRed", "DarkCyan", "GreenYellow", "Khaki", "Red", "Cyan", "Magenta"]

function render() {
  ctx.clearRect( 0, 0, CANVAS_W, CANVAS_H);
  ctx.strokeStyle = 'black';

  for(let y of range(H)) {
    for(let x of range(W)) {
      if(field[y][x] != Tile.BLANK) {
        drawBlock(x, y, Color[field[y][x]])
      }
    }
  }

  drawChar(char_x, char_y);
}

setInterval(render, 30);

function drawBlock(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1, BLOCK_H - 1);
  ctx.strokeRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1, BLOCK_H - 1);
}

function drawChar(x, y) {
  ctx.fillStyle = "pink";
  ctx.fillRect(BLOCK_W * (x+0.2), BLOCK_H * (y+0.2), BLOCK_W * 0.6, BLOCK_H * 0.6);
  ctx.strokeRect(BLOCK_W * (x+0.2), BLOCK_H * (y+0.2), BLOCK_W * 0.6, BLOCK_H * 0.6);
}