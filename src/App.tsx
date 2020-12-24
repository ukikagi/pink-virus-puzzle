import React, { useState, useRef, useEffect } from "react";
import { Point, Tile, Level } from "./level";
import { range } from "./library";
import { sampleLevel } from "./sampleLevel";
import "./App.css";

const BLOCK_W = 40;
const BLOCK_H = 40;

enum MoveDir {
  RIGHT = 0,
  DOWN = 1,
  LEFT = 2,
  UP = 3,
}

enum DigDir {
  RIGHT,
  LEFT,
}

const Color = [
  "",
  "DarkRed",
  "DarkCyan",
  "GreenYellow",
  "Khaki",
  "Red",
  "Cyan",
  "Magenta",
];

interface BoardProps {
  level: Level;
  width: number;
  height: number;
  style?: React.CSSProperties;
}

function Board(props: BoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const contex = canvasRef.current!.getContext("2d")!;
    const level = props.level;
    contex.clearRect(0, 0, props.width, props.height);

    function drawBlock({ x, y }: Point, color: string) {
      contex.fillStyle = color;
      contex.fillRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W, BLOCK_H);
      contex.strokeRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W, BLOCK_H);
    }

    function drawChara({ x, y }: Point) {
      const cornerX = BLOCK_W * (x + 0.2);
      const cornerY = BLOCK_H * (y + 0.2);
      const width = BLOCK_W * 0.6;
      const height = BLOCK_H * 0.6;

      contex.fillStyle = "pink";
      contex.fillRect(cornerX, cornerY, width, height);
      contex.strokeRect(cornerX, cornerY, width, height);
    }

    range(level.height).forEach((y) => {
      range(level.width).forEach((x) => {
        if (level.field[y][x] != Tile.BLANK) {
          drawBlock({ x, y }, Color[level.field[y][x]]);
        }
      });
    });
    drawChara(level.chara);
  }, [props.level]);
  return <canvas ref={canvasRef} {...props} />;
}

function App() {
  return (
    <div className="App">
      <Board level={sampleLevel} width={1000} height={1000} />
    </div>
  );
}

export default App;
