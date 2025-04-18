import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  FaMapMarkerAlt,
  FaHotel,
  FaSwimmingPool,
  FaWifi,
  FaUtensils,
  FaStar,
  FaHeart,
  FaRegHeart,
  FaFilter
} from 'react-icons/fa';
import '../styles/SearchResults.css';

const SearchResults = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialFilters = {
    location: searchParams.get('location') || '',
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    guests: searchParams.get('guests') || '1',
    minPrice: '',
    maxPrice: '',
    rating: '',
    features: []
  };

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState(initialFilters);
  const [favorites, setFavorites] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchHotels();
    fetchFavorites();
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/hotels', {
        params: {
          location: filters.location,
          checkIn: filters.checkIn,
          checkOut: filters.checkOut,
          guests: filters.guests,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          rating: filters.rating,
          features: filters.features.join(',')
        }
      });
      setHotels(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      setError('Oteller yüklenirken bir hata oluştu.');
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (userId) {
        const response = await axios.get(`http://localhost:5002/api/favorites/${userId}`);
        setFavorites(response.data.map(fav => fav.hotel._id));
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const toggleFavorite = async (hotelId) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        // Redirect to login or show login prompt
        return;
      }

      if (favorites.includes(hotelId)) {
        await axios.delete(`http://localhost:5002/api/favorites/${userId}/${hotelId}`);
        setFavorites(favorites.filter(id => id !== hotelId));
      } else {
        await axios.post('http://localhost:5002/api/favorites', {
          userId,
          hotelId
        });
        setFavorites([...favorites, hotelId]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeatureToggle = (feature) => {
    setFilters(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const applyFilters = () => {
    fetchHotels();
    setShowFilters(false);
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="search-results-container">
      <button
        className="filter-toggle-btn"
        onClick={() => setShowFilters(!showFilters)}
      >
        <FaFilter /> Filtreleri {showFilters ? 'Gizle' : 'Göster'}
      </button>

      <div className={`filters-section ${showFilters ? 'show' : ''}`}>
        <h2>Filtreler</h2>
        <div className="filters-form">
          <div className="form-group">
            <label htmlFor="minPrice">Minimum Fiyat (₺)</label>
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              min="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="maxPrice">Maksimum Fiyat (₺)</label>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              min="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="rating">Minimum Puan</label>
            <select
              id="rating"
              name="rating"
              value={filters.rating}
              onChange={handleFilterChange}
            >
              <option value="">Tümü</option>
              <option value="3">3+ Yıldız</option>
              <option value="4">4+ Yıldız</option>
              <option value="5">5 Yıldız</option>
            </select>
          </div>

          <div className="features-group">
            <label>Özellikler</label>
            <div className="features-list">
              <button
                type="button"
                className={`feature-btn ${filters.features.includes('pool') ? 'active' : ''}`}
                onClick={() => handleFeatureToggle('pool')}
              >
                <FaSwimmingPool /> Havuz
              </button>
              <button
                type="button"
                className={`feature-btn ${filters.features.includes('wifi') ? 'active' : ''}`}
                onClick={() => handleFeatureToggle('wifi')}
              >
                <FaWifi /> Wi-Fi
              </button>
              <button
                type="button"
                className={`feature-btn ${filters.features.includes('restaurant') ? 'active' : ''}`}
                onClick={() => handleFeatureToggle('restaurant')}
              >
                <FaUtensils /> Restoran
              </button>
            </div>
          </div>

          <button type="button" className="apply-filters-btn" onClick={applyFilters}>
            Filtreleri Uygula
          </button>
        </div>
      </div>

      <div className="hotels-grid">
        {hotels.length === 0 ? (
          <div className="no-results">
            <p>Aramanıza uygun otel bulunamadı.</p>
          </div>
        ) : (
          hotels.map(hotel => (
            <div key={hotel._id} className="hotel-card">
              <div className="hotel-image">
                <img src={hotel.images[0]} alt={hotel.name} />
                <button
                  className="favorite-btn"
                  onClick={() => toggleFavorite(hotel._id)}
                >
                  {favorites.includes(hotel._id) ? (
                    <FaHeart className="favorite" />
                  ) : (
                    <FaRegHeart />
                  )}
                </button>
              </div>

              <div className="hotel-content">
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

                <div className="hotel-features">
                  {hotel.features.map((feature, index) => (
                    <span key={index} className="feature-tag">
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="hotel-price">
                  <span className="price">{hotel.price}₺</span>
                  <span className="per-night">/ gece</span>
                </div>

                <Link to={`/hotel/${hotel._id}`} className="view-details-btn">
                  Detayları Görüntüle
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchResults;
