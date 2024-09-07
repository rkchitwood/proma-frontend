import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Card, CardBody, CardTitle, Button, Input, Form, FormGroup, Label } from "reactstrap";
import PromaApi from "../api/api";
import LoadingSpinner from "../loadingSpinner/LoadingSpinner";
import UserContext from "../auth/UserContext";

/** Session detail page.
 * 
 * Shows timer and allows user to stop session with comment.
 * 
 * Routed to at /sessions/:sessionId
 * 
 * AppRoutes -> SessionDetail
 */

function SessionDetail() {
    const { sessionId } = useParams();
    const { currentUser } = useContext(UserContext);
    const [session, setSession] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(true);
    const [comment, setComment] = useState("");  // New state for comment

    // Fetch the session details when the component mounts
    useEffect(function fetchSessionOnMount() {
        async function fetchSession() {
            const { session } = await PromaApi.getSession(+sessionId);
            setSession(session);
        }
        fetchSession();
    }, [sessionId]);

    // Calculate elapsed time
    useEffect(() => {
        let intervalId;

        if (session && isTimerRunning) {
            intervalId = setInterval(() => {
                const startTime = new Date(session.startDatetime);
                const currentTime = new Date();
                const timeElapsed = Math.floor((currentTime - startTime) / 1000); // in seconds
                setElapsedTime(timeElapsed);
            }, 1000);
        }

        return () => clearInterval(intervalId);
    }, [session, isTimerRunning]);

    // Stop the session and submit comment
    async function stopSession(evt) {
        evt.preventDefault();
        try {
            const endDatetime = new Date().toISOString();
            await PromaApi.updateSession(sessionId, { endDatetime, comment });  // Send endDatetime and comment
            setIsTimerRunning(false);
        } catch (err) {
            console.error("Error stopping session:", err);
        }
    }

    if (!session) return <LoadingSpinner />;

    // Convert elapsed time to hours, minutes, seconds
    const hours = Math.floor(elapsedTime / 3600);
    const minutes = Math.floor((elapsedTime % 3600) / 60);
    const seconds = elapsedTime % 60;

    return (
        <Card className="SessionDetail col-md-6 offset-md-3 mt-4">
            <CardBody>
                <CardTitle>
                    <h5>Session Details</h5>
                </CardTitle>
                <div><strong>Category:</strong> {session.category}</div>
                <div><strong>Start Time:</strong> {new Date(session.startDatetime).toLocaleString()}</div>
                <div><strong>Elapsed Time:</strong> {`${hours}h ${minutes}m ${seconds}s`}</div>
                {isTimerRunning ? (
                    <Form onSubmit={stopSession} className="mt-3">
                        <FormGroup>
                            <Label for="comment">Optional Comment</Label>
                            <Input 
                                type="textarea" 
                                name="comment" 
                                id="comment" 
                                value={comment} 
                                onChange={e => setComment(e.target.value)} 
                                placeholder="Enter any notes or comments..." 
                            />
                        </FormGroup>
                        <Button color="danger" type="submit">
                            Stop Timer
                        </Button>
                    </Form>
                ) : (
                    <div className="mt-3 text-success">Session stopped</div>
                )}
            </CardBody>
        </Card>
    );
}

export default SessionDetail;