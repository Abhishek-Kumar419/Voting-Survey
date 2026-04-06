import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const ElectionDataContext = createContext(null);

export function ElectionDataProvider({ children }) {
    const [parties, setParties]         = useState([]);
    const [activeParties, setActiveParties] = useState([]);
    const [loading, setLoading]         = useState(true);
    const [error, setError]             = useState(false);

    useEffect(() => {
        let cancelled = false;

        const fetchActive = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/api/party/allActiveElectionParties`
                );
                if (!cancelled) {
                    setActiveParties(res.data || []);
                    setError(false);
                }
            } catch {
                if (!cancelled) setError(true);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchActive();
        const iv = setInterval(fetchActive, 8000);
        return () => { cancelled = true; clearInterval(iv); };
    }, []);

    // Lazy-load all parties only when explicitly needed
    const fetchAllParties = async () => {
        if (parties.length > 0) return;
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/party`);
            setParties(res.data || []);
        } catch { /* ignore */ }
    };

    return (
        <ElectionDataContext.Provider value={{ parties, activeParties, loading, error, fetchAllParties }}>
            {children}
        </ElectionDataContext.Provider>
    );
}

export function useElectionData() {
    return useContext(ElectionDataContext);
}
