import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box, Paper } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const BookingSuccess = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <CheckCircleIcon
          color="success"
          sx={{ fontSize: 80, mb: 2 }}
        />
        <Typography variant="h4" component="h1" gutterBottom>
          Rezervasyonunuz Başarıyla Tamamlandı!
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Rezervasyon detaylarınız e-posta adresinize gönderilmiştir.
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/')}
            sx={{ mr: 2 }}
          >
            Ana Sayfaya Dön
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate('/my-bookings')}
          >
            Rezervasyonlarımı Görüntüle
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default BookingSuccess; 