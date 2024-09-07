import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Form, FormGroup, Label, Input, Button, Card, CardBody, Container } from 'reactstrap';

/** Login form
 * 
 * Shows form and manages update to state on change.
 * On submit:
 *  - Calls login function prop
 *  - Redirects to /boards route
 * 
 * Routes -> LoginForm -> Alert
 * Routed as /login
 */

function LoginForm({ login }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [formErrors, setFormErrors] = useState([]);

    /** Handle form submit:
     * 
     *  Calls login function prop and redirects to /boards on success
     */
    async function handleSubmit(evt) {
        evt.preventDefault();
        let result = await login(formData);
        if (result.success) {
            navigate("/boards");
        } else {
            console.log("FAIL: ", result.errors);
            setFormErrors(result.errors);
        }
    }

    /** Update form data field */
    function handleChange(evt) {
        const { name, value } = evt.target;
        setFormData(l => ({ ...l, [name]: value }));
    }

    return (
        <div className="LoginForm">
            <Container className="col-md-6 offset-md-3 col-lg-4 offset-lg-4">
                <h3 className="mb-3">Log In</h3>

                <Card>
                    <CardBody>
                        <Form onSubmit={handleSubmit}>
                            <FormGroup>
                                <Label for="email">Email</Label>
                                <Input
                                    name="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    autoComplete="email"
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="password">Password</Label>
                                <Input
                                    type="password"
                                    name="password"
                                    id="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    autoComplete="current-password"
                                    required
                                />
                            </FormGroup>

                            {formErrors.length > 0 && (
                                <Alert color="danger">
                                    {formErrors.map((error, index) => (
                                        <p key={index}>{error}</p>
                                    ))}
                                </Alert>
                            )}
                            <Button color="primary" className="float-right">
                                Submit
                            </Button>
                        </Form>
                    </CardBody>
                </Card>
            </Container>
        </div>
    );
}

export default LoginForm;