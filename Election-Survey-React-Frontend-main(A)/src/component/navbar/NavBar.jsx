import { Link, useNavigate } from "react-router-dom";
import style from "./navbar.module.css";
import { Fragment } from "react";
import toast from "react-hot-toast";

function NavBar() {
    const voterId = sessionStorage.getItem("voterId");
    const id      = sessionStorage.getItem("id");
    const navigate = useNavigate();

    const logout = () => {
        sessionStorage.removeItem(id ? "id" : "voterId");
        toast.success("Logged out");
        navigate("/");
    };

    return (
        <nav id={style.nav}>
            <figure>
                <img src="/logo.png" alt="logo" title="ElectPulse" />
            </figure>
            <h1 className={style.title}>ElectPulse</h1>

            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/news">📰 News</Link></li>
                <li><Link to="/results">📊 Results</Link></li>
                {id || voterId ? (
                    <Fragment>
                        <li className="g-btn">
                            <Link to={id ? "/adminDashbord" : "/profile"}>Profile</Link>
                        </li>
                        <li className="g-btn" onClick={logout}>LogOut</li>
                    </Fragment>
                ) : (
                    <Fragment>
                        <Link to="/login"><li className="g-btn">Login</li></Link>
                        <Link to="/register"><li className="g-btn">Signup</li></Link>
                    </Fragment>
                )}
            </ul>
        </nav>
    );
}

export default NavBar;
