import { useNavigate } from "react-router-dom";
import { useElectionData } from "../context/ElectionDataContext";
import styles from "./Results.module.css";

const PARTY_COLORS = { BJP: "#ff6600", INC: "#1565c0", AAP: "#00897b", SAD: "#f9a825" };

// Mock exit poll predictions (seats)
const EXIT_POLL = { BJP: 5, INC: 2, AAP: 3, SAD: 1 };

function Results() {
    const { parties, loading, error } = useElectionData();
    const navigate = useNavigate();

    const byC = parties.reduce((acc, p) => {
        const cId = p.constituency.id;
        if (!acc[cId]) acc[cId] = { id: cId, name: p.constituency.name, state: p.constituency.state, active: p.constituency.electionActive, parties: [] };
        acc[cId].parties.push(p);
        return acc;
    }, {});

    const grouped = Object.values(byC).map(c => {
        const sorted = [...c.parties].sort((a, b) => b.numberOfVotes - a.numberOfVotes);
        return { ...c, parties: sorted, leader: sorted[0], total: sorted.reduce((s, p) => s + p.numberOfVotes, 0) };
    });

    const partyTotals = parties.reduce((acc, p) => {
        acc[p.name] = (acc[p.name] || 0) + p.numberOfVotes;
        return acc;
    }, {});

    const grandTotal = Object.values(partyTotals).reduce((s, v) => s + v, 0);
    const hasVotes   = grandTotal > 0;

    const actualSeats = grouped.reduce((acc, c) => {
        if (c.leader && c.leader.numberOfVotes > 0) acc[c.leader.name] = (acc[c.leader.name] || 0) + 1;
        return acc;
    }, {});

    if (loading) return (
        <div className={styles.page}>
            <h1 className={styles.pageTitle}>📊 Election Results — Punjab</h1>
            <div className={styles.stateBox}>⏳ Loading results...</div>
        </div>
    );

    if (error) return (
        <div className={styles.page}>
            <h1 className={styles.pageTitle}>📊 Election Results — Punjab</h1>
            <div className={styles.stateBox}>❌ Failed to load data. Make sure the backend is running.</div>
        </div>
    );

    return (
        <div className={styles.page}>
            <h1 className={styles.pageTitle}>📊 Election Results — Punjab</h1>

            {/* Overall Vote Share */}
            <div className={styles.voteShareSection}>
                <h2 className={styles.sectionTitle}>Overall Vote Share</h2>
                {!hasVotes ? (
                    <div className={styles.noDataBox}>
                        🗳️ No votes cast yet. Activate an election from the Admin Dashboard and start voting to see live vote share here.
                    </div>
                ) : (
                    <div className={styles.voteShareBars}>
                        {Object.entries(partyTotals).sort((a, b) => b[1] - a[1]).map(([name, votes]) => {
                            const pct   = ((votes / grandTotal) * 100).toFixed(1);
                            const color = PARTY_COLORS[name] || "#6c63ff";
                            return (
                                <div key={name} className={styles.voteShareRow}>
                                    <span className={styles.vsParty} style={{ color }}>{name}</span>
                                    <div className={styles.vsTrack}>
                                        <div className={styles.vsFill} style={{ width: `${pct}%`, background: color }} />
                                    </div>
                                    <span className={styles.vsPct} style={{ color }}>{pct}%</span>
                                    <span className={styles.vsVotes}>{votes.toLocaleString()}</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Exit Poll vs Actual */}
            <div className={styles.exitPollSection}>
                <h2 className={styles.sectionTitle}>Exit Poll vs Actual — Seats Leading</h2>
                <div className={styles.exitPollGrid}>
                    {Object.entries(EXIT_POLL).map(([party, predicted]) => {
                        const actual = actualSeats[party] || 0;
                        const color  = PARTY_COLORS[party] || "#6c63ff";
                        const diff   = actual - predicted;
                        return (
                            <div key={party} className={styles.exitCard} style={{ borderTopColor: color }}>
                                <span className={styles.exitParty} style={{ color }}>{party}</span>
                                <div className={styles.exitRow}>
                                    <div className={styles.exitCol}>
                                        <div className={styles.exitNum}>{predicted}</div>
                                        <div className={styles.exitLabel}>Exit Poll</div>
                                    </div>
                                    <div className={styles.exitDivider} />
                                    <div className={styles.exitCol}>
                                        <div className={styles.exitNum} style={{ color }}>{actual}</div>
                                        <div className={styles.exitLabel}>Actual</div>
                                    </div>
                                </div>
                                <div className={diff > 0 ? styles.swingUp : diff < 0 ? styles.swingDown : styles.swingNeutral}>
                                    {diff > 0 ? `▲ +${diff}` : diff < 0 ? `▼ ${diff}` : "= No change"}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Constituency-wise Breakdown */}
            <h2 className={styles.sectionTitle}>Constituency-wise Breakdown</h2>
            {grouped.length === 0 ? (
                <div className={styles.noDataBox}>
                    🗺️ No constituency data found. Make sure parties and constituencies are seeded from the Admin Dashboard.
                </div>
            ) : (
                <div className={styles.constituencyGrid}>
                    {grouped.map(c => (
                        <div key={c.id} className={styles.cCard}>
                            <div className={styles.cHeader}>
                                <span className={styles.cName}>{c.name}</span>
                                <span className={c.active ? styles.live : styles.closed}>
                                    {c.active ? "🟢 Live" : "🔴 Closed"}
                                </span>
                            </div>
                            {c.total === 0 ? (
                                <p className={styles.noVotesYet}>No votes cast yet</p>
                            ) : (
                                <div className={styles.cBars}>
                                    {c.parties.map(p => {
                                        const pct   = ((p.numberOfVotes / c.total) * 100).toFixed(1);
                                        const color = PARTY_COLORS[p.name] || "#6c63ff";
                                        return (
                                            <div key={p.id} className={styles.cBarRow} onClick={() => navigate(`/candidate/${p.id}`)}>
                                                <span className={styles.cParty} style={{ color }}>{p.name}</span>
                                                <div className={styles.cTrack}>
                                                    <div className={styles.cFill} style={{ width: `${pct}%`, background: color }} />
                                                </div>
                                                <span className={styles.cPct}>{pct}%</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                            <div className={styles.cFooter}>
                                Total: {c.total.toLocaleString()} votes
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Results;
