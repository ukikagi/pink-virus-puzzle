import React, { useRef, useEffect } from "react";
import { Tile } from "./level";
import { Point } from "./point";
import { fieldToTiles } from "./field";
import { GameModel } from "./game";

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
  gameModel: GameModel;
  width: number;
  height: number;
  tabIndex: number;
  onKeyDown: (event: React.KeyboardEvent<HTMLCanvasElement>) => void;
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

function drawChara(
  context: CanvasRenderingContext2D,
  { x, y }: Point,
  beated: boolean
) {
  const cornerX = BLOCK_W * (x + 0.2);
  const cornerY = BLOCK_H * (y + 0.2);
  const width = BLOCK_W * 0.6;
  const height = BLOCK_H * 0.6;

  context.fillStyle = beated ? "Yellow" : "Pink";
  context.fillRect(cornerX, cornerY, width, height);
  context.strokeRect(cornerX, cornerY, width, height);
}

export default function Board(props: BoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    canvas.focus();
    const context = canvas.getContext("2d")!;

    const { field, chara, beated } = props.gameModel;
    fieldToTiles(field)
      .filter(({ tile }) => tile !== Tile.BLANK)
      .forEach(({ point, tile }) => {
        drawBlock(context, point, Color[tile]);
      });
    drawChara(context, chara, beated);

    return () => context.clearRect(0, 0, props.width, props.height);
  });
  return (
    <canvas
      ref={canvasRef}
      width={props.width}
      height={props.height}
      tabIndex={props.tabIndex}
      onKeyDown={props.onKeyDown}
    />
  );
}
