import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Rating,
  Chip,
  Button,
  Card,
  CardMedia,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CardContent,
  CardActions,
  Avatar,
  Divider,
  Snackbar,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
import { Favorite, FavoriteBorder, Comment, Delete } from '@mui/icons-material';
import { hotels } from '../data/hotels';
import { useFavorite } from '../contexts/FavoriteContext';

const HotelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorite();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    rooms: 1,
    name: '',
    email: '',
    phone: '',
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [hotel, setHotel] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [sortReviews, setSortReviews] = useState('newest');
  const [filterRating, setFilterRating] = useState(0);
  const [currentUser] = useState("Kullanıcı Adı"); // Gerçek uygulamada kullanıcı bilgisi kullanılacak

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        // Örnek veri - API entegrasyonu yapılacak
        const hotelData = {
          id: 1,
          name: "Grand Luxury Hotel",
          location: "İstanbul, Türkiye",
          rating: 4.8,
          price: 2500,
          type: "hotel",
          description: "Boğaz manzaralı lüks otelimiz, şehrin kalbinde yer almaktadır. Modern odalar, spa merkezi ve dünya mutfağından lezzetler sunan restoranımızla misafirlerimize unutulmaz bir deneyim sunuyoruz.",
          image: "https://images.unsplash.com/photo-1564501049412-61c50449b63f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
          images: [
            "https://images.unsplash.com/photo-1564501049412-61c50449b63f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
            "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
            "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
          ],
          amenities: ["Ücretsiz WiFi", "Havuz", "Spa", "Restoran", "Otopark"],
          roomTypes: [
            {
              id: 1,
              name: "Standart Oda",
              price: 2000,
              capacity: 2,
              description: "Boğaz manzaralı standart oda",
              features: ["Klima", "Mini Bar", "TV", "Ücretsiz WiFi"]
            },
            {
              id: 2,
              name: "Deluxe Oda",
              price: 3000,
              capacity: 2,
              description: "Boğaz manzaralı deluxe oda",
              features: ["Klima", "Mini Bar", "TV", "Ücretsiz WiFi", "Jakuzi"]
            }
          ]
        };

        const reviewsData = [
          {
            id: 1,
            user: "Ahmet Yılmaz",
            rating: 5,
            comment: "Harika bir otel, kesinlikle tavsiye ederim!",
            date: "2024-03-15"
          },
          {
            id: 2,
            user: "Ayşe Demir",
            rating: 4,
            comment: "Konumu ve hizmeti çok iyi, tekrar geleceğim.",
            date: "2024-03-10"
          }
        ];

        setHotel(hotelData);
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error fetching hotel details:', error);
        setSnackbar({
          open: true,
          message: 'Otel detayları yüklenirken bir hata oluştu',
          severity: 'error'
        });
      }
    };

    fetchHotelDetails();
  }, [id]);

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? hotel.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === hotel.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleImageClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleBookingOpen = () => {
    setBookingOpen(true);
  };

  const handleBookingClose = () => {
    setBookingOpen(false);
    setBookingSuccess(false);
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    // Burada rezervasyon işlemi yapılacak
    console.log('Rezervasyon bilgileri:', bookingData);
    setBookingSuccess(true);
    setTimeout(() => {
      handleBookingClose();
    }, 3000);
  };

  const handleBookingClick = () => {
    navigate('/payment', {
      state: {
        hotelId: hotel.id,
        hotelName: hotel.name,
        totalPrice: hotel.price,
        roomTypes: hotel.roomTypes,
        checkIn: new Date().toISOString().split('T')[0],
        checkOut: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        guests: 1,
      },
    });
  };

  const handleReviewSubmit = async () => {
    try {
      // API'ye yorum gönderme işlemi
      const review = {
        ...newReview,
        id: Date.now(), // Geçici ID
        hotelId: hotel.id,
        date: new Date().toISOString().split('T')[0],
        user: "Kullanıcı Adı" // Gerçek uygulamada kullanıcı bilgisi kullanılacak
      };

      setReviews([...reviews, review]);
      setSnackbar({
        open: true,
        message: 'Yorumunuz başarıyla eklendi',
        severity: 'success'
      });
      setOpenReviewDialog(false);
      setNewReview({ rating: 0, comment: '' });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Yorum eklenirken bir hata oluştu',
        severity: 'error'
      });
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      // API'ye yorum silme isteği gönderilecek
      setReviews(reviews.filter(review => review.id !== reviewId));
      setSnackbar({
        open: true,
        message: 'Yorumunuz başarıyla silindi',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Yorum silinirken bir hata oluştu',
        severity: 'error'
      });
    }
  };

  const sortedAndFilteredReviews = [...reviews]
    .filter(review => filterRating === 0 || review.rating === filterRating)
    .sort((a, b) => {
      if (sortReviews === 'newest') {
        return new Date(b.date) - new Date(a.date);
      } else if (sortReviews === 'oldest') {
        return new Date(a.date) - new Date(b.date);
      } else if (sortReviews === 'highest') {
        return b.rating - a.rating;
      } else {
        return a.rating - b.rating;
      }
    });

  if (!hotel) {
    return (
      <Container>
        <Typography variant="h5">Yükleniyor...</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      py: 4
    }}>
      <Container maxWidth="lg">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ 
            mb: 2,
            color: 'primary.main',
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.04)'
            }
          }}
        >
          Geri Dön
        </Button>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Box sx={{ 
              position: 'relative',
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: 3
            }}>
              <CardMedia
                component="img"
                height="400"
                image={hotel?.images?.[currentImageIndex] || hotel?.image}
                alt={hotel?.name}
                onClick={handleImageClick}
                sx={{ 
                  cursor: 'pointer',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'scale(1.02)'
                  }
                }}
              />
              <IconButton
                onClick={handlePreviousImage}
                sx={{
                  position: 'absolute',
                  left: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': { 
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    color: 'primary.main'
                  }
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <IconButton
                onClick={handleNextImage}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': { 
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    color: 'primary.main'
                  }
                }}
              >
                <ArrowForwardIcon />
              </IconButton>
            </Box>

            <Box sx={{ 
              mt: 2, 
              display: 'flex', 
              gap: 1, 
              overflowX: 'auto',
              pb: 1
            }}>
              {hotel.images.map((image, index) => (
                <CardMedia
                  key={index}
                  component="img"
                  height="80"
                  image={image}
                  alt={`${hotel.name} - ${index + 1}`}
                  onClick={() => setCurrentImageIndex(index)}
                  sx={{
                    width: 120,
                    cursor: 'pointer',
                    borderRadius: 1,
                    border: currentImageIndex === index ? '2px solid #1976d2' : 'none',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.05)'
                    }
                  }}
                />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ 
              p: 3, 
              height: '100%',
              borderRadius: 2,
              boxShadow: 3,
              backgroundColor: 'white'
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
                  {hotel.name}
                </Typography>
                <IconButton
                  color="error"
                  onClick={() => toggleFavorite(hotel)}
                >
                  {favorites.some((fav) => fav.id === hotel.id) ? (
                    <Favorite />
                  ) : (
                    <FavoriteBorder />
                  )}
                </IconButton>
              </Box>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                {hotel.location}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating value={hotel.rating} precision={0.1} readOnly />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  ({reviews.length} değerlendirme)
                </Typography>
              </Box>
              <Typography variant="h5" color="primary" gutterBottom>
                {hotel.price} TL / gece
              </Typography>
              <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
                {hotel.description}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main' }}>
                  Özellikler:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {hotel.amenities.map((amenity, index) => (
                    <Chip
                      key={index}
                      label={amenity}
                      color="primary"
                      variant="outlined"
                      sx={{
                        '&:hover': {
                          backgroundColor: 'primary.main',
                          color: 'white'
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleBookingClick}
                sx={{ mt: 2 }}
              >
                Rezervasyon Yap
              </Button>
            </Card>
          </Grid>
        </Grid>

        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              overflow: 'hidden'
            }
          }}
        >
          <DialogContent sx={{ p: 0 }}>
            <Box sx={{ position: 'relative' }}>
              <CardMedia
                component="img"
                image={hotel.images[currentImageIndex]}
                alt={hotel.name}
                sx={{ width: '100%', height: 'auto' }}
              />
              <IconButton
                onClick={handlePreviousImage}
                sx={{
                  position: 'absolute',
                  left: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': { 
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    color: 'primary.main'
                  }
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <IconButton
                onClick={handleNextImage}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': { 
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    color: 'primary.main'
                  }
                }}
              >
                <ArrowForwardIcon />
              </IconButton>
            </Box>
          </DialogContent>
        </Dialog>

        {/* Rezervasyon Dialog */}
        <Dialog 
          open={bookingOpen} 
          onClose={handleBookingClose}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              p: 2
            }
          }}
        >
          <DialogTitle sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            pb: 2
          }}>
            <Typography variant="h5" sx={{ color: 'primary.main' }}>
              Rezervasyon Yap
            </Typography>
            <IconButton onClick={handleBookingClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {bookingSuccess ? (
              <Alert severity="success" sx={{ mt: 2 }}>
                Rezervasyonunuz başarıyla alındı! En kısa sürede sizinle iletişime geçeceğiz.
              </Alert>
            ) : (
              <form onSubmit={handleBookingSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Giriş Tarihi"
                      type="date"
                      name="checkIn"
                      value={bookingData.checkIn}
                      onChange={handleBookingChange}
                      InputLabelProps={{ shrink: true }}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Çıkış Tarihi"
                      type="date"
                      name="checkOut"
                      value={bookingData.checkOut}
                      onChange={handleBookingChange}
                      InputLabelProps={{ shrink: true }}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Misafir Sayısı</InputLabel>
                      <Select
                        name="guests"
                        value={bookingData.guests}
                        onChange={handleBookingChange}
                        label="Misafir Sayısı"
                        required
                      >
                        {[1, 2, 3, 4, 5, 6].map(num => (
                          <MenuItem key={num} value={num}>{num} Kişi</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Oda Sayısı</InputLabel>
                      <Select
                        name="rooms"
                        value={bookingData.rooms}
                        onChange={handleBookingChange}
                        label="Oda Sayısı"
                        required
                      >
                        {[1, 2, 3, 4].map(num => (
                          <MenuItem key={num} value={num}>{num} Oda</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Ad Soyad"
                      name="name"
                      value={bookingData.name}
                      onChange={handleBookingChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="E-posta"
                      type="email"
                      name="email"
                      value={bookingData.email}
                      onChange={handleBookingChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Telefon"
                      name="phone"
                      value={bookingData.phone}
                      onChange={handleBookingChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      size="large"
                      sx={{ mt: 2 }}
                    >
                      Rezervasyonu Tamamla
                    </Button>
                  </Grid>
                </Grid>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Yorumlar Bölümü */}
        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" gutterBottom>
              Yorumlar ({reviews.length})
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Comment />}
              onClick={() => setOpenReviewDialog(true)}
              sx={{ 
                borderRadius: 2,
                px: 3,
                py: 1
              }}
            >
              Yorum Yap
            </Button>
          </Box>

          {/* Yorum Filtreleme ve Sıralama */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Sırala</InputLabel>
              <Select
                value={sortReviews}
                onChange={(e) => setSortReviews(e.target.value)}
                label="Sırala"
              >
                <MenuItem value="newest">En Yeni</MenuItem>
                <MenuItem value="oldest">En Eski</MenuItem>
                <MenuItem value="highest">En Yüksek Puan</MenuItem>
                <MenuItem value="lowest">En Düşük Puan</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Filtrele</InputLabel>
              <Select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                label="Filtrele"
              >
                <MenuItem value={0}>Tüm Puanlar</MenuItem>
                <MenuItem value={5}>5 Yıldız</MenuItem>
                <MenuItem value={4}>4 Yıldız</MenuItem>
                <MenuItem value={3}>3 Yıldız</MenuItem>
                <MenuItem value={2}>2 Yıldız</MenuItem>
                <MenuItem value={1}>1 Yıldız</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Divider sx={{ mb: 2 }} />
          {reviews.length === 0 ? (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              Henüz yorum yapılmamış. İlk yorumu siz yapın!
            </Typography>
          ) : (
            sortedAndFilteredReviews.map((review) => (
              <Card key={review.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar sx={{ mr: 2 }}>{review.user[0]}</Avatar>
                      <Box>
                        <Typography variant="subtitle1">{review.user}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {review.date}
                        </Typography>
                      </Box>
                    </Box>
                    {review.user === currentUser && (
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteReview(review.id)}
                        sx={{ 
                          '&:hover': {
                            backgroundColor: 'rgba(211, 47, 47, 0.1)'
                          }
                        }}
                      >
                        <Delete />
                      </IconButton>
                    )}
                  </Box>
                  <Rating value={review.rating} readOnly />
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {review.comment}
                  </Typography>
                </CardContent>
              </Card>
            ))
          )}
        </Box>

        {/* Yorum Yapma Dialog'u */}
        <Dialog 
          open={openReviewDialog} 
          onClose={() => setOpenReviewDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Yorum Yap</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="subtitle1" gutterBottom>
                Puanınız
              </Typography>
              <Rating
                value={newReview.rating}
                onChange={(event, newValue) => setNewReview({ ...newReview, rating: newValue })}
                size="large"
                sx={{ fontSize: '2.5rem' }}
              />
            </Box>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Yorumunuz"
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              sx={{ mt: 2 }}
              placeholder="Otel hakkındaki deneyiminizi paylaşın..."
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenReviewDialog(false)}>İptal</Button>
            <Button 
              onClick={handleReviewSubmit} 
              variant="contained"
              disabled={!newReview.rating || !newReview.comment}
            >
              Gönder
            </Button>
          </DialogActions>
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
      </Container>
    </Box>
  );
};

export default HotelDetail;
