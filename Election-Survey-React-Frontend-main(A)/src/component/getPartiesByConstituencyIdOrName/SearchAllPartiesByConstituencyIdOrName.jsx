import { useState } from "react";
import style from "./searchAllPartiesByConstituencyIdOrName.module.css";

function SearchAllPartiesByConstituencyIdOrName() {
    const [constituencyId, setConstituencyId] = useState("");
    const [constituencyName, setConstituencyName] = useState("");
    const [parties, setParties] = useState([]);
    const [message, setMessage] = useState("");

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

    const fetchParties = async () => {
        let url = `${import.meta.env.VITE_API_BASE_URL}/api/party/byConstituencyIdOrName`;

        if (constituencyId) {
            url += `?constituencyId=${constituencyId}`;
        } else if (constituencyName) {
            url += `?constituencyName=${constituencyName}`;
        } else {
            setMessage("Please enter either Constituency ID or Name.");
            return;
        }

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.length > 0) {
                setParties(data);
                setMessage("");
            } else {
                setParties([]);
                setMessage("Survey records in this constituency are not available yet.");
            }
        } catch (error) {
            console.error("Error fetching parties:", error);
            setMessage("Error fetching data. Please try again later.");
        }
    };

    return (
        <div className={style.container}>
            <h2>Search Political Parties <i>Its Belonging Constituency</i></h2>
            <div className={style.searchBoxWrapper}>
                <div className={style.searchBox}>
                    <input
                        type="number"
                        placeholder="Enter Constituency ID"
                        value={constituencyId}
                        onChange={(e) => {
                            setConstituencyId(e.target.value);
                            setConstituencyName("");
                        }}
                    />
                    <input
                        type="text"
                        placeholder="Enter Constituency Name"
                        value={constituencyName}
                        onChange={(e) => {
                            setConstituencyName(e.target.value);
                            setConstituencyId("");
                        }}
                    />
                    <button onClick={fetchParties}>Search</button>
                </div>
                <p className={style.note}>Tip: You can search by either Constituency ID or exact Constituency Name.</p>
            </div>

            {message && <p className={style.message}>{message}</p>}

            {parties.length > 0 && (
                <div className={style.resultCard}>
                    <div className={style.resultHeader}>
                        <h3>Results for {constituencyId ? `ID ${constituencyId}` : `"${constituencyName}"`}</h3>
                        <span>{parties.length} party(ies) found</span>
                    </div>

                    <div className={style.tableWrapper}>
                        <table className={style.table}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Party Name</th>
                                    <th>Candidate Name</th>
                                    <th>Votes</th>
                                    <th>Party Logo</th>
                                    <th>Candidate Image</th>
                                </tr>
                            </thead>
                            <tbody>
                                {parties.map((party) => (
                                    <tr key={party.id}>
                                        <td>{party.id}</td>
                                        <td>{party.name}</td>
                                        <td>{party.candidateName}</td>
                                        <td>{party.numberOfVotes}</td>
                                        <td>
                                            <img src={getPartyImage(party)} alt={party.name} className={style.img} onError={(e) => { e.target.onerror = null; e.target.src = "/img/party.png"; }} />
                                        </td>
                                        <td>
                                            <img src={getCandidateImage(party)} alt={party.candidateName} className={style.img} onError={(e) => { e.target.onerror = null; e.target.src = "/img/user.png"; }} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SearchAllPartiesByConstituencyIdOrName;
