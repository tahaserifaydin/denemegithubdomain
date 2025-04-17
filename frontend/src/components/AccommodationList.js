import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Grid, TextField, MenuItem, Box } from '@mui/material';

const AccommodationList = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [accommodationType, setAccommodationType] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const response = await fetch('http://localhost:5002/api/hotels');
        if (!response.ok) {
          throw new Error('Tatil yerleri yüklenemedi');
        }
        const data = await response.json();
        setAccommodations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAccommodations();
  }, []);

  const filteredAccommodations = accommodations.filter(accommodation => {
    const matchesSearch = accommodation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         accommodation.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = accommodationType === 'all' || accommodation.type === accommodationType;
    return matchesSearch && matchesType;
  });

  if (loading) return <Typography>Yükleniyor...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          label="Tatil Yeri Ara"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flex: 2 }}
        />
        <TextField
          select
          label="Konaklama Türü"
          value={accommodationType}
          onChange={(e) => setAccommodationType(e.target.value)}
          sx={{ flex: 1 }}
        >
          <MenuItem value="all">Tümü</MenuItem>
          <MenuItem value="hotel">Otel</MenuItem>
          <MenuItem value="villa">Villa</MenuItem>
          <MenuItem value="bungalow">Bungalov</MenuItem>
        </TextField>
      </Box>

      <Grid container spacing={3}>
        {filteredAccommodations.map((accommodation) => (
          <Grid item xs={12} sm={6} md={4} key={accommodation.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.02)',
                  transition: 'transform 0.2s ease-in-out'
                }
              }}
              onClick={() => navigate(`/accommodation/${accommodation.id}`)}
            >
              <CardMedia
                component="img"
                height="200"
                image={accommodation.image}
                alt={accommodation.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div">
                  {accommodation.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {accommodation.location}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {accommodation.type === 'hotel' ? 'Otel' : accommodation.type === 'villa' ? 'Villa' : 'Bungalov'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {accommodation.rating} Yıldız
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {accommodation.price} TL/gece
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AccommodationList; 