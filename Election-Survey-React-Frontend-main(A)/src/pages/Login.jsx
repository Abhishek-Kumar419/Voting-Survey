import { useState } from "react";
import styles from "./login.module.css";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [formData, setFormData] = useState({ id: "", voterId: "", password: "" });
    const [isAdmin, setIsAdmin] = useState(false);
    let navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleCheckboxChange = () => {
        setIsAdmin((prev) => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const loginData = isAdmin 
                ? { id: formData.id, password: formData.password } 
                : { voterId: formData.voterId, password: formData.password };
            
            const endpoint = isAdmin 
                ? `${import.meta.env.VITE_API_BASE_URL}/api/admin/auth` 
                : `${import.meta.env.VITE_API_BASE_URL}/api/users/login`;
            
            const response = await axios.post(endpoint, loginData);
            
            toast.success("Login successful!");
            if (isAdmin) {
                sessionStorage.setItem("id", formData.id);
                navigate("/adminDashbord");
            } else {
                sessionStorage.setItem("voterId", response.data.voterId);
                navigate("/profile");
            }
        } catch (error) {
            if (error.response && (error.response.status === 401 || error.response.status === 400)) {
                toast.error("Invalid ID or Password");
            } else {
                console.error("Login error:", error);
                toast.error("Login failed. Please try again.");
            }
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.formWrapper}>
                <h1>Welcome Back</h1>
                <p className={styles.subtitle}>Sign in to your account to continue</p>
                <form onSubmit={handleSubmit}>
                    {isAdmin ? (
                        <div className={styles.inputGroup}>
                            <label htmlFor="id">Admin ID</label>
                            <input
                                type="text"
                                id="id"
                                name="id"
                                placeholder="Enter Admin ID"
                                value={formData.id}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    ) : (
                        <div className={styles.inputGroup}>
                            <label htmlFor="voterId">Voter ID</label>
                            <input
                                type="text"
                                id="voterId"
                                name="voterId"
                                placeholder="Enter your Voter ID"
                                value={formData.voterId}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}
                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <input
                            type="checkbox"
                            id="adminCheck"
                            name="adminCheck"
                            checked={isAdmin}
                            onChange={handleCheckboxChange}
                        />
                        <label htmlFor="adminCheck">Login as Admin</label>
                    </div>
                    <button type="submit" className="g-btn">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
