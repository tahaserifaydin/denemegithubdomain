import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Rating,
  TextField,
  Button,
  Card,
  CardContent,
  Avatar,
  Divider,
} from '@mui/material';
import { useParams } from 'react-router-dom';

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { hotelId } = useParams();

  useEffect(() => {
    fetchReviews();
  }, [hotelId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/hotels/${hotelId}/reviews`);
      if (!response.ok) {
        throw new Error('Yorumlar yüklenirken bir hata oluştu');
      }
      const data = await response.json();
      setReviews(data);
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
      alert('Yorum yapmak için giriş yapmalısınız');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/hotels/${hotelId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newReview),
      });

      if (!response.ok) {
        throw new Error('Yorum eklenirken bir hata oluştu');
      }

      const data = await response.json();
      setReviews([...reviews, data]);
      setNewReview({ rating: 0, comment: '' });
    } catch (err) {
      setError(err.message);
    }
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Değerlendirmeler
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom>
          Değerlendirmenizi Yazın
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Rating
            value={newReview.rating}
            onChange={(event, newValue) => {
              setNewReview({ ...newReview, rating: newValue });
            }}
          />
        </Box>
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          placeholder="Yorumunuzu yazın..."
          value={newReview.comment}
          onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" color="primary">
          Yorum Yap
        </Button>
      </Box>

      <Divider sx={{ my: 3 }} />

      {reviews.length === 0 ? (
        <Typography>Henüz yorum yapılmamış.</Typography>
      ) : (
        reviews.map((review) => (
          <Card key={review.id} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ mr: 2 }}>{review.userName[0]}</Avatar>
                <Box>
                  <Typography variant="subtitle1">{review.userName}</Typography>
                  <Rating value={review.rating} readOnly size="small" />
                </Box>
              </Box>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {review.comment}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(review.date).toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
}

export default Reviews; 