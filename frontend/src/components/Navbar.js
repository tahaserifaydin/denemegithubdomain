import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Select,
  Badge,
} from '@mui/material';
import {
  AccountCircle,
  Favorite,
  Language,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { hotels } from '../data/hotels';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [language, setLanguage] = useState('tr');
  const [favoriteAnchorEl, setFavoriteAnchorEl] = useState(null);
  const [favoriteHotels, setFavoriteHotels] = useState([]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
    // TODO: Implement language change functionality
  };

  const handleFavoriteClick = (event) => {
    setFavoriteAnchorEl(event.currentTarget);
  };

  const handleFavoriteClose = () => {
    setFavoriteAnchorEl(null);
  };

  const handleHotelClick = (hotelId) => {
    handleFavoriteClose();
    navigate(`/hotels/${hotelId}`);
  };

  const isLoggedIn = localStorage.getItem('token');

  return (
    <AppBar position="static" sx={{ backgroundColor: 'white', color: 'black', boxShadow: 'none' }}>
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'black',
            fontWeight: 'bold',
            '&:hover': {
              color: 'primary.main',
            },
          }}
        >
          Tatilim
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Select
            value={language}
            onChange={handleLanguageChange}
            size="small"
            sx={{ color: 'black', '& .MuiSelect-icon': { color: 'black' } }}
          >
            <MenuItem value="tr">TR</MenuItem>
            <MenuItem value="en">EN</MenuItem>
          </Select>

          <Button
            component={RouterLink}
            to="/hotels"
            color="inherit"
          >
            Tatilim
          </Button>

          {isLoggedIn && (
            <Button
              component={RouterLink}
              to="/my-bookings"
              color="inherit"
            >
              Rezervasyonlarım
            </Button>
          )}

          <Button
            component={RouterLink}
            to="/login"
            color="inherit"
            variant="outlined"
            sx={{
              borderColor: 'black',
              borderRadius: '8px',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                borderColor: 'black'
              }
            }}
          >
            Giriş Yap
          </Button>

          <Button
            component={RouterLink}
            to="/register"
            color="inherit"
            sx={{
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
              }
            }}
          >
            Üye Ol
          </Button>

          <IconButton
            component={RouterLink}
            to="/favorites"
            color="inherit"
            onClick={handleFavoriteClick}
            sx={{ color: 'black' }}
          >
            <Badge badgeContent={favoriteHotels.length} color="error">
              <Favorite />
            </Badge>
          </IconButton>

          <Menu
            anchorEl={favoriteAnchorEl}
            open={Boolean(favoriteAnchorEl)}
            onClose={handleFavoriteClose}
            PaperProps={{
              sx: {
                width: 300,
                maxHeight: 400,
              },
            }}
          >
            {favoriteHotels.length === 0 ? (
              <MenuItem disabled>
                <Typography variant="body2" color="text.secondary">
                  Henüz favori otel eklenmemiş
                </Typography>
              </MenuItem>
            ) : (
              favoriteHotels.map((hotelId) => {
                const hotel = hotels.find(h => h.id === hotelId);
                return (
                  <MenuItem
                    key={hotelId}
                    onClick={() => handleHotelClick(hotelId)}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: 1,
                      py: 1,
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      {hotel.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {hotel.location}
                    </Typography>
                    <Typography variant="body2" color="primary">
                      {hotel.price} TL / gece
                    </Typography>
                  </MenuItem>
                );
              })
            )}
          </Menu>

          <IconButton
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem component={RouterLink} to="/profile" onClick={handleClose}>
              Profilim
            </MenuItem>
            <MenuItem component={RouterLink} to="/bookings" onClick={handleClose}>
              Rezervasyonlarım
            </MenuItem>
            <MenuItem onClick={handleClose}>
              Çıkış Yap
            </MenuItem>
          </Menu>

          <Button color="inherit" component={RouterLink} to="/admin">
            Admin Paneli
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
