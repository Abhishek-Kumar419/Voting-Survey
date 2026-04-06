import styles from "./VoterTurnout.module.css";

function VoterTurnoutMeter({ totalVotes, totalRegistered, compact = false }) {
    const pct = totalRegistered > 0 ? Math.min(100, ((totalVotes / totalRegistered) * 100).toFixed(1)) : 0;
    const size = compact ? 64 : 130;
    const r    = compact ? 26 : 54;
    const sw   = compact ? 7  : 12;
    const circumference = 2 * Math.PI * r;
    const offset = circumference - (pct / 100) * circumference;
    const color  = pct < 30 ? "#ef4444" : pct < 60 ? "#f59e0b" : "#22c55e";
    const center = size / 2;

    return (
        <div className={compact ? styles.wrapperCompact : styles.wrapper}>
            {!compact && <h3 className={styles.title}>🗳️ Voter Turnout</h3>}
            <div className={styles.gaugeWrap} style={{ width: size, height: size }}>
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    <circle cx={center} cy={center} r={r} fill="none" stroke="#1c1c28" strokeWidth={sw} />
                    <circle
                        cx={center} cy={center} r={r}
                        fill="none" stroke={color} strokeWidth={sw}
                        strokeDasharray={circumference} strokeDashoffset={offset}
                        strokeLinecap="round"
                        transform={`rotate(-90 ${center} ${center})`}
                        style={{ transition: "stroke-dashoffset 1s ease" }}
                    />
                </svg>
                <div className={styles.pctLabel} style={{ color, fontSize: compact ? "13px" : "22px" }}>{pct}%</div>
            </div>
            {!compact && (
                <div className={styles.stats}>
                    <span>{totalVotes.toLocaleString()} voted</span>
                    <span className={styles.sep}>of</span>
                    <span>{totalRegistered.toLocaleString()} registered</span>
                </div>
            )}
            {compact && <div className={styles.compactLabel} style={{ color }}>Turnout</div>}
        </div>
    );
}

export default VoterTurnoutMeter;
