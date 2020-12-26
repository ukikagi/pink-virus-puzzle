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

export function reset(oldModel: GameModel): GameModel {
  return createModel(oldModel.level);
}

export function move(oldModel: GameModel, dir: Direction): GameModel {
  if (
    oldModel.beated ||
    getTile(oldModel.field, oldModel.chara) == Tile.BRICK ||
    (dir === Direction.UP &&
      getTile(oldModel.field, oldModel.chara) !== Tile.LADDER)
  ) {
    return oldModel;
  }
  const newChara = movePoint(oldModel.chara, dir);
  if (!canGoThrough(oldModel.field, newChara)) {
    return oldModel;
  }

  let newModel = cloneModel(oldModel);
  newModel.chara = newChara;
  reflect(newModel);
  while (isFalling(newModel.field, newModel.chara)) {
    newModel.chara = movePoint(newModel.chara, Direction.DOWN);
    reflect(newModel);
  }

  return newModel;
}

export function dig(
  oldModel: GameModel,
  dir: Direction.LEFT | Direction.RIGHT
): GameModel {
  if (oldModel.beated) {
    return oldModel;
  }
  const target = movePoint(movePoint(oldModel.chara, Direction.DOWN), dir);
  if (!isBreakable(oldModel.field, target)) {
    return oldModel;
  }

  let newModel = cloneModel(oldModel);
  setTile(newModel.field, target, Tile.BLANK);
  newModel.queue.push(target);
  if (newModel.queue.length > MAXQ) {
    const popped = newModel.queue.shift()!;
    if (getTile(newModel.field, popped) === Tile.BLANK) {
      setTile(newModel.field, popped, Tile.BRICK);
    }
  }

  return newModel;
}
