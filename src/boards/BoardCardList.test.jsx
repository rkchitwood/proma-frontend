import React from "react";
import { render } from "@testing-library/react";
import Boards from "./BoardCardList";

it("matches snapshot", function () {
  const { asFragment } = render(<Boards />);
  expect(asFragment()).toMatchSnapshot();
});
