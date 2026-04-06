import { useState } from 'react';
import styles from './signup.module.css';
import axios from "axios";
import toast from 'react-hot-toast';
import { useNavigate, useLocation, Link } from "react-router-dom";

const Register = () => {
    const location = useLocation();
    const prefill = location.state || {};

    const [formData, setFormData] = useState({
        voterId: prefill.voterId || '',
        dob: prefill.dob || '',
        email: '',
        password: '',
        phone: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/users/register`, formData)
            .then((response) => {
                if (response.status === 201) {
                    toast.success("Voter registered successfully");
                    navigate("/login");
                }
            })
            .catch((error) => {
                toast.error(error.response?.data || "Registration failed. Please try again.");
            });
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Voter Registration</h1>
            <p style={{textAlign:'center', color:'#9ca3af', fontSize:'14px', marginBottom:'8px'}}>
                Don't know your Voter ID?{' '}
                <Link to="/find-voter-id" style={{color:'#6c63ff'}}>Find it here</Link>
            </p>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Voter ID</label>
                    <input type="number" name="voterId" className={styles.input}
                        placeholder="Enter your Voter ID"
                        value={formData.voterId} onChange={handleChange} required />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Date of Birth</label>
                    <input type="date" name="dob" className={styles.input}
                        value={formData.dob} onChange={handleChange} required />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Email</label>
                    <input type="email" name="email" className={styles.input}
                        placeholder="Enter a valid email"
                        value={formData.email} onChange={handleChange} required />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Password</label>
                    <input type="password" name="password" className={styles.input}
                        placeholder="Min 8 characters"
                        value={formData.password} onChange={handleChange} required />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Phone</label>
                    <input type="text" name="phone" className={styles.input}
                        placeholder="Enter your phone number"
                        value={formData.phone} onChange={handleChange} />
                </div>

                <div className={styles.buttonGroup}>
                    <button type="submit" className="g-btn">Register</button>
                </div>
            </form>
        </div>
    );
};

export default Register;
