import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, CardMedia, Button, TextField, Autocomplete, Rating, Chip, CardActions, MenuItem, Modal, FormControl, InputLabel, Select, IconButton, CircularProgress, AppBar, Toolbar, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import HotelCard from '../components/HotelCard';
import { syncHotelsWithCursorAI, getRecommendations, trackInteraction } from '../services/cursorAI';
import { hotels, cities } from '../data/hotels';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FeedbackIcon from '@mui/icons-material/Feedback';
import { useFavorite } from '../contexts/FavoriteContext';

const Home = () => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorite();
  const [hotels, setHotels] = useState([
    {
      id: 1,
      name: "Grand Luxury Hotel",
      location: "İstanbul, Türkiye",
      rating: 4.8,
      price: 2500,
      type: "hotel",
      description: "Boğaz manzaralı lüks otelimiz, şehrin kalbinde yer almaktadır. Modern odalar, spa merkezi ve dünya mutfağından lezzetler sunan restoranımızla misafirlerimize unutulmaz bir deneyim sunuyoruz.",
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      available: false
    },
    {
      id: 2,
      name: "Seaside Villa",
      location: "Antalya, Türkiye",
      rating: 4.8,
      price: 1500,
      type: "villa",
      description: "Özel plaj erişimi olan lüks villamız, Akdeniz'in muhteşem manzarasını sunar. Özel havuzlu bahçesi ve modern tasarımıyla konforlu bir tatil deneyimi.",
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
      available: true
    },
    {
      id: 3,
      name: "Forest Bungalow",
      location: "İzmir, Türkiye",
      rating: 4.5,
      price: 1200,
      type: "bungalow",
      description: "Ormanın kalbinde, doğayla iç içe bir konaklama deneyimi. Şöminesi ve ahşap dekorasyonuyla sıcak bir atmosfer sunan bungalovumuz, şehrin gürültüsünden uzakta huzurlu bir tatil vaat ediyor.",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      available: true
    },
    {
      id: 4,
      name: "Mountain Villa",
      location: "Bursa, Türkiye",
      rating: 4.6,
      price: 1800,
      type: "villa",
      description: "Uludağ'ın eteklerinde, muhteşem dağ manzarasına sahip lüks villamız. Özel jakuzisi ve şöminesiyle kış tatili için ideal bir konaklama seçeneği.",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      available: false
    },
    {
      id: 5,
      name: "Beach Bungalow",
      location: "Muğla, Türkiye",
      rating: 4.7,
      price: 1500,
      type: "bungalow",
      description: "Ege'nin mavi sularına sıfır konumda, özel plajı olan bungalovumuz. Deniz manzaralı terası ve ahşap dekorasyonuyla sıcak bir atmosfer sunuyor.",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      available: true
    }
  ]);
  const [loading, setLoading] = useState(false);

  const [recommendations, setRecommendations] = useState([]);

  const [searchParams, setSearchParams] = useState({
    hotelName: '',
    city: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    accommodationType: ''
  });

  const [filteredHotels, setFilteredHotels] = useState(hotels);

  const [featuredHotels, setFeaturedHotels] = useState([
    {
      id: 1,
      name: "Grand Luxury Hotel",
      location: "İstanbul, Türkiye",
      price: 2500,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: 2,
      name: "Seaside Resort & Spa",
      location: "Antalya, Türkiye",
      price: 2200,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: 3,
      name: "Boutique City Hotel",
      location: "İzmir, Türkiye",
      price: 1800,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: 4,
      name: "Cappadocia Cave Hotel",
      location: "Nevşehir, Türkiye",
      price: 2000,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: 5,
      name: "Bodrum Beach Resort",
      location: "Muğla, Türkiye",
      price: 2300,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: 6,
      name: "Uludağ Mountain Resort",
      location: "Bursa, Türkiye",
      price: 2200,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: 7,
      name: "Trabzon City Hotel",
      location: "Trabzon, Türkiye",
      price: 1200,
      rating: 4.2,
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: 8,
      name: "Pamukkale Thermal Resort",
      location: "Denizli, Türkiye",
      price: 1800,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: 9,
      name: "Bursa Thermal Spa Resort",
      location: "Bursa, Türkiye",
      price: 1500,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: 10,
      name: "Bursa City Center Hotel",
      location: "Bursa, Türkiye",
      price: 1200,
      rating: 4.3,
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: 11,
      name: "Bursa Green Valley Resort",
      location: "Bursa, Türkiye",
      price: 1800,
      rating: 4.4,
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: 12,
      name: "Bursa Family Resort",
      location: "Bursa, Türkiye",
      price: 2000,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: 13,
      name: "İstanbul Bosphorus Hotel",
      location: "İstanbul, Türkiye",
      price: 2500,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: 14,
      name: "Antalya Beach Resort",
      location: "Antalya, Türkiye",
      price: 2200,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    }
  ]);

  const [selectedHotel, setSelectedHotel] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    roomType: '',
    name: '',
    email: '',
    phone: ''
  });

  const accommodationTypes = [
    { value: 'hotel', label: 'Otel' },
    { value: 'apartment', label: 'Apart' },
    { value: 'resort', label: 'Tatil Köyü' },
    { value: 'hostel', label: 'Pansiyon' }
  ];

  const [filters, setFilters] = useState({
    guests: 1,
    sortBy: 'rating',
    checkIn: '',
    checkOut: ''
  });

  const [favoriteHotels, setFavoriteHotels] = useState(() => {
    const savedFavorites = localStorage.getItem('favoriteHotels');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  const [complaintDialogOpen, setComplaintDialogOpen] = useState(false);
  const [complaintForm, setComplaintForm] = useState({
    name: '',
    email: '',
    hotelName: '',
    rating: 0,
    comment: ''
  });

  useEffect(() => {
    localStorage.setItem('favoriteHotels', JSON.stringify(favoriteHotels));
  }, [favoriteHotels]);

  useEffect(() => {
    // fetchHotels();
  }, []);

  const handleHotelInteraction = async (hotelId, interactionType) => {
    try {
      // Kullanıcı etkileşimini izle
      await trackInteraction('user123', hotelId, interactionType);
      
      // Yeni önerileri al
      const newRecommendations = await getRecommendations({
        // Kullanıcı tercihlerine göre parametreler eklenebilir
      });
      setRecommendations(newRecommendations);
    } catch (error) {
      console.error('Error handling hotel interaction:', error);
    }
  };

  const handleSearch = (city) => {
    if (city) {
      const filtered = hotels.filter(hotel => 
        hotel.location.toLowerCase().includes(city.toLowerCase()) &&
        hotel.price >= searchParams.minPrice &&
        hotel.price <= searchParams.maxPrice &&
        hotel.rating >= searchParams.minRating &&
        hotel.name.toLowerCase().includes(searchParams.hotelName.toLowerCase()) &&
        (!searchParams.accommodationType || hotel.type === searchParams.accommodationType)
      );
      setFilteredHotels(filtered);
    } else {
      const filtered = hotels.filter(hotel => 
        hotel.price >= searchParams.minPrice &&
        hotel.price <= searchParams.maxPrice &&
        hotel.rating >= searchParams.minRating &&
        hotel.name.toLowerCase().includes(searchParams.hotelName.toLowerCase()) &&
        (!searchParams.accommodationType || hotel.type === searchParams.accommodationType)
      );
      setFilteredHotels(filtered);
    }
  };

  const handleHotelClick = (hotelId) => {
    navigate(`/hotels/${hotelId}`);
  };

  const handleBookingClick = (hotel) => {
    if (!hotel.available) {
      alert('Bu konaklama yeri şu anda dolu. Lütfen başka bir konaklama yeri seçiniz.');
      return;
    }

    navigate('/payment', {
      state: {
        hotelId: hotel.id,
        hotelName: hotel.name,
        totalPrice: hotel.price,
        checkIn: new Date(),
        checkOut: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 gün sonrası
        guests: 1
      }
    });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5002/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hotelId: selectedHotel.id,
          ...bookingForm
        }),
      });

      if (response.ok) {
        alert('Rezervasyonunuz başarıyla oluşturuldu!');
        setBookingModalOpen(false);
        setBookingForm({
          checkIn: '',
          checkOut: '',
          guests: 1,
          roomType: '',
          name: '',
          email: '',
          phone: ''
        });
      } else {
        throw new Error('Rezervasyon oluşturulamadı');
      }
    } catch (error) {
      console.error('Rezervasyon hatası:', error);
      alert('Rezervasyon oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    const filtered = hotels.filter(hotel => {
      const matchesLocation = !filters.location || hotel.location === filters.location;
      const matchesType = !filters.type || hotel.type === filters.type;
      const matchesPrice = !filters.priceRange || (
        filters.priceRange === '0-500' && hotel.price <= 500 ||
        filters.priceRange === '500-1000' && hotel.price > 500 && hotel.price <= 1000 ||
        filters.priceRange === '1000+' && hotel.price > 1000
      );
      const matchesGuests = !filters.guests || 
        (hotel.roomTypes && Array.isArray(hotel.roomTypes) && 
         hotel.roomTypes.some(room => room.capacity >= filters.guests));
      const matchesDates = !filters.checkIn || !filters.checkOut || 
        (hotel.available && new Date(hotel.checkIn) <= new Date(filters.checkIn) && 
         new Date(hotel.checkOut) >= new Date(filters.checkOut));
      
      return matchesLocation && matchesType && matchesPrice && matchesGuests && matchesDates;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'priceAsc':
          return a.price - b.price;
        case 'priceDesc':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
    
    setFilteredHotels(filtered);
  }, [filters, hotels]);

  const handleToggleFavorite = (hotelId) => {
    setFavoriteHotels(prev => {
      if (prev.includes(hotelId)) {
        return prev.filter(id => id !== hotelId);
      } else {
        return [...prev, hotelId];
      }
    });
  };

  const handleFavoriteClick = (hotel) => {
    toggleFavorite(hotel);
  };

  const handleSortChange = (event) => {
    setFilters({ ...filters, sortBy: event.target.value });
  };

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5002/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(complaintForm),
      });

      if (response.ok) {
        setComplaintDialogOpen(false);
        setComplaintForm({
          name: '',
          email: '',
          hotelName: '',
          rating: 0,
          comment: ''
        });
        alert('Şikayetiniz başarıyla gönderildi!');
      }
    } catch (error) {
      console.error('Şikayet gönderilirken hata oluştu:', error);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Tatilim
          </Typography>
          <Button
            color="inherit"
            startIcon={<FeedbackIcon />}
            onClick={() => setComplaintDialogOpen(true)}
          >
            Şikayet Yaz
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          background: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '400px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          textAlign: 'center',
          padding: '0 20px',
        }}
      >
        <Typography variant="h3" component="h1" sx={{ mb: 2, fontWeight: 'bold' }}>
          En İyi Fiyatlarla Tatil Yeri Ara
        </Typography>
        <Typography variant="h6" sx={{ mb: 4 }}>
          Binlerce konaklama seçeneğini karşılaştırın ve size en uygun olanı seçin
        </Typography>
      </Box>

      <Box sx={{ 
        maxWidth: 800, 
        mx: 'auto', 
        mt: 4,
        p: 3,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 3
      }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Konaklama Adı"
              value={searchParams.hotelName}
              onChange={(e) => {
                setSearchParams({ ...searchParams, hotelName: e.target.value });
                handleSearch(searchParams.city);
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Autocomplete
              options={cities}
              value={searchParams.city}
              onChange={(event, newValue) => {
                setSearchParams({ ...searchParams, city: newValue });
                handleSearch(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Şehir Seçin"
                  fullWidth
                  variant="outlined"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Minimum Fiyat"
              type="number"
              value={searchParams.minPrice}
              onChange={(e) => {
                setSearchParams({ ...searchParams, minPrice: Number(e.target.value) });
                handleSearch(searchParams.city);
              }}
              variant="outlined"
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Maksimum Fiyat"
              type="number"
              value={searchParams.maxPrice}
              onChange={(e) => {
                setSearchParams({ ...searchParams, maxPrice: Number(e.target.value) });
                handleSearch(searchParams.city);
              }}
              variant="outlined"
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Minimum Puan"
              type="number"
              value={searchParams.minRating}
              onChange={(e) => {
                setSearchParams({ ...searchParams, minRating: Number(e.target.value) });
                handleSearch(searchParams.city);
              }}
              variant="outlined"
              InputProps={{ inputProps: { min: 0, max: 5, step: 0.1 } }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              select
              label="Konaklama Tipi"
              value={searchParams.accommodationType}
              onChange={(e) => {
                setSearchParams({ ...searchParams, accommodationType: e.target.value });
                handleSearch(searchParams.city);
              }}
              variant="outlined"
            >
              {accommodationTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Misafir Sayısı</InputLabel>
              <Select
                value={filters.guests}
                onChange={(e) => setFilters({ ...filters, guests: e.target.value })}
                label="Misafir Sayısı"
              >
                <MenuItem value={1}>1 Kişi</MenuItem>
                <MenuItem value={2}>2 Kişi</MenuItem>
                <MenuItem value={3}>3 Kişi</MenuItem>
                <MenuItem value={4}>4 Kişi</MenuItem>
                <MenuItem value={5}>5+ Kişi</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Sıralama</InputLabel>
              <Select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                label="Sıralama"
              >
                <MenuItem value="rating">En çok beğenilenden en az beğenilene</MenuItem>
                <MenuItem value="priceAsc">Fiyat (Düşükten Yükseğe)</MenuItem>
                <MenuItem value="priceDesc">Fiyat (Yüksekten Düşüğe)</MenuItem>
                <MenuItem value="name">İsme Göre (A-Z)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              type="date"
              label="Giriş Tarihi"
              value={filters.checkIn}
              onChange={(e) => setFilters({ ...filters, checkIn: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              type="date"
              label="Çıkış Tarihi"
              value={filters.checkOut}
              onChange={(e) => setFilters({ ...filters, checkOut: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              onClick={() => handleSearch(searchParams.city)}
              sx={{ mt: 2 }}
            >
              Tatil Ara
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {hotels.map((hotel) => (
              <Grid item xs={12} sm={6} md={4} key={hotel.id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={hotel.image}
                    alt={hotel.name}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {hotel.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {hotel.location}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {hotel.price} TL
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Rating value={hotel.rating} readOnly precision={0.5} />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        ({hotel.rating})
                      </Typography>
                    </Box>
                    <Typography variant="body2" color={hotel.available ? "success.main" : "error.main"}>
                      {hotel.available ? "Müsait" : "Dolu"}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary" onClick={() => handleHotelClick(hotel.id)}>
                      Detaylar
                    </Button>
                    <Button
                      size="small"
                      color="primary"
                      variant="contained"
                      onClick={() => handleBookingClick(hotel)}
                      disabled={!hotel.available}
                    >
                      Rezervasyon Yap
                    </Button>
                    <IconButton 
                      color={favorites.some(f => f.id === hotel.id) ? "error" : "default"}
                      onClick={() => handleFavoriteClick(hotel)}
                    >
                      {favorites.some(f => f.id === hotel.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <Modal
        open={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        aria-labelledby="booking-modal-title"
        aria-describedby="booking-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2
        }}>
          <Typography id="booking-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
            {selectedHotel?.name} - Rezervasyon
          </Typography>
          <form onSubmit={handleBookingSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ad Soyad"
                  name="name"
                  value={bookingForm.name}
                  onChange={handleFormChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="E-posta"
                  name="email"
                  type="email"
                  value={bookingForm.email}
                  onChange={handleFormChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Telefon"
                  name="phone"
                  value={bookingForm.phone}
                  onChange={handleFormChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Oda Tipi</InputLabel>
                  <Select
                    name="roomType"
                    value={bookingForm.roomType}
                    onChange={handleFormChange}
                    required
                  >
                    {selectedHotel?.roomTypes?.map((room) => (
                      <MenuItem key={room.id} value={room.id}>
                        {room.name} - {room.price} TL
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Giriş Tarihi"
                  name="checkIn"
                  type="date"
                  value={bookingForm.checkIn}
                  onChange={handleFormChange}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Çıkış Tarihi"
                  name="checkOut"
                  type="date"
                  value={bookingForm.checkOut}
                  onChange={handleFormChange}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Misafir Sayısı"
                  name="guests"
                  type="number"
                  value={bookingForm.guests}
                  onChange={handleFormChange}
                  required
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Rezervasyon Yap
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>

      <Dialog open={complaintDialogOpen} onClose={() => setComplaintDialogOpen(false)}>
        <DialogTitle>Şikayet ve Yorum Yaz</DialogTitle>
        <DialogContent>
          <form onSubmit={handleComplaintSubmit}>
            <TextField
              autoFocus
              margin="dense"
              label="Adınız"
              fullWidth
              value={complaintForm.name}
              onChange={(e) => setComplaintForm({ ...complaintForm, name: e.target.value })}
              required
            />
            <TextField
              margin="dense"
              label="E-posta"
              type="email"
              fullWidth
              value={complaintForm.email}
              onChange={(e) => setComplaintForm({ ...complaintForm, email: e.target.value })}
              required
            />
            <TextField
              margin="dense"
              label="Otel Adı"
              fullWidth
              value={complaintForm.hotelName}
              onChange={(e) => setComplaintForm({ ...complaintForm, hotelName: e.target.value })}
              required
            />
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 2 }}>
              <Typography>Değerlendirme:</Typography>
              <Rating
                value={complaintForm.rating}
                onChange={(e, newValue) => setComplaintForm({ ...complaintForm, rating: newValue })}
              />
            </Box>
            <TextField
              margin="dense"
              label="Yorumunuz"
              multiline
              rows={4}
              fullWidth
              value={complaintForm.comment}
              onChange={(e) => setComplaintForm({ ...complaintForm, comment: e.target.value })}
              required
            />
            <DialogActions>
              <Button onClick={() => setComplaintDialogOpen(false)}>İptal</Button>
              <Button type="submit" variant="contained" color="primary">
                Gönder
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Home;
