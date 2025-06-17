import { useEffect, useState, useRef } from "react";
import { useUserContext } from "./UserContext";
import ApiService from "../utils/ApiService";
import Navbar from "./Navbar";
import styles from "../styles/Clients.module.css";
import { validateNotEmpty } from '../utils/validation';

const apiService = new ApiService();

function Clients() {
    const { user, isInitialized } = useUserContext();
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [newClient, setNewClient] = useState({ client_name: "" });
    const [logoFile, setLogoFile] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        loadClients();
    }, []);

    const loadClients = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await apiService.get("/clients");
            setClients(data);
        } catch {
            setError("Failed to load clients");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this client?")) return;
        try {
            const response = await apiService.delete(`/clients/${id}`);
            if (response.message === "Client deleted successfully") {
                setClients(clients.filter(c => c.id !== id));
            } else {
                throw new Error("Failed to delete client");
            }
        } catch {
            alert("Failed to delete client");
        }
    };

    const handleFileChange = (e) => {
        setLogoFile(e.target.files[0]);
    };

    const handleAddClient = async (e) => {
        e.preventDefault();
        if (!validateNotEmpty(newClient.client_name)) {
            setError("Client name is required");
            return;
        }
        const formData = new FormData();
        formData.append("client_name", newClient.client_name);
        if (logoFile) {
            formData.append("logo", logoFile);
        }
        try {
            const added = await apiService.uploadFile("/clients", formData);
            setClients([...clients, added]);
            setNewClient({ client_name: "" });
            setLogoFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            setError("");
        } catch (err) {
            setError(err.message || "Failed to add client. Please try again.");
        }
    };

    if (!isInitialized) return <p>Loading...</p>;

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <h2 className={styles.title}>מלקוחותינו</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className={styles.error}>{error}</p>
                ) : (
                    <div className={styles.clientsList}>
                        {clients.map(client => (
                            <div key={client.id} className={styles.clientCard}>
                                <div className={styles.clientInfo}>
                                    <span className={styles.clientName}>{client.client_name}</span>
                                    {client.logo_url && (
                                        <img
                                            src={client.logo_url}
                                            alt={client.client_name}
                                            className={styles.clientLogo}
                                            onError={(e) => (e.target.style.display = "none")}
                                        />
                                    )}
                                </div>
                                {user?.role === "admin" && (
                                    <button
                                        className={styles.deleteButton}
                                        onClick={() => handleDelete(client.id)}
                                    >
                                        מחק
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {user?.role === "admin" && (
                    <form className={styles.addForm} onSubmit={handleAddClient}>
                        <h3 className={styles.addFormTitle}>הוסף לקוח חדש</h3>
                        <input
                            type="text"
                            placeholder="שם הלקוח"
                            value={newClient.client_name}
                            onChange={e => setNewClient({ client_name: e.target.value })}
                            required
                            className={styles.inputField}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                            className={styles.inputField}
                        />
                        <button type="submit">הוסף</button>
                    </form>
                )}
            </div>
        </>
    );
}

export default Clients;
