import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Rating,
  Alert,
  Paper,
} from '@mui/material';

function Feedback() {
  const [feedback, setFeedback] = useState({
    name: '',
    email: '',
    rating: 0,
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5002/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedback),
      });

      if (!response.ok) {
        throw new Error('Geri bildirim gönderilirken bir hata oluştu');
      }

      setSubmitted(true);
      setFeedback({
        name: '',
        email: '',
        rating: 0,
        message: '',
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedback({ ...feedback, [name]: value });
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Geri Bildirim
        </Typography>
        <Typography variant="body1" paragraph>
          Görüşleriniz bizim için değerli. Lütfen deneyiminizi bizimle paylaşın.
        </Typography>

        {submitted && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Geri bildiriminiz için teşekkür ederiz!
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Adınız"
            name="name"
            value={feedback.name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="E-posta"
            name="email"
            type="email"
            value={feedback.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Box sx={{ my: 2 }}>
            <Typography component="legend">Genel Değerlendirme</Typography>
            <Rating
              name="rating"
              value={feedback.rating}
              onChange={(event, newValue) => {
                setFeedback({ ...feedback, rating: newValue });
              }}
            />
          </Box>
          <TextField
            fullWidth
            label="Mesajınız"
            name="message"
            multiline
            rows={4}
            value={feedback.message}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 2 }}
          >
            Gönder
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default Feedback; 