import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, CardMedia, Button, Rating } from '@mui/material';

const AccommodationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [accommodation, setAccommodation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccommodation = async () => {
      try {
        const response = await fetch(`http://localhost:5002/api/hotels/${id}`);
        if (!response.ok) {
          throw new Error('Tatil yeri bulunamadı');
        }
        const data = await response.json();
        setAccommodation(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAccommodation();
  }, [id]);

  if (loading) return <Typography>Yükleniyor...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!accommodation) return <Typography>Tatil yeri bulunamadı</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardMedia
              component="img"
              height="400"
              image={accommodation.image}
              alt={accommodation.name}
            />
            <CardContent>
              <Typography variant="h4" gutterBottom>
                {accommodation.name}
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {accommodation.location}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating value={accommodation.rating} readOnly />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  {accommodation.rating} Yıldız
                </Typography>
              </Box>
              <Typography variant="body1" paragraph>
                {accommodation.description}
              </Typography>
              <Typography variant="h6" color="primary" gutterBottom>
                {accommodation.price} TL/gece
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Rezervasyon Yap
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => navigate(`/booking/${id}`)}
                sx={{ mt: 2 }}
              >
                Rezervasyon Yap
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AccommodationDetail; 