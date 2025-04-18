import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Complaints.css';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    hotelId: '',
    userId: '',
  });
  const [hotels, setHotels] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchHotels();
    fetchComplaints();
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/hotels');
      setHotels(response.data);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      setError('Oteller yüklenirken bir hata oluştu.');
    }
  };

  const fetchComplaints = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.get(`http://localhost:5002/api/complaints/user/${userId}`);
      setComplaints(response.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      setError('Şikayetler yüklenirken bir hata oluştu.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId');
      const complaintData = {
        ...formData,
        userId,
      };
      await axios.post('http://localhost:5002/api/complaints', complaintData);
      setMessage('Şikayetiniz başarıyla gönderildi.');
      setFormData({ title: '', description: '', hotelId: '', userId: '' });
      fetchComplaints();
    } catch (error) {
      console.error('Error submitting complaint:', error);
      setError('Şikayet gönderilirken bir hata oluştu.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="complaints-container">
      <div className="complaints-form-section">
        <h2>Yeni Şikayet Oluştur</h2>
        <form onSubmit={handleSubmit} className="complaints-form">
          <div className="form-group">
            <label htmlFor="title">Başlık</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="hotelId">Otel</label>
            <select
              id="hotelId"
              name="hotelId"
              value={formData.hotelId}
              onChange={handleChange}
              required
            >
              <option value="">Otel Seçin</option>
              {hotels.map((hotel) => (
                <option key={hotel._id} value={hotel._id}>
                  {hotel.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Açıklama</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
            />
          </div>

          <button type="submit" className="submit-btn">
            Şikayet Gönder
          </button>
        </form>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
      </div>

      <div className="complaints-list-section">
        <h2>Şikayetlerim</h2>
        {complaints.length === 0 ? (
          <p className="no-complaints">Henüz bir şikayetiniz bulunmamaktadır.</p>
        ) : (
          <div className="complaints-list">
            {complaints.map((complaint) => (
              <div key={complaint._id} className="complaint-card">
                <h3>{complaint.title}</h3>
                <p className="hotel-name">
                  Otel: {hotels.find(h => h._id === complaint.hotelId)?.name || 'Bilinmeyen Otel'}
                </p>
                <p className="description">{complaint.description}</p>
                <p className="status">
                  Durum: <span className={`status-${complaint.status.toLowerCase()}`}>
                    {complaint.status === 'PENDING' ? 'Beklemede' :
                     complaint.status === 'IN_PROGRESS' ? 'İşleme Alındı' :
                     complaint.status === 'RESOLVED' ? 'Çözüldü' : 'Bilinmiyor'}
                  </span>
                </p>
                <p className="date">
                  {new Date(complaint.createdAt).toLocaleDateString('tr-TR')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Complaints; 