import React, { useRef, useEffect, useContext } from "react";
import { LEVEL_NCOL, LEVEL_NROW, Tile } from "./level";
import { Direction, Point } from "./point";
import { fieldToTiles } from "./field";
import tileset from "./oubliette_tileset_transparent.png";
import useImage from "use-image";
import { ActionType, AppContext } from "./state";

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

const WIDTH = CELL_W * LEVEL_NCOL;
const HEIGHT = CELL_H * LEVEL_NROW;

interface BoardProps {
  tabIndex: number;
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

  const { state, dispatch } = useContext(AppContext)!;

  useEffect(() => {
    if (!tilesetImage) return;

    const canvas = canvasRef.current!;
    if (!canvas) return;
    const context = canvas.getContext("2d")!;

    context.fillStyle = "#0f0f3e";
    context.fillRect(0, 0, WIDTH, HEIGHT);

    const { field, chara, beated } = state.gameModel;
    fieldToTiles(field)
      .filter(({ tile }) => tile !== Tile.BLANK)
      .forEach(({ point, tile }) => {
        drawCell(context, tilesetImage, point, tile);
      });
    if (!beated) drawCell(context, tilesetImage, chara, Tile.CHARA);

    return () => context.clearRect(0, 0, WIDTH, HEIGHT);
  });

  const onKeyDown = (event: React.KeyboardEvent<HTMLCanvasElement>) => {
    switch (event.key) {
      case "ArrowDown":
        dispatch({ type: ActionType.Move, direction: Direction.DOWN });
        break;
      case "ArrowLeft":
        dispatch({ type: ActionType.Move, direction: Direction.LEFT });
        break;
      case "ArrowRight":
        dispatch({ type: ActionType.Move, direction: Direction.RIGHT });
        break;
      case "ArrowUp":
        dispatch({ type: ActionType.Move, direction: Direction.UP });
        break;
      case "z":
        dispatch({ type: ActionType.Dig, direction: Direction.LEFT });
        break;
      case "x":
        dispatch({ type: ActionType.Dig, direction: Direction.RIGHT });
        break;
      case "r":
        dispatch({ type: ActionType.Reset });
        break;
    }
    event.preventDefault();
  };

  return (
    <canvas
      ref={canvasRef}
      width={WIDTH}
      height={HEIGHT}
      tabIndex={props.tabIndex}
      onKeyDown={onKeyDown}
    />
  );
}
