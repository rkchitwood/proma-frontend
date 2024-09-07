import React, { useState } from "react";
import { Container, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, ModalFooter, Button, Alert } from "reactstrap";
import PromaApi from "../api/api";

/** Modal to add a new user to a board by their email */
function NewBoardUserFormModal({ isOpen, toggle, boardId }) {
    const [email, setEmail] = useState("");
    const [formErrors, setFormErrors] = useState([]);
    const [formSuccess, setFormSuccess] = useState(false);

    /** Handle form submission */
    const handleSubmit = async (evt) => {
        evt.preventDefault();
        setFormErrors([]);
        setFormSuccess(false);

        try {
            // Get user by email
            const user = await PromaApi.getByEmail(email);

            // Add user to the board
            await PromaApi.addUserToBoard(boardId, user.id);
            setFormSuccess(true);
            setEmail("");
            toggle();
        } catch (err) {
            setFormErrors(err);
            console.log(err);
        }
    };

    /** Handle input change */
    const handleChange = (evt) => {
        setEmail(evt.target.value);
    };

    return (
        <div className="NewBoardUserForm">
            <Container className="col-md-6 offset-md-3 col-lg-4 offset-lg-4">
                <Modal isOpen={isOpen} toggle={toggle}>
                    <ModalHeader>Add User to Board</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={handleSubmit}>
                            <FormGroup>
                                <Label for="email">User Email</Label>
                                <Input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={email}
                                    onChange={handleChange}
                                    required
                                />
                            </FormGroup>
                            <ModalFooter>
                                {formErrors && formErrors.length > 0 && (
                                    <Alert color="danger">{formErrors.join(", ")}</Alert>
                                )}
                                {formSuccess && (
                                    <Alert color="success">User added successfully!</Alert>
                                )}
                                <Button color="primary" type="submit">Add User</Button>
                                <Button color="secondary" onClick={toggle}>Cancel</Button>
                            </ModalFooter>
                        </Form>
                    </ModalBody>
                </Modal>
            </Container>
        </div>
    );
}

export default NewBoardUserFormModal;