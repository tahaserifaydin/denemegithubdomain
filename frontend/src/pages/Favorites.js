import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Box,
  IconButton,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useFavorite } from '../contexts/FavoriteContext';

const Favorites = () => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorite();

  const handleHotelClick = (hotelId) => {
    navigate(`/hotel/${hotelId}`);
  };

  const handleBookingClick = (hotel) => {
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

  if (favorites.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Favorilerim
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh',
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Henüz favori otel eklemediniz.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => navigate('/')}
          >
            Otelleri Keşfet
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Favorilerim
      </Typography>
      <Grid container spacing={4}>
        {favorites.map((hotel) => (
          <Grid item key={hotel.id} xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={hotel.image}
                alt={hotel.name}
                onClick={() => handleHotelClick(hotel.id)}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {hotel.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {hotel.location}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {hotel.price} TL / gece
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => handleBookingClick(hotel)}
                >
                  Rezervasyon Yap
                </Button>
                <IconButton
                  color="error"
                  onClick={() => toggleFavorite(hotel)}
                  sx={{ ml: 'auto' }}
                >
                  <FavoriteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Favorites;
