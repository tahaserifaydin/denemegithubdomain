import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/campaigns');
      if (!response.ok) {
        throw new Error('Kampanyalar yüklenirken bir hata oluştu');
      }
      const data = await response.json();
      setCampaigns(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleCampaignClick = (hotelId) => {
    navigate(`/hotels/${hotelId}`);
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
      <Typography variant="h4" gutterBottom>
        Özel Kampanyalar
      </Typography>

      <Grid container spacing={3}>
        {campaigns.map((campaign) => (
          <Grid item xs={12} md={6} key={campaign.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 6,
                },
              }}
              onClick={() => handleCampaignClick(campaign.hotelId)}
            >
              <CardMedia
                component="img"
                height="200"
                image={campaign.image}
                alt={campaign.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div">
                  {campaign.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {campaign.description}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={`%${campaign.discount} İndirim`}
                    color="primary"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={campaign.validUntil}
                    color="secondary"
                    variant="outlined"
                  />
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCampaignClick(campaign.hotelId);
                  }}
                >
                  Kampanyayı İncele
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Campaigns; 