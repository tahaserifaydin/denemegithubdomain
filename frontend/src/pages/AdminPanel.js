import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AdminPanel.css';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    price: '',
    rating: '',
    image: '',
    photos: [],
  });
  const [campaigns, setCampaigns] = useState([]);
  const [openCampaignDialog, setOpenCampaignDialog] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [campaignFormData, setCampaignFormData] = useState({
    title: '',
    description: '',
    discount: '',
    startDate: '',
    endDate: '',
    image: ''
  });
  const [activeTab, setActiveTab] = useState(0);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [newPhoto, setNewPhoto] = useState('');

  useEffect(() => {
    fetchHotels();
    fetchComplaints();
    fetchCampaigns();
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/hotels');
      if (response.ok) {
        const data = await response.json();
        setHotels(data);
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
    }
  };

  const fetchComplaints = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/complaints');
      if (!response.ok) {
        throw new Error('Şikayetler yüklenirken bir hata oluştu');
      }
      const data = await response.json();
      setComplaints(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Şikayetler yüklenirken hata:', error);
      setComplaints([]);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/campaigns');
      const data = await response.json();
      setCampaigns(data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleOpenDialog = (hotel = null) => {
    if (hotel) {
      setEditingHotel(hotel);
      setFormData(hotel);
    } else {
      setEditingHotel(null);
      setFormData({
        name: '',
        location: '',
        price: '',
        rating: '',
        image: '',
        photos: [],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingHotel(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const url = editingHotel 
        ? `http://localhost:5002/api/hotels/${editingHotel.id}`
        : 'http://localhost:5002/api/hotels';
      
      const method = editingHotel ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchHotels();
        handleCloseDialog();
        setSnackbar({
          open: true,
          message: editingHotel ? 'Otel başarıyla güncellendi' : 'Otel başarıyla eklendi',
          severity: 'success'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'İşlem sırasında bir hata oluştu',
        severity: 'error'
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5002/api/hotels/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchHotels();
        setSnackbar({
          open: true,
          message: 'Otel başarıyla silindi',
          severity: 'success'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Silme işlemi sırasında bir hata oluştu',
        severity: 'error'
      });
    }
  };

  const handleDeleteComplaint = async (id) => {
    try {
      const response = await fetch(`http://localhost:5002/api/complaints/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchComplaints();
        setSnackbar({
          open: true,
          message: 'Şikayet başarıyla silindi',
          severity: 'success'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Şikayet silinirken bir hata oluştu',
        severity: 'error'
      });
    }
  };

  const handleOpenCampaignDialog = (campaign = null) => {
    if (campaign) {
      setEditingCampaign(campaign);
      setCampaignFormData(campaign);
    } else {
      setEditingCampaign(null);
      setCampaignFormData({
        title: '',
        description: '',
        discount: '',
        startDate: '',
        endDate: '',
        image: ''
      });
    }
    setOpenCampaignDialog(true);
  };

  const handleCloseCampaignDialog = () => {
    setOpenCampaignDialog(false);
    setEditingCampaign(null);
  };

  const handleCampaignSubmit = async () => {
    try {
      const url = editingCampaign 
        ? `http://localhost:5002/api/campaigns/${editingCampaign.id}`
        : 'http://localhost:5002/api/campaigns';
      
      const method = editingCampaign ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaignFormData),
      });

      if (response.ok) {
        fetchCampaigns();
        handleCloseCampaignDialog();
        setSnackbar({
          open: true,
          message: editingCampaign ? 'Kampanya başarıyla güncellendi' : 'Kampanya başarıyla eklendi',
          severity: 'success'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Kampanya işlemi sırasında bir hata oluştu',
        severity: 'error'
      });
    }
  };

  const handleDeleteCampaign = async (id) => {
    try {
      const response = await fetch(`http://localhost:5002/api/campaigns/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchCampaigns();
        setSnackbar({
          open: true,
          message: 'Kampanya başarıyla silindi',
          severity: 'success'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Kampanya silinirken bir hata oluştu',
        severity: 'error'
      });
    }
  };

  const handleOpenPhotoDialog = (hotel) => {
    setSelectedHotel(hotel);
    setPhotoDialogOpen(true);
  };

  const handleClosePhotoDialog = () => {
    setPhotoDialogOpen(false);
    setSelectedHotel(null);
    setNewPhoto('');
  };

  const handleAddPhoto = async () => {
    if (!newPhoto || !selectedHotel) return;

    try {
      const updatedHotel = {
        ...selectedHotel,
        photos: [...(selectedHotel.photos || []), newPhoto]
      };

      const response = await fetch(`http://localhost:5002/api/hotels/${selectedHotel.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedHotel),
      });

      if (response.ok) {
        fetchHotels();
        handleClosePhotoDialog();
        setSnackbar({
          open: true,
          message: 'Fotoğraf başarıyla eklendi',
          severity: 'success'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Fotoğraf eklenirken bir hata oluştu',
        severity: 'error'
      });
    }
  };

  const handleDeletePhoto = async (hotelId, photoIndex) => {
    try {
      const hotel = hotels.find(h => h.id === hotelId);
      if (!hotel) return;

      const updatedPhotos = [...hotel.photos];
      updatedPhotos.splice(photoIndex, 1);

      const response = await fetch(`http://localhost:5002/api/hotels/${hotelId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...hotel, photos: updatedPhotos }),
      });

      if (response.ok) {
        fetchHotels();
        setSnackbar({
          open: true,
          message: 'Fotoğraf başarıyla silindi',
          severity: 'success'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Fotoğraf silinirken bir hata oluştu',
        severity: 'error'
      });
    }
  };

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= rating ? 'filled' : ''}`}>★</span>
      );
    }
    return stars;
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <button className="logout-button" onClick={handleLogout}>
          Çıkış Yap
        </button>
      </div>

      <div className="tabs">
        <button 
          className={`tab-button ${activeTab === 0 ? 'active' : ''}`}
          onClick={() => handleTabChange(0)}
        >
          Oteller
        </button>
        <button 
          className={`tab-button ${activeTab === 1 ? 'active' : ''}`}
          onClick={() => handleTabChange(1)}
        >
          Şikayetler
        </button>
        <button 
          className={`tab-button ${activeTab === 2 ? 'active' : ''}`}
          onClick={() => handleTabChange(2)}
        >
          Kampanyalar
        </button>
      </div>

      {/* Oteller Sekmesi */}
      {activeTab === 0 && (
        <div className="hotels-section">
          <button className="add-button" onClick={() => handleOpenDialog()}>
            Yeni Otel Ekle
          </button>

          <div className="hotels-grid">
            {hotels.map((hotel) => (
              <div className="hotel-card" key={hotel.id}>
                <div className="hotel-content">
                  <h3>{hotel.name}</h3>
                  <p className="location">{hotel.location}</p>
                  <p className="price">Fiyat: {hotel.price} TL</p>
                  <div className="rating">{renderStars(hotel.rating)}</div>
                  
                  {hotel.photos && hotel.photos.length > 0 && (
                    <div className="photos-grid">
                      {hotel.photos.map((photo, index) => (
                        <div className="photo-item" key={index}>
                          <img src={photo} alt={`${hotel.name} - Fotoğraf ${index + 1}`} />
                          <button 
                            className="delete-photo-button"
                            onClick={() => handleDeletePhoto(hotel.id, index)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="hotel-actions">
                  <button onClick={() => handleOpenDialog(hotel)}>Düzenle</button>
                  <button onClick={() => handleOpenPhotoDialog(hotel)}>Fotoğraf Ekle</button>
                  <button className="delete-button" onClick={() => handleDelete(hotel.id)}>Sil</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Şikayetler Sekmesi */}
      {activeTab === 1 && (
        <div className="complaints-section">
          <table className="complaints-table">
            <thead>
              <tr>
                <th>İsim</th>
                <th>E-posta</th>
                <th>Otel</th>
                <th>Puan</th>
                <th>Yorum</th>
                <th>Tarih</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(complaints) && complaints.length > 0 ? (
                complaints.map((complaint) => (
                  <tr key={complaint._id}>
                    <td>{complaint.name}</td>
                    <td>{complaint.email}</td>
                    <td>{complaint.hotelName}</td>
                    <td>
                      <div className="rating">{renderStars(complaint.rating)}</div>
                    </td>
                    <td>{complaint.comment}</td>
                    <td>{new Date(complaint.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button 
                        className="delete-button"
                        onClick={() => handleDeleteComplaint(complaint._id)}
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>
                    Henüz şikayet bulunmuyor
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Kampanyalar Sekmesi */}
      {activeTab === 2 && (
        <div className="campaigns-section">
          <button className="add-button" onClick={() => handleOpenCampaignDialog()}>
            Yeni Kampanya Ekle
          </button>

          <div className="campaigns-grid">
            {campaigns.map((campaign) => (
              <div className="campaign-card" key={campaign.id}>
                <div className="campaign-content">
                  <h3>{campaign.title}</h3>
                  <p className="description">{campaign.description}</p>
                  <p className="discount">İndirim: %{campaign.discount}</p>
                  <p className="date">
                    Başlangıç: {new Date(campaign.startDate).toLocaleDateString()}
                  </p>
                  <p className="date">
                    Bitiş: {new Date(campaign.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="campaign-actions">
                  <button onClick={() => handleOpenCampaignDialog(campaign)}>Düzenle</button>
                  <button className="delete-button" onClick={() => handleDeleteCampaign(campaign.id)}>Sil</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Otel Ekleme/Düzenleme Dialog */}
      {openDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h2>{editingHotel ? 'Otel Düzenle' : 'Yeni Otel Ekle'}</h2>
            <div className="dialog-content">
              <input
                type="text"
                name="name"
                placeholder="Otel Adı"
                value={formData.name}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="location"
                placeholder="Konum"
                value={formData.location}
                onChange={handleInputChange}
              />
              <input
                type="number"
                name="price"
                placeholder="Fiyat"
                value={formData.price}
                onChange={handleInputChange}
              />
              <input
                type="number"
                name="rating"
                placeholder="Puan"
                value={formData.rating}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="image"
                placeholder="Ana Fotoğraf URL"
                value={formData.image}
                onChange={handleInputChange}
              />
            </div>
            <div className="dialog-actions">
              <button onClick={handleCloseDialog}>İptal</button>
              <button onClick={handleSubmit}>
                {editingHotel ? 'Güncelle' : 'Ekle'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kampanya Ekleme/Düzenleme Dialog */}
      {openCampaignDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h2>{editingCampaign ? 'Kampanya Düzenle' : 'Yeni Kampanya Ekle'}</h2>
            <div className="dialog-content">
              <input
                type="text"
                name="title"
                placeholder="Kampanya Başlığı"
                value={campaignFormData.title}
                onChange={(e) => setCampaignFormData({ ...campaignFormData, title: e.target.value })}
              />
              <textarea
                name="description"
                placeholder="Açıklama"
                value={campaignFormData.description}
                onChange={(e) => setCampaignFormData({ ...campaignFormData, description: e.target.value })}
              />
              <input
                type="number"
                name="discount"
                placeholder="İndirim Oranı (%)"
                value={campaignFormData.discount}
                onChange={(e) => setCampaignFormData({ ...campaignFormData, discount: e.target.value })}
              />
              <input
                type="date"
                name="startDate"
                value={campaignFormData.startDate}
                onChange={(e) => setCampaignFormData({ ...campaignFormData, startDate: e.target.value })}
              />
              <input
                type="date"
                name="endDate"
                value={campaignFormData.endDate}
                onChange={(e) => setCampaignFormData({ ...campaignFormData, endDate: e.target.value })}
              />
              <input
                type="text"
                name="image"
                placeholder="Kampanya Görseli URL"
                value={campaignFormData.image}
                onChange={(e) => setCampaignFormData({ ...campaignFormData, image: e.target.value })}
              />
            </div>
            <div className="dialog-actions">
              <button onClick={handleCloseCampaignDialog}>İptal</button>
              <button onClick={handleCampaignSubmit}>
                {editingCampaign ? 'Güncelle' : 'Ekle'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fotoğraf Ekleme Dialog */}
      {photoDialogOpen && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h2>Fotoğraf Ekle</h2>
            <div className="dialog-content">
              <input
                type="text"
                placeholder="Fotoğraf URL"
                value={newPhoto}
                onChange={(e) => setNewPhoto(e.target.value)}
              />
            </div>
            <div className="dialog-actions">
              <button onClick={handleClosePhotoDialog}>İptal</button>
              <button onClick={handleAddPhoto}>Ekle</button>
            </div>
          </div>
        </div>
      )}

      {/* Snackbar */}
      {snackbar.open && (
        <div className={`snackbar ${snackbar.severity}`}>
          {snackbar.message}
          <button onClick={() => setSnackbar({ ...snackbar, open: false })}>×</button>
        </div>
      )}
    </div>
  );
};

export default AdminPanel; 