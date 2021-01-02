import {
  canGoThrough,
  countJewel,
  Field,
  getTile,
  isBreakable,
  isFalling,
  setTile,
} from "./field";
import { Level, Tile } from "./level";
import { Direction, movePoint, Point } from "./point";
import { clone2dArray, range } from "./utils";

const MAXQ = 5;

export interface GameModel {
  level: Level;
  field: Field;
  chara: Point;
  exit: Point;
  queue: Point[];
  beated: boolean;
}

function cloneModel(gameState: GameModel): GameModel {
  return JSON.parse(JSON.stringify(gameState));
}

function reflect(mutModel: GameModel): void {
  const { field: mutField, chara, exit } = mutModel;
  if (getTile(mutField, chara) === Tile.JEWEL) {
    setTile(mutField, chara, Tile.BLANK);
  }
  if (getTile(mutField, chara) === Tile.EXIT) {
    mutModel.beated = true;
  }
  if (countJewel(mutField) === 0) {
    setTile(mutField, exit, Tile.EXIT);
  }
}

export function isFallingModel(model: GameModel): boolean {
  return isFalling(model.field, model.chara);
}

export function createModel(level: Level): GameModel {
  const { width, height } = level;

  let value: Tile[][] = clone2dArray(level.field);
  let chara: Point = { x: 0, y: 0 };
  let exit: Point = { x: 0, y: 0 };

  range(height).forEach((y) => {
    range(width).forEach((x) => {
      switch (value[y][x]) {
        case Tile.CHARA:
          value[y][x] = Tile.BLANK;
          chara = { x, y };
          break;
        case Tile.EXIT:
          value[y][x] = Tile.BRICK;
          exit = { x, y };
          break;
      }
    });
  });

  const field = { value, width, height };
  return { level, field, chara, exit, queue: [], beated: false };
}

export function reset(model: GameModel): GameModel {
  return createModel(model.level);
}

export function move(model: GameModel, dir: Direction): GameModel {
  if (
    model.beated ||
    getTile(model.field, model.chara) === Tile.BRICK ||
    (dir === Direction.UP && getTile(model.field, model.chara) !== Tile.LADDER)
  ) {
    return model;
  }
  const newChara = movePoint(model.chara, dir);
  if (!canGoThrough(model.field, newChara)) {
    return model;
  }

  model = cloneModel(model);
  model.chara = newChara;
  reflect(model);

  return model;
}

export function dig(
  model: GameModel,
  dir: Direction.LEFT | Direction.RIGHT
): GameModel {
  if (model.beated) {
    return model;
  }
  const target = movePoint(movePoint(model.chara, Direction.DOWN), dir);
  if (!isBreakable(model.field, target)) {
    return model;
  }

  model = cloneModel(model);
  setTile(model.field, target, Tile.BLANK);
  model.queue.push(target);
  if (model.queue.length > MAXQ) {
    const popped = model.queue.shift()!;
    if (getTile(model.field, popped) === Tile.BLANK) {
      setTile(model.field, popped, Tile.BRICK);
    }
  }

  return model;
}
