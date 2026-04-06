import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useElectionData } from "../context/ElectionDataContext";
import VoterTurnoutMeter from "../component/voterTurnout/VoterTurnout";
import WinnerBanner from "../component/winnerBanner/WinnerBanner";
import AllConstituencyResults from "../component/allConstituencyResults/AllConstituencyResults";
import styles from "./home.module.css";

const PARTY_COLORS = { BJP: "#ff6600", INC: "#1565c0", AAP: "#00897b", SAD: "#f9a825" };
const PARTY_BG     = { BJP: "rgba(255,102,0,0.10)", INC: "rgba(21,101,192,0.10)", AAP: "rgba(0,137,123,0.10)", SAD: "rgba(249,168,37,0.10)" };
const MOCK_REGISTERED_PER_CONSTITUENCY = 3000;

const fallbackPartyImages = {
    BJP: "https://tse2.mm.bing.net/th/id/OIP.53bSgHop7Rw7VMVwi2PU7gHaH6?pid=Api&P=0&h=180",
    INC: "https://tse2.mm.bing.net/th/id/OIP.7gBsmyboxHJsRCp6Yf0kpwHaE2?pid=Api&P=0&h=180",
    AAP: "https://tse3.mm.bing.net/th/id/OIP.WExtSFlcjlLts4SAE9SVcQHaFO?pid=Api&P=0&h=180",
    SAD: "https://tse3.mm.bing.net/th/id/OIP.-zgU1kJkApXOESdrlzBjoAHaE8?pid=Api&P=0&h=180",
};

const getPartyImage = (party) => party.img || fallbackPartyImages[party.name] || "/img/party.png";

const Home = () => {
    const { activeParties, loading } = useElectionData();
    const [winner, setWinner]         = useState(null);
    const [showBanner, setShowBanner] = useState(false);
    const [prevVotes, setPrevVotes]   = useState({});
    const announcedRef                = useRef({});
    const navigate                    = useNavigate();

    // Group active parties by constituency — memoized so it only recomputes when activeParties changes
    const constituencyMap = useMemo(() => activeParties.reduce((acc, p) => {
        const cId = p.constituency?.id;
        if (!cId) return acc;
        if (!acc[cId]) acc[cId] = { id: cId, name: p.constituency.name, state: p.constituency.state, parties: [] };
        acc[cId].parties.push(p);
        return acc;
    }, {}), [activeParties]);

    const constituencies = useMemo(() => Object.values(constituencyMap).map(c => ({
        ...c,
        parties: [...c.parties].sort((a, b) => b.numberOfVotes - a.numberOfVotes),
        total: c.parties.reduce((s, p) => s + p.numberOfVotes, 0),
    })), [constituencyMap]);

    const grandTotal = useMemo(() => constituencies.reduce((s, c) => s + c.total, 0), [constituencies]);

    useEffect(() => {
        if (activeParties.length === 0) return;

        // Swing tracking
        setPrevVotes(prev => {
            const updated = { ...prev };
            activeParties.forEach(p => { if (!(p.id in updated)) updated[p.id] = p.numberOfVotes; });
            return updated;
        });

        // Winner detection per constituency
        constituencies.forEach(c => {
            const leader = c.parties[0];
            if (!announcedRef.current[c.id] && c.total >= 10 && leader.numberOfVotes / c.total > 0.5) {
                announcedRef.current[c.id] = true;
                setWinner({ ...leader, constituencyName: c.name });
                setShowBanner(true);
            }
        });
    }, [activeParties]);

    return (
        <div className={styles.wrapper}>
            {showBanner && winner && (
                <WinnerBanner
                    winner={winner}
                    constituency={winner.constituencyName}
                    onClose={() => setShowBanner(false)}
                />
            )}

            {loading && <p className={styles.loading}>⏳ Loading live election data...</p>}

            {!loading && constituencies.length === 0 && (
                <div className={styles.noLive}>
                    <div className={styles.noLiveIcon}>🔴</div>
                    <h2>No Live Election Yet</h2>
                    <p>Check back when an election is activated by the admin.</p>
                </div>
            )}

            {constituencies.length > 0 && (
                <>
                    {/* Page header */}
                    <div className={styles.pageHeader}>
                        <div className={styles.pageHeaderLeft}>
                            <span className={styles.liveDot} />
                            <h1 className={styles.pageTitle}>Live Election Survey</h1>
                            <span className={styles.liveChip}>LIVE</span>
                        </div>
                        <div className={styles.pageHeaderRight}>
                            <div className={styles.statPill}>
                                <span className={styles.statVal}>{constituencies.length}</span>
                                <span className={styles.statLabel}>Active</span>
                            </div>
                            <div className={styles.statPill}>
                                <span className={styles.statVal}>{grandTotal.toLocaleString()}</span>
                                <span className={styles.statLabel}>Total Votes</span>
                            </div>
                        </div>
                    </div>

                    {/* Constituency cards grid */}
                    <div className={styles.constituencyGrid}>
                        {constituencies.map(c => {
                            const leader = c.parties[0];
                            const leaderColor = PARTY_COLORS[leader?.name] || "#6c63ff";

                            return (
                                <div key={c.id} className={styles.constituencyCard} style={{ borderTopColor: leaderColor }}>

                                    {/* Card header */}
                                    <div className={styles.cardHeader}>
                                        <div className={styles.cardHeaderLeft}>
                                            <span className={styles.cId}>#{c.id}</span>
                                            <div>
                                                <h2 className={styles.cName}>{c.name}</h2>
                                                <p className={styles.cState}>{c.state}</p>
                                            </div>
                                        </div>
                                        <VoterTurnoutMeter
                                            totalVotes={c.total}
                                            totalRegistered={MOCK_REGISTERED_PER_CONSTITUENCY}
                                            compact
                                        />
                                    </div>

                                    {/* Leading party highlight */}
                                    {leader && c.total > 0 && (
                                        <div className={styles.leaderBanner} style={{ background: PARTY_BG[leader.name] || "rgba(108,99,255,0.1)", borderColor: leaderColor }}>
                                            <img
                                                src={getPartyImage(leader)}
                                                alt={leader.name}
                                                className={styles.leaderLogo}
                                                loading="lazy"
                                                onError={e => { e.target.src = "/img/party.png"; }}
                                            />
                                            <div className={styles.leaderInfo}>
                                                <span className={styles.leaderParty} style={{ color: leaderColor }}>{leader.name}</span>
                                                <span className={styles.leaderCandidate}>{leader.candidateName}</span>
                                            </div>
                                            <div className={styles.leaderVotes}>
                                                <span className={styles.leaderVoteNum} style={{ color: leaderColor }}>{leader.numberOfVotes.toLocaleString()}</span>
                                                <span className={styles.leaderVoteLabel}>votes</span>
                                            </div>
                                            <span className={styles.leadingBadge} style={{ background: leaderColor }}>LEADING</span>
                                        </div>
                                    )}

                                    {/* All parties bars */}
                                    <div className={styles.partyBars}>
                                        {c.parties.map((party, idx) => {
                                            const pct    = c.total > 0 ? ((party.numberOfVotes / c.total) * 100).toFixed(1) : 0;
                                            const color  = PARTY_COLORS[party.name] || "#6c63ff";
                                            const prev   = prevVotes[party.id] ?? party.numberOfVotes;
                                            const swing  = party.numberOfVotes - prev;

                                            return (
                                                <div
                                                    key={party.id}
                                                    className={`${styles.partyBar} ${idx === 0 && c.total > 0 ? styles.partyBarLeader : ""}`}
                                                    onClick={() => navigate(`/candidate/${party.id}`)}
                                                >
                                                    <img
                                                        src={getPartyImage(party)}
                                                        alt={party.name}
                                                        className={styles.barLogo}
                                                        loading="lazy"
                                                        onError={e => { e.target.src = "/img/party.png"; }}
                                                    />
                                                    <div className={styles.barBody}>
                                                        <div className={styles.barTopRow}>
                                                            <span className={styles.barPartyName} style={{ color }}>{party.name}</span>
                                                            <span className={styles.barCandidate}>{party.candidateName}</span>
                                                            <div className={styles.barRightStats}>
                                                                {swing > 0 && <span className={styles.swingUp}>▲+{swing}</span>}
                                                                {swing < 0 && <span className={styles.swingDown}>▼{swing}</span>}
                                                                <span className={styles.barPct} style={{ color }}>{pct}%</span>
                                                                <span className={styles.barVotes}>{party.numberOfVotes.toLocaleString()}</span>
                                                            </div>
                                                        </div>
                                                        <div className={styles.barTrack}>
                                                            <div
                                                                className={styles.barFill}
                                                                style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}99)` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Card footer */}
                                    <div className={styles.cardFooter}>
                                        <span>Total: <strong>{c.total.toLocaleString()}</strong> votes</span>
                                        {c.total > 0 && c.parties[1] && (
                                            <span className={styles.margin}>
                                                Margin: <strong>{(c.parties[0].numberOfVotes - c.parties[1].numberOfVotes).toLocaleString()}</strong>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {winner && !showBanner && (
                        <button className={styles.reannounce} onClick={() => setShowBanner(true)}>
                            🏆 View Winner: {winner.name} — {winner.constituencyName}
                        </button>
                    )}
                </>
            )}

            {/* All constituencies table */}
            <div className={styles.allResults}>
                <AllConstituencyResults />
            </div>
        </div>
    );
};

export default Home;
