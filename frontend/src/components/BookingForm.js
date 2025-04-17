import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import trLocale from 'date-fns/locale/tr';

function BookingForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [booking, setBooking] = useState({
    checkIn: null,
    checkOut: null,
    guests: 1,
    roomType: '',
  });

  useEffect(() => {
    fetchHotel();
  }, [id]);

  const fetchHotel = async () => {
    try {
      const response = await fetch(`http://localhost:5002/api/hotels/${id}`);
      if (!response.ok) {
        throw new Error('Otel bilgileri yüklenirken bir hata oluştu');
      }
      const data = await response.json();
      setHotel(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('Rezervasyon yapmak için giriş yapmalısınız');
      navigate('/login');
      return;
    }

    // Ödeme sayfasına yönlendir
    navigate('/payment', {
      state: {
        hotelId: id,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guests: booking.guests,
        roomType: booking.roomType,
        hotelName: hotel.name,
        totalPrice: hotel.price * booking.guests
      }
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography>Yükleniyor...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {hotel.name} - Rezervasyon
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          {hotel.location}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} locale={trLocale}>
                <DatePicker
                  label="Giriş Tarihi"
                  value={booking.checkIn}
                  onChange={(newValue) => {
                    setBooking({ ...booking, checkIn: newValue });
                  }}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                  minDate={new Date()}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} locale={trLocale}>
                <DatePicker
                  label="Çıkış Tarihi"
                  value={booking.checkOut}
                  onChange={(newValue) => {
                    setBooking({ ...booking, checkOut: newValue });
                  }}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                  minDate={booking.checkIn || new Date()}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Misafir Sayısı"
                type="number"
                value={booking.guests}
                onChange={(e) => setBooking({ ...booking, guests: parseInt(e.target.value) })}
                required
                inputProps={{ min: 1, max: 10 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Oda Tipi</InputLabel>
                <Select
                  value={booking.roomType}
                  onChange={(e) => setBooking({ ...booking, roomType: e.target.value })}
                  label="Oda Tipi"
                >
                  {hotel && hotel.roomTypes ? (
                    hotel.roomTypes.map((type) => (
                      <MenuItem key={type.id} value={type.name}>
                        {type.name} - {type.price} TL
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>Yükleniyor...</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                <Typography variant="h6">
                  Toplam Tutar: {hotel.price * booking.guests} TL
                </Typography>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  Rezervasyonu Tamamla
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}

export default BookingForm; 