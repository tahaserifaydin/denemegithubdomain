import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Rating,
  Button,
  TextField,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  LocationOn,
  Star,
  Favorite,
  FavoriteBorder,
  FilterList,
  Search,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const HotelList = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    minPrice: 0,
    maxPrice: 5000,
    rating: 0,
    sortBy: 'price',
  });
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/hotels');
      const data = await response.json();
      setHotels(data);
      setLoading(false);
    } catch (error) {
      console.error('Otel verileri yüklenirken hata oluştu:', error);
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.location) queryParams.append('location', filters.location);
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
      if (filters.rating) queryParams.append('rating', filters.rating);

      const response = await fetch(`http://localhost:3000/api/hotels/search?${queryParams}`);
      const data = await response.json();
      setHotels(data);
    } catch (error) {
      console.error('Arama yapılırken hata oluştu:', error);
    }
  };

  const handleHotelClick = (hotelId) => {
    navigate(`/hotel/${hotelId}`);
  };

  const handleToggleFavorite = (hotelId) => {
    // Favori işlemleri burada yapılacak
    console.log('Favoriye eklendi:', hotelId);
  };

  if (loading) {
    return (
      <Container>
        <Typography>Yükleniyor...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Arama ve Filtreler */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Konum"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              InputProps={{
                startAdornment: <LocationOn sx={{ mr: 1, color: 'action.active' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Search />}
              onClick={handleSearch}
            >
              Ara
            </Button>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filtreler
            </Button>
          </Grid>
        </Grid>

        {/* Filtre Paneli */}
        {showFilters && (
          <Box sx={{ mt: 3, p: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Typography gutterBottom>Fiyat Aralığı</Typography>
                <Slider
                  value={[filters.minPrice, filters.maxPrice]}
                  onChange={(_, newValue) => {
                    handleFilterChange('minPrice', newValue[0]);
                    handleFilterChange('maxPrice', newValue[1]);
                  }}
                  valueLabelDisplay="auto"
                  min={0}
                  max={5000}
                  step={100}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">₺{filters.minPrice}</Typography>
                  <Typography variant="body2">₺{filters.maxPrice}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography gutterBottom>Minimum Puan</Typography>
                <Rating
                  value={filters.rating}
                  onChange={(_, newValue) => handleFilterChange('rating', newValue)}
                  precision={0.5}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Sıralama</InputLabel>
                  <Select
                    value={filters.sortBy}
                    label="Sıralama"
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  >
                    <MenuItem value="price">Fiyata Göre</MenuItem>
                    <MenuItem value="rating">Puana Göre</MenuItem>
                    <MenuItem value="name">İsme Göre</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>

      {/* Otel Listesi */}
      <Grid container spacing={3}>
        {hotels.map((hotel) => (
          <Grid item xs={12} key={hotel.id}>
            <Card
              sx={{
                display: 'flex',
                height: 200,
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 6,
                },
              }}
              onClick={() => handleHotelClick(hotel.id)}
            >
              <CardMedia
                component="img"
                sx={{ width: 300 }}
                image={hotel.image}
                alt={hotel.name}
              />
              <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="h6" component="div">
                      {hotel.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOn fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {hotel.location}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating value={hotel.rating} precision={0.1} readOnly size="small" />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        ({hotel.rating})
                      </Typography>
                    </Box>
                  </Box>
                  <Tooltip title="Favorilere Ekle">
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(hotel.id);
                      }}
                    >
                      <FavoriteBorder />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Stack direction="row" spacing={1} sx={{ mt: 1, mb: 2 }}>
                  {hotel.amenities.slice(0, 3).map((amenity, index) => (
                    <Chip
                      key={index}
                      label={amenity}
                      size="small"
                      sx={{ backgroundColor: 'primary.light', color: 'white' }}
                    />
                  ))}
                  {hotel.amenities.length > 3 && (
                    <Chip
                      label={`+${hotel.amenities.length - 3}`}
                      size="small"
                      sx={{ backgroundColor: 'grey.200' }}
                    />
                  )}
                </Stack>

                <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" color="primary">
                    ₺{hotel.price}
                    <Typography component="span" variant="body2" color="text.secondary">
                      {' '}/ gece
                    </Typography>
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleHotelClick(hotel.id);
                    }}
                  >
                    Detayları Gör
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HotelList;
