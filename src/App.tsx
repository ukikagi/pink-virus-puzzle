import React, { useState } from "react";
import { createModel, dig, GameModel, move, reset } from "./game";
import "./App.css";
import Board, { CELL_H, CELL_W } from "./Board";
import { LEVEL_NROW, LEVEL_NCOL, parseLevel } from "./level";
import { Direction } from "./point";
import { sampleLevels } from "./sampleLevel";
import { Box, Button, MenuItem, Select, TextField } from "@material-ui/core";

const defaultLevelString = sampleLevels[0].data;

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
  }

  return (
    <Box className="App">
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
