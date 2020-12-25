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
import { Level, parseLevel, Tile } from "./level";
import { Direction, movePoint, Point } from "./point";
import { sampleLevels } from "./sampleLevel";
import { clone2dArray, range } from "./utils";

const MAXQ = 5;
const defaultLabel = sampleLevels[0].label;
const defaultLevelString = sampleLevels[0].data;
const defaultLevel = parseLevel(defaultLevelString, 12, 12);

interface GameProp {
  width: number;
  height: number;
}

interface GameState {
  field: Field;
  chara: Point;
  exit: Point;
  queue: Point[];
  beated: boolean;
}

function cloneState(gameState: GameState): GameState {
  return JSON.parse(JSON.stringify(gameState));
}

function initializeGameState(level: Level): GameState {
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

  const field = { value, width, height };
  return { field, chara, exit, queue: [], beated: false };
}

export default function Game(props: GameProp) {
  const [gameState, setGameState] = useState<GameState>(
    initializeGameState(defaultLevel)
  );

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
    setGameState(initializeGameState(level));
  }

  function reflect(mutState: GameState): void {
    const { field: mutField, chara, exit } = mutState;
    if (getTile(mutField, chara) === Tile.JEWEL) {
      setTile(mutField, chara, Tile.BLANK);
    }
    if (getTile(mutField, chara) === Tile.EXIT) {
      mutState.beated = true;
    }
    if (countJewel(mutField) === 0) {
      setTile(mutField, exit, Tile.EXIT);
    }
  }

  function move(dir: Direction): void {
    let state = cloneState(gameState);
    if (
      dir === Direction.UP &&
      getTile(state.field, state.chara) !== Tile.LADDER
    ) {
      return;
    }
    const newPoint = movePoint(state.chara, dir);
    if (!canGoThrough(state.field, newPoint)) {
      return;
    }

    state.chara = newPoint;
    reflect(state);
    while (isFalling(state.field, state.chara)) {
      state.chara = movePoint(state.chara, Direction.DOWN);
      reflect(state);
    }

    setGameState(state);
  }

  function dig(dir: Direction.LEFT | Direction.RIGHT): void {
    let state = cloneState(gameState);
    const target = movePoint(movePoint(state.chara, Direction.DOWN), dir);
    if (!isBreakable(state.field, target)) {
      return;
    }

    setTile(state.field, target, Tile.BLANK);
    state.queue.push(target);
    if (state.queue.length > MAXQ) {
      const popped = state.queue.shift()!;
      setTile(state.field, popped, Tile.BRICK);
    }

    setGameState(state);
  }

  return (
    <div tabIndex={0} onKeyDown={onKeyDown}>
      <Board
        field={gameState.field}
        chara={gameState.chara}
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
