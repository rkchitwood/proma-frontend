import React, { useEffect, useState } from "react";
import { Card, CardBody, Button, Row, Col, Input } from "reactstrap";
import NewSessionFormModal from "../sessions/NewSessionFormModal";
import PromaApi from "../api/api";

/** Show list of board cards
 * 
 * This is routed to at /boards
 * 
 * BoardDetail -> ProjectCardList
 */
function ProjectCardList({ projects }) {
    const [modal, setModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [editingStageId, setEditingStageId] = useState(null);
    const [localProjects, setLocalProjects] = useState(projects);
    
    /** Controls modal toggle and URL change */
    const toggleModal = (project) => {
        setSelectedProject(project);
        setModal(!modal);
    };

    // Sync localProjects with the updated projects prop
    useEffect(() => {
        setLocalProjects(projects);
    }, [projects]);

    /** Handle stage change */
    const handleStageChange = async (projectId, newStage) => {
    
        await PromaApi.updateProjectStage(projectId, newStage);
        setLocalProjects(prevProjects => 
            prevProjects.map(p => 
                p.id === projectId ? { ...p, stage: newStage } : p
            )
        );
        setEditingStageId(null);
    };

    return (
        <div className="ProjectCardList col-md-8 offset-md-2">
            <div>
                {localProjects &&
                    localProjects.map(p => (
                        <Card key={p.id} id={p.id} className="mb-3">
                            <CardBody>
                                <Row className="align-items-center">
                                    <Col xs="12" sm="6">
                                        <h5 className="mb-1">{p.name}</h5>
                                    </Col>
                                    <Col xs="12" sm="6" className="d-flex justify-content-between">
                                        <span>Priority: {p.priority}</span>
                                        {editingStageId === p.id ? (
                                            <Input
                                                type="select"
                                                value={p.stage}
                                                onChange={(e) => handleStageChange(p.id, e.target.value)}
                                                style={{ width: '120px', fontSize: '0.9rem', padding: '0.2rem' }}
                                            >
                                                <option value="complete">Complete</option>
                                                <option value="pending">Pending</option>
                                                <option value="in_progress">In Progress</option>
                                            </Input>
                                        ) : (
                                            <span onClick={() => setEditingStageId(p.id)} style={{ cursor: 'pointer' }}>
                                                {p.stage}
                                            </span>
                                        )}
                                    </Col>
                                    {p.users.length > 0 && (
                                        <Col xs="12">
                                            <div className="d-flex flex-wrap">
                                                <span style={{ marginRight: '10px' }}>Owners:</span>
                                                {p.users.map(u => (
                                                    <div key={u.id} className="me-2">
                                                        {u.firstName} {u.lastName}
                                                    </div>
                                                ))}
                                            </div>
                                        </Col>
                                    )}
                                </Row>
                            </CardBody>
                            <Button color="primary" onClick={() => toggleModal(p)}>
                                Record Session
                            </Button>
                            {selectedProject && (
                                <NewSessionFormModal
                                    isOpen={modal}
                                    toggle={() => toggleModal(null)}
                                    project={selectedProject}
                                />
                            )}
                        </Card>
                ))}
            </div>
        </div>
    );
}

export default ProjectCardList;