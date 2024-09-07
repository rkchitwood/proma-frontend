import React, { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import UserContext from "../auth/UserContext";

/** Higher-order component for private routes.
 * 
 * This component will only continue to route if there is
 * valid current user, otherwise redirects to login form.
 */

const PrivateRoute = () => {
    const { currentUser } = useContext(UserContext);
  
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
  
    return <Outlet />;
  };

export default PrivateRoute;