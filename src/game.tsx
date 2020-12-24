import React, { useState } from "react";
import Board from "./board";
import { canWalkThrough, countGold, Field, getTile, isFalling } from "./field";
import { Level, Tile } from "./level";
import { MoveDirection, movePoint, Point } from "./point";
import { sampleLevel } from "./sampleLevel";
import { clone2dArray, range } from "./utils";

function initializeModel(level: Level) {
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

function setTile(mutableField: Field, p: Point, tile: Tile): void {
  mutableField.value[p.y][p.x] = tile;
}

function reflectChange(mutableField: Field, chara: Point, exit: Point): void {
  if (getTile(mutableField, chara) === Tile.GOLD) {
    setTile(mutableField, chara, Tile.BLANK);
  }
  if (countGold(mutableField) === 0) {
    setTile(mutableField, exit, Tile.EXIT);
  }
}

export default function Game(props: { width: number; height: number }) {
  const { field: initField, chara: initChara, exit } = initializeModel(
    sampleLevel
  );
  const [field, setField] = useState(initField);
  const [chara, setChara] = useState(initChara);
  // const [queue, setQueue] = useState([]);
  // const [beated, setBeated] = useState(false);

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    switch (e.key) {
      case "ArrowDown":
        move(MoveDirection.DOWN);
        break;
      case "ArrowLeft":
        move(MoveDirection.LEFT);
        break;
      case "ArrowRight":
        move(MoveDirection.RIGHT);
        break;
      case "ArrowUp":
        move(MoveDirection.UP);
        break;
    }
  }

  function move(dir: MoveDirection): void {
    if (dir === MoveDirection.UP && getTile(field, chara) !== Tile.LADDER) {
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
      newChara = movePoint(newChara, MoveDirection.DOWN);
      reflectChange(newField, newChara, exit);
    }

    setChara(newChara);
    setField(newField);
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
