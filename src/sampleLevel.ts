import { readLevel } from "./level";

const sampleLevelWidth = 12;
const sampleLevelHeight = 12;
const sampleLevelString =
  "000004000000" +
  "311110311113" +
  "310013310013" +
  "311113011113" +
  "004003000400" +
  "110311113011" +
  "013310013310" +
  "113011110311" +
  "043000000340" +
  "311113311113" +
  "310013310013" +
  "311113311113";

export const sampleLevel = readLevel(
  sampleLevelString,
  sampleLevelHeight,
  sampleLevelWidth
);
