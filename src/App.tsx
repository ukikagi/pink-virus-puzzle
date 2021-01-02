import React, { useEffect, useReducer } from "react";
import {
  createModel,
  dig,
  GameModel,
  isFallingModel,
  move,
  reset,
} from "./game";
import "./App.css";
import Board, { CELL_H, CELL_W } from "./Board";
import { LEVEL_NROW, LEVEL_NCOL, parseLevel } from "./level";
import { Direction } from "./point";
import { sampleLevels } from "./sampleLevel";
import { Box, Button, MenuItem, Select, TextField } from "@material-ui/core";
import ReactMarkdown from "react-markdown";

const defaultLevelString = sampleLevels[0].data;

const description = `
# Pink Virus Puzzle
かつてパズルゲームサイト「[ぼらＱ](https://web.archive.org/web/20060116224359/http://boraq.hp.infoseek.co.jp/main.htm)」\
に掲載されていたパズルゲーム「Pink Virus」のクローンです。

## ルール
鍵を全部集めて出口を目指しましょう。
- 主人公は上下左右に移動することができます。
  - 移動は重力の影響を受けます：移動後、以下のいずれかの条件を満たすまで落下します。
    1. 主人公のいるマスにハシゴかロープが存在する。
    2. 主人公の下のマスに足場（レンガ・ブロック・ハシゴ・床）が存在する。
  - レンガとブロックのあるマスは通過することができません。
  - 上方向への移動はハシゴのあるマスでのみ可能です。
- 主人公は自分の左下・右下にあるレンガを破壊することができます。
  - 対象のレンガの上に他のレンガやブロックがある場合は破壊することができません。
  - 同時に破壊することができるレンガは5個までです。6個めのレンガを破壊すると最初に破壊したレンガが復活します。
  - 主人公が復活したレンガに埋まってしまった場合はゲームオーバーです。

## 操作方法
- ←/↑/→/↓: 移動
- Z/X: 左下・右下のレンガを壊す
- R: リスタート

## ソースコード
- <https://github.com/ukikagi/pink-virus-puzzle/>
`;

const TICK_DELAY = 100;

type Action =
  | {
      type: "move";
      direction: Direction;
    }
  | {
      type: "dig";
      direction: Direction.LEFT | Direction.RIGHT;
    }
  | {
      type: "fall";
    }
  | {
      type: "reset";
    }
  | {
      type: "load";
      levelString: string;
    }
  | {
      type: "setSelectValue";
      value: string;
    }
  | {
      type: "setLevelString";
      value: string;
    };

interface State {
  selectValue: string;
  levelString: string;
  gameModel: GameModel;
}

const initialState = {
  selectValue: defaultLevelString,
  levelString: defaultLevelString,
  gameModel: createModel(parseLevel(defaultLevelString)),
};

const reducer = (state: State, action: Action): State => {
  return {
    selectValue: selectValueReducer(state.selectValue, action),
    levelString: levelStringReducer(state.levelString, action),
    gameModel: gameModelReducer(state.gameModel, action),
  };
};

const gameModelReducer = (model: GameModel, action: Action): GameModel => {
  switch (action.type) {
    case "move":
      if (isFallingModel(model)) return model;
      return move(model, action.direction);
    case "dig":
      if (isFallingModel(model)) return model;
      return dig(model, action.direction);
    case "fall":
      return move(model, Direction.DOWN);
    case "reset":
      return reset(model);
    case "load":
      return createModel(parseLevel(action.levelString));
    default:
      return model;
  }
};

const selectValueReducer = (selectValue: string, action: Action): string => {
  switch (action.type) {
    case "setSelectValue":
      return action.value;
    default:
      return selectValue;
  }
};

const levelStringReducer = (levelString: string, action: Action): string => {
  switch (action.type) {
    case "setLevelString":
      return action.value;
    default:
      return levelString;
  }
};

function App() {
  const Dispatch = React.createContext(null);
  const [state, dispatch] = useReducer(reducer, initialState);

  const setLevelString = (value: string) =>
    dispatch({ type: "setLevelString", value: value });
  const setSelectValue = (value: string) =>
    dispatch({ type: "setSelectValue", value: value });

  const falling = isFallingModel(state.gameModel);
  useEffect(() => {
    if (!falling) return;
    const interval = setInterval(() => dispatch({ type: "fall" }), TICK_DELAY);
    console.log("setInterval is invoked.");
    return () => clearInterval(interval);
  }, [falling]);

  function loadLevel(levelString: string) {
    dispatch({ type: "load", levelString: levelString });
  }

  function onLevelStringChange(event: React.ChangeEvent<{ value: string }>) {
    setLevelString(event.target.value);
  }

  function onSelectChange(event: React.ChangeEvent<{ value: unknown }>) {
    const newLevelString = event.target.value as string;
    setLevelString(newLevelString);
    setSelectValue(newLevelString);
    loadLevel(newLevelString);
  }

  function onClick() {
    loadLevel(state.levelString);
  }

  function onKeyDown<T>(event: React.KeyboardEvent<T>) {
    switch (event.key) {
      case "ArrowDown":
        dispatch({ type: "move", direction: Direction.DOWN });
        break;
      case "ArrowLeft":
        dispatch({ type: "move", direction: Direction.LEFT });
        break;
      case "ArrowRight":
        dispatch({ type: "move", direction: Direction.RIGHT });
        break;
      case "ArrowUp":
        dispatch({ type: "move", direction: Direction.UP });
        break;
      case "z":
        dispatch({ type: "dig", direction: Direction.LEFT });
        break;
      case "x":
        dispatch({ type: "dig", direction: Direction.RIGHT });
        break;
      case "r":
        dispatch({ type: "reset" });
        break;
    }
    event.preventDefault();
  }

  return (
    <Box className="App">
      <Box style={{ textAlign: "left" }}>
        <ReactMarkdown children={description} />
      </Box>
      <Board
        tabIndex={0}
        onKeyDown={onKeyDown}
        gameModel={state.gameModel}
        width={CELL_W * LEVEL_NCOL}
        height={CELL_H * LEVEL_NROW}
      />
      <TextField
        value={state.levelString}
        rows={3}
        onChange={onLevelStringChange}
        multiline
        variant="outlined"
        style={{ width: 480 }}
      />
      <Box>
        <Select
          variant="outlined"
          value={state.selectValue}
          onChange={onSelectChange}
          style={{ width: 320 }}
        >
          {sampleLevels.map(({ label, data }) => (
            <MenuItem key={label} value={data}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box>
        <Button onClick={onClick} variant="contained">
          Refresh
        </Button>
      </Box>
    </Box>
  );
}

export default App;
