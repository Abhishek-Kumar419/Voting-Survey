import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import style from "./partyCard.module.css";

function PartyCard() {
    const [parties, setParties] = useState([]);
    const [editParty, setEditParty] = useState(null);
    const [editData, setEditData] = useState({});

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

    const fallbackPartyImages = {
        "BJP": "https://tse2.mm.bing.net/th/id/OIP.53bSgHop7Rw7VMVwi2PU7gHaH6?pid=Api&P=0&h=180",
        "INC": "https://tse2.mm.bing.net/th/id/OIP.7gBsmyboxHJsRCp6Yf0kpwHaE2?pid=Api&P=0&h=180",
        "AAP": "https://tse3.mm.bing.net/th/id/OIP.WExtSFlcjlLts4SAE9SVcQHaFO?pid=Api&P=0&h=180",
        "SAD": "https://tse3.mm.bing.net/th/id/OIP.-zgU1kJkApXOESdrlzBjoAHaE8?pid=Api&P=0&h=180",
    };

    const fallbackCandidateImages = {
        "Narendra Modi": "https://media.assettype.com/sentinelassam-english/2026-01-26/w6nyejdk/Narendra-Modi.webp?w=1200&ar=40:21&auto=format%2Ccompress&ogImage=true&mode=crop&enlarge=true&overlay=false&overlay_position=bottom&overlay_width=100",
        "Rahul Gandhi": "https://tse2.mm.bing.net/th/id/OIP.QJBtpk5ZwqsCSVBS6_S-uQHaEK?pid=Api&P=0&h=180",
        "Arvind Kejriwal": "https://d2e1hu1ktur9ur.cloudfront.net/wp-content/uploads/2025/02/Arvind-Kejriwal-4.jpg",
        "Sukhbir Badal": "https://tse4.mm.bing.net/th/id/OIP.jZycuWr34gEvfXTIMVsmnAHaEc?pid=Api&P=0&h=180",
    };

    const getPartyImage = (party) => party.img || fallbackPartyImages[party.name] || "/img/party.png";

    const getCandidateImage = (party) => party.candidateImg || fallbackCandidateImages[party.candidateName] || "/img/user.png";

    const handleEdit = (party) => {
        setEditParty(party);
        setEditData({
            name: party.name,
            candidateName: party.candidateName,
            numberOfVotes: party.numberOfVotes,
            img: party.img,
            candidateImg: party.candidateImg,
            constituency: party.constituency,
        });
    };

    const cancelEdit = () => {
        setEditParty(null);
        setEditData({});
    };

    const saveEdit = async () => {
        if (!editParty) return;

        try {
            const response = await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/api/party/${editParty.id}`,
                editData
            );
            const updatedParty = response.data;
            setParties((prev) => prev.map(p => p.id === updatedParty.id ? updatedParty : p));
            setEditParty(null);
            setEditData({});
            toast.success("Party updated successfully!");
        } catch (error) {
            console.error("Error updating party:", error);
            toast.error("Failed to update party.");
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
            {editParty && (
                <div className={style.editPanel}>
                    <h2>Edit Party: {editParty.name}</h2>
                    <label>
                        Candidate Name:
                        <input
                            value={editData.candidateName || ""}
                            onChange={(e) => setEditData(prev => ({ ...prev, candidateName: e.target.value }))}
                        />
                    </label>
                    <label>
                        Votes:
                        <input
                            type="number"
                            value={editData.numberOfVotes ?? 0}
                            onChange={(e) => setEditData(prev => ({ ...prev, numberOfVotes: Number(e.target.value) }))}
                        />
                    </label>
                    <label>
                        Party Symbol URL:
                        <input
                            value={editData.img || ""}
                            onChange={(e) => setEditData(prev => ({ ...prev, img: e.target.value }))}
                        />
                    </label>
                    <label>
                        Candidate Image URL:
                        <input
                            value={editData.candidateImg || ""}
                            onChange={(e) => setEditData(prev => ({ ...prev, candidateImg: e.target.value }))}
                        />
                    </label>
                    <div className={style.editButtons}>
                        <button onClick={saveEdit}>Save</button>
                        <button onClick={cancelEdit}>Cancel</button>
                    </div>
                </div>
            )}
            <div className={style.partyContainer}>
                {parties.length > 0 ? (
                    parties.map(party => (
                        <div key={party.id} className={style.partyCard}>
                            <div className={style.imgWrapper}>
                                <img
                                    src={getPartyImage(party)}
                                    alt={`${party.name} Symbol`}
                                    className={style.partySymbol}
                                    onError={(e) => { e.target.onerror = null; e.target.src = "/img/party.png"; }}
                                />
                            </div>
                            <h3>{party.name}</h3>
                            <div className={style.imgWrapperSm}>
                                <img
                                    src={getCandidateImage(party)}
                                    alt={party.candidateName}
                                    className={style.candidateImage}
                                    onError={(e) => { e.target.onerror = null; e.target.src = "/img/user.png"; }}
                                />
                            </div>
                            <p>Candidate: {party.candidateName}</p>
                            <p>Votes: {party.numberOfVotes}</p>
                            <p>Constituency: {party.constituency.name} ({party.constituency.id})</p>
                            <div className={style.cardActions}>
                                <button onClick={() => handleEdit(party)} className={style.editButton}>Edit</button>
                                <button onClick={() => handleDelete(party.id)} className={style.deleteButton}>Delete</button>
                            </div>
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
