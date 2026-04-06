import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import styles from "./findVoterId.module.css";

const FindVoterId = () => {
    const [step, setStep] = useState(1);
    const [name, setName] = useState("");
    const [dob, setDob] = useState("");
    const [results, setResults] = useState([]);
    const [selected, setSelected] = useState(null);
    const [fullVoterId, setFullVoterId] = useState("");
    const [confirmed, setConfirmed] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/voter-search/find`, {
                params: { name, dob }
            });
            setResults(res.data);
            setStep(2);
        } catch (err) {
            toast.error(err.response?.data || "No voter found. Check your name and date of birth.");
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/voter-search/confirm`, {
                params: { voterId: fullVoterId, dob }
            });
            setConfirmed(res.data);
            setStep(3);
        } catch (err) {
            toast.error(err.response?.data || "Voter ID and date of birth do not match.");
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = () => {
        navigate("/register", { state: { voterId: confirmed.voterId, dob } });
    };

    return (
        <div className={styles.container}>
            <Toaster />
            <h1 className={styles.title}>🔍 Find Your Voter ID</h1>

            {/* STEP 1 — Search */}
            {step === 1 && (
                <form className={styles.form} onSubmit={handleSearch}>
                    <p className={styles.hint}>Enter your name and date of birth as registered in the electoral roll.</p>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Full Name</label>
                        <input className={styles.input} type="text" placeholder="e.g. Rajesh Singh"
                            value={name} onChange={e => setName(e.target.value)} required minLength={3} />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Date of Birth</label>
                        <input className={styles.input} type="date"
                            value={dob} onChange={e => setDob(e.target.value)} required />
                    </div>
                    <button className="g-btn" type="submit" disabled={loading}>
                        {loading ? "Searching..." : "Search"}
                    </button>
                </form>
            )}

            {/* STEP 2 — Pick result & enter full voter ID */}
            {step === 2 && (
                <div>
                    <p className={styles.hint}>We found {results.length} record(s). Select yours and enter your full Voter ID to confirm.</p>
                    <div className={styles.resultList}>
                        {results.map((r, i) => (
                            <div key={i}
                                className={`${styles.resultCard} ${selected === i ? styles.selected : ""}`}
                                onClick={() => setSelected(i)}>
                                <p><strong>{r.name}</strong> — {r.gender}</p>
                                <p>Constituency: {r.constituencyName}</p>
                                <p>Address: {r.address}</p>
                                <p className={styles.masked}>Voter ID: <strong>{r.maskedVoterId}</strong></p>
                                <p>{r.isRegistered ? "✅ Already registered" : "🔵 Not yet registered"}</p>
                            </div>
                        ))}
                    </div>
                    <form className={styles.form} onSubmit={handleConfirm}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Enter Your Full Voter ID</label>
                            <input className={styles.input} type="number" placeholder="e.g. 1000042"
                                value={fullVoterId} onChange={e => setFullVoterId(e.target.value)} required />
                        </div>
                        <div className={styles.btnRow}>
                            <button type="button" className="g-btn" style={{background:"#374151"}}
                                onClick={() => { setStep(1); setResults([]); setSelected(null); }}>
                                ← Back
                            </button>
                            <button className="g-btn" type="submit" disabled={loading}>
                                {loading ? "Confirming..." : "Confirm My ID"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* STEP 3 — Confirmed details */}
            {step === 3 && confirmed && (
                <div className={styles.confirmedCard}>
                    <h2>✅ Voter Found</h2>
                    <p><strong>Voter ID:</strong> {confirmed.voterId}</p>
                    <p><strong>Name:</strong> {confirmed.name}</p>
                    <p><strong>Gender:</strong> {confirmed.gender}</p>
                    <p><strong>Constituency:</strong> {confirmed.constituencyName}</p>
                    <p><strong>Address:</strong> {confirmed.address}</p>
                    {confirmed.isRegistered ? (
                        <div className={styles.alreadyReg}>
                            ✅ This Voter ID already has an account. Please <span onClick={() => navigate("/login")} className={styles.link}>login</span>.
                        </div>
                    ) : (
                        <button className="g-btn" onClick={handleRegister}>
                            Register with this Voter ID →
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default FindVoterId;
