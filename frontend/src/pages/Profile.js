import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaEnvelope, FaPhone, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import '../styles/Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUserData();
    fetchBookings();
  }, []);

  const fetchUserData = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.get(`http://localhost:5002/api/users/${userId}`);
      setUser(response.data);
      setEditedUser(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Kullanıcı bilgileri yüklenirken bir hata oluştu.');
    }
  };

  const fetchBookings = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.get(`http://localhost:5002/api/bookings/user/${userId}`);
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Rezervasyonlar yüklenirken bir hata oluştu.');
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setEditedUser(user);
    setError('');
    setSuccess('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId');
      await axios.put(`http://localhost:5002/api/users/${userId}`, editedUser);
      setUser(editedUser);
      setIsEditing(false);
      setSuccess('Profil bilgileriniz başarıyla güncellendi.');
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Profil güncellenirken bir hata oluştu.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  if (!user) {
    return <div className="loading">Yükleniyor...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Profilim</h1>
        <button onClick={handleLogout} className="logout-btn">
          Çıkış Yap
        </button>
      </div>

      <div className="profile-content">
        <div className="profile-info">
          <h2>Kişisel Bilgiler</h2>
          
          {success && <div className="success-message">{success}</div>}
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label>
                <FaUser /> Ad Soyad
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={editedUser.name}
                  onChange={handleInputChange}
                  required
                />
              ) : (
                <p>{user.name}</p>
              )}
            </div>

            <div className="form-group">
              <label>
                <FaEnvelope /> E-posta
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={editedUser.email}
                  onChange={handleInputChange}
                  required
                />
              ) : (
                <p>{user.email}</p>
              )}
            </div>

            <div className="form-group">
              <label>
                <FaPhone /> Telefon
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={editedUser.phone}
                  onChange={handleInputChange}
                  required
                />
              ) : (
                <p>{user.phone}</p>
              )}
            </div>

            <div className="form-actions">
              {isEditing ? (
                <>
                  <button type="submit" className="save-btn">
                    <FaSave /> Kaydet
                  </button>
                  <button type="button" onClick={handleEditToggle} className="cancel-btn">
                    <FaTimes /> İptal
                  </button>
                </>
              ) : (
                <button type="button" onClick={handleEditToggle} className="edit-btn">
                  <FaEdit /> Düzenle
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bookings-section">
          <h2>Rezervasyonlarım</h2>
          {bookings.length === 0 ? (
            <p className="no-bookings">Henüz bir rezervasyonunuz bulunmamaktadır.</p>
          ) : (
            <div className="bookings-list">
              {bookings.map((booking) => (
                <div key={booking._id} className="booking-card">
                  <h3>{booking.hotel.name}</h3>
                  <div className="booking-details">
                    <p>
                      <strong>Giriş:</strong>{' '}
                      {new Date(booking.checkIn).toLocaleDateString('tr-TR')}
                    </p>
                    <p>
                      <strong>Çıkış:</strong>{' '}
                      {new Date(booking.checkOut).toLocaleDateString('tr-TR')}
                    </p>
                    <p>
                      <strong>Misafir Sayısı:</strong> {booking.guests}
                    </p>
                    <p>
                      <strong>Toplam Tutar:</strong> {booking.totalPrice}₺
                    </p>
                    <p className={`booking-status status-${booking.status.toLowerCase()}`}>
                      {booking.status === 'CONFIRMED' ? 'Onaylandı' :
                       booking.status === 'PENDING' ? 'Beklemede' :
                       booking.status === 'CANCELLED' ? 'İptal Edildi' : 'Bilinmiyor'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
