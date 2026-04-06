import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./CandidateProfile.module.css";

const PARTY_COLORS = { BJP: "#ff6600", INC: "#1565c0", AAP: "#00897b", SAD: "#f9a825" };

const MOCK_DETAILS = {
    BJP:  { education: "M.A. Political Science", assets: "₹12.4 Cr", criminal: "0 cases", experience: "15 years", manifesto: "Development, Infrastructure, Digital India" },
    INC:  { education: "B.A. Economics, Cambridge", assets: "₹8.7 Cr", criminal: "0 cases", experience: "12 years", manifesto: "Farm loan waiver, Employment, Healthcare" },
    AAP:  { education: "B.Tech, IIT Delhi", assets: "₹3.2 Cr", criminal: "0 cases", experience: "10 years", manifesto: "Free electricity, Education reform, Anti-corruption" },
    SAD:  { education: "M.B.A. Finance", assets: "₹22.1 Cr", criminal: "1 case (pending)", experience: "20 years", manifesto: "Farmers rights, Punjab identity, Religious harmony" },
};

function CandidateProfile() {
    const { partyId } = useParams();
    const navigate = useNavigate();
    const [party, setParty] = useState(null);
    const [allParties, setAllParties] = useState([]);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/party`)
            .then(res => {
                setAllParties(res.data);
                const found = res.data.find(p => p.id === Number(partyId));
                setParty(found || null);
            })
            .catch(() => {});
    }, [partyId]);

    if (!party) return <div className={styles.loading}>Loading candidate profile...</div>;

    const color = PARTY_COLORS[party.name] || "#6c63ff";
    const details = MOCK_DETAILS[party.name] || {};
    const constituencyParties = allParties.filter(p => p.constituency?.id === party.constituency?.id);
    const totalVotes = constituencyParties.reduce((s, p) => s + p.numberOfVotes, 0);
    const votePct = totalVotes > 0 ? ((party.numberOfVotes / totalVotes) * 100).toFixed(1) : 0;

    return (
        <div className={styles.page}>
            <button className={styles.back} onClick={() => navigate(-1)}>← Back</button>

            <div className={styles.hero} style={{ borderColor: color }}>
                <div className={styles.heroLeft}>
                    <img
                        src={party.candidateImg || "/img/user.png"}
                        alt={party.candidateName}
                        className={styles.candidateImg}
                        onError={e => { e.target.src = "/img/user.png"; }}
                    />
                    <img
                        src={party.img || "/img/party.png"}
                        alt={party.name}
                        className={styles.partyLogo}
                        onError={e => { e.target.src = "/img/party.png"; }}
                    />
                </div>
                <div className={styles.heroRight}>
                    <span className={styles.partyBadge} style={{ background: color }}>{party.name}</span>
                    <h1 className={styles.candidateName}>{party.candidateName}</h1>
                    <p className={styles.constituency}>📍 {party.constituency?.name}, {party.constituency?.state}</p>
                    <div className={styles.voteRow}>
                        <span className={styles.voteCount} style={{ color }}>{party.numberOfVotes.toLocaleString()}</span>
                        <span className={styles.voteLabel}>votes ({votePct}%)</span>
                    </div>
                    <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: `${votePct}%`, background: color }} />
                    </div>
                </div>
            </div>

            <div className={styles.detailsGrid}>
                {[
                    { icon: "🎓", label: "Education", value: details.education },
                    { icon: "💰", label: "Declared Assets", value: details.assets },
                    { icon: "⚖️", label: "Criminal Cases", value: details.criminal },
                    { icon: "📅", label: "Political Experience", value: details.experience },
                ].map((d, i) => (
                    <div key={i} className={styles.detailCard}>
                        <span className={styles.detailIcon}>{d.icon}</span>
                        <div>
                            <div className={styles.detailLabel}>{d.label}</div>
                            <div className={styles.detailValue}>{d.value || "N/A"}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.manifestoCard}>
                <h3>📜 Key Manifesto Points</h3>
                <p>{details.manifesto || "No manifesto data available."}</p>
            </div>

            <div className={styles.constituencySection}>
                <h3>🏛️ All Candidates in {party.constituency?.name}</h3>
                <div className={styles.candidateRow}>
                    {constituencyParties.map(p => (
                        <div
                            key={p.id}
                            className={`${styles.miniCard} ${p.id === party.id ? styles.miniActive : ""}`}
                            style={{ borderColor: p.id === party.id ? color : "transparent" }}
                            onClick={() => navigate(`/candidate/${p.id}`)}
                        >
                            <img src={p.img || "/img/party.png"} alt={p.name} className={styles.miniLogo} onError={e => { e.target.src = "/img/party.png"; }} />
                            <span className={styles.miniParty} style={{ color: PARTY_COLORS[p.name] || "#9ca3af" }}>{p.name}</span>
                            <span className={styles.miniVotes}>{p.numberOfVotes.toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CandidateProfile;
