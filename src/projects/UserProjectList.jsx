import React, { useState, useEffect } from "react";
import PromaApi from "../api/api";
import LoadingSpinner from "../loadingSpinner/LoadingSpinner";
import ProjectCardList from "../projects/ProjectCardList";

/** Projects page.
 * 
 * Shows list of all projects assigned to user, or all projects from
 * a PM's boards. This logic is taken care of in backend via API authorization.
 * 
 * Routed to at /projects
 * 
 * AppRoutes -> UserProjectList -> ProjectCardList
 */
function UserProjectList() {
    const [projects, setProjects] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(function getUserProjectsOnMount() {
        async function getUserProjects() {
            const { projects } = await PromaApi.getUserProjects()

            if (projects.length) {
                const projectUsersPromises = projects.map(async project => {
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
        getUserProjects()
    }, []);

    if (isLoading) return <LoadingSpinner />

    return (
        <div className="BoardCardList col-md-8 offset-md-2" style={{ textAlign: 'center' }}>
            <h1>Your Projects</h1>
            <div>
                <h3>Projects</h3>
                <ProjectCardList projects={projects}/>
            </div>
        </div>
    );

}
export default UserProjectList;