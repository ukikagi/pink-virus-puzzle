import React, { useRef, useEffect } from "react";
import { Tile } from "./level";
import { Point } from "./point";
import { fieldToTiles } from "./field";
import { GameModel } from "./game";
import tileset from "./oubliette_tileset_transparent.png";
import useImage from "use-image";

const TILE_W = 16;
const TILE_H = 16;

export const CELL_W = TILE_W * 3;
export const CELL_H = TILE_H * 3;

const TilePos = {
  [Tile.BLANK]: { x: 6, y: 5 },
  [Tile.BRICK]: { x: 4, y: 0 },
  [Tile.BLOCK]: { x: 3, y: 0 },
  [Tile.LADDER]: { x: 5, y: 4 },
  [Tile.ROPE]: { x: 6, y: 2 },
  [Tile.EXIT]: { x: 3, y: 3 },
  [Tile.JEWEL]: { x: 4, y: 3 },
  [Tile.CHARA]: { x: 1, y: 7 },
};

interface BoardProps {
  gameModel: GameModel;
  width: number;
  height: number;
  tabIndex: number;
  onKeyDown: (event: React.KeyboardEvent<HTMLCanvasElement>) => void;
}

function drawCell(
  context: CanvasRenderingContext2D,
  tileset: HTMLImageElement,
  { x, y }: Point,
  tile: Tile
) {
  const { x: tilePosX, y: tilePosY } = TilePos[tile];
  context.drawImage(
    tileset,
    tilePosX * TILE_W + 0.25,
    tilePosY * TILE_H + 0.25,
    TILE_W - 0.25,
    TILE_H - 0.25,
    CELL_W * x,
    CELL_H * y,
    CELL_W,
    CELL_H
  );
}

export default function Board(props: BoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tilesetImage] = useImage(tileset);

  useEffect(() => {
    if (!tilesetImage) return;

    const canvas = canvasRef.current!;
    if (!canvas) return;

    canvas.focus();
    const context = canvas.getContext("2d")!;

    context.fillStyle = "#0f0f3e";
    context.fillRect(0, 0, props.width, props.height);

    const { field, chara, beated } = props.gameModel;
    fieldToTiles(field)
      .filter(({ tile }) => tile !== Tile.BLANK)
      .forEach(({ point, tile }) => {
        drawCell(context, tilesetImage, point, tile);
      });
    if (!beated) drawCell(context, tilesetImage, chara, Tile.CHARA);

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
