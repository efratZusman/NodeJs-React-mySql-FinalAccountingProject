import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useActionData } from 'react-router-dom';
import styles from './Albums.module.css';
import NavigationButtons from '../NavigationButtons';
import { useUserContext } from '../UserContext';
import ApiService from '../ApiSevice';

function ViewPhotos() {
    const navigate = useNavigate();
    const { albumId } = useParams();
    const [photos, setPhotos] = useState([]);
    const [page, setPage] = useState(1);
    const photosPerPage = 10;
    const [newPhoto, setNewPhoto] = useState({ title: '', url: '', thumbnailUrl: '' });
    const [editingPhotoIndex, setEditingPhotoIndex] = useState(null);
    const [updatedTitle, setUpdatedTitle] = useState('');
    const [hasMorePhotos, setHasMorePhotos] = useState(true);
    const { userData } = useUserContext();
    const apiService = new ApiService();

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const data = await apiService.fetch(`http://localhost:3000/photos?albumId=${albumId}&_start=${page}&_limit=${photosPerPage}`);
                if (page === 1) {
                    setPhotos(data);
                } else {
                    setPhotos(prevPhotos => [...prevPhotos, ...data]);
                }
                if (data.length < photosPerPage) {
                    setHasMorePhotos(false);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };
        const fetchAlbum = async () => {
            try {
                const data = await apiService.fetch(`http://localhost:3000/albums?id=${albumId}`);
                if (data[0].userId != userData.id) {
                    navigate('/404');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchAlbum();
        fetchPhotos();
    }, [page]);

    const handleAddPhoto = async () => {
        if (!newPhoto.title || !newPhoto.url || !newPhoto.thumbnailUrl) return;
        const newAlbum = { ...newPhoto, albumId: albumId };
        try {
            const photo = await apiService.post('http://localhost:3000/photos', newAlbum);
            setPhotos(prevPhotos => [...prevPhotos, photo]);
            setNewPhoto({ title: '', url: '', thumbnailUrl: '' });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDeletePhoto = async (index) => {
        const photoId = photos[index].id;
        try {
await apiService.delete(`http://localhost:3000/photos/${photoId}`);
                setPhotos(prevPhotos => {
                    const updatedPhotos = [...prevPhotos];
                    updatedPhotos.splice(index, 1);
                    return updatedPhotos;
                });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleUpdatePhoto = async (index) => {
        try {
            const photoId = photos[index].id;
            const updatedPhoto = { ...photos[index], title: updatedTitle };
            const response = await apiService.put(`http://localhost:3000/photos/${photoId}`, updatedPhoto);
                setPhotos(prevPhotos => {
                    const updatedPhotos = [...prevPhotos];
                    updatedPhotos[index] = updatedPhoto;
                    return updatedPhotos;
                });
                setEditingPhotoIndex(null);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className={styles.container}>
            <NavigationButtons />
            <button className={styles.back} onClick={() => { navigate(`/user/${userData.id}/albums`) }}>Back To Albums</button>
            <h1>Photos in Album {albumId}</h1>
            <div className={styles.photoGrid}>
                {photos.map((photo, index) => (
                    <div key={photo.id} className={styles.photoCard}>
                        <img src={photo.thumbnailUrl} alt={photo.title} className={styles.photoThumbnail} />
                        {editingPhotoIndex === index ? (
                            <div>
                                <input
                                    type="text"
                                    value={updatedTitle}
                                    onChange={(e) => setUpdatedTitle(e.target.value)}
                                    className={styles.editInput}
                                />
                                <span onClick={() => handleUpdatePhoto(index)} className={styles.saveButton}>✔️</span>
                                <span onClick={() => setEditingPhotoIndex(null)} className={styles.cancelButton}>❌</span>
                            </div>
                        ) : (
                            <div className={styles.actionButtons}>
                                <span
                                    className={styles.editButton}
                                    onClick={() => {
                                        setEditingPhotoIndex(index);
                                        setUpdatedTitle(photo.title);
                                    }}
                                ></span>
                                <span
                                    className={styles.deleteButton}
                                    onClick={() => handleDeletePhoto(index)}
                                ></span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {hasMorePhotos && (
                <button onClick={() => { setPage(prevPage => prevPage + 10) }} className={styles.loadMoreButton}>Load More Photos</button>
            )}

            <h2>Add New Photo</h2>
            <div className={styles.addPhotoForm}>
                <input
                    type="text"
                    placeholder="Photo Title"
                    value={newPhoto.title}
                    onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })}
                    className={styles.photoInput}
                />
                <input
                    type="text"
                    placeholder="Photo URL"
                    value={newPhoto.url}
                    onChange={(e) => setNewPhoto({ ...newPhoto, url: e.target.value })}
                    className={styles.photoInput}
                />
                <input
                    type="text"
                    placeholder="Thumbnail URL"
                    value={newPhoto.thumbnailUrl}
                    onChange={(e) => setNewPhoto({ ...newPhoto, thumbnailUrl: e.target.value })}
                    className={styles.photoInput}
                />
                <button onClick={handleAddPhoto} className={styles.addPhotoButton}>Add Photo</button>
            </div>
        </div>
    );
}

export default ViewPhotos;

