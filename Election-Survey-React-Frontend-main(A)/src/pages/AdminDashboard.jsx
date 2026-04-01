import { useState } from "react";
import style from "./adminDashboard.module.css";
import ActiveElection from "../component/activeConstituencyElection/ActiveElection";
import PartyRegister from "../component/party/PartyRegister";
import PartyCard from "../component/partyCard/PartyCard";
import ActiveParty from "../component/activeConstituencyParty/ActiveParty";
import LiveAgainElection from "../component/liveAgain/LiveAgainElection";
import ConstituencyTable from "../component/constituencyTableAndParty/ConstituencyTable";
import ConstituencyAdded from "../component/constituency/ConstituencyAdded";

const NAV = [
    { key: "overview",      label: "Overview",            icon: "⚡" },
    { key: "parties",       label: "Parties",             icon: "🏛️" },
    { key: "constituency",  label: "Constituency",        icon: "🗺️" },
    { key: "live",          label: "Live Election",       icon: "🔴" },
    { key: "results",       label: "Results",             icon: "📊" },
];

const AdminDashboard = () => {
    const [active, setActive] = useState("overview");
    const [sidebarOpen, setSidebarOpen] = useState(true);

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
                            onClick={() => setActive(item.key)}
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
                        <div className={style.grid2}>
                            <div className={style.card}><ActiveElection /></div>
                            <div className={style.card}><ActiveParty /></div>
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
                            <div className={style.card}><ConstituencyTable /></div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
