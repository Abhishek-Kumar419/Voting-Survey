import { useState } from "react";
import { useElectionData } from "../../context/ElectionDataContext";
import styles from "./AllConstituencyResults.module.css";

const PARTY_COLORS = { BJP: "#ff6600", INC: "#1565c0", AAP: "#00897b", SAD: "#f9a825" };

function AllConstituencyResults() {
    const { parties } = useElectionData();
    const [sortKey, setSortKey] = useState("id");
    const [sortDir, setSortDir] = useState("asc");

    const grouped = parties.reduce((acc, p) => {
        const cId = p.constituency.id;
        if (!acc[cId]) acc[cId] = { id: cId, name: p.constituency.name, state: p.constituency.state, active: p.constituency.electionActive, parties: [] };
        acc[cId].parties.push(p);
        return acc;
    }, {});

    const rows = Object.values(grouped).map(c => {
        const sorted = [...c.parties].sort((a, b) => b.numberOfVotes - a.numberOfVotes);
        const leader = sorted[0];
        const second = sorted[1];
        const total  = sorted.reduce((s, p) => s + p.numberOfVotes, 0);
        const margin = leader.numberOfVotes - (second?.numberOfVotes || 0);
        return { ...c, leader, total, margin };
    });

    const handleSort = (key) => {
        if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
        else { setSortKey(key); setSortDir("asc"); }
    };

    const sorted = [...rows].sort((a, b) => {
        let av = a[sortKey], bv = b[sortKey];
        if (typeof av === "string") av = av.toLowerCase(), bv = bv.toLowerCase();
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
    });

    const arrow = (key) => sortKey === key ? (sortDir === "asc" ? " ▲" : " ▼") : " ⇅";

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.heading}>📋 All Constituencies — Live Results</h2>
            <div className={styles.tableWrap}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th onClick={() => handleSort("id")}>#{arrow("id")}</th>
                            <th onClick={() => handleSort("name")}>Constituency{arrow("name")}</th>
                            <th onClick={() => handleSort("state")}>State{arrow("state")}</th>
                            <th>Leading Party</th>
                            <th onClick={() => handleSort("total")}>Total Votes{arrow("total")}</th>
                            <th onClick={() => handleSort("margin")}>Margin{arrow("margin")}</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sorted.map(row => (
                            <tr key={row.id}>
                                <td>{row.id}</td>
                                <td className={styles.cName}>{row.name}</td>
                                <td>{row.state}</td>
                                <td>
                                    <span className={styles.partyBadge} style={{ background: PARTY_COLORS[row.leader?.name] || "#6c63ff" }}>
                                        {row.leader?.name || "—"}
                                    </span>
                                    <span className={styles.candidate}>{row.leader?.candidateName}</span>
                                </td>
                                <td className={styles.num}>{row.total.toLocaleString()}</td>
                                <td className={styles.num}>{row.margin.toLocaleString()}</td>
                                <td>
                                    <span className={row.active ? styles.live : styles.closed}>
                                        {row.active ? "🟢 Live" : "🔴 Closed"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AllConstituencyResults;
