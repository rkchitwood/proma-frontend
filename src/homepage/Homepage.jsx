import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button } from "reactstrap";
import UserContext from "../auth/UserContext";

/** Homepage of app.
 *
 * Shows welcome message or login/register buttons.
 *
 * Routed at /
 *
 * Routes -> Homepage
 */
function Homepage() {
    const { currentUser } = useContext(UserContext);

    return (
        <div className="Homepage">
            <Container className="text-center">
                <Row>
                    <Col>
                        <h1 className="mb-4 font-weight-bold">proma</h1>
                        <p className="lead">Project Management, reimagined.</p>
                        {currentUser ? (
                            <h2>Welcome Back, {currentUser.firstName || currentUser.email}!</h2>
                        ) : (
                            <p>
                                <Button color="primary" className="font-weight-bold mr-3" tag={Link} to="/login">
                                    Log in
                                </Button>
                                <Button color="primary" className="font-weight-bold" tag={Link} to="/signup">
                                    Sign up
                                </Button>
                            </p>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>

    );
}

export default Homepage;