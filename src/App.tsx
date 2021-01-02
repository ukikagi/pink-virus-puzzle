import { Box } from "@material-ui/core";
import React, { useEffect, useReducer } from "react";
import "./App.css";
import Board from "./Board";
import { Description } from "./Description";
import { gameModelReducer, isWaiting } from "./game";
import LevelInput, {
  levelStringReducer,
  selectValueReducer,
} from "./LevelInput";
import { sampleLevels } from "./sampleLevel";
import { Action, ActionType, AppContext, initialize, State } from "./state";

const DEFAULT_LEVEL_STRING = sampleLevels[0].data;
const TICK_DELAY = 80;

const reducer = (state: State, action: Action): State => ({
  selectValue: selectValueReducer(state.selectValue, action),
  levelString: levelStringReducer(state.levelString, action),
  gameModel: gameModelReducer(state.gameModel, action),
});

function App() {
  const [state, dispatch] = useReducer(
    reducer,
    DEFAULT_LEVEL_STRING,
    initialize
  );

  const waiting = isWaiting(state.gameModel);
  useEffect(() => {
    if (!waiting) return;
    const interval = setInterval(
      () => dispatch({ type: ActionType.Tick }),
      TICK_DELAY
    );
    return () => clearInterval(interval);
  }, [waiting]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <Box className="App">
        <Description />
        <Board tabIndex={0} />
        <LevelInput />
      </Box>
    </AppContext.Provider>
  );
}

export default App;
