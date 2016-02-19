"use strict";

const canvas = document.getElementsByTagName("canvas")[0];
const ctx = canvas.getContext("2d");
const BLOCK_W = 40, BLOCK_H = 40;
const CANVAS_W = BLOCK_W * W, CANVAS_H = BLOCK_H * H;

const Color = [, "DarkRed", "DarkCyan", "GreenYellow", "Khaki", "Red", "Cyan", "Magenta"];

function render() {
  "use strict";
  ctx.clearRect( 0, 0, CANVAS_W, CANVAS_H);
  ctx.strokeStyle = 'black';

  for(let y of range(H)) {
    for(let x of range(W)) {
      if(field[y][x] != Tile.BLANK) {
        drawBlock(x, y, Color[field[y][x]]);
      }
    }
  }

  drawChar(chr.x, chr.y);
}

setInterval(render, 30);

function drawBlock(x, y, color) {
  "use strict";
  ctx.fillStyle = color;
  ctx.fillRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1, BLOCK_H - 1);
  ctx.strokeRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1, BLOCK_H - 1);
}

function drawChar(x, y) {
  "use strict";
  ctx.fillStyle = "pink";
  ctx.fillRect(BLOCK_W * (x+0.2), BLOCK_H * (y+0.2), BLOCK_W * 0.6, BLOCK_H * 0.6);
  ctx.strokeRect(BLOCK_W * (x+0.2), BLOCK_H * (y+0.2), BLOCK_W * 0.6, BLOCK_H * 0.6);
}
