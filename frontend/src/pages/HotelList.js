import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaStar, FaHeart, FaRegHeart, FaFilter, FaSearch } from 'react-icons/fa';
import '../styles/HotelList.css';

const HotelList = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    minPrice: 0,
    maxPrice: 5000,
    rating: 0,
    sortBy: 'price',
  });
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/hotels');
      const data = await response.json();
      setHotels(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading hotel data:', error);
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.location) queryParams.append('location', filters.location);
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
      if (filters.rating) queryParams.append('rating', filters.rating);

      const response = await fetch(`http://localhost:5002/api/hotels/search?${queryParams}`);
      const data = await response.json();
      setHotels(data);
    } catch (error) {
      console.error('Error during search:', error);
    }
  };

  const handleHotelClick = (hotelId) => {
    navigate(`/hotel/${hotelId}`);
  };

  const handleToggleFavorite = (hotelId) => {
    // Favorite functionality will be implemented here
    console.log('Added to favorites:', hotelId);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="stars" />);
      } else if (i - 0.5 <= rating) {
        stars.push(<FaStar key={i} className="stars" style={{ opacity: 0.5 }} />);
      } else {
        stars.push(<FaStar key={i} className="stars" style={{ opacity: 0.2 }} />);
      }
    }
    return stars;
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="hotel-list-container">
      {/* Search and Filters */}
      <div className="search-filters">
        <div className="search-filters-grid">
          <div className="search-input">
            <FaMapMarkerAlt className="search-icon" />
            <input
              type="text"
              placeholder="Location"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            />
          </div>
          <button className="search-button" onClick={handleSearch}>
            <FaSearch /> Search
          </button>
          <button className="filter-button" onClick={() => setShowFilters(!showFilters)}>
            <FaFilter /> Filters
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="filter-panel">
            <div className="filter-grid">
              <div className="filter-section">
                <h3>Price Range</h3>
                <input
                  type="range"
                  className="price-range"
                  min="0"
                  max="5000"
                  step="100"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value))}
                />
                <div className="price-labels">
                  <span>${filters.minPrice}</span>
                  <span>${filters.maxPrice}</span>
                </div>
              </div>
              <div className="filter-section">
                <h3>Minimum Rating</h3>
                <div className="rating-filter">
                  {renderStars(filters.rating)}
                  <span className="rating-value">({filters.rating})</span>
                </div>
              </div>
              <div className="filter-section">
                <h3>Sort By</h3>
                <select
                  className="sort-select"
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                >
                  <option value="price">Price</option>
                  <option value="rating">Rating</option>
                  <option value="name">Name</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hotel List */}
      <div className="hotels-grid">
        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            className="hotel-card"
            onClick={() => handleHotelClick(hotel.id)}
          >
            <img
              className="hotel-image"
              src={hotel.image}
              alt={hotel.name}
            />
            <div className="hotel-content">
              <div className="hotel-header">
                <div>
                  <h2 className="hotel-title">{hotel.name}</h2>
                  <div className="hotel-location">
                    <FaMapMarkerAlt />
                    <span>{hotel.location}</span>
                  </div>
                  <div className="hotel-rating">
                    <div className="rating-stars">
                      {renderStars(hotel.rating)}
                    </div>
                    <span className="rating-value">({hotel.rating})</span>
                  </div>
                </div>
                <button
                  className="favorite-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFavorite(hotel.id);
                  }}
                >
                  <FaRegHeart />
                </button>
              </div>

              <div className="amenities">
                {hotel.amenities.slice(0, 3).map((amenity, index) => (
                  <span key={index} className="amenity-chip">
                    {amenity}
                  </span>
                ))}
                {hotel.amenities.length > 3 && (
                  <span className="more-amenities">
                    +{hotel.amenities.length - 3}
                  </span>
                )}
              </div>

              <div className="hotel-footer">
                <div className="hotel-price">
                  ${hotel.price}
                  <span className="price-period"> / night</span>
                </div>
                <button
                  className="view-details-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleHotelClick(hotel.id);
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotelList;
