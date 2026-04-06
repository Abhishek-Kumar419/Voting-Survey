import { useEffect, useRef } from "react";
import styles from "./WinnerBanner.module.css";

const PARTY_COLORS = { BJP: "#ff6600", INC: "#1565c0", AAP: "#00897b", SAD: "#f9a825" };

function WinnerBanner({ winner, constituency, onClose }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const pieces = Array.from({ length: 160 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height,
            w: Math.random() * 10 + 5,
            h: Math.random() * 16 + 6,
            color: ["#ffd700", "#ff4444", "#22c55e", "#6c63ff", "#f59e0b", "#fff"][Math.floor(Math.random() * 6)],
            speed: Math.random() * 3 + 1.5,
            angle: Math.random() * 360,
            spin: (Math.random() - 0.5) * 4,
        }));

        let raf;
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            pieces.forEach(p => {
                ctx.save();
                ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
                ctx.rotate((p.angle * Math.PI) / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                ctx.restore();
                p.y += p.speed;
                p.angle += p.spin;
                if (p.y > canvas.height) { p.y = -20; p.x = Math.random() * canvas.width; }
            });
            raf = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(raf);
    }, []);

    const color = PARTY_COLORS[winner?.name] || "#6c63ff";

    return (
        <div className={styles.overlay}>
            <canvas ref={canvasRef} className={styles.canvas} />
            <div className={styles.banner} style={{ borderColor: color, boxShadow: `0 0 60px ${color}88` }}>
                <div className={styles.trophy}>🏆</div>
                <div className={styles.winnerLabel} style={{ color }}>WINNER DECLARED</div>
                <h1 className={styles.partyName} style={{ color }}>{winner?.name}</h1>
                <p className={styles.candidate}>{winner?.candidateName}</p>
                <p className={styles.constituency}>📍 {constituency}</p>
                <p className={styles.votes}>{winner?.numberOfVotes?.toLocaleString()} votes</p>
                <button className={styles.closeBtn} onClick={onClose}>✕ Close</button>
            </div>
        </div>
    );
}

export default WinnerBanner;
