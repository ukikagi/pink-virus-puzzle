import { Button, MenuItem, Select, TextField } from "@material-ui/core";
import React, { useContext } from "react";
import { Action, ActionType, AppContext } from "./state";
import { sampleLevels } from "./sampleLevel";

export const selectValueReducer = (
  selectValue: string,
  action: Action
): string => {
  switch (action.type) {
    case ActionType.SetSelectValue:
      return action.value;
    default:
      return selectValue;
  }
};

export const levelStringReducer = (
  levelString: string,
  action: Action
): string => {
  switch (action.type) {
    case ActionType.SetLevelString:
      return action.value;
    default:
      return levelString;
  }
};

const LevelInput = () => {
  const { state, dispatch } = useContext(AppContext)!;

  const setLevelString = (value: string) =>
    dispatch({ type: ActionType.SetLevelString, value: value });
  const setSelectValue = (value: string) =>
    dispatch({ type: ActionType.SetSelectValue, value: value });

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

  function loadLevel(levelString: string) {
    dispatch({ type: ActionType.Load, levelString: levelString });
  }

  return (
    <>
      <TextField
        value={state.levelString}
        rows={3}
        onChange={onLevelStringChange}
        multiline
        variant="outlined"
        style={{ width: 480 }}
      />
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
      <Button onClick={onClick} variant="contained" children="Refresh" />
    </>
  );
};

export default LevelInput;
