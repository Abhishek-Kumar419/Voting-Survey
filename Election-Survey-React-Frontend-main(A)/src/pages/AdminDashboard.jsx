import { useState, useCallback } from "react";
import style from "./adminDashboard.module.css";
import ActiveElection from "../component/activeConstituencyElection/ActiveElection";
import PartyRegister from "../component/party/PartyRegister";
import PartyCard from "../component/partyCard/PartyCard";
import ActiveParty from "../component/activeConstituencyParty/ActiveParty";
import LiveAgainElection from "../component/liveAgain/LiveAgainElection";
import ConstituencyTable from "../component/constituencyTableAndParty/ConstituencyTable";
import ConstituencyAdded from "../component/constituency/ConstituencyAdded";
import AdminStats from "../component/adminStats/AdminStats";
import AllConstituencyResults from "../component/allConstituencyResults/AllConstituencyResults";

const NAV = [
    { key: "overview",     label: "Overview",       icon: "⚡" },
    { key: "parties",      label: "Parties",        icon: "🏛️" },
    { key: "constituency", label: "Constituency",   icon: "🗺️" },
    { key: "live",         label: "Live Election",  icon: "🔴" },
    { key: "results",      label: "Results",        icon: "📊" },
    { key: "phases",       label: "Phases",         icon: "🗓️" },
    { key: "audit",        label: "Audit Log",      icon: "📋" },
];

// Phase definitions
const PHASES = [
    { phase: 1, label: "Phase 1", constituencies: [1, 2, 3, 4] },
    { phase: 2, label: "Phase 2", constituencies: [5, 6, 7, 8] },
    { phase: 3, label: "Phase 3", constituencies: [9, 10, 11] },
];

const AdminDashboard = () => {
    const [active, setActive]         = useState("overview");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [auditLog, setAuditLog]     = useState([
        { time: new Date().toLocaleTimeString(), action: "Admin logged in", icon: "🔐" },
    ]);

    const addLog = useCallback((action, icon = "📝") => {
        setAuditLog(prev => [
            { time: new Date().toLocaleTimeString(), action, icon },
            ...prev.slice(0, 49),
        ]);
    }, []);

    const handleNav = (key) => {
        setActive(key);
        addLog(`Navigated to ${NAV.find(n => n.key === key)?.label}`, "🔀");
    };

    return (
        <div className={style.shell}>
            {/* Sidebar */}
            <aside className={`${style.sidebar} ${sidebarOpen ? style.sidebarOpen : style.sidebarClosed}`}>
                <div className={style.sidebarHeader}>
                    {sidebarOpen && (
                        <div className={style.brand}>
                            <span className={style.brandIcon}>🗳️</span>
                            <span className={style.brandText}>ElectionAdmin</span>
                        </div>
                    )}
                    <button className={style.toggleBtn} onClick={() => setSidebarOpen(p => !p)}>
                        {sidebarOpen ? "◀" : "▶"}
                    </button>
                </div>

                <nav className={style.nav}>
                    {NAV.map(item => (
                        <button
                            key={item.key}
                            className={`${style.navItem} ${active === item.key ? style.navActive : ""}`}
                            onClick={() => handleNav(item.key)}
                        >
                            <span className={style.navIcon}>{item.icon}</span>
                            {sidebarOpen && <span className={style.navLabel}>{item.label}</span>}
                        </button>
                    ))}
                </nav>

                {sidebarOpen && (
                    <div className={style.sidebarFooter}>
                        <div className={style.adminBadge}>
                            <div className={style.adminAvatar}>A</div>
                            <div>
                                <div className={style.adminName}>Administrator</div>
                                <div className={style.adminRole}>Super Admin</div>
                            </div>
                        </div>
                    </div>
                )}
            </aside>

            {/* Main content */}
            <main className={style.main}>
                <header className={style.topbar}>
                    <div className={style.pageTitle}>
                        <span>{NAV.find(n => n.key === active)?.icon}</span>
                        <h1>{NAV.find(n => n.key === active)?.label}</h1>
                    </div>
                    <div className={style.topbarRight}>
                        <div className={style.statusPill}>🟢 System Online</div>
                    </div>
                </header>

                <div className={style.content}>
                    {active === "overview" && (
                        <div className={style.stack}>
                            <AdminStats />
                            <div className={style.grid2}>
                                <div className={style.card}><ActiveElection /></div>
                                <div className={style.card}><ActiveParty /></div>
                            </div>
                        </div>
                    )}

                    {active === "parties" && (
                        <div className={style.stack}>
                            <div className={style.card}><PartyRegister /></div>
                            <div className={style.card}><PartyCard /></div>
                        </div>
                    )}

                    {active === "constituency" && (
                        <div className={style.stack}>
                            <div className={style.card}><ConstituencyAdded /></div>
                        </div>
                    )}

                    {active === "live" && (
                        <div className={style.centerCol}>
                            <div className={style.card}><LiveAgainElection /></div>
                        </div>
                    )}

                    {active === "results" && (
                        <div className={style.stack}>
                            <div className={style.card}><AllConstituencyResults /></div>
                            <div className={style.card}><ConstituencyTable /></div>
                        </div>
                    )}

                    {active === "phases" && (
                        <div className={style.stack}>
                            <h2 className={style.sectionHeading}>🗓️ Election Phase Management</h2>
                            <p className={style.sectionSub}>Constituencies are grouped into phases. Use the Live Election tab to activate individual constituencies.</p>
                            <div className={style.phaseGrid}>
                                {PHASES.map(ph => (
                                    <div key={ph.phase} className={style.phaseCard}>
                                        <div className={style.phaseHeader}>
                                            <span className={style.phaseLabel}>{ph.label}</span>
                                            <span className={style.phaseCount}>{ph.constituencies.length} constituencies</span>
                                        </div>
                                        <div className={style.phaseIds}>
                                            {ph.constituencies.map(id => (
                                                <span key={id} className={style.phaseId}>#{id}</span>
                                            ))}
                                        </div>
                                        <button
                                            className={style.phaseBtn}
                                            onClick={() => addLog(`Phase ${ph.phase} reviewed`, "🗓️")}
                                        >
                                            View Phase {ph.phase}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {active === "audit" && (
                        <div className={style.stack}>
                            <h2 className={style.sectionHeading}>📋 Audit Log</h2>
                            <p className={style.sectionSub}>All admin actions are recorded here in real-time.</p>
                            <div className={style.auditTable}>
                                {auditLog.map((entry, i) => (
                                    <div key={i} className={style.auditRow}>
                                        <span className={style.auditIcon}>{entry.icon}</span>
                                        <span className={style.auditAction}>{entry.action}</span>
                                        <span className={style.auditTime}>{entry.time}</span>
                                    </div>
                                ))}
                                {auditLog.length === 0 && <p className={style.noAudit}>No actions recorded yet.</p>}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
