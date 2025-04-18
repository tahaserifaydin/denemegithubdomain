import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaStar, FaWifi, FaSwimmingPool, FaUtensils } from 'react-icons/fa';
import HotelDetailModal from '../components/HotelDetailModal';
import './Hotels.css';

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    minRating: 0,
    amenities: [],
    priceRange: [0, 10000]
  });

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/hotels');
      const data = await response.json();
      setHotels(data);
      setLoading(false);
    } catch (err) {
      setError('Oteller yüklenirken bir hata oluştu.');
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const handleRatingChange = (rating) => {
    setFilters(prev => ({ ...prev, minRating: rating }));
  };

  const handleAmenityToggle = (amenity) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handlePriceRangeChange = (e) => {
    const [min, max] = e.target.value.split(',').map(Number);
    setFilters(prev => ({ ...prev, priceRange: [min, max] }));
  };

  const filteredHotels = hotels.filter(hotel => {
    const matchesSearch = hotel.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         hotel.location.toLowerCase().includes(filters.search.toLowerCase());
    const matchesRating = hotel.rating >= filters.minRating;
    const matchesAmenities = filters.amenities.length === 0 ||
                           filters.amenities.every(amenity => hotel.amenities.includes(amenity));
    const matchesPrice = hotel.price >= filters.priceRange[0] && hotel.price <= filters.priceRange[1];

    return matchesSearch && matchesRating && matchesAmenities && matchesPrice;
  });

  if (loading) return <div className="loading">Yükleniyor...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="hotels-container">
      <div className="filters-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Otel veya şehir ara..."
            value={filters.search}
            onChange={handleSearch}
          />
        </div>

        <div className="filters">
          <div className="filter-group">
            <h3>Puan</h3>
            <div className="rating-buttons">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  className={`rating-button ${filters.minRating === rating ? 'active' : ''}`}
                  onClick={() => handleRatingChange(rating)}
                >
                  <FaStar />
                  <span>{rating}+</span>
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h3>Özellikler</h3>
            <div className="amenity-buttons">
              {['wifi', 'pool', 'restaurant'].map(amenity => (
                <button
                  key={amenity}
                  className={`amenity-button ${filters.amenities.includes(amenity) ? 'active' : ''}`}
                  onClick={() => handleAmenityToggle(amenity)}
                >
                  {amenity === 'wifi' && <FaWifi />}
                  {amenity === 'pool' && <FaSwimmingPool />}
                  {amenity === 'restaurant' && <FaUtensils />}
                  <span>{amenity}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h3>Fiyat Aralığı</h3>
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={filters.priceRange.join(',')}
              onChange={handlePriceRangeChange}
              className="price-range"
            />
            <div className="price-labels">
              <span>0 TL</span>
              <span>{filters.priceRange[1]} TL</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hotels-grid">
        {filteredHotels.map(hotel => (
          <div key={hotel._id} className="hotel-card" onClick={() => setSelectedHotel(hotel)}>
            <img src={hotel.image} alt={hotel.name} className="hotel-image" />
            <div className="hotel-info">
              <h3>{hotel.name}</h3>
              <p className="location">{hotel.location}</p>
              <div className="rating">
                <FaStar />
                <span>{hotel.rating}</span>
              </div>
              <div className="amenities">
                {hotel.amenities.slice(0, 3).map((amenity, index) => (
                  <span key={index} className="amenity-tag">{amenity}</span>
                ))}
              </div>
              <div className="price">
                <span className="amount">{hotel.price} TL</span>
                <span className="per-night">/ gece</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedHotel && (
        <HotelDetailModal
          hotel={selectedHotel}
          onClose={() => setSelectedHotel(null)}
        />
      )}
    </div>
  );
};

export default Hotels; 