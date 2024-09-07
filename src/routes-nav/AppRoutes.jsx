import React from "react";
import {Routes, Route, Navigate} from "react-router-dom";
import Homepage from "../homepage/Homepage";
import LoginForm from "../auth/LoginForm";
import SignupForm from "../auth/SignupForm";
import BoardCardList from "../boards/BoardCardList";
import PrivateRoute from "./PrivateRoute";
import { Container } from 'reactstrap';
import BoardDetail from "../boards/BoardDetail";
import SessionCardList from "../sessions/SessionCardList"
import SessionDetail from "../sessions/SessionDetail";
import UserProjectList from "../projects/UserProjectList";

/** Site-wide routes.
 * 
 * Authorization component, <PrivateRoute> wraps parts of site
 * that should only be visibile on login.
 * 
 * Visiting a non-existant route redirects to homepage.
 */
function AppRoutes({ login, signup }) {
    return (
        <Container className="pt-5">
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/login" element={<LoginForm login={login} />} />
                <Route path="/signup" element={<SignupForm signup={signup} />} />
                
                <Route element={<PrivateRoute />}>
                    <Route path="/boards" element={<BoardCardList />} />
                    <Route path="/boards/:boardId" element={<BoardDetail />} />
                    <Route path="/projects" element={<UserProjectList />} />
                    <Route path="/sessions" element={<SessionCardList />} />
                    <Route path="/sessions/:sessionId" element={<SessionDetail />} />
                </Route>
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Container>
    );
}

export default AppRoutes;