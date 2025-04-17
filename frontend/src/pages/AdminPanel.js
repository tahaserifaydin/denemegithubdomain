import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Rating,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [complaints, setComplaints] = useState([
    {
      id: 1,
      name: 'Ahmet Yılmaz',
      email: 'ahmet@example.com',
      hotelName: 'Grand Luxury Hotel',
      rating: 2,
      comment: 'Otel temizliği yetersizdi ve personel ilgisizdi. Fiyatına göre beklentilerimi karşılamadı.',
      createdAt: new Date().toISOString()
    }
  ]);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  const [loginDialogOpen, setLoginDialogOpen] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    price: '',
    rating: '',
    image: '',
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

  useEffect(() => {
    if (isLoggedIn) {
      fetchHotels();
      fetchComplaints();
    }
  }, [isLoggedIn]);

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
      const data = await response.json();
      setComplaints(data);
    } catch (error) {
      console.error('Şikayetler yüklenirken hata:', error);
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

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loginForm.email === 'admin@gmail.com' && loginForm.password === '123123') {
      setIsLoggedIn(true);
      setLoginDialogOpen(false);
      fetchHotels();
    } else {
      alert('Geçersiz e-posta veya şifre!');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
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
      if (editingHotel) {
        // API'ye otel güncelleme isteği gönder
        setHotels(hotels.map(hotel => 
          hotel.id === editingHotel.id ? { ...formData, id: editingHotel.id } : hotel
        ));
        setSnackbar({
          open: true,
          message: 'Otel başarıyla güncellendi',
          severity: 'success'
        });
      } else {
        // API'ye yeni otel ekleme isteği gönder
        const newHotel = {
          ...formData,
          id: Date.now() // Geçici ID
        };
        setHotels([...hotels, newHotel]);
        setSnackbar({
          open: true,
          message: 'Otel başarıyla eklendi',
          severity: 'success'
        });
      }
      handleCloseDialog();
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
      // API'ye otel silme isteği gönder
      setHotels(hotels.filter(hotel => hotel.id !== id));
      setSnackbar({
        open: true,
        message: 'Otel başarıyla silindi',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Otel silinirken bir hata oluştu',
        severity: 'error'
      });
    }
  };

  const handleCampaignOpenDialog = (campaign = null) => {
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

  const handleCampaignCloseDialog = () => {
    setOpenCampaignDialog(false);
    setEditingCampaign(null);
  };

  const handleCampaignInputChange = (e) => {
    const { name, value } = e.target;
    setCampaignFormData({ ...campaignFormData, [name]: value });
  };

  const handleCampaignSubmit = async () => {
    try {
      if (editingCampaign) {
        const response = await fetch(`http://localhost:5002/api/campaigns/${editingCampaign.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(campaignFormData),
        });
        const updatedCampaign = await response.json();
        setCampaigns(campaigns.map(camp => 
          camp.id === editingCampaign.id ? updatedCampaign : camp
        ));
      } else {
        const response = await fetch('http://localhost:5002/api/campaigns', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(campaignFormData),
        });
        const newCampaign = await response.json();
        setCampaigns([...campaigns, newCampaign]);
      }
      handleCampaignCloseDialog();
    } catch (error) {
      console.error('Error saving campaign:', error);
    }
  };

  const handleCampaignDelete = async (id) => {
    try {
      await fetch(`http://localhost:5002/api/campaigns/${id}`, {
        method: 'DELETE',
      });
      setCampaigns(campaigns.filter(camp => camp.id !== id));
    } catch (error) {
      console.error('Error deleting campaign:', error);
    }
  };

  const handleChangePhoto = (hotel) => {
    const newPhotoUrl = prompt('Yeni fotoğraf URL\'sini girin:', hotel.image);
    if (newPhotoUrl) {
      const updatedHotel = { ...hotel, image: newPhotoUrl };
      fetch(`http://localhost:5002/api/hotels/${hotel.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedHotel),
      })
        .then(response => response.json())
        .then(() => {
          fetchHotels();
          alert('Fotoğraf başarıyla güncellendi!');
        })
        .catch(error => {
          console.error('Fotoğraf güncellenirken hata:', error);
          alert('Fotoğraf güncellenirken bir hata oluştu!');
        });
    }
  };

  const handleAddPhoto = (hotel) => {
    const newPhotoUrl = prompt('Yeni fotoğraf URL\'sini girin:');
    if (newPhotoUrl) {
      const updatedHotel = { ...hotel, image: newPhotoUrl };
      fetch(`http://localhost:5002/api/hotels/${hotel.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedHotel),
      })
        .then(response => response.json())
        .then(() => {
          fetchHotels();
          alert('Fotoğraf başarıyla eklendi!');
        })
        .catch(error => {
          console.error('Fotoğraf eklenirken hata:', error);
          alert('Fotoğraf eklenirken bir hata oluştu!');
        });
    }
  };

  const handleDeletePhoto = (hotel) => {
    if (window.confirm('Fotoğrafı silmek istediğinizden emin misiniz?')) {
      const updatedHotel = { ...hotel, image: '' };
      fetch(`http://localhost:5002/api/hotels/${hotel.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedHotel),
      })
        .then(response => response.json())
        .then(() => {
          fetchHotels();
          alert('Fotoğraf başarıyla silindi!');
        })
        .catch(error => {
          console.error('Fotoğraf silinirken hata:', error);
          alert('Fotoğraf silinirken bir hata oluştu!');
        });
    }
  };

  const handleDeleteComplaint = async (id) => {
    if (window.confirm('Bu şikayeti silmek istediğinizden emin misiniz?')) {
      try {
        // API'ye silme isteği gönder
        await fetch(`http://localhost:5002/api/complaints/${id}`, {
          method: 'DELETE',
        });
        // Local state'i güncelle
        setComplaints(complaints.filter(complaint => complaint.id !== id));
        alert('Şikayet başarıyla silindi!');
      } catch (error) {
        console.error('Şikayet silinirken hata:', error);
        alert('Şikayet silinirken bir hata oluştu!');
      }
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {!isLoggedIn ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '80vh' 
          }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => setLoginDialogOpen(true)}
            >
              Admin Girişi
            </Button>
          </Box>
        ) : (
          <>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 4 
            }}>
              <Typography variant="h4" component="h1">
                Admin Paneli
              </Typography>
              <Button 
                variant="contained" 
                color="error" 
                onClick={handleLogout}
              >
                Çıkış Yap
              </Button>
            </Box>

            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 4 }}>
              <Tab label="Oteller" />
              <Tab label="Şikayetler" />
            </Tabs>

            {activeTab === 0 ? (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">
                        Otel Listesi
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog()}
                      >
                        Yeni Otel Ekle
                      </Button>
                    </Box>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Otel Adı</TableCell>
                            <TableCell>Konum</TableCell>
                            <TableCell>Fiyat</TableCell>
                            <TableCell>Puan</TableCell>
                            <TableCell>Müsaitlik</TableCell>
                            <TableCell>İşlemler</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {hotels.map((hotel) => (
                            <TableRow key={hotel.id}>
                              <TableCell>{hotel.id}</TableCell>
                              <TableCell>{hotel.name}</TableCell>
                              <TableCell>{hotel.location}</TableCell>
                              <TableCell>{hotel.price} TL</TableCell>
                              <TableCell>{hotel.rating}</TableCell>
                              <TableCell>
                                <Typography color={hotel.available ? "success.main" : "error.main"}>
                                  {hotel.available ? "Müsait" : "Dolu"}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  size="small"
                                  onClick={() => handleOpenDialog(hotel)}
                                  sx={{ mr: 1 }}
                                >
                                  Düzenle
                                </Button>
                                <Button
                                  variant="contained"
                                  color="error"
                                  size="small"
                                  onClick={() => handleDelete(hotel.id)}
                                  sx={{ mr: 1 }}
                                >
                                  Sil
                                </Button>
                                <Button
                                  variant="contained"
                                  color="info"
                                  size="small"
                                  onClick={() => handleChangePhoto(hotel)}
                                  sx={{ mr: 1 }}
                                >
                                  Fotoğraf Değiştir
                                </Button>
                                <Button
                                  variant="contained"
                                  color="success"
                                  size="small"
                                  onClick={() => handleAddPhoto(hotel)}
                                  sx={{ mr: 1 }}
                                >
                                  Fotoğraf Ekle
                                </Button>
                                <Button
                                  variant="contained"
                                  color="warning"
                                  size="small"
                                  onClick={() => handleDeletePhoto(hotel)}
                                  sx={{ mr: 1 }}
                                >
                                  Fotoğraf Sil
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">
                        Kampanya Listesi
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleCampaignOpenDialog()}
                      >
                        Yeni Kampanya Ekle
                      </Button>
                    </Box>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Kampanya Adı</TableCell>
                            <TableCell>Açıklama</TableCell>
                            <TableCell>İndirim</TableCell>
                            <TableCell>Başlangıç</TableCell>
                            <TableCell>Bitiş</TableCell>
                            <TableCell>İşlemler</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {campaigns.map((campaign) => (
                            <TableRow key={campaign.id}>
                              <TableCell>{campaign.title}</TableCell>
                              <TableCell>{campaign.description}</TableCell>
                              <TableCell>%{campaign.discount}</TableCell>
                              <TableCell>{campaign.startDate}</TableCell>
                              <TableCell>{campaign.endDate}</TableCell>
                              <TableCell>
                                <IconButton color="primary" onClick={() => handleCampaignOpenDialog(campaign)}>
                                  <EditIcon />
                                </IconButton>
                                <IconButton color="error" onClick={() => handleCampaignDelete(campaign.id)}>
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Grid>
              </Grid>
            ) : (
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Şikayetler ve Yorumlar
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Ad Soyad</TableCell>
                        <TableCell>E-posta</TableCell>
                        <TableCell>Otel</TableCell>
                        <TableCell>Değerlendirme</TableCell>
                        <TableCell>Yorum</TableCell>
                        <TableCell>Tarih</TableCell>
                        <TableCell>İşlemler</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {complaints.map((complaint) => (
                        <TableRow key={complaint.id}>
                          <TableCell>{complaint.name}</TableCell>
                          <TableCell>{complaint.email}</TableCell>
                          <TableCell>{complaint.hotelName}</TableCell>
                          <TableCell>
                            <Rating value={complaint.rating} readOnly />
                          </TableCell>
                          <TableCell>{complaint.comment}</TableCell>
                          <TableCell>{new Date(complaint.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              onClick={() => handleDeleteComplaint(complaint.id)}
                            >
                              Sil
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            )}

            {/* Otel Ekleme/Düzenleme Dialog'u */}
            <Dialog
              open={openDialog}
              onClose={handleCloseDialog}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle>
                {editingHotel ? 'Otel Düzenle' : 'Yeni Otel Ekle'}
              </DialogTitle>
              <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                  <TextField
                    fullWidth
                    label="Otel Adı"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                  <TextField
                    fullWidth
                    label="Konum"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                  <TextField
                    fullWidth
                    type="number"
                    label="Fiyat"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                  />
                  <TextField
                    fullWidth
                    type="number"
                    label="Puan"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                  />
                  <TextField
                    fullWidth
                    label="Görsel URL"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                  />
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>İptal</Button>
                <Button onClick={handleSubmit} variant="contained">
                  {editingHotel ? 'Güncelle' : 'Ekle'}
                </Button>
              </DialogActions>
            </Dialog>

            {/* Kampanya Ekleme/Düzenleme Dialog'u */}
            <Dialog
              open={openCampaignDialog}
              onClose={handleCampaignCloseDialog}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle>
                {editingCampaign ? 'Kampanya Düzenle' : 'Yeni Kampanya Ekle'}
              </DialogTitle>
              <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                  <TextField
                    fullWidth
                    label="Kampanya Adı"
                    name="title"
                    value={campaignFormData.title}
                    onChange={handleCampaignInputChange}
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Açıklama"
                    name="description"
                    value={campaignFormData.description}
                    onChange={handleCampaignInputChange}
                  />
                  <TextField
                    fullWidth
                    type="number"
                    label="İndirim Oranı (%)"
                    name="discount"
                    value={campaignFormData.discount}
                    onChange={handleCampaignInputChange}
                  />
                  <TextField
                    fullWidth
                    type="date"
                    label="Başlangıç Tarihi"
                    name="startDate"
                    value={campaignFormData.startDate}
                    onChange={handleCampaignInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    fullWidth
                    type="date"
                    label="Bitiş Tarihi"
                    name="endDate"
                    value={campaignFormData.endDate}
                    onChange={handleCampaignInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    fullWidth
                    label="Resim URL"
                    name="image"
                    value={campaignFormData.image}
                    onChange={handleCampaignInputChange}
                  />
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCampaignCloseDialog}>İptal</Button>
                <Button onClick={handleCampaignSubmit} variant="contained">
                  {editingCampaign ? 'Güncelle' : 'Ekle'}
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </Container>

      <Dialog open={loginDialogOpen} onClose={() => setLoginDialogOpen(false)}>
        <DialogTitle>Admin Girişi</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="E-posta"
              type="email"
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Şifre"
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              sx={{ mb: 2 }}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
            >
              Giriş Yap
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminPanel; 