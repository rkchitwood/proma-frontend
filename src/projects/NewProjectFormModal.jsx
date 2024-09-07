import React, { useState } from "react";
import { Container, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, ModalFooter, Button, Alert, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import PromaApi from "../api/api";

/** Modal to create a new project and assign users to it */
function NewProjectFormModal({ isOpen, toggle, boardId, boardUsers, onProjectCreated }) {
    const [formData, setFormData] = useState({
        name: "",
        priority: "",
        users: []
    });
    const [formErrors, setFormErrors] = useState([]);
    const [formSuccess, setFormSuccess] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState(new Set());
    const [dropdownOpen, setDropdownOpen] = useState(false);

    /** Handle form submission */
    const handleSubmit = async (evt) => {
        evt.preventDefault();
        setFormErrors([]);
        setFormSuccess(false);

        try {
            // Create new project
            const projectRes = await PromaApi.createProject(boardId, formData.name, formData.priority);

            // Add selected users to the new project
            for (const userId of formData.users) {
                await PromaApi.addUserToProject(projectRes.project.id, +userId);
            }

            setFormSuccess(true);
            setFormData({ name: "", priority: "", users: [] });
            onProjectCreated({
                ...projectRes.project,
                users: formData.users.map(userId => boardUsers.find(user => user.id === +userId))
            });
            toggle();

        } catch (err) {
            setFormErrors(err);
        }
    };

    /** Handle input change */
    const handleChange = (e) => {
        const { name, value } = e.target;
    
        setFormData({
            ...formData,
            [name]: name === 'priority' ? parseInt(value, 10) : value
        });
    };

    

    const toggleDropdown = () => {
        setDropdownOpen(prevState => !prevState);
        console.log(dropdownOpen);
    }

    const handleSelectUser = (userId) => {
        setSelectedUsers(prevSelected => {
            const newSelected = new Set(prevSelected);
            if (newSelected.has(userId)) {
                newSelected.delete(userId);
            } else {
                newSelected.add(userId);
            }
            setFormData({ ...formData, users: Array.from(newSelected) });
            return newSelected;
        });
    };

    return (
        <div className="NewProjectForm">
            <Container className="col-md-6 offset-md-3 col-lg-4 offset-lg-4">
                <Modal isOpen={isOpen} toggle={toggle}>
                    <ModalHeader>Create New Project</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={handleSubmit}>
                            <FormGroup>
                                <Label for="name">Project Name</Label>
                                <Input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="priority">Priority</Label>
                                <Input
                                    type="select"
                                    name="priority"
                                    id="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Priority</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </Input>
                            </FormGroup>
                            <FormGroup>
                            <Label for="users">Assign Users</Label>
                                <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                                    <DropdownToggle caret>
                                        {selectedUsers.size > 0 ? `${selectedUsers.size} Users Selected` : 'Select Users'}
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        {boardUsers.map(user => (
                                            <DropdownItem
                                                key={user.id}
                                                onClick={() => handleSelectUser(user.id)}
                                                active={selectedUsers && selectedUsers.has(user.id)}
                                            >
                                                {user.firstName} {user.lastName}
                                            </DropdownItem>
                                        ))}
                                    </DropdownMenu>
                                </Dropdown>
                            </FormGroup>
                            <ModalFooter>
                                {formErrors.length > 0 && (
                                    <Alert color="danger">{formErrors.join(", ")}</Alert>
                                )}
                                {formSuccess && (
                                    <Alert color="success">Project created successfully!</Alert>
                                )}
                                <Button color="primary" type="submit">Create Project</Button>
                                <Button color="secondary" onClick={toggle}>Cancel</Button>
                            </ModalFooter>
                        </Form>
                    </ModalBody>
                </Modal>
            </Container>
        </div>
    );
}

export default NewProjectFormModal;