import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import style from "./activeParty.module.css";

function ActiveParty() {
    const [activeParties, setActiveParties] = useState([]);

    useEffect(() => {
        fetchActiveParties();
        const interval = setInterval(fetchActiveParties, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchActiveParties = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/party/activeConstituenciePartys`);
            setActiveParties(response.data);
            // toast.success("Live active constituency parties loaded successfully!");
        } catch (error) {
            console.error("Error fetching active parties:", error);
            toast.error("Failed to load live active parties.");
        }
    };

    const localPartyFallback = "/img/party.png";
    const localCandidateFallback = "/img/user.png";

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

    const resolvePartyImg = (party) => party.img || fallbackPartyImages[party.name] || localPartyFallback;

    const resolveCandidateImg = (party) => party.candidateImg || fallbackCandidateImages[party.candidateName] || localCandidateFallback;

    return (
        <div className={style.container}>
            <Toaster />
            <h1>🟢 Live Active Party</h1>
            <div className={style.scrollContainer}>
                {activeParties.length > 0 ? (
                    activeParties.map(party => (
                        <div key={party.id} className={style.partyCard}>
                            <img
                                src={resolvePartyImg(party)}
                                alt="Party Symbol"
                                className={style.partySymbol}
                                onError={(e) => { e.target.onerror = null; e.target.src = localPartyFallback; }}
                            />
                            <h3>{party.name} (Live)</h3>
                            <img
                                src={resolveCandidateImg(party)}
                                alt="Candidate"
                                className={style.candidateImage}
                                onError={(e) => { e.target.onerror = null; e.target.src = localCandidateFallback; }}
                            />
                            <p>Candidate: {party.candidateName}</p>
                            <p>Votes: {party.numberOfVotes}</p>
                            <p>Constituency: {party.constituency.name} ({party.constituency.id})</p>
                        </div>
                    ))
                ) : (
                    <p>No live active constituency parties available.</p>
                )}
            </div>
        </div>
    );
}

export default ActiveParty;
