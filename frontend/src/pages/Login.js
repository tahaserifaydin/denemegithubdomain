import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { 
  Login as LoginIcon, 
  Google as GoogleIcon, 
  Facebook as FacebookIcon,
  Visibility, 
  VisibilityOff,
  PersonAdd
} from '@mui/icons-material';
import '../styles/AuthStyles.css';
import logo from '../assets/logo.svg';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Admin kontrolü
      if (formData.email === 'admin@gmail.com' && formData.password === '123123') {
        navigate('/admin');
        return;
      }

      // Normal kullanıcı kontrolü
      if (formData.email !== 'test@test.com') {
        setOpenModal(true);
        return;
      }

      // TODO: Implement actual API call for login
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        navigate('/');
      } else {
        setError('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="auth-container">
      <Paper elevation={0} className="auth-card">
        <Box className="auth-header">
          <Typography component="h1" variant="h4" className="auth-title">
            Giriş Yap
          </Typography>
          <Typography component="h2" variant="h5" className="auth-subtitle">
            Tatilim'e Hoş Geldiniz
          </Typography>
        </Box>

        <Box className="auth-form">
          {error && (
            <Alert severity="error" className="auth-error">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              className="auth-input"
              required
              fullWidth
              id="email"
              label="E-posta Adresi"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
            />
            <TextField
              className="auth-input"
              required
              fullWidth
              name="password"
              label="Şifre"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
            <Box sx={{ textAlign: 'right', mt: 1, mb: 2 }}>
              <Link component={RouterLink} to="/forgot-password" variant="body2" className="auth-link">
                Şifrenizi mi unuttunuz?
              </Link>
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="auth-button"
            >
              Giriş Yap
            </Button>
            
            <div className="auth-divider">veya</div>
            
            <Box className="social-buttons">
              <Button
                variant="contained"
                className="social-button google-button"
                startIcon={<GoogleIcon />}
              >
                Google
              </Button>
              <Button
                variant="contained"
                className="social-button facebook-button"
                startIcon={<FacebookIcon />}
              >
                Facebook
              </Button>
            </Box>
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link component={RouterLink} to="/register" variant="body2" className="auth-link">
                Hesabınız yok mu? Üye olun
              </Link>
            </Box>
          </form>
        </Box>
      </Paper>

      {/* Üye olmayan kullanıcılar için modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: '12px',
            padding: '1rem',
            maxWidth: '450px'
          }
        }}
      >
        <DialogTitle id="alert-dialog-title" sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.5rem' }}>
          {"Hesap Bulunamadı"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <PersonAdd sx={{ fontSize: '4rem', color: '#1976d2' }} />
          </Box>
          <DialogContentText id="alert-dialog-description" sx={{ textAlign: 'center', mb: 2 }}>
            Bu e-posta adresi ile kayıtlı bir hesap bulunamadı. Tatilim'de yeni misiniz? Hemen üye olun ve harika tatil fırsatlarını keşfedin!
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ display: 'flex', flexDirection: 'column', gap: 1, padding: '1rem' }}>
          <Button 
            onClick={handleRegister} 
            variant="contained" 
            fullWidth
            sx={{ 
              borderRadius: '8px', 
              padding: '0.75rem',
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0'
              }
            }}
          >
            Üye Ol
          </Button>
          <Button 
            onClick={handleCloseModal} 
            variant="outlined" 
            fullWidth
            sx={{ 
              borderRadius: '8px', 
              padding: '0.75rem',
              borderColor: '#1976d2',
              color: '#1976d2',
              '&:hover': {
                borderColor: '#1565c0',
                backgroundColor: 'rgba(25, 118, 210, 0.04)'
              }
            }}
          >
            Tekrar Dene
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Login;
