import React, { useState } from "react";
import { createModel, dig, GameModel, move, reset } from "./game";
import "./App.css";
import Board from "./Board";
import { parseLevel } from "./level";
import { Direction } from "./point";
import { sampleLevels } from "./sampleLevel";

const defaultLabel = sampleLevels[0].label;
const defaultLevelString = sampleLevels[0].data;
const defaultLevel = parseLevel(defaultLevelString);

function App() {
  const [gameModel, setGameModel] = useState<GameModel>(
    createModel(defaultLevel)
  );

  const [selectValue, setSelectValue] = useState(defaultLabel);
  const [levelString, setLevelString] = useState(defaultLevelString);

  function loadLevel(levelString: string) {
    const level = parseLevel(levelString);
    const model = createModel(level);
    setGameModel(model);
  }

  function onLevelStringChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setLevelString(event.target.value);
  }

  function onSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const newLevelString = event.currentTarget.value;
    setLevelString(newLevelString);
    setSelectValue(newLevelString);
    loadLevel(newLevelString);
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    loadLevel(levelString);
    event.preventDefault();
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
    <div className="App">
      <Board
        tabIndex={0}
        onKeyDown={onKeyDown}
        field={gameModel.field}
        chara={gameModel.chara}
        width={480}
        height={480}
      />
      <form onSubmit={onSubmit}>
        <div>
          <textarea
            value={levelString}
            onChange={onLevelStringChange}
            rows={5}
            cols={60}
          />
        </div>
        <select value={selectValue} onChange={onSelectChange}>
          {sampleLevels.map(({ label, data }) => (
            <option key={label} value={data}>
              {label}
            </option>
          ))}
        </select>
        <input type="submit" value="Refresh" />
      </form>
    </div>
  );
}

export default App;
