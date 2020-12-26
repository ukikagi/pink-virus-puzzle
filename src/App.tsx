import React, { useState } from "react";
import { createModel, dig, GameModel, move, reset } from "./game";
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
  - 主人公は重力の影響を受けます：移動後、以下のいずれかの条件を満たすまで落下します。
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

function App() {
  const [selectValue, setSelectValue] = useState(defaultLevelString);
  const [levelString, setLevelString] = useState(defaultLevelString);
  const [gameModel, setGameModel] = useState<GameModel>(
    createModel(parseLevel(defaultLevelString))
  );

  function loadLevel(levelString: string) {
    const level = parseLevel(levelString);
    const model = createModel(level);
    setGameModel(model);
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
    loadLevel(levelString);
  }

  function onKeyDown<T>(event: React.KeyboardEvent<T>) {
    switch (event.key) {
      case "ArrowDown":
        setGameModel(move(gameModel, Direction.DOWN));
        break;
      case "ArrowLeft":
        setGameModel(move(gameModel, Direction.LEFT));
        break;
      case "ArrowRight":
        setGameModel(move(gameModel, Direction.RIGHT));
        break;
      case "ArrowUp":
        setGameModel(move(gameModel, Direction.UP));
        break;
      case "z":
        setGameModel(dig(gameModel, Direction.LEFT));
        break;
      case "x":
        setGameModel(dig(gameModel, Direction.RIGHT));
        break;
      case "r":
        setGameModel(reset(gameModel));
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
        gameModel={gameModel}
        width={CELL_W * LEVEL_NCOL}
        height={CELL_H * LEVEL_NROW}
      />
      <TextField
        value={levelString}
        rows={3}
        onChange={onLevelStringChange}
        multiline
        variant="outlined"
        style={{ width: 480 }}
      />
      <Box>
        <Select
          variant="outlined"
          value={selectValue}
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
