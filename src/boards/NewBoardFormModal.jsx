import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PromaApi from "../api/api";
import { Alert, Form, FormGroup, Label, Input, Button, Container, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

/** New Board form
 * 
 * Shows form modal and manages update to state on change.
 * On submit:
 *  - Calls createBoard function prop
 *  - Redirects to /boards/:newBoardId route
 * 
 * Routes -> NewBoard
 * Routed as /boards/new
 */
function NewBoardFormModal({ isOpen, toggle }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: ""
    });
    const [formErrors, setFormErrors] = useState([]);



    async function createBoard(formData) {
        try {
            const newBoard = await PromaApi.createBoard(formData);
            return newBoard;
        } catch (errors) {
            console.error("createBoard failed:", errors);
            return { success: false, errors };
        }
    }

    /** Handle form submit:
     * 
     * Calls API and redirects to /boards
     */
    async function handleSubmit(evt) {
        evt.preventDefault();
        console.log("submit data: ", formData)
        let result = await createBoard(formData);
        if (result) {
            console.log(result);
            navigate(`/boards/${result.board.id}`);
        } else {
            setFormErrors(result.errors);
        }
    }
    /** Update form data field */
    function handleChange(evt) {
        const { name, value } = evt.target;
        setFormData(l => ({
          ...l,
          [name]: value
        }));
    }

    return (
        <div className="NewBoardForm">
            <Container className="col-md-6 offset-md-3 col-lg-4 offset-lg-4">
                <Modal isOpen={isOpen} toggle={toggle}>
                    <ModalHeader>Create New Board</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={handleSubmit}>
                            <FormGroup>
                                <Label for="title">Board Title</Label>
                                <Input
                                    type="text"
                                    name="title"
                                    id="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </FormGroup>
                            <ModalFooter>
                            {formErrors && formErrors.length > 0 && (
                                <Alert type="danger" messages={formErrors} />
                            )}
                                <Button color="primary" type="submit">Create</Button>
                                <Button color="secondary" onClick={toggle}>Cancel</Button>
                            </ModalFooter>
                        </Form>
                    </ModalBody>
                </Modal>
            </Container>
        </div>
    );
}

export default NewBoardFormModal;