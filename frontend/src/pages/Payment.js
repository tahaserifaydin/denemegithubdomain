import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaCreditCard, FaCalendarAlt, FaLock } from 'react-icons/fa';
import '../styles/Payment.css';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state;

  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!bookingData) {
    navigate('/');
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = value
        .replace(/\s/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim()
        .slice(0, 19);
    } else if (name === 'expiryDate') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d{0,2})/, '$1/$2')
        .slice(0, 5);
    } else if (name === 'cvv') {
      formattedValue = value.slice(0, 3);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userId = localStorage.getItem('userId');
      const paymentData = {
        ...bookingData,
        userId,
        paymentDetails: {
          cardNumber: formData.cardNumber.replace(/\s/g, ''),
          cardName: formData.cardName,
          expiryDate: formData.expiryDate,
          cvv: formData.cvv
        }
      };

      const response = await axios.post('http://localhost:5002/api/bookings', paymentData);
      
      if (response.data) {
        navigate('/booking-success');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError('Ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-summary">
        <h2>Rezervasyon Özeti</h2>
        <div className="summary-details">
          <div className="summary-item">
            <span>Otel:</span>
            <span>{bookingData.hotelName}</span>
          </div>
          <div className="summary-item">
            <span>Giriş Tarihi:</span>
            <span>{new Date(bookingData.checkIn).toLocaleDateString('tr-TR')}</span>
          </div>
          <div className="summary-item">
            <span>Çıkış Tarihi:</span>
            <span>{new Date(bookingData.checkOut).toLocaleDateString('tr-TR')}</span>
          </div>
          <div className="summary-item">
            <span>Misafir Sayısı:</span>
            <span>{bookingData.guests} kişi</span>
          </div>
          <div className="summary-item total">
            <span>Toplam Tutar:</span>
            <span>{bookingData.totalPrice}₺</span>
          </div>
        </div>
      </div>

      <div className="payment-form-container">
        <h2>Ödeme Bilgileri</h2>
        <form onSubmit={handleSubmit} className="payment-form">
          <div className="form-group">
            <label htmlFor="cardNumber">
              <FaCreditCard /> Kart Numarası
            </label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              placeholder="1234 5678 9012 3456"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cardName">Kart Üzerindeki İsim</label>
            <input
              type="text"
              id="cardName"
              name="cardName"
              value={formData.cardName}
              onChange={handleChange}
              placeholder="Ad Soyad"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="expiryDate">
                <FaCalendarAlt /> Son Kullanma Tarihi
              </label>
              <input
                type="text"
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                placeholder="AA/YY"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cvv">
                <FaLock /> CVV
              </label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                placeholder="123"
                required
              />
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'İşleniyor...' : 'Ödemeyi Tamamla'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment; 