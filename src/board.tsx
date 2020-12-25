import React, { useRef, useEffect } from "react";
import { Tile } from "./level";
import { Point } from "./point";
import { Field, getTile } from "./field";
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
  [Tile.JEWEL]: "Cyan",
  [Tile.CHARA]: "",
};

interface BoardProps {
  field: Field;
  chara: Point;
  width: number;
  height: number;
}

function fieldToTiles(field: Field) {
  return range(field.height).flatMap((y) =>
    range(field.width).map((x) => {
      const point = { x, y };
      const tile = getTile(field, point);
      return { point, tile };
    })
  );
}

function drawBlock(
  context: CanvasRenderingContext2D,
  { x, y }: Point,
  color: string
) {
  context.fillStyle = color;
  context.fillRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W, BLOCK_H);
  context.strokeRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W, BLOCK_H);
}

function drawChara(context: CanvasRenderingContext2D, { x, y }: Point) {
  const cornerX = BLOCK_W * (x + 0.2);
  const cornerY = BLOCK_H * (y + 0.2);
  const width = BLOCK_W * 0.6;
  const height = BLOCK_H * 0.6;

  context.fillStyle = "pink";
  context.fillRect(cornerX, cornerY, width, height);
  context.strokeRect(cornerX, cornerY, width, height);
}

export default function Board(props: BoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const context = canvasRef.current.getContext("2d")!;
    context.clearRect(0, 0, props.width, props.height);

    fieldToTiles(props.field)
      .filter(({ tile }) => tile !== Tile.BLANK)
      .forEach(({ point, tile }) => {
        drawBlock(context, point, Color[tile]);
      });
    drawChara(context, props.chara);
  }, [props]);
  return <canvas ref={canvasRef} width={props.width} height={props.height} />;
}
