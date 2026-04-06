import { Link } from "react-router-dom";
import styles from "./footer.module.css";

function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>

                {/* Brand */}
                <div className={styles.brand}>
                    <div className={styles.brandName}>
                        <span className={styles.pulse}></span>
                        ElectPulse
                    </div>
                    <p className={styles.tagline}>
                        Where every voice shapes the outcome. Real-time election surveys powered by transparent, secure, and instant vote tracking.
                    </p>
                    <div className={styles.badges}>
                        <span className={styles.badge}>🔒 Secure</span>
                        <span className={styles.badge}>⚡ Real-time</span>
                        <span className={styles.badge}>🇮🇳 Made for India</span>
                    </div>
                </div>

                {/* Quick Links */}
                <div className={styles.linksSection}>
                    <h4 className={styles.linksTitle}>Quick Links</h4>
                    <ul className={styles.linksList}>
                        <li><Link to="/">🏠 Home</Link></li>
                        <li><Link to="/results">📊 Election Results</Link></li>
                        <li><Link to="/news">📰 Election News</Link></li>
                        <li><Link to="/find-voter-id">🔍 Find Voter ID</Link></li>
                        <li><Link to="/register">📝 Register to Vote</Link></li>
                        <li><Link to="/login">🔐 Login</Link></li>
                    </ul>
                </div>

                {/* Features */}
                <div className={styles.linksSection}>
                    <h4 className={styles.linksTitle}>Features</h4>
                    <ul className={styles.featureList}>
                        <li>🔴 Live vote counting</li>
                        <li>📊 Constituency-wise results</li>
                        <li>🗳️ Voter turnout tracker</li>
                        <li>🏆 Winner declaration</li>
                        <li>📰 Dynamic election news</li>
                        <li>🛡️ JWT secured voting</li>
                    </ul>
                </div>

            </div>

            <div className={styles.copyright}>
                <p>© 2026 ElectPulse &nbsp;|&nbsp; Built for democracy, powered by the people &nbsp;|&nbsp; 🇮🇳 India</p>
            </div>
        </footer>
    );
}

export default Footer;
