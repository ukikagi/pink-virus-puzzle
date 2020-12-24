import React, { useState } from "react";
import Board from "./board";
import {
  canWalkThrough,
  countGold,
  Field,
  getTile,
  isDiggable as isBreakable,
  isFalling,
  setTile,
} from "./field";
import { Level, Tile } from "./level";
import { MoveDirection as Direction, movePoint, Point } from "./point";
import { sampleLevel } from "./sampleLevel";
import { clone2dArray, range } from "./utils";

const MAXQ = 5;

function createModel(level: Level) {
  const width = level.width;
  const height = level.height;

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

  const field: Field = { value, width, height };
  return { field, chara, exit };
}

export default function Game(props: { width: number; height: number }) {
  const initialModel = createModel(sampleLevel);

  const [field, setField] = useState<Field>(initialModel.field);
  const [chara, setChara] = useState<Point>(initialModel.chara);
  const [queue, setQueue] = useState<Point[]>([]);
  const [exit, setExit] = useState<Point>(initialModel.exit);
  const [beated, setBeated] = useState<boolean>(false);

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    switch (e.key) {
      case "ArrowDown":
        move(Direction.DOWN);
        break;
      case "ArrowLeft":
        move(Direction.LEFT);
        break;
      case "ArrowRight":
        move(Direction.RIGHT);
        break;
      case "ArrowUp":
        move(Direction.UP);
        break;
      case "z":
        dig(Direction.LEFT);
        break;
      case "x":
        dig(Direction.RIGHT);
        break;
      case "r":
        reset(sampleLevel);
        break;
    }
  }

  function reset(level: Level): void {
    const { field, chara, exit } = createModel(level);
    setField(field);
    setChara(chara);
    setQueue([]);
    setExit(exit);
    setBeated(false);
  }

  function reflectChange(mutableField: Field, chara: Point, exit: Point): void {
    if (getTile(mutableField, chara) === Tile.GOLD) {
      setTile(mutableField, chara, Tile.BLANK);
    }
    if (getTile(mutableField, chara) === Tile.EXIT) {
      setBeated(true);
    }
    if (countGold(mutableField) === 0) {
      setTile(mutableField, exit, Tile.EXIT);
    }
  }

  function move(dir: Direction): void {
    if (dir === Direction.UP && getTile(field, chara) !== Tile.LADDER) {
      return;
    }
    const newPoint = movePoint(chara, dir);
    if (!canWalkThrough(field, newPoint)) {
      return;
    }

    let newChara = { ...newPoint };
    let newField = { ...field, value: clone2dArray(field.value) };
    reflectChange(newField, newChara, exit);
    while (isFalling(newField, newChara)) {
      newChara = movePoint(newChara, Direction.DOWN);
      reflectChange(newField, newChara, exit);
    }
    setChara(newChara);
    setField(newField);
  }

  function dig(dir: Direction.LEFT | Direction.RIGHT): void {
    const target = movePoint(movePoint(chara, Direction.DOWN), dir);
    if (!isBreakable(field, target)) {
      return;
    }
    let newField = { ...field, value: clone2dArray(field.value) };
    let newQueue = [...queue];
    setTile(newField, target, Tile.BLANK);
    newQueue.push(target);
    if (newQueue.length > MAXQ) {
      const popped = newQueue.shift()!;
      setTile(newField, popped, Tile.BRICK);
    }
    setField(newField);
    setQueue(newQueue);
  }

  return (
    <div tabIndex={0} onKeyDown={onKeyDown}>
      <Board
        field={field}
        chara={chara}
        width={props.width}
        height={props.height}
      />
    </div>
  );
}
