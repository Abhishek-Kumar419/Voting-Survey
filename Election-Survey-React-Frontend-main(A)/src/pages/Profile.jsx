import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./profile.module.css";
import { toast } from "react-hot-toast";
import SearchAllPartiesByConstituencyIdOrName from "../component/getPartiesByConstituencyIdOrName/SearchAllPartiesByConstituencyIdOrName";

const PARTY_COLORS = { BJP: "#ff6600", INC: "#1565c0", AAP: "#00897b", SAD: "#f9a825" };

function Profile() {
    const [user, setUser]               = useState(null);
    const [candidates, setCandidates]   = useState([]);
    const [loading, setLoading]         = useState(true);
    const [electionActive, setElectionActive] = useState(false);
    const [votedParty, setVotedParty]   = useState(null);
    const [constituencyRank, setConstituencyRank] = useState(null);
    const [showShareCard, setShowShareCard] = useState(false);
    const navigate = useNavigate();

    const voterId = sessionStorage.getItem("voterId");
    const token   = sessionStorage.getItem("token");

    const fallbackPartyImages = {
        BJP: "https://tse2.mm.bing.net/th/id/OIP.53bSgHop7Rw7VMVwi2PU7gHaH6?pid=Api&P=0&h=180",
        INC: "https://tse2.mm.bing.net/th/id/OIP.7gBsmyboxHJsRCp6Yf0kpwHaE2?pid=Api&P=0&h=180",
        AAP: "https://tse3.mm.bing.net/th/id/OIP.WExtSFlcjlLts4SAE9SVcQHaFO?pid=Api&P=0&h=180",
        SAD: "https://tse3.mm.bing.net/th/id/OIP.-zgU1kJkApXOESdrlzBjoAHaE8?pid=Api&P=0&h=180",
    };

    const fallbackCandidateImages = {
        "Narendra Modi":   "https://media.assettype.com/sentinelassam-english/2026-01-26/w6nyejdk/Narendra-Modi.webp?w=1200&ar=40:21&auto=format%2Ccompress&ogImage=true&mode=crop&enlarge=true&overlay=false&overlay_position=bottom&overlay_width=100",
        "Rahul Gandhi":    "https://tse2.mm.bing.net/th/id/OIP.QJBtpk5ZwqsCSVBS6_S-uQHaEK?pid=Api&P=0&h=180",
        "Arvind Kejriwal": "https://d2e1hu1ktur9ur.cloudfront.net/wp-content/uploads/2025/02/Arvind-Kejriwal-4.jpg",
        "Sukhbir Badal":   "https://tse4.mm.bing.net/th/id/OIP.jZycuWr34gEvfXTIMVsmnAHaEc?pid=Api&P=0&h=180",
    };

    const proxyImage = (url) => {
        if (!url || url.startsWith("/")) return url;
        return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=180&h=180&fit=cover`;
    };

    const getPartyImage     = (p) => proxyImage(p.img     || fallbackPartyImages[p.name]          || "/img/party.png");
    const getCandidateImage = (p) => proxyImage(p.candidateImg || fallbackCandidateImages[p.candidateName] || "/img/user.png");

    useEffect(() => {
        if (!voterId || !token) {
            toast.error("Authentication required. Please log in again.");
            sessionStorage.clear();
            window.location.href = "/login";
            return;
        }
        if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const fetchData = async () => {
            try {
                const userRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/voter/${voterId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const userData = userRes.data;
                setUser(userData);

                const name = userData.constituencyName;
                const [partiesRes, constituencyRes, allPartiesRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/party/byConstituencyIdOrName?constituencyName=${encodeURIComponent(name)}`),
                    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/constituency/name/${encodeURIComponent(name)}`).catch(() => ({ data: null })),
                    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/party`),
                ]);

                setCandidates(partiesRes.data);

                const activeFromConstituency = constituencyRes.data?.electionActive === true;
                const activeFromParty = partiesRes.data.length > 0 && partiesRes.data[0].constituency?.electionActive === true;
                setElectionActive(activeFromConstituency || activeFromParty);

                // Constituency rank by total votes
                const grouped = allPartiesRes.data.reduce((acc, p) => {
                    const cId = p.constituency?.id;
                    if (!acc[cId]) acc[cId] = { name: p.constituency?.name, total: 0 };
                    acc[cId].total += p.numberOfVotes;
                    return acc;
                }, {});
                const ranked = Object.values(grouped).sort((a, b) => b.total - a.total);
                const rank = ranked.findIndex(c => c.name === name) + 1;
                setConstituencyRank(rank > 0 ? rank : null);

            } catch (error) {
                if (error.response?.status === 401 || error.response?.status === 403) {
                    toast.error("Session expired. Please log in again.");
                    sessionStorage.clear();
                    window.location.href = "/login";
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, [voterId]);

    const handleVote = async (partyId) => {
        if (!user || user.hasVoted) return;
        try {
            const candidate = candidates.find(c => c.id === partyId);
            if (!candidate) return;
            const authHeader = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/party/${partyId}/votes?votes=${candidate.numberOfVotes + 1}`);
            await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/users/vote/${user.voterId}`, null, authHeader);
            setCandidates(prev => prev.map(c => c.id === partyId ? { ...c, numberOfVotes: c.numberOfVotes + 1 } : c));
            setUser(prev => ({ ...prev, hasVoted: true }));
            setVotedParty(candidate);
            toast.success("✅ Vote cast successfully!");
        } catch (error) {
            const msg = error.response?.data || "Error casting vote.";
            toast.error(msg);
            if (error.response?.status === 401 || error.response?.status === 403) {
                sessionStorage.clear();
                window.location.href = "/login";
            }
        }
    };

    if (loading) return <div className={styles.loading}>Loading your profile...</div>;
    if (!electionActive) return <h2 className={styles.notLiveSurvey}>🔴 No Live Survey in your constituency yet</h2>;

    const displayVotedParty = votedParty || (user?.hasVoted ? candidates.find(c => c.numberOfVotes > 0) : null);

    return (
        <div className={styles.page}>
            {/* Share card modal */}
            {showShareCard && displayVotedParty && (
                <div className={styles.shareOverlay} onClick={() => setShowShareCard(false)}>
                    <div className={styles.shareCard} onClick={e => e.stopPropagation()}>
                        <div className={styles.shareHeader}>🗳️ I Voted!</div>
                        <img src={getPartyImage(displayVotedParty)} alt={displayVotedParty.name} className={styles.sharePartyLogo} onError={e => { e.target.src = "/img/party.png"; }} />
                        <p className={styles.sharePartyName} style={{ color: PARTY_COLORS[displayVotedParty.name] || "#6c63ff" }}>{displayVotedParty.name}</p>
                        <p className={styles.shareVoter}>{user.name} | {user.constituencyName}</p>
                        <p className={styles.shareTagline}>Powered by ElectPulse 🇮🇳</p>
                        <button className={styles.shareClose} onClick={() => setShowShareCard(false)}>Close</button>
                    </div>
                </div>
            )}

            <div className={styles.container}>
                <div className={styles.profileContainer}>
                    {/* User card */}
                    <div className={styles.userCard}>
                        <img src="./img/user.png" alt="User" className={styles.profileImage} />
                        <h3>{user.name}</h3>
                        <p><strong>Voter ID:</strong> {user.voterId}</p>
                        <p><strong>Constituency:</strong> {user.constituencyName}</p>
                        <p><strong>Status:</strong>
                            <span className={user.hasVoted ? styles.voted : styles.notVoted}>
                                {user.hasVoted ? " ✅ Voted" : " 🔵 Not Voted"}
                            </span>
                        </p>
                        {constituencyRank && (
                            <p className={styles.rank}>📊 Constituency Rank: <strong>#{constituencyRank}</strong> by turnout</p>
                        )}
                        {user.hasVoted && displayVotedParty && (
                            <div className={styles.votedForBox} style={{ borderColor: PARTY_COLORS[displayVotedParty.name] || "#6c63ff" }}>
                                <p className={styles.votedForLabel}>You voted for</p>
                                <img src={getPartyImage(displayVotedParty)} alt={displayVotedParty.name} className={styles.votedPartyLogo} onError={e => { e.target.src = "/img/party.png"; }} />
                                <p className={styles.votedPartyName} style={{ color: PARTY_COLORS[displayVotedParty.name] || "#6c63ff" }}>{displayVotedParty.name}</p>
                                <button className={styles.shareBtn} onClick={() => setShowShareCard(true)}>📤 Share</button>
                            </div>
                        )}
                    </div>

                    {/* Candidates */}
                    <div className={styles.candidatesContainer}>
                        {candidates.map(candidate => (
                            <div
                                key={candidate.id}
                                className={styles.candidateCard}
                                style={{ borderTopColor: PARTY_COLORS[candidate.name] || "#6c63ff" }}
                                onClick={() => navigate(`/candidate/${candidate.id}`)}
                            >
                                <img src={getPartyImage(candidate)} alt="Party Logo" className={styles.partyLogo} onError={e => { e.target.src = "/img/party.png"; }} />
                                <img src={getCandidateImage(candidate)} alt="Candidate" className={styles.candidateImage} onError={e => { e.target.src = "/img/user.png"; }} />
                                <h3 style={{ color: PARTY_COLORS[candidate.name] || "#f1f1f1" }}>{candidate.name}</h3>
                                <p className={styles.candidateName}>{candidate.candidateName}</p>
                                <p className={styles.voteCount}>{candidate.numberOfVotes.toLocaleString()} votes</p>
                                <button
                                    className={styles.voteButton}
                                    style={{ background: user.hasVoted ? "#374151" : (PARTY_COLORS[candidate.name] || "#6c63ff") }}
                                    onClick={e => { e.stopPropagation(); handleVote(candidate.id); }}
                                    disabled={user.hasVoted}
                                >
                                    {user.hasVoted ? "✅ Voted" : "Vote"}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className={styles.constituencyTableContainer}>
                <SearchAllPartiesByConstituencyIdOrName />
            </div>
        </div>
    );
}

export default Profile;
