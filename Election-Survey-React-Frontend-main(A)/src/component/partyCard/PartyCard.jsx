import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import style from "./partyCard.module.css";

function PartyCard() {
    const [parties, setParties] = useState([]);

    useEffect(() => {
        fetchParties();
    }, []);

    const fetchParties = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/party`);
            setParties(response.data);
        } catch (error) {
            console.error("Error fetching parties:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/party/delete/${id}`);

            // Ensure UI updates correctly after deletion
            setParties(prevParties => prevParties.filter(party => party.id !== id));

            toast.success("Party deleted successfully!");
        } catch (error) {
            console.error("Error deleting party:", error);
            toast.error("Failed to delete party.");
        }
    };

    return (
        <div className={style.container}>
            <Toaster />
            <h1>Parties List</h1>
            <div className={style.partyContainer}>
                {parties.length > 0 ? (
                    parties.map(party => (
                        <div key={party.id} className={style.partyCard}>
                            <div className={style.imgWrapper}>
                                <img src={party.img} alt="Party Symbol" className={style.partySymbol} />
                            </div>
                            <h3>{party.name}</h3>
                            <div className={style.imgWrapperSm}>
                                <img src={party.candidateImg} alt="Candidate" className={style.candidateImage} />
                            </div>
                            <p>Candidate: {party.candidateName}</p>
                            <p>Votes: {party.numberOfVotes}</p>
                            <p>Constituency: {party.constituency.name} ({party.constituency.id})</p>
                            <button onClick={() => handleDelete(party.id)} className={style.deleteButton}>Delete</button>
                        </div>
                    ))
                ) : (
                    <p>No parties available.</p>
                )}
            </div>
        </div>
    );
}

export default PartyCard;
