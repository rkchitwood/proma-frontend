import React, { useContext } from "react";
import { NavLink as RouterNavLink, Link } from "react-router-dom";
import { Nav, NavItem, NavLink, Navbar, NavbarBrand } from "reactstrap";
import UserContext from "../auth/UserContext";

/** Navigation bar for site. Shows on every page.
 * 
 * When user is logged in shows links to main features:
 *  - Boards
 *  - Projects
 * When logged out shows links to login & signup
 * 
 * Rendered by App
 */
function Navigation({ logout }) {
    const { currentUser } = useContext(UserContext);

    function loggedOutNav() {
        return(
            <>
                <NavItem>
                    <NavLink tag={RouterNavLink} className="nav-link" to="/login">
                        Login
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={RouterNavLink} className="nav-link" to="/signup">
                        Join
                    </NavLink>
                </NavItem>   
            </>
        );
    }

    function loggedInNav() {
        return (
            <>
                <NavItem>
                    <NavLink tag={RouterNavLink} className="nav-link" to="/boards">
                        Boards
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={RouterNavLink} className="nav-link" to="/projects">
                        Projects
                    </NavLink>
                </NavItem>
                {currentUser.isPm 
                    ? 
                        <NavItem>
                            <NavLink tag={RouterNavLink} className="nav-link" to="/sessions">
                                Team Sessions
                            </NavLink>
                        </NavItem>
                    :
                    <NavItem>
                        <NavLink tag={RouterNavLink} className="nav-link" to="/sessions">
                            My Sessions
                        </NavLink>
                    </NavItem>
                }
                 <NavItem>
                    <NavLink tag={Link} className="nav-link" to="/" onClick={logout}>
                        Log out
                    </NavLink>
                </NavItem>
            </> 
        );
    }

    return (
        <Navbar className="Navigation navbar-expand-md">
            <NavbarBrand tag={Link} to="/">
                proma
            </NavbarBrand>
            <Nav className="ml-auto">
                {currentUser ? loggedInNav() : loggedOutNav()}
            </Nav>
        </Navbar>
    );
}

export default Navigation;