import React from "react";
import { createModel, GameModel } from "./game";
import { parseLevel } from "./level";
import { Direction } from "./point";

export interface State {
  selectValue: string;
  levelString: string;
  gameModel: GameModel;
}

export const initialize = (levelString: string) => ({
  selectValue: levelString,
  levelString: levelString,
  gameModel: createModel(parseLevel(levelString)),
});

export enum ActionType {
  Move,
  Dig,
  Reset,
  Tick,
  Load,
  SetSelectValue,
  SetLevelString,
}

export type Action =
  | {
      type: ActionType.Move;
      direction: Direction;
    }
  | {
      type: ActionType.Dig;
      direction: Direction.LEFT | Direction.RIGHT;
    }
  | {
      type: ActionType.Reset;
    }
  | {
      type: ActionType.Tick;
    }
  | {
      type: ActionType.Load;
      levelString: string;
    }
  | {
      type: ActionType.SetSelectValue;
      value: string;
    }
  | {
      type: ActionType.SetLevelString;
      value: string;
    };

interface AppContextInterface {
  state: State;
  dispatch: React.Dispatch<Action>;
}

export const AppContext = React.createContext<AppContextInterface | null>(null);
