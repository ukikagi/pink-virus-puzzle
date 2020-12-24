import { readLevel } from "./level";

const sampleLevelWidth = 12;
const sampleLevelHeight = 12;
const sampleLevelString =
  "000000000000" +
  "000007000000" +
  "000003500000" +
  "000003100000" +
  "000003100000" +
  "000003100000" +
  "000003130000" +
  "000000130000" +
  "000003130000" +
  "000003100000" +
  "000003130000" +
  "000006130000";

export const sampleLevel = readLevel(
  sampleLevelString,
  sampleLevelHeight,
  sampleLevelWidth
);
