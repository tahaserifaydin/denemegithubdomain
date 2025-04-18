import React, { useState } from 'react';
import { FaCalendar, FaUser, FaCreditCard, FaLock } from 'react-icons/fa';
import './Booking.css';

const Booking = () => {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    rooms: 1,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Handle final submission
      console.log('Booking submitted:', bookingData);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="booking-step">
            <h2>Rezervasyon Detayları</h2>
            <div className="form-group">
              <label>
                <FaCalendar />
                Giriş Tarihi
              </label>
              <input
                type="date"
                name="checkIn"
                value={bookingData.checkIn}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="form-group">
              <label>
                <FaCalendar />
                Çıkış Tarihi
              </label>
              <input
                type="date"
                name="checkOut"
                value={bookingData.checkOut}
                onChange={handleInputChange}
                min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="form-group">
              <label>
                <FaUser />
                Misafir Sayısı
              </label>
              <input
                type="number"
                name="guests"
                value={bookingData.guests}
                onChange={handleInputChange}
                min="1"
                max="10"
              />
            </div>
            <div className="form-group">
              <label>
                <FaUser />
                Oda Sayısı
              </label>
              <input
                type="number"
                name="rooms"
                value={bookingData.rooms}
                onChange={handleInputChange}
                min="1"
                max="5"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="booking-step">
            <h2>Kişisel Bilgiler</h2>
            <div className="form-group">
              <label>Ad</label>
              <input
                type="text"
                name="firstName"
                value={bookingData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Soyad</label>
              <input
                type="text"
                name="lastName"
                value={bookingData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>E-posta</label>
              <input
                type="email"
                name="email"
                value={bookingData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Telefon</label>
              <input
                type="tel"
                name="phone"
                value={bookingData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="booking-step">
            <h2>Ödeme Bilgileri</h2>
            <div className="form-group">
              <label>
                <FaCreditCard />
                Kart Numarası
              </label>
              <input
                type="text"
                name="cardNumber"
                value={bookingData.cardNumber}
                onChange={handleInputChange}
                required
                maxLength="16"
                placeholder="1234 5678 9012 3456"
              />
            </div>
            <div className="form-group">
              <label>Kart Üzerindeki İsim</label>
              <input
                type="text"
                name="cardName"
                value={bookingData.cardName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Son Kullanma Tarihi</label>
                <input
                  type="text"
                  name="expiryDate"
                  value={bookingData.expiryDate}
                  onChange={handleInputChange}
                  required
                  placeholder="MM/YY"
                  maxLength="5"
                />
              </div>
              <div className="form-group">
                <label>CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={bookingData.cvv}
                  onChange={handleInputChange}
                  required
                  maxLength="3"
                />
              </div>
            </div>
            <div className="secure-payment">
              <FaLock />
              <span>Güvenli Ödeme</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="booking-container">
      <div className="booking-progress">
        <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
          <span className="step-number">1</span>
          <span className="step-label">Rezervasyon</span>
        </div>
        <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
          <span className="step-number">2</span>
          <span className="step-label">Kişisel Bilgiler</span>
        </div>
        <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
          <span className="step-number">3</span>
          <span className="step-label">Ödeme</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="booking-form">
        {renderStep()}
        
        <div className="booking-actions">
          {step > 1 && (
            <button
              type="button"
              className="back-button"
              onClick={() => setStep(step - 1)}
            >
              Geri
            </button>
          )}
          <button type="submit" className="next-button">
            {step === 3 ? 'Rezervasyonu Tamamla' : 'İleri'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Booking;
