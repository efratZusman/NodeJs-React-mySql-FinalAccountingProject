import React, { useEffect, useState, useRef } from "react";
import { useUserContext } from "./UserContext";
import ApiService from "../ApiService";
import Navbar from "./Navbar";
import styles from "../styles/Clients.module.css";

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
        } catch (err) {
            setError("Failed to load clients");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this client?")) return;
        try {
            const response = await apiService.delete(`/clients/${id}`);
            console.log("Delete response:", response);
            
            if(response.message === "Client deleted successfully") {
            setClients(clients.filter((c) => c.id !== id));
            }
            else {
                throw new Error("Failed to delete client");
            }
        } catch (err) {
            alert("Failed to delete client");
        }
    };

    const handleFileChange = (e) => {
        setLogoFile(e.target.files[0]);
    };

    const handleAddClient = async (e) => {
        e.preventDefault();
        if (!newClient.client_name) {
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
                fileInputRef.current.value = '';  // Reset file input
            }
            setError("");
        } catch (err) {
            console.error("Error adding client:", err);
            setError(err.message || "Failed to add client. Please try again.");
        }
    };

    if (!isInitialized) return <p>Loading...</p>;

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <h2 className={styles.title}>Clients</h2>
                {loading ? (
                    <p>Loading clients...</p>
                ) : error ? (
                    <p className={styles.error}>{error}</p>
                ) : (
                    <div className={styles.clientsList}>
                        {clients.map((client) => (
                            <div key={client.id} className={styles.clientCard}>
                                <div className={styles.clientInfo}>
                                    <span className={styles.clientName}>{client.client_name}</span>
                                    {client.logo_url && (
                                        <img
                                            src={client.logo_url}
                                            alt={client.client_name}
                                            className={styles.clientLogo}
                                            onError={(e) => {
                                                // If image fails to load, hide the broken image
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    )}
                                </div>
                                {user?.role === "admin" && (
                                    <button
                                        className={styles.deleteButton}
                                        onClick={() => handleDelete(client.id)}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {user?.role === "admin" && (
                    <form className={styles.addForm} onSubmit={handleAddClient}>
                        <h3>Add New Client</h3>
                        <input
                            type="text"
                            placeholder="Client Name"
                            value={newClient.client_name}
                            onChange={(e) =>
                                setNewClient({ ...newClient, client_name: e.target.value })
                            }
                            required
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                        />
                        <button type="submit">Add Client</button>
                    </form>
                )}
            </div>
        </>
    );
}

export default Clients;