import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHotel, FaMapMarkerAlt, FaSwimmingPool, FaWifi, FaUtensils } from 'react-icons/fa';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [popularDestinations, setPopularDestinations] = useState([]);

  useEffect(() => {
    // Simüle edilmiş veri yükleme
    setFeaturedHotels([
    {
      id: 1,
        name: 'Luxury Resort & Spa',
        location: 'Antalya',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
      rating: 4.8,
        price: 1200
    },
    {
      id: 2,
        name: 'Seaside Hotel',
        location: 'Bodrum',
        image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd',
        rating: 4.5,
        price: 950
    },
    {
      id: 3,
        name: 'Mountain View Resort',
        location: 'Uludağ',
        image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39',
      rating: 4.6,
        price: 1100
      }
    ]);

    setPopularDestinations([
    {
      id: 1,
        name: 'Antalya',
        image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989',
        hotelCount: 245
    },
    {
      id: 2,
        name: 'Bodrum',
        image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a',
        hotelCount: 178
    },
    {
      id: 3,
        name: 'İstanbul',
        image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b',
        hotelCount: 312
      }
    ]);
  }, []);

  const handleHotelClick = (hotelId) => {
    navigate(`/hotels/${hotelId}`);
  };

  const handleDestinationClick = (destination) => {
    navigate(`/search?location=${destination}`);
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Hayalinizdeki Tatili Keşfedin</h1>
          <p>En iyi oteller, en uygun fiyatlar ve unutulmaz deneyimler</p>
          <button className="search-button" onClick={() => navigate('/search')}>
            Otel Ara
          </button>
        </div>
      </section>

      <section className="featured-hotels">
        <h2>Öne Çıkan Oteller</h2>
        <div className="hotel-grid">
          {featuredHotels.map((hotel) => (
            <div
              key={hotel.id}
              className="hotel-card"
              onClick={() => handleHotelClick(hotel.id)}
            >
              <div className="hotel-image">
                <img src={hotel.image} alt={hotel.name} />
              </div>
              <div className="hotel-info">
                <h3>{hotel.name}</h3>
                <p className="location">
                  <FaMapMarkerAlt /> {hotel.location}
                </p>
                <div className="hotel-features">
                  <span><FaSwimmingPool /> Havuz</span>
                  <span><FaWifi /> Wifi</span>
                  <span><FaUtensils /> Restoran</span>
                </div>
                <div className="hotel-footer">
                  <div className="rating">★ {hotel.rating}</div>
                  <div className="price">{hotel.price} ₺/gece</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="popular-destinations">
        <h2>Popüler Destinasyonlar</h2>
        <div className="destination-grid">
          {popularDestinations.map((destination) => (
            <div
              key={destination.id}
              className="destination-card"
              onClick={() => handleDestinationClick(destination.name)}
            >
              <img src={destination.image} alt={destination.name} />
              <div className="destination-info">
                <h3>{destination.name}</h3>
                <p>{destination.hotelCount} otel</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="why-choose-us">
        <h2>Neden Bizi Seçmelisiniz?</h2>
        <div className="features-grid">
          <div className="feature">
            <FaHotel className="feature-icon" />
            <h3>En İyi Oteller</h3>
            <p>Özenle seçilmiş, yüksek kaliteli konaklama seçenekleri</p>
          </div>
          <div className="feature">
            <span className="feature-icon">💰</span>
            <h3>En İyi Fiyat Garantisi</h3>
            <p>Piyasadaki en uygun fiyatları sunuyoruz</p>
          </div>
          <div className="feature">
            <span className="feature-icon">🎯</span>
            <h3>Kolay Rezervasyon</h3>
            <p>Hızlı ve güvenli rezervasyon işlemi</p>
          </div>
          <div className="feature">
            <span className="feature-icon">🌟</span>
            <h3>7/24 Destek</h3>
            <p>Her zaman yanınızda olan müşteri desteği</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
