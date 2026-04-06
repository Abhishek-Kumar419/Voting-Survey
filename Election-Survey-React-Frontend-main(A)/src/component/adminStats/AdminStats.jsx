import { useElectionData } from "../../context/ElectionDataContext";
import styles from "./AdminStats.module.css";

function AdminStats() {
    const { parties, activeParties } = useElectionData();

    const totalVotes  = parties.reduce((s, p) => s + p.numberOfVotes, 0);
    const activeCount = new Set(activeParties.map(p => p.constituency?.id)).size;

    const partyTotals = parties.reduce((acc, p) => {
        acc[p.name] = (acc[p.name] || 0) + p.numberOfVotes;
        return acc;
    }, {});
    const leadingParty = Object.entries(partyTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

    const cards = [
        { icon: "🗳️", label: "Total Votes Cast",  value: totalVotes.toLocaleString(),              color: "#6c63ff" },
        { icon: "🟢", label: "Active Elections", value: activeCount,                                  color: "#22c55e" },
        { icon: "🏆", label: "Leading Party",    value: leadingParty,                                color: "#f59e0b" },
        { icon: "📊", label: "BJP Votes",         value: (partyTotals?.BJP || 0).toLocaleString(),   color: "#ff6600" },
        { icon: "✋",  label: "INC Votes",         value: (partyTotals?.INC || 0).toLocaleString(),   color: "#1565c0" },
        { icon: "🧹", label: "AAP Votes",         value: (partyTotals?.AAP || 0).toLocaleString(),   color: "#00897b" },
    ];

    return (
        <div className={styles.grid}>
            {cards.map((c, i) => (
                <div key={i} className={styles.card} style={{ borderTopColor: c.color }}>
                    <span className={styles.icon}>{c.icon}</span>
                    <div className={styles.value} style={{ color: c.color }}>{c.value}</div>
                    <div className={styles.label}>{c.label}</div>
                </div>
            ))}
        </div>
    );
}

export default AdminStats;
