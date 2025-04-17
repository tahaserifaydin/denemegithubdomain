import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [iban, setIban] = useState('');
  const [error, setError] = useState(null);
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    roomType: ''
  });

  const {
    hotelId,
    hotelName,
    totalPrice,
    roomTypes,
    checkIn: initialCheckIn,
    checkOut: initialCheckOut,
    guests: initialGuests
  } = location.state || {};

  if (!location.state) {
    return (
      <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
        <Alert severity="error">Rezervasyon bilgileri bulunamadı.</Alert>
      </Box>
    );
  }

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('Ödeme yapmak için giriş yapmalısınız');
      navigate('/login');
      return;
    }

    try {
      // Önce ödeme işlemini gerçekleştir
      const paymentData = {
        paymentMethod,
        amount: totalPrice,
        ...(paymentMethod === 'creditCard' && {
          cardNumber,
          cardHolder: cardName,
          expiryDate,
          cvv
        }),
        ...(paymentMethod === 'bankTransfer' && {
          bankName,
          accountHolder: accountNumber,
          iban
        })
      };

      const paymentResponse = await fetch('http://localhost:5002/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      });

      if (!paymentResponse.ok) {
        throw new Error('Ödeme işlemi başarısız oldu');
      }

      const paymentResult = await paymentResponse.json();

      // Ödeme başarılıysa rezervasyonu oluştur
      const bookingData = {
        hotelId,
        checkIn: bookingData.checkIn || initialCheckIn,
        checkOut: bookingData.checkOut || initialCheckOut,
        guests: bookingData.guests || initialGuests,
        roomType: bookingData.roomType,
        paymentId: paymentResult.paymentId
      };

      const bookingResponse = await fetch('http://localhost:5002/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      if (!bookingResponse.ok) {
        throw new Error('Rezervasyon oluşturulurken bir hata oluştu');
      }

      const bookingResult = await bookingResponse.json();
      alert('Rezervasyonunuz ve ödemeniz başarıyla tamamlandı!');
      navigate('/my-bookings');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Ödeme
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          {hotelName}
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6">Rezervasyon Detayları</Typography>
          <Typography>Giriş: {new Date(initialCheckIn).toLocaleDateString('tr-TR')}</Typography>
          <Typography>Çıkış: {new Date(initialCheckOut).toLocaleDateString('tr-TR')}</Typography>
          <Typography>Misafir Sayısı: {initialGuests}</Typography>
          <Typography>Toplam Tutar: {totalPrice} TL</Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Rezervasyon Bilgileri
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ad Soyad"
                name="name"
                value={bookingData.name}
                onChange={handleBookingChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="E-posta"
                name="email"
                type="email"
                value={bookingData.email}
                onChange={handleBookingChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Telefon"
                name="phone"
                value={bookingData.phone}
                onChange={handleBookingChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Misafir Sayısı"
                name="guests"
                type="number"
                value={bookingData.guests}
                onChange={handleBookingChange}
                required
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Giriş Tarihi"
                name="checkIn"
                type="date"
                value={bookingData.checkIn}
                onChange={handleBookingChange}
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
                value={bookingData.checkOut}
                onChange={handleBookingChange}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Oda Tipi</InputLabel>
                <Select
                  name="roomType"
                  value={bookingData.roomType}
                  onChange={handleBookingChange}
                  required
                >
                  {roomTypes && roomTypes.map((room) => (
                    <MenuItem key={room.id} value={room.id}>
                      {room.name} - {room.price} TL
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Ödeme Bilgileri
              </Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <FormControlLabel
                    value="creditCard"
                    control={<Radio />}
                    label="Kredi/Banka Kartı ile Öde"
                  />
                  <FormControlLabel
                    value="bankTransfer"
                    control={<Radio />}
                    label="Havale/EFT ile Öde"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            {paymentMethod === 'creditCard' ? (
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Kart Numarası"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          required
                          inputProps={{ maxLength: 16 }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Kart Üzerindeki İsim"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          required
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Son Kullanma Tarihi (AA/YY)"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                          required
                          inputProps={{ maxLength: 5 }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="CVV"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          required
                          inputProps={{ maxLength: 3 }}
                          type="password"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ) : (
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Banka Adı"
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          required
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Hesap Sahibi"
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value)}
                          required
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="IBAN"
                          value={iban}
                          onChange={(e) => setIban(e.target.value)}
                          required
                          inputProps={{ maxLength: 26 }}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                <Typography variant="h6">
                  Toplam Tutar: {totalPrice} TL
                </Typography>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  Ödemeyi Tamamla
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}

export default Payment; 