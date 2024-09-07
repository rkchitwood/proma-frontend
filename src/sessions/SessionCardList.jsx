import React, { useEffect, useState } from "react";
import PromaApi from "../api/api";
import { Card, CardBody, CardTitle } from "reactstrap";
import LoadingSpinner from "../loadingSpinner/LoadingSpinner";



/** Show list of session cards
 * 
 * This is routed to at /sessions
 */
function SessionCardList() {
    const [userSessions, setUserSessions] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(function getSessionsDataOnMount() {
        getAndBuildSessions();
    }, []);

    /** Queries boards from API */
    async function getAndBuildSessions() {
        const  { sessions }  = await PromaApi.getSessions();
        // get category name, user first & last name and project name from ID's
        const { users } = await PromaApi.getUsers();
        const { projects } = await PromaApi.getUserProjects();
        const categories = await PromaApi.getCategories();

        // lookup objects to enhance from ID's
        console.log(categories);
        const userLookup = users.reduce((acc, user) => {
            acc[user.id] = `${user.firstName} ${user.lastName}`
            return acc;
        }, {});

        const projectLookup = projects.reduce((acc, project) => {
            acc[project.id] = project.name;
            return acc;
        }, {});

        const categoryLookup = categories.reduce((acc, category) => {
            acc[category.id] = category.name;
            return acc;
        }, {});

        // map over sessions to build new object with additional human-readable data
        const sessionsWithData = sessions.map(s => ({
            ...s,
            userName: userLookup[s.userId],
            projectName: projectLookup[s.projectId],
            categoryName: categoryLookup[s.categoryId]
        }));


        setUserSessions(sessionsWithData);
        console.log(sessionsWithData);
        setLoading(false);
    }

    return (
        <div className="SessionCardList col-md-8 offset-md-2">
            <div>
                <h1>Sessions</h1>
                {loading ? (
                    <LoadingSpinner />
                ) : userSessions && userSessions.length === 0 ? (
                    <p>No Sessions found. Please create a new session.</p>
                ) : (
                    userSessions.map(s => (                        
                            <Card key={s.id}>
                                <CardBody>
                                    <CardTitle>Owner: {s.userName}</CardTitle>
                                    <CardTitle>Project: {s.projectName}</CardTitle>
                                    <CardTitle>Start: {new Date(s.startDatetime).toLocaleString()}</CardTitle>
                                    <CardTitle>End: {s.endDatetime ? new Date(s.endDatetime).toLocaleString() : "In Progress"}</CardTitle>
                                    <CardTitle>Category: {s.categoryName}</CardTitle>
                                    <CardTitle>Optional Comment: {s.comment}</CardTitle>
                                </CardBody>
                            </Card>
                    ))
                )}
            </div>
        </div>
    );
}

export default SessionCardList;