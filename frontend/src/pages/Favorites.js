import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaHeart, FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import '../styles/Favorites.css';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.get(`http://localhost:5002/api/favorites/${userId}`);
      setFavorites(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setError('Favoriler yüklenirken bir hata oluştu.');
      setLoading(false);
    }
  };

  const removeFavorite = async (hotelId) => {
    try {
      const userId = localStorage.getItem('userId');
      await axios.delete(`http://localhost:5002/api/favorites/${userId}/${hotelId}`);
      setFavorites(favorites.filter(fav => fav.hotel._id !== hotelId));
    } catch (error) {
      console.error('Error removing favorite:', error);
      setError('Favori silinirken bir hata oluştu.');
    }
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="favorites-container">
      <h1>Favori Otellerim</h1>
      
      {favorites.length === 0 ? (
        <div className="no-favorites">
          <p>Henüz favori oteliniz bulunmamaktadır.</p>
          <Link to="/" className="browse-hotels-btn">
            Otelleri Keşfet
          </Link>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map(({ hotel }) => (
            <div key={hotel._id} className="favorite-card">
              <div className="favorite-image">
                <img src={hotel.images[0]} alt={hotel.name} />
                <button
                  className="remove-favorite-btn"
                  onClick={() => removeFavorite(hotel._id)}
                >
                  <FaHeart />
                </button>
              </div>
              
              <div className="favorite-content">
                <Link to={`/hotel/${hotel._id}`} className="hotel-name">
                  <h2>{hotel.name}</h2>
                </Link>
                
                <div className="hotel-location">
                  <FaMapMarkerAlt />
                  <span>{hotel.location}</span>
                </div>
                
                <div className="hotel-rating">
                  <FaStar />
                  <span>{hotel.rating.toFixed(1)}</span>
                </div>
                
                <div className="hotel-price">
                  <span className="price">{hotel.price}₺</span>
                  <span className="per-night">/ gece</span>
                </div>
                
                <div className="hotel-features">
                  {hotel.features.slice(0, 3).map((feature, index) => (
                    <span key={index} className="feature-tag">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
