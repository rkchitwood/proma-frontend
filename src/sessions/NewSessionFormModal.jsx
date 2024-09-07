import React, { useContext, useState, useEffect } from "react";
import { Container, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, ModalFooter, Button, Alert } from "reactstrap";
import PromaApi from "../api/api";
import UserContext from "../auth/UserContext";
import { useNavigate } from "react-router-dom";

/** Modal to start a new session */
function NewSessionFormModal({ isOpen, toggle, project }) {
    const { currentUser } = useContext(UserContext);
    const userId = +currentUser.id;
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({ categoryId: "" });
    const [formErrors, setFormErrors] = useState([]);
    const [formSuccess, setFormSuccess] = useState(false);

    // Fetch categories when modal is opened
    useEffect(() => {
        async function fetchCategories() {
            try {
                const categories = await PromaApi.getCategories();
                setCategories(categories);
            } catch (err) {
                setFormErrors(err);
            }
        }
        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen]);

    /** Handle form submission */
    const handleSubmit = async (evt) => {
        evt.preventDefault();
        setFormErrors([]);
        setFormSuccess(false);

        try {
            // Create a new session
            const { session } = await PromaApi.createSession(project.id, userId, +formData.categoryId);
            setFormSuccess(true);
            navigate(`/sessions/${session.id}`)
            
        } catch (err) {
            setFormErrors([err]);
        }
    };

    /** Handle input change */
    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setFormData(data => ({
            ...data,
            [name]: value
        }));
    };

    return (
        <div className="NewSessionFormModal">
            <Container className="col-md-6 offset-md-3 col-lg-4 offset-lg-4">
                <Modal isOpen={isOpen} toggle={toggle}>
                    <ModalHeader>Record New Session for {project.name}</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={handleSubmit}>
                            <FormGroup>
                                <Label for="categoryId">Category</Label>
                                <Input
                                    type="select"
                                    name="categoryId"
                                    id="categoryId"
                                    value={formData.categoryId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </Input>
                            </FormGroup>
                            <ModalFooter>
                                {formErrors && formErrors.length > 0 && (
                                    <Alert color="danger">{formErrors.join(", ")}</Alert>
                                )}
                                {formSuccess && (
                                    <Alert color="success">Session started successfully!</Alert>
                                )}
                                <Button color="primary" type="submit">Start Session</Button>
                                <Button color="secondary" onClick={toggle}>Cancel</Button>
                            </ModalFooter>
                        </Form>
                    </ModalBody>
                </Modal>
            </Container>
        </div>
    );
}

export default NewSessionFormModal;