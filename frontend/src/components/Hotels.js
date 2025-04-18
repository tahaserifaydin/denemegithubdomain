import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import './Hotels.css';

function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/hotels');
      if (!response.ok) {
        throw new Error('Oteller yüklenirken bir hata oluştu');
      }
      const data = await response.json();
      setHotels(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredHotels = hotels.filter((hotel) =>
    hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleHotelClick = (hotelId) => {
    navigate(`/hotels/${hotelId}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="hotels-container">
      <div className="search-container">
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Otel veya konum ara..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
      </div>

      <div className="hotels-grid">
        {filteredHotels.map((hotel) => (
          <div
            key={hotel._id}
            className="hotel-card"
            onClick={() => handleHotelClick(hotel._id)}
          >
            <div className="hotel-image">
              <img src={hotel.image} alt={hotel.name} />
            </div>
            <div className="hotel-content">
              <h3 className="hotel-name">{hotel.name}</h3>
              <div className="hotel-location">
                <FaMapMarkerAlt className="location-icon" />
                <span>{hotel.location}</span>
              </div>
              <div className="hotel-rating">
                <FaStar className="star-icon" />
                <span>{hotel.rating}</span>
                <span className="rating-count">({hotel.reviews?.length || 0} değerlendirme)</span>
              </div>
              <div className="hotel-price">
                <span className="price">{hotel.price}₺</span>
                <span className="per-night">/ gece</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Hotels; 