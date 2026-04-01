import styles from "./footer.module.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin, faTwitter } from "@fortawesome/free-brands-svg-icons";

function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.section}>
                    <h3>Voting Survey React Frontend</h3>
                    <p>
                        A user-friendly voting survey application built with <strong>React.js</strong> and <strong>Vite</strong>. 
                        This platform enables users to participate in surveys, cast votes, and view real-time results with ease.
                    </p>
                    <div className={styles.socialIcons}>
                        <a href="Github link will bw here" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faGithub} className={styles.icon} /> GitHub
                        </a>
                        <a href="Linkedin link will be here" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faLinkedin} className={styles.icon} /> LinkedIn
                        </a>
                        <a href="Twitter link will be here" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faTwitter} className={styles.icon} /> Twitter
                        </a>
                    </div>
                </div>
            </div>

            <div className={styles.copyright}>
                <p>© 2026 Voting Survey. All rights reserved. | PTU License</p>
            </div>
        </footer>
    );
}

export default Footer;
