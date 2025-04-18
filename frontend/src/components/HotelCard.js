import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaHeart, FaRegHeart, FaStar, FaSwimmingPool, FaWifi, FaUtensils } from 'react-icons/fa';
import '../styles/HotelCard.css';

const HotelCard = ({ hotel, onInteraction }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setIsFavorite(favorites.some(favHotel => favHotel.id === hotel.id));
  }, [hotel.id]);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    let newFavorites;
    let message;

    if (isFavorite) {
      newFavorites = favorites.filter(favHotel => favHotel.id !== hotel.id);
      message = 'Otel favorilerden çıkarıldı';
    } else {
      newFavorites = [...favorites, hotel];
      message = 'Otel favorilere eklendi';
    }

    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
    onInteraction && onInteraction(isFavorite ? 'remove_favorite' : 'add_favorite');
  };

  const handleCardClick = () => {
    onInteraction && onInteraction('view_details');
    navigate(`/hotels/${hotel.id}`);
  };

  return (
    <div className="hotel-card" onClick={handleCardClick}>
      <div className="hotel-image">
        <img src={hotel.image} alt={hotel.name} />
        <button
          className="favorite-button"
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? <FaHeart className="favorite-icon active" /> : <FaRegHeart className="favorite-icon" />}
        </button>
      </div>

      <div className="hotel-content">
        <h3>{hotel.name}</h3>
        <p className="location">
          <FaMapMarkerAlt /> {hotel.location}
        </p>

        <div className="amenities">
          <span><FaSwimmingPool /> Havuz</span>
          <span><FaWifi /> Wifi</span>
          <span><FaUtensils /> Restoran</span>
        </div>

        <div className="hotel-footer">
          <div className="rating">
            <FaStar className="star-icon" />
            <span>{hotel.rating}</span>
          </div>
          <div className="price">
            <span className="amount">{hotel.price} ₺</span>
            <span className="period">/ gece</span>
          </div>
        </div>
      </div>

      {showNotification && (
        <div className={`notification ${showNotification ? 'show' : ''}`}>
          {notificationMessage}
        </div>
      )}
    </div>
  );
};

export default HotelCard;
