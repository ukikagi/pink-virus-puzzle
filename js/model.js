"use strict";

const W = 12, H = 12;
const MAXQ = 5;

const dx = [1, 0, -1, 0]
const dy = [0, 1, 0, -1]

let field, queue, rest;
let chr, exit;

const MoveDir = { RIGHT : 0, DOWN : 1, LEFT : 2, UP : 3};

const DigDir = { RIGHT : 0, LEFT : 1 };

const Tile = { BLANK : 0, BRICK : 1, BLOCK : 2, LADDER : 3,
               ROPE : 4,  EXIT : 5,  GOLD : 6,  CHARA : 7 };

const sampledata1 = "000004000000" +
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

const sampledata2 = "000000000000" +
                    "000007000000" +
                    "000003500000" +
                    "000003100000" +
                    "000003100000" +
                    "000003100000" +
                    "000003130000" +
                    "000000130000" +
                    "000003130000" +
                    "000003100000" +
                    "000003130000" +
                    "000006130000";

const sampledata3 = "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000070000000000031115000000031666000000031000000000031111"

newGame();

function newGame() {
  "use strict";
  init();
}


function init() {
  "use strict";
  loadLevel(sampledata2);
  queue = [];
  check();
}

function loadLevel(data) {
  "use strict";
  field = makeArray([H, W], 0);
  chr = {x:0, y:0};
  exit = {x:0, y:0};
  rest = 0;

  for(let y of range(H)) {
    for(let x of range(W)) {
      field[y][x] = parseInt(data[y * W + x]);

      if(field[y][x] == Tile.CHARA) {
        chr.x = x, chr.y = y;
        field[y][x] = Tile.BLANK;
      } else if(field[y][x] == Tile.EXIT) {
        exit.x = x, exit.y = y;
        field[y][x] = Tile.BRICK;
      } else if(field[y][x] == Tile.GOLD) {
        rest++;
      }
    }
  }
}

function move(dir) {
  "use strict";
  var xp = chr.x + dx[dir], yp = chr.y + dy[dir];
  if(dir == MoveDir.UP && field[chr.y][chr.x] != Tile.LADDER) {
    return;
  }
  if(!isInRange(xp, yp)) { return; }
  if(isPenetrable(xp, yp) || field[yp][xp] == Tile.EXIT) {
    chr.x = xp, chr.y = yp;
    check();
  }
  fall();
}

function fall() {
  "use strict";
  while(isInAir(chr.x, chr.y)) {
    chr.y = chr.y + 1;
    check();
  }
}

function check() {
  "use strict";
  assert(rest >= 0);

  if(field[chr.y][chr.x] == Tile.GOLD) {
    field[chr.y][chr.x] = Tile.BLANK;
    rest -= 1;
  }

  if(field[chr.y][chr.x] == Tile.EXIT) {
    clear = true;
  }

  if(rest == 0) {
    field[exit.y][exit.x] = Tile.EXIT;
    for(let i in range(queue.length-1, 0, -1)) {
      if(queue[i].x == exit.x && queue[i].y == exit.y) {
        queue.splice(i, 1);
      }
    }
  }
}

function dig(dir) {
  "use strict";
  var tgt = {x: (chr.x + [1, -1][dir]), y: (chr.y + 1)}
  if(isDigable(tgt.x, tgt.y)) {
    field[tgt.y][tgt.x] = Tile.BLANK;
    queue.push(tgt);
    if(queue.length > MAXQ) {
      let p = queue.shift();
      field[p.y][p.x] = Tile.BRICK;
    }
  }
}

function isInRange(x, y) {
  "use strict";
  return (0 <= x && x < W && 0 <= y && y < H);
}

function isDigable(x, y) {
  "use strict";
  return (isInRange(x, y) && field[y][x] == Tile.BRICK && isPenetrable(x, y-1));
}

function isPenetrable(x, y) {
  "use strict";
  return (isInRange(x, y) && ![Tile.BRICK, Tile.BLOCK, Tile.EXIT].includes(field[y][x]));
}

function isInAir(x, y){
  "use strict";
  return (![Tile.LADDER, Tile.ROPE].includes(field[y][x])
    && y < H - 1
    && isPenetrable(x, y+1)
    && ![Tile.LADDER].includes(field[y+1][x]));
}
