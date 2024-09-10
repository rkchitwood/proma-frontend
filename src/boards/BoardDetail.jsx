import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PromaApi from "../api/api";
import LoadingSpinner from "../loadingSpinner/LoadingSpinner";
import UserContext from "../auth/UserContext";
import NewBoardUserFormModal from "./NewBoardUserFormModal";
import NewProjectFormModal from "../projects/NewProjectFormModal";
import { Button } from "reactstrap";
import ProjectCardList from "../projects/ProjectCardList";

/** Board Detail page. 
 * 
 * Renders list of projects on board along with modals
 * to create projects, add users and add sessions for any
 * project
 * 
 * Routes -> BoardDetail -> ProjectCardList
*/
function BoardDetail() {
    const { boardId } = useParams();
    const [board, setBoard] = useState(null);
    const [boardUsers, setBoardUsers] = useState(null);
    const [projects, setProjects] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { currentUser } = useContext(UserContext);
    const navigate = useNavigate();

    /** Controls modal toggle and URL change */
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

    const toggleUserModal = () => setIsUserModalOpen(!isUserModalOpen);
    const toggleProjectModal = () => setIsProjectModalOpen(!isProjectModalOpen);

    useEffect(function getBoardProjectsAndUsers() {
        async function getProjectsAndUsers() {
            const [boardRes, usersRes, projectsRes] = await Promise.all([
                PromaApi.getBoard(boardId),
                PromaApi.getBoardUsers(boardId),
                PromaApi.getBoardProjects(boardId)
            ]);
            setBoard(boardRes.board);
            setBoardUsers(usersRes.boardUsers);

            // Check if the current user is a member of the board
            const isUserMember = usersRes.boardUsers.some(user => user.id === currentUser.id);
            if (!isUserMember) {
                navigate("/");
                return;
            }

            if (projectsRes.boardProjects.length) {
                const projectUsersPromises = projectsRes.boardProjects.map(async project => {
                    const response = await PromaApi.getProjectUsers(project.id);
                    return {
                        ...project,
                        users: response.users
                    };
                });

                // Wait for all project users to be fetched
                const projectsWithUsers = await Promise.all(projectUsersPromises);
                setProjects(projectsWithUsers);
        }
            setIsLoading(false);
        }
        getProjectsAndUsers()
    }, []);

    /** Add new project to Board UI directly */
    const handleNewProject = (newProject) => {
        console.log("New project added:", newProject);
        setProjects(prevProjects => [...prevProjects, newProject]);
    };

    if (isLoading) return <LoadingSpinner />

    return (
        <div className="BoardCardList col-md-8 offset-md-2" style={{ textAlign: 'center' }}>
            <h1>{board.title}</h1>
            {currentUser.isPm && (
                <div className="mb-3" 
                    style={{ 
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '1rem', 
                        marginBottom: '1rem' }}>
                    <Button color="primary" onClick={toggleUserModal}>
                        Add Users
                    </Button>
                    <NewBoardUserFormModal isOpen={isUserModalOpen} boardId={boardId} toggle={toggleUserModal} boardUsers={boardUsers}/>
                    
                    <Button color="primary" onClick={toggleProjectModal}>
                        Add Projects
                    </Button>
                    <NewProjectFormModal
                        isOpen={isProjectModalOpen} 
                        boardId={boardId} 
                        boardUsers={boardUsers} 
                        toggle={toggleProjectModal}
                        onProjectCreated={handleNewProject}/>
                </div>
            )}
            <div>
                <h3>Projects</h3>
                <ProjectCardList projects={projects}/>
            </div>
        </div>
    );

}
export default BoardDetail;