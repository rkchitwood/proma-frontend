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
 * Routed as /signup
 */
function SignupForm({ signup }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        isPm: false
    });
    const [formErrors, setFormErrors] = useState([]);

    /** Handle form submit:
     * 
     * Calls login function prop and redirects to /boards
     */
    async function handleSubmit(evt) {
        evt.preventDefault();
        let result = await signup(formData);
        if (result.success) {
            navigate("/boards");
        } else {
            setFormErrors(result.errors);
        }
    }
    /** Update form data field */
    function handleChange(evt) {
        const { name, value, type, checked } = evt.target;
        setFormData(l => ({
          ...l,
          [name]: type === "checkbox" ? checked : value
        }));
    }

    return (
        <div className="SignupForm">
            <Container className="col-md-6 offset-md-3 col-lg-4 offset-lg-4">
                <h3 className="mb-3">Sign Up</h3>

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
                            <FormGroup>
                                <Label for="firstName">First Name</Label>
                                <Input
                                    name="firstName"
                                    id="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    autoComplete="first-name"
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="lastName">Last Name</Label>
                                <Input
                                    name="lastName"
                                    id="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    autoComplete="last-name"
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="isPm">Project Manager</Label>
                                <Input
                                    type="checkbox"
                                    name="isPm"
                                    id="isPm"
                                    checked={formData.isPm}
                                    onChange={handleChange}
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

    )
}

export default SignupForm;