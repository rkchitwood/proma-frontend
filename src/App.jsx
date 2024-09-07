import React, { useState, useEffect } from 'react';
import { BrowserRouter } from "react-router-dom";
import useLocalStorage from "./hooks/useLocalStorage";
import Navigation from "./routes-nav/Navigation";
import AppRoutes from './routes-nav/AppRoutes';
import LoadingSpinner from './loadingSpinner/LoadingSpinner';
import PromaApi from './api/api';
import UserContext from './auth/UserContext';


export const TOKEN_STORAGE_ID = "jobly-token";

/** Proma frontend application.
 * 
 * - infoLoaded: manages loading spinner while user data
 * is pulled from API
 * - currentUser: user object from API - passed around
 * to determine whether user is logged in.
 * - token: for logged in users, this is their authentication JWT
 * that is required for most API calls. It is read from localStorage
 * and synced there via useLocalStorage hook.
 */
function App() {
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);

  // Load user info from API. Runs on login and logout.
  useEffect(function loadUserInfo() {
    async function getCurrentUser() {
      if(token) {
        try {
          //put token on API class
          PromaApi.token = token;
          setCurrentUser(currentUser);
        } catch(err) {
          console.error("app loadUserInfo error: ", err);
          setCurrentUser(null);
        }
      }
      setInfoLoaded(true);
    }
    // set infoLoaded to false while getCurrentUser runs
    setInfoLoaded(false);
    getCurrentUser();
  }, [token]);

  /** Handles site-wide logout. */
  function logout() {
    setCurrentUser(null);
    setToken(null);
  }

  /** Handles site-wide signup. */
  async function signup(data) {
    try {
      const { user, token } = await PromaApi.signup(data);
      setToken(token);
      setCurrentUser(user);
      return { success: true };
    } catch(errors) {
      console.error("signup failed: ", errors);
      return { success: false, errors };
    }
  }

  /** Handles site-wide login. */
  async function login(data) {
    try {
      const { user, token } = await PromaApi.login(data);
      setToken(token);
      setCurrentUser(user);
      return { success: true };
    } catch(errors) {
      console.error("login failed", errors);
      return { success: false, errors };
    }
  }

  if (!infoLoaded) return <LoadingSpinner />;

  return (
    <BrowserRouter>
      <UserContext.Provider
          value={{ currentUser, setCurrentUser }}>
        <div className="App">
          <Navigation logout={logout} />
          <AppRoutes login={login} signup={signup} />
        </div>
      </UserContext.Provider>
    </BrowserRouter>
  )
}

export default App;