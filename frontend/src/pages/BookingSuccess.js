import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import '../styles/BookingSuccess.css';

const BookingSuccess = () => {
  return (
    <div className="booking-success">
      <div className="success-card">
        <FaCheckCircle className="success-icon" />
        <h1>Rezervasyon Başarılı!</h1>
        <p>Rezervasyonunuz başarıyla tamamlandı. Rezervasyon detaylarınız e-posta adresinize gönderilecektir.</p>
        <div className="action-buttons">
          <Link to="/profile" className="view-booking-btn">
            Rezervasyonlarımı Görüntüle
          </Link>
          <Link to="/" className="home-btn">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess; 