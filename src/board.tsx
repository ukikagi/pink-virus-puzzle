import React, { useRef, useEffect } from "react";
import { Tile } from "./level";
import { Point } from "./point";
import { Field } from "./field";
import { range } from "./utils";

const BLOCK_W = 40;
const BLOCK_H = 40;

const Color = {
  [Tile.BLANK]: "",
  [Tile.BRICK]: "DarkRed",
  [Tile.BLOCK]: "DarkCyan",
  [Tile.LADDER]: "GreenYellow",
  [Tile.ROPE]: "Khaki",
  [Tile.EXIT]: "Red",
  [Tile.GOLD]: "Cyan",
  [Tile.CHARA]: "",
};

interface BoardProps {
  field: Field;
  chara: Point;
  width: number;
  height: number;
  style?: React.CSSProperties;
}

export default function Board(props: BoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const contex = canvasRef.current!.getContext("2d")!;
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

    range(props.field.height).forEach((y) => {
      range(props.field.width).forEach((x) => {
        if (props.field.value[y][x] !== Tile.BLANK) {
          drawBlock({ x, y }, Color[props.field.value[y][x]]);
        }
      });
    });
    drawChara(props.chara);
  }, [props]);
  return <canvas ref={canvasRef} {...props} />;
}
