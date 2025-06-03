import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserContext } from '../UserContext';
import styles from './Albums.module.css';
import NavigationButtons from '../NavigationButtons';
import ApiService from '../ApiSevice';

function Albums() {
    const [albums, setAlbums] = useState([]);
    const [newAlbumTitle, setNewAlbumTitle] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const { userData } = useUserContext();
    const navigate = useNavigate();
    const apiService = new ApiService();

    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                const response = await apiService.fetch(`http://localhost:3000/albums?userId=${userData.username}`);
                setAlbums(response);
            } catch (error) {
                console.error('Error:', error);
                navigate('/404');
            }
        };
        fetchAlbums();
    }, []);

    const handleCreateAlbum = async () => {
        if (newAlbumTitle.trim() === '') return;
        const newAlbum = {
            userId: userData.id,
            title: newAlbumTitle,
        };
        try {
            const album = await apiService.post('http://localhost:3000/albums', newAlbum);
            setAlbums([...albums, album]);
            setNewAlbumTitle('');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDeleteAlbum = async (index) => {
        const albumId = albums[index].id;
        try {
            await apiService.delete(`http://localhost:3000/albums/${albumId}`);
            const updatedAlbums = [...albums];
            updatedAlbums.splice(index, 1);
            setAlbums(updatedAlbums);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <>
            <div className={styles.container}>
                <NavigationButtons />
                <h1>Your Albums</h1>
                <input
                    className={styles.searchInput}
                    type="text"
                    placeholder="Search by ID or Title"
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value) }}
                />
                <div className={styles.albumGrid}>
                    {albums
                        .filter(album =>
                            album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            album.id.toString().includes(searchTerm)
                        )
                        .map((album, index) => (
                            <div key={album.id} className={styles.albumCard}>
                                <Link to={`/user/${userData.id}/album/${album.id}/photos`} className={styles.albumLink}>
                                    <h3>{album.id}: {album.title}</h3>
                                </Link>
                                <span
                                    className={styles.deleteButton}
                                    onClick={() => handleDeleteAlbum(index)}
                                >
                                </span>
                            </div>
                        ))}
                </div>
                <h2>Create New Album</h2>
                <div className={styles.createAlbumForm}>
                    <input
                        className={styles.createInput}
                        type="text"
                        placeholder="New album title"
                        value={newAlbumTitle}
                        onChange={(e) => setNewAlbumTitle(e.target.value)}
                    />
                    <button className={styles.createButton} onClick={handleCreateAlbum}>Create Album</button>
                </div>
            </div>
        </>
    );
}

export default Albums;



