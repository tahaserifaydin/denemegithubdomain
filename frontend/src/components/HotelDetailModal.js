import React from 'react';
import { FaStar, FaWifi, FaSwimmingPool, FaUtensils, FaParking, FaSpa, FaDumbbell, FaConciergeBell } from 'react-icons/fa';
import './HotelDetailModal.css';

const HotelDetailModal = ({ hotel, onClose }) => {
  if (!hotel) return null;

  const getAmenityIcon = (amenity) => {
    switch (amenity) {
      case 'wifi':
        return <FaWifi />;
      case 'pool':
        return <FaSwimmingPool />;
      case 'restaurant':
        return <FaUtensils />;
      case 'parking':
        return <FaParking />;
      case 'spa':
        return <FaSpa />;
      case 'gym':
        return <FaDumbbell />;
      case 'concierge':
        return <FaConciergeBell />;
      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <h2>{hotel.name}</h2>
          <div className="rating">
            <FaStar className="star-icon" />
            <span>{hotel.rating}</span>
          </div>
        </div>

        <div className="modal-body">
          <div className="image-gallery">
            {hotel.images.map((image, index) => (
              <img 
                key={index} 
                src={image} 
                alt={`${hotel.name} - Görünüm ${index + 1}`} 
                className="gallery-image"
              />
            ))}
          </div>

          <div className="hotel-info">
            <div className="location">
              <FaStar className="location-icon" />
              <span>{hotel.location}</span>
            </div>

            <div className="description">
              <h3>Otel Hakkında</h3>
              <p>{hotel.description}</p>
            </div>

            <div className="amenities">
              <h3>Otel Özellikleri</h3>
              <div className="amenities-grid">
                {hotel.amenities.map((amenity, index) => (
                  <div key={index} className="amenity-item">
                    {getAmenityIcon(amenity)}
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rooms">
              <h3>Odalar</h3>
              <div className="rooms-grid">
                {hotel.rooms.map((room, index) => (
                  <div key={index} className="room-card">
                    <img src={room.image} alt={room.name} className="room-image" />
                    <div className="room-info">
                      <h4>{room.name}</h4>
                      <p>{room.description}</p>
                      <div className="room-price">
                        <span className="price">{room.price} TL</span>
                        <span className="per-night">/ gece</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetailModal;
