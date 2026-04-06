import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import styles from "./ConstituencyTable.module.css";

const ConstituencyTable = () => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/party`);

            // Grouping data by constituency ID
            const groupedData = response.data.reduce((acc, party) => {
                const { id, name, state, electionActive } = party.constituency;

                if (!acc[id]) {
                    acc[id] = { 
                        constituency: { id, name, state, electionActive }, 
                        parties: [] 
                    };
                }

                acc[id].parties.push(party);
                return acc;
            }, {});

            setData(groupedData);
            toast.success("Data loaded successfully!");
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Failed to load data. Please try again.");
            toast.error("Failed to fetch constituency data.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <Toaster />
            <h1>🗳️ Constituency-wise Party List</h1>

            {loading && <p className={styles.loading}>Loading data...</p>}
            {error && <p className={styles.error}>{error}</p>}

            {Object.keys(data).length > 0 ? (
                Object.values(data).map(({ constituency, parties }) => (
                    <div key={constituency.id} className={styles.constituencyBlock}>
                        <h2 className={styles.constituencyTitle}>
                            {constituency.name} ({constituency.id}) - {constituency.state} 
                            {constituency.electionActive ? " 🟢 Live" : " 🔴 Not Live"}
                        </h2>

                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Party</th>
                                    <th>Candidate</th>
                                    <th>Votes</th>
                                    <th>Party Logo</th>
                                    <th>Candidate Image</th>
                                </tr>
                            </thead>
                            <tbody>
                                {parties.map((party) => (
                                    <tr key={party.id}>
                                        <td>{party.name}</td>
                                        <td>{party.candidateName}</td>
                                        <td>{party.numberOfVotes}</td>
                                        <td><img src={getPartyImage(party)} alt="Party Logo" className={styles.image} onError={(e) => { e.target.onerror = null; e.target.src = "/img/party.png"; }} /></td>
                                        <td><img src={getCandidateImage(party)} alt="Candidate" className={styles.image} onError={(e) => { e.target.onerror = null; e.target.src = "/img/user.png"; }} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))
            ) : (
                <p className={styles.noData}>No data available.</p>
            )}
        </div>
    );
};

export default ConstituencyTable;
