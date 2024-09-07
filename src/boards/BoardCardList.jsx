import React, { useEffect, useState } from "react";
import PromaApi from "../api/api";
import { Link } from "react-router-dom";
import { Card, CardBody, CardTitle, Button } from "reactstrap";
import LoadingSpinner from "../loadingSpinner/LoadingSpinner";
import NewBoardFormModal from "./NewBoardFormModal";


/** Show list of board cards
 * 
 * This is routed to at /boards
 */
function BoardCardList() {
    const [boards, setBoards] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    useEffect(function getBoardsOnMount() {
        getBoards();
    }, []);

    /** Controls modal toggle and URL change */
    const toggleModal = () => {
        setModal(!modal);
    };

    /** Queries boards from API */
    async function getBoards() {
        const boards = await PromaApi.getBoards();
        setBoards(boards);
        setLoading(false);
    }

    return (
        <div className="BoardCardList col-md-8 offset-md-2">
            <div className="mb-3">
                <Button color="primary" onClick={toggleModal}>
                    Create New Board
                </Button>
                <NewBoardFormModal isOpen={modal} toggle={toggleModal}/>
            </div>
            <div>
                <h2>Your Boards</h2>
                {loading ? (
                    <LoadingSpinner />
                ) : boards.length === 0 ? (
                    <p>No boards found. Please create a new board.</p>
                ) : (
                    boards.map(b => (
                        <Link key={b.id} className="BoardListCard card" to={`/boards/${b.id}`}>
                            <Card>
                                <CardBody>
                                    <CardTitle>{b.title}</CardTitle>
                                </CardBody>
                            </Card>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}

export default BoardCardList;