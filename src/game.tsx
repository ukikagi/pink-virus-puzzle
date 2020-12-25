import React, { useState } from "react";
import Board from "./board";
import {
  canGoThrough,
  countJewel,
  Field,
  getTile,
  isBreakable,
  isFalling,
  setTile,
} from "./field";
import { createModel, Level, parseLevel, Tile } from "./level";
import { Direction, movePoint, Point } from "./point";
import { sampleLevels } from "./sampleLevel";
import { clone2dArray } from "./utils";

const MAXQ = 5;

interface GameProp {
  width: number;
  height: number;
}

export default function Game(props: GameProp) {
  const defaultLabel = sampleLevels[0].label;
  const defaultLevelString = sampleLevels[0].data;
  const defaultLevel = parseLevel(defaultLevelString, 12, 12);

  const initialModel = createModel(defaultLevel);

  const [field, setField] = useState<Field>(initialModel.field);
  const [chara, setChara] = useState<Point>(initialModel.chara);
  const [queue, setQueue] = useState<Point[]>([]);
  const [exit, setExit] = useState<Point>(initialModel.exit);
  const [beated, setBeated] = useState<boolean>(false);

  const [selectValue, setSelectValue] = useState(defaultLabel);
  const [level, setLevel] = useState(defaultLevel);
  const [levelString, setLevelString] = useState(defaultLevelString);

  function onLevelStringChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setLevelString(event.target.value);
  }

  function onSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const levelString = event.currentTarget.value;
    const level = parseLevel(levelString, 12, 12);
    setLevelString(event.currentTarget.value);
    setSelectValue(event.currentTarget.value);
    reset(level);
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    const level = parseLevel(levelString, 12, 12);
    reset(level);
    event.preventDefault();
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    switch (event.key) {
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
        reset(level);
        break;
    }
  }

  function reset(level: Level): void {
    setLevel(level);
    const { field, chara, exit } = createModel(level);
    setField(field);
    setChara(chara);
    setQueue([]);
    setExit(exit);
    setBeated(false);
  }

  function reflect(mutableField: Field, chara: Point, exit: Point): void {
    if (getTile(mutableField, chara) === Tile.JEWEL) {
      setTile(mutableField, chara, Tile.BLANK);
    }
    if (getTile(mutableField, chara) === Tile.EXIT) {
      setBeated(true);
    }
    if (countJewel(mutableField) === 0) {
      setTile(mutableField, exit, Tile.EXIT);
    }
  }

  function move(dir: Direction): void {
    if (dir === Direction.UP && getTile(field, chara) !== Tile.LADDER) {
      return;
    }
    const newPoint = movePoint(chara, dir);
    if (!canGoThrough(field, newPoint)) {
      return;
    }

    let newChara = { ...newPoint };
    let newField = { ...field, value: clone2dArray(field.value) };
    reflect(newField, newChara, exit);
    while (isFalling(newField, newChara)) {
      newChara = movePoint(newChara, Direction.DOWN);
      reflect(newField, newChara, exit);
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
      <form onSubmit={onSubmit}>
        <div>
          <textarea
            value={levelString}
            onChange={onLevelStringChange}
            rows={5}
            cols={60}
          />
        </div>
        <select value={selectValue} onChange={onSelectChange}>
          {sampleLevels.map(({ label, data }) => (
            <option key={label} value={data}>
              {label}
            </option>
          ))}
        </select>
        <input type="submit" value="Refresh" />
      </form>
    </div>
  );
}
