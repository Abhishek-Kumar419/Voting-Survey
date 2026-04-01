import { useState } from 'react';
import styles from './signup.module.css';
import axios from "axios";
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [formData, setFormData] = useState({
        voterId: '',
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        constituencyName: ''
    });

    let navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("http://localhost:8090/api/users/register", { ...formData, hasVoted: false })
            .then((response) => {
                if (response.status === 201) {
                    toast.success("Voter registered successfully");
                    setFormData({ voterId: '', name: '', email: '', password: '', phone: '', address: '', constituencyName: '' });
                    navigate("/login");
                }
            })
            .catch((error) => {
                if (error.response?.status === 400) {
                    toast.error(error.response.data);
                } else {
                    toast.error("Registration failed. Please try again.");
                }
            });
    };
    
    

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Voter Registration</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="voterId" className={styles.label}>Voter ID</label>
                    <input type="number" id="voterId" name="voterId" className={styles.input} 
                        placeholder="Enter your 12-digit Voter ID" 
                        value={formData.voterId} onChange={handleChange} required />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.label}>Name</label>
                    <input type="text" id="name" name="name" className={styles.input} 
                        placeholder="Enter your full name" 
                        value={formData.name} onChange={handleChange} required />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>Email</label>
                    <input type="email" id="email" name="email" className={styles.input} 
                        placeholder="Enter a valid email (e.g., example@mail.com)" 
                        value={formData.email} onChange={handleChange} required />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="password" className={styles.label}>Password</label>
                    <input type="password" id="password" name="password" className={styles.input} 
                        placeholder="Enter a strong password (min 8 characters)" 
                        value={formData.password} onChange={handleChange} required />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="phone" className={styles.label}>Phone</label>
                    <input type="text" id="phone" name="phone" className={styles.input} 
                        placeholder="Enter your phone number" 
                        value={formData.phone} onChange={handleChange} />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="address" className={styles.label}>Address</label>
                    <input type="text" id="address" name="address" className={styles.input} 
                        placeholder="Enter your residential address" 
                        value={formData.address} onChange={handleChange} required />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="constituencyName" className={styles.label}>Constituency Name</label>
                    <input type="text" id="constituencyName" name="constituencyName" className={styles.input} 
                        placeholder="Enter your constituency name" 
                        value={formData.constituencyName} onChange={handleChange} required />
                </div>

                <div className={styles.buttonGroup}>
                    <button type="submit" className="g-btn">Register</button>
                </div>
            </form>
        </div>
    );
};

export default Register;
