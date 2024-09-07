import React from "react";
import UserContext from "./auth/UserContext";

const testUser = {
    id: 1,
    username: "testuser",
    first_name: "testfirst",
    last_name: "testlast",
    email: "test@test.com"
};

const UserProvider =
    ({ children, currentUser = testUser = () => false }) => (
    <UserContext.Provider value={{ currentUser }}>
      {children}
    </UserContext.Provider>
);

export { UserProvider };