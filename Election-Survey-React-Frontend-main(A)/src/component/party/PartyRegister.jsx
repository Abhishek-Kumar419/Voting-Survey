import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import style from "./partRegister.module.css";

function PartyRegister() {
    const [formData, setFormData] = useState({
        name: "",
        candidateName: "",
        img: "",
        candidateImg: "",
        constituency: { id: "" }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "constituency") {
            setFormData({ ...formData, constituency: { id: Number(value) } });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/party`, formData);
            if (response.data) {
                toast.success("Party registered successfully!");
                setFormData({ name: "", candidateName: "", img: "", candidateImg: "", constituency: { id: "" } });
            }
        } catch (error) {
            const msg = error.response?.data?.message || error.response?.data || "Failed to register party. Check constituency number.";
            console.error("Error submitting form:", error);
            toast.error(typeof msg === "string" ? msg : "Failed to register party.");
        }
    };

    return (
        <div className={style.container}>
            <Toaster />
            <h1 className={style.title}>Party Registration Form</h1>
            <form onSubmit={handleSubmit} className={style.form}>
                <label className={style.label}>Party Name
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </label>
                <label className={style.label}>Candidate Name
                    <input type="text" name="candidateName" value={formData.candidateName} onChange={handleChange} required />
                </label>
                <label className={style.label}>Party Symbol (URL)
                    <input type="text" name="img" value={formData.img} onChange={handleChange} required />
                </label>
                <label className={style.label}>Candidate Image (URL)
                    <input type="text" name="candidateImg" value={formData.candidateImg} onChange={handleChange} required />
                </label>
                <label className={style.label}>Constituency Number
                    <input type="number" name="constituency" value={formData.constituency.id} onChange={handleChange} required />
                </label>
                <button type="submit" className={style.btn}>Register Party</button>
            </form>
        </div>
    );
}

export default PartyRegister;
