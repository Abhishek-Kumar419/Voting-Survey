import { useElectionData } from "../../context/ElectionDataContext";
import styles from "./NewsTicker.module.css";

function NewsTicker() {
    const { activeParties } = useElectionData();

    if (!activeParties || activeParties.length === 0) return null;

    const grouped = activeParties.reduce((acc, p) => {
        const cName = p.constituency?.name || "Unknown";
        if (!acc[cName]) acc[cName] = [];
        acc[cName].push(p);
        return acc;
    }, {});

    const msgs = [];
    Object.entries(grouped).forEach(([cName, parties]) => {
        const sorted = [...parties].sort((a, b) => b.numberOfVotes - a.numberOfVotes);
        const leader = sorted[0];
        const second = sorted[1];
        const margin = leader.numberOfVotes - (second?.numberOfVotes || 0);
        msgs.push(`🔴 LIVE | ${leader.name} leads in ${cName} with ${leader.numberOfVotes.toLocaleString()} votes | Margin: ${margin.toLocaleString()} votes`);
        if (second) msgs.push(`📊 ${cName} — ${second.name} trailing with ${second.numberOfVotes.toLocaleString()} votes`);
    });

    const totalVotes = activeParties.reduce((s, p) => s + p.numberOfVotes, 0);
    msgs.push(`🗳️ Total votes cast across all active constituencies: ${totalVotes.toLocaleString()}`);

    const tickerText = msgs.join("   ◆   ");

    return (
        <div className={styles.ticker}>
            <span className={styles.liveTag}>🔴 LIVE</span>
            <div className={styles.track}>
                <span className={styles.text}>{tickerText}   ◆   {tickerText}</span>
            </div>
        </div>
    );
}

export default NewsTicker;
