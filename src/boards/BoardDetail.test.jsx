import React from "react";
import { render } from "@testing-library/react";
import Board from "./BoardDetail";
import { MemoryRouter, Route } from "react-router-dom";
import { UserProvider } from "../testUtils";

it("renders without crashing", function () {
  render(
      <MemoryRouter>
        <UserProvider>
          <Board />
        </UserProvider>
      </MemoryRouter>,
  );
});

it("matches snapshot", function () {
    const { asFragment } = render(
        <MemoryRouter initialEntries={["/boards/1"]}>
          <UserProvider>
            <Route path="/boards/:boardId">
              <Board />
            </Route>
          </UserProvider>
        </MemoryRouter>,
    );
    expect(asFragment()).toMatchSnapshot();
});