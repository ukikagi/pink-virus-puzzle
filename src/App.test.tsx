import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

test("renders without an apparent error", () => {
  render(<App />);
});
