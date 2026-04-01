import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import styles from "./ConstituencyAdded.module.css";

const STATES = [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
    "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
    "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
    "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal"
];

const EMPTY = { id: "", name: "", state: STATES[0] };

const ConstituencyManager = () => {
    const [constituencies, setConstituencies] = useState([]);
    const [loading, setLoading]   = useState(true);
    const [search, setSearch]     = useState("");
    const [filterState, setFilterState] = useState("All");
    const [filterStatus, setFilterStatus] = useState("All");
    const [formData, setFormData] = useState(EMPTY);
    const [submitting, setSubmitting] = useState(false);
    const [togglingId, setTogglingId] = useState(null);

    const fetchAll = async () => {
        try {
            const res = await axios.get("http://localhost:8090/api/constituency");
            setConstituencies(res.data);
        } catch {
            toast.error("Failed to load constituencies.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAll(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axios.post("http://localhost:8090/api/constituency", {
                ...formData,
                electionActive: false,
                dOLS: new Date().toISOString().split("T")[0]
            }, { headers: { "Content-Type": "application/json" } });
            toast.success("Constituency added successfully!");
            setFormData(EMPTY);
            fetchAll();
        } catch {
            toast.error("Failed to add constituency. ID may already exist.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggle = async (c) => {
        setTogglingId(c.id);
        try {
            const newStatus = !c.electionActive;
            await axios.put(`http://localhost:8090/api/constituency/${c.id}/election-status/${newStatus}`);
            toast.success(`Election ${newStatus ? "activated" : "deactivated"} for ${c.name}`);
            fetchAll();
        } catch {
            toast.error("Failed to update election status.");
        } finally {
            setTogglingId(null);
        }
    };

    const filtered = constituencies.filter(c => {
        const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                            String(c.id).includes(search);
        const matchState  = filterState  === "All" || c.state === filterState;
        const matchStatus = filterStatus === "All" ||
                            (filterStatus === "Active" && c.electionActive) ||
                            (filterStatus === "Inactive" && !c.electionActive);
        return matchSearch && matchState && matchStatus;
    });

    const totalActive = constituencies.filter(c => c.electionActive).length;

    return (
        <div className={styles.container}>

            {/* ── Stats ── */}
            <div className={styles.statsRow}>
                <div className={styles.statBox}>
                    <span className={styles.statNum}>{constituencies.length}</span>
                    <span className={styles.statLabel}>Total</span>
                </div>
                <div className={styles.statBox}>
                    <span className={`${styles.statNum} ${styles.green}`}>{totalActive}</span>
                    <span className={styles.statLabel}>Live</span>
                </div>
                <div className={styles.statBox}>
                    <span className={styles.statNum}>{constituencies.length - totalActive}</span>
                    <span className={styles.statLabel}>Inactive</span>
                </div>
            </div>

            {/* ── Add Form ── */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>➕ Add Constituency</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formRow}>
                        <div className={styles.field}>
                            <label>Constituency Number</label>
                            <input type="number" placeholder="e.g. 101" value={formData.id}
                                onChange={e => setFormData({ ...formData, id: e.target.value })} required />
                        </div>
                        <div className={styles.field}>
                            <label>Constituency Name</label>
                            <input type="text" placeholder="e.g. Shivajinagar" value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                        </div>
                        <div className={styles.field}>
                            <label>State</label>
                            <select value={formData.state}
                                onChange={e => setFormData({ ...formData, state: e.target.value })}>
                                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                    <button type="submit" className={styles.addBtn} disabled={submitting}>
                        {submitting ? "Adding..." : "Add Constituency"}
                    </button>
                </form>
            </div>

            {/* ── Filters ── */}
            <div className={styles.section}>
                <div className={styles.filterRow}>
                    <input className={styles.searchInput} type="text"
                        placeholder="🔍  Search by name or ID..."
                        value={search} onChange={e => setSearch(e.target.value)} />
                    <select className={styles.filterSelect} value={filterState}
                        onChange={e => setFilterState(e.target.value)}>
                        <option value="All">All States</option>
                        {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select className={styles.filterSelect} value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}>
                        <option value="All">All Status</option>
                        <option value="Active">🟢 Live</option>
                        <option value="Inactive">🔴 Inactive</option>
                    </select>
                </div>

                {/* ── Table ── */}
                {loading ? (
                    <p className={styles.msg}>Loading...</p>
                ) : filtered.length === 0 ? (
                    <p className={styles.msg}>No constituencies found.</p>
                ) : (
                    <div className={styles.tableWrap}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>State</th>
                                    <th>Last Survey</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(c => (
                                    <tr key={c.id}>
                                        <td className={styles.idCell}>{c.id}</td>
                                        <td className={styles.nameCell}>{c.name}</td>
                                        <td>{c.state}</td>
                                        <td>{c.dOLS ?? "—"}</td>
                                        <td>
                                            <span className={c.electionActive ? styles.badgeLive : styles.badgeOff}>
                                                {c.electionActive ? "🟢 Live" : "🔴 Inactive"}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className={c.electionActive ? styles.btnDeactivate : styles.btnActivate}
                                                onClick={() => handleToggle(c)}
                                                disabled={togglingId === c.id}
                                            >
                                                {togglingId === c.id ? "..." : c.electionActive ? "Deactivate" : "Activate"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConstituencyManager;
