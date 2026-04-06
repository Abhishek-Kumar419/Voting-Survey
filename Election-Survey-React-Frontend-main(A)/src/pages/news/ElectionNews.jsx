import { useElectionData } from "../../context/ElectionDataContext";
import styles from "./ElectionNews.module.css";

const PARTY_COLORS  = { BJP: "#ff6600", INC: "#1565c0", AAP: "#00897b", SAD: "#f9a825" };
const TAG_COLORS    = { "BREAKING": "#ef4444", "LIVE UPDATE": "#f59e0b", "ANALYSIS": "#6c63ff", "SURGE": "#ec4899", "UPDATE": "#3b82f6", "TRAILING": "#ef4444", "WINNER": "#22c55e" };
const PARTY_IMAGES  = {
    BJP: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400&q=80",
    INC: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&q=80",
    AAP: "https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?w=400&q=80",
    SAD: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=80",
};
const FALLBACK_IMG  = "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=400&q=80";

// Returns how many minutes ago a news item was "published" (just for display)
let newsCounter = 0;
const timeLabel = () => {
    const mins = newsCounter * 3;
    newsCounter++;
    if (mins === 0) return "Just now";
    if (mins < 60) return `${mins} min${mins > 1 ? "s" : ""} ago`;
    return `${Math.floor(mins / 60)} hr ago`;
};

function generateNews(parties) {
    newsCounter = 0;
    if (!parties || parties.length === 0) return [];

    // Group by constituency
    const byC = parties.reduce((acc, p) => {
        const cId = p.constituency?.id;
        if (!acc[cId]) acc[cId] = { name: p.constituency?.name, parties: [] };
        acc[cId].parties.push(p);
        return acc;
    }, {});

    const news = [];

    // Overall party totals
    const partyTotals = parties.reduce((acc, p) => {
        acc[p.name] = (acc[p.name] || 0) + p.numberOfVotes;
        return acc;
    }, {});
    const totalVotes = Object.values(partyTotals).reduce((s, v) => s + v, 0);
    const sortedParties = Object.entries(partyTotals).sort((a, b) => b[1] - a[1]);
    const [topParty, topVotes]       = sortedParties[0] || [];
    const [secondParty, secondVotes] = sortedParties[1] || [];
    const [bottomParty]              = [...sortedParties].reverse()[0] || [];

    // 1. BREAKING — overall leader
    if (topParty && topVotes > 0) {
        const pct = ((topVotes / totalVotes) * 100).toFixed(1);
        news.push({
            id: 1, category: "BREAKING", tag: "🔴",
            headline: `${topParty} surges ahead with ${pct}% of total votes across all constituencies`,
            summary: `${topParty} is currently leading the election with ${topVotes.toLocaleString()} votes (${pct}% vote share), pulling ahead of ${secondParty || "rivals"} who have ${(secondVotes || 0).toLocaleString()} votes. Analysts say the margin is ${topVotes - (secondVotes || 0) > 500 ? "decisive" : "narrow and could change"}.`,
            time: timeLabel(),
            img: PARTY_IMAGES[topParty] || FALLBACK_IMG,
        });
    }

    // 2. LIVE UPDATE — constituency-wise leaders
    const constituencyLeaders = Object.values(byC).map(c => {
        const sorted = [...c.parties].sort((a, b) => b.numberOfVotes - a.numberOfVotes);
        return { cName: c.name, leader: sorted[0], second: sorted[1] };
    }).filter(c => c.leader?.numberOfVotes > 0);

    if (constituencyLeaders.length > 0) {
        const leadingNames = constituencyLeaders.map(c => c.cName).join(", ");
        const leaderParty  = constituencyLeaders[0].leader;
        news.push({
            id: 2, category: "LIVE UPDATE", tag: "🟡",
            headline: `${leaderParty.name} leading in ${constituencyLeaders.length} constituency${constituencyLeaders.length > 1 ? "ies" : "y"} — ${leaderParty.candidateName} ahead`,
            summary: `Live counting shows ${leaderParty.name}'s ${leaderParty.candidateName} leading in ${leadingNames}. With ${leaderParty.numberOfVotes.toLocaleString()} votes, the party is showing strong performance in these regions.`,
            time: timeLabel(),
            img: PARTY_IMAGES[leaderParty.name] || FALLBACK_IMG,
        });
    }

    // 3. Per-constituency detailed news
    Object.values(byC).forEach(c => {
        const sorted = [...c.parties].sort((a, b) => b.numberOfVotes - a.numberOfVotes);
        const leader = sorted[0];
        const second = sorted[1];
        const total  = sorted.reduce((s, p) => s + p.numberOfVotes, 0);
        if (total === 0) return;

        const margin = leader.numberOfVotes - (second?.numberOfVotes || 0);
        const pct    = ((leader.numberOfVotes / total) * 100).toFixed(1);
        const isTight = margin < 50 && margin > 0;
        const isLandslide = parseFloat(pct) > 60;

        if (isLandslide) {
            news.push({
                id: news.length + 10,
                category: "WINNER", tag: "🏆",
                headline: `${leader.name} dominates ${c.name} with ${pct}% vote share — landslide victory`,
                summary: `${leader.candidateName} of ${leader.name} is heading for a landslide in ${c.name} with ${leader.numberOfVotes.toLocaleString()} votes (${pct}%). ${second?.name || "Rivals"} are far behind with only ${(second?.numberOfVotes || 0).toLocaleString()} votes.`,
                time: timeLabel(),
                img: PARTY_IMAGES[leader.name] || FALLBACK_IMG,
            });
        } else if (isTight) {
            news.push({
                id: news.length + 10,
                category: "BREAKING", tag: "🔴",
                headline: `Nail-biting contest in ${c.name} — ${leader.name} leads ${second?.name} by just ${margin} votes`,
                summary: `An extremely close battle is unfolding in ${c.name}. ${leader.candidateName} (${leader.name}) leads with ${leader.numberOfVotes.toLocaleString()} votes while ${second?.candidateName} (${second?.name}) is just ${margin} vote${margin > 1 ? "s" : ""} behind. Every vote counts here.`,
                time: timeLabel(),
                img: PARTY_IMAGES[leader.name] || FALLBACK_IMG,
            });
        } else if (margin > 0) {
            news.push({
                id: news.length + 10,
                category: "LIVE UPDATE", tag: "🟡",
                headline: `${leader.name}'s ${leader.candidateName} leads in ${c.name} by ${margin.toLocaleString()} votes`,
                summary: `In ${c.name}, ${leader.name} holds a ${margin.toLocaleString()}-vote lead over ${second?.name || "rivals"}. Current tally: ${leader.name} — ${leader.numberOfVotes.toLocaleString()}, ${second?.name || "2nd"} — ${(second?.numberOfVotes || 0).toLocaleString()}.`,
                time: timeLabel(),
                img: PARTY_IMAGES[leader.name] || FALLBACK_IMG,
            });
        }
    });

    // 4. SURGE — party gaining most votes
    const surgeParty = sortedParties.find(([name]) => name !== topParty);
    if (surgeParty && surgeParty[1] > 0) {
        news.push({
            id: news.length + 100,
            category: "SURGE", tag: "⚡",
            headline: `${surgeParty[0]} showing strong surge — ${surgeParty[1].toLocaleString()} votes and climbing`,
            summary: `${surgeParty[0]} is putting up a strong fight with ${surgeParty[1].toLocaleString()} votes across constituencies. Political analysts say the party's ground campaign is paying off in key urban areas.`,
            time: timeLabel(),
            img: PARTY_IMAGES[surgeParty[0]] || FALLBACK_IMG,
        });
    }

    // 5. TRAILING — bottom party
    if (bottomParty && bottomParty !== topParty && partyTotals[bottomParty] >= 0) {
        news.push({
            id: news.length + 200,
            category: "TRAILING", tag: "📉",
            headline: `${bottomParty} struggling — trails all parties with ${partyTotals[bottomParty].toLocaleString()} votes`,
            summary: `${bottomParty} is currently at the bottom of the vote tally with ${partyTotals[bottomParty].toLocaleString()} votes. Party leaders have called an emergency meeting to assess the situation as results continue to pour in.`,
            time: timeLabel(),
            img: PARTY_IMAGES[bottomParty] || FALLBACK_IMG,
        });
    }

    // 6. ANALYSIS — vote share breakdown
    if (totalVotes > 0) {
        const breakdown = sortedParties.map(([name, votes]) =>
            `${name}: ${((votes / totalVotes) * 100).toFixed(1)}%`
        ).join(" | ");
        news.push({
            id: news.length + 300,
            category: "ANALYSIS", tag: "📊",
            headline: `Vote share analysis: ${topParty} leads — full breakdown across all parties`,
            summary: `Current vote share distribution — ${breakdown}. Total votes counted so far: ${totalVotes.toLocaleString()}. Psephologists note that the trend is ${parseFloat(((topVotes || 0) / totalVotes) * 100) > 45 ? "clear and decisive" : "still fluid with results expected to shift"}.`,
            time: timeLabel(),
            img: FALLBACK_IMG,
        });
    }

    return news;
}

function ElectionNews() {
    const { parties, loading } = useElectionData();
    const news = generateNews(parties);

    if (loading) return <div className={styles.page}><p className={styles.loading}>Loading live news...</p></div>;

    if (news.length === 0) return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.pageTitle}>📰 Election News</h1>
                <span className={styles.liveChip}>🔴 LIVE COVERAGE</span>
            </div>
            <p className={styles.noNews}>No active election data. News will appear once voting begins.</p>
        </div>
    );

    const [featured, ...rest] = news;

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.pageTitle}>📰 Election News</h1>
                <span className={styles.liveChip}>🔴 LIVE COVERAGE</span>
            </div>

            {/* Featured story */}
            <div className={styles.featured}>
                <img src={featured.img} alt={featured.headline} className={styles.featuredImg} onError={e => { e.target.style.display = "none"; }} />
                <div className={styles.featuredContent}>
                    <span className={styles.tag} style={{ background: TAG_COLORS[featured.category] || "#6c63ff" }}>
                        {featured.tag} {featured.category}
                    </span>
                    <h2 className={styles.featuredHeadline}>{featured.headline}</h2>
                    <p className={styles.summary}>{featured.summary}</p>
                    <span className={styles.time}>🕐 {featured.time}</span>
                </div>
            </div>

            {/* News grid */}
            <div className={styles.grid}>
                {rest.map(n => (
                    <div key={n.id} className={styles.card}>
                        <img src={n.img} alt={n.headline} className={styles.cardImg} onError={e => { e.target.style.display = "none"; }} />
                        <div className={styles.cardBody}>
                            <span className={styles.tag} style={{ background: TAG_COLORS[n.category] || "#6c63ff" }}>
                                {n.tag} {n.category}
                            </span>
                            <h3 className={styles.cardHeadline}>{n.headline}</h3>
                            <p className={styles.cardSummary}>{n.summary}</p>
                            <span className={styles.time}>🕐 {n.time}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ElectionNews;
