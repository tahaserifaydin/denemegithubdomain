import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import theme from './theme';
import './styles/App.css';
import './styles/TatilStyles.css';
import './styles/AuthStyles.css';
import { Typography } from '@mui/material';
import { FavoriteProvider } from './contexts/FavoriteContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AccommodationList from './components/AccommodationList';
import AccommodationDetail from './components/AccommodationDetail';
import BookingForm from './components/BookingForm';
import UserBookings from './components/UserBookings';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import SearchResults from './pages/SearchResults';
import Reviews from './components/Reviews';
import Campaigns from './components/Campaigns';
import Feedback from './components/Feedback';
import HotelDetail from './pages/HotelDetail';
import Payment from './pages/Payment';
import BookingSuccess from './pages/BookingSuccess';
import AdminPanel from './pages/AdminPanel';
import Complaints from './pages/Complaints';

function App() {
  return (
    <FavoriteProvider>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <CssBaseline />
            <Router>
              <div className="app">
                <Navbar />
                <main>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/hotels/:id" element={<HotelDetail />} />
                    <Route path="/hotels/:id/book" element={<BookingForm />} />
                    <Route path="/accommodations" element={<AccommodationList />} />
                    <Route path="/accommodation/:id" element={<AccommodationDetail />} />
                    <Route path="/booking/:id" element={<BookingForm />} />
                    <Route path="/campaigns" element={<Campaigns />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/my-bookings" element={<UserBookings />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/reviews" element={<Reviews />} />
                    <Route path="/feedback" element={<Feedback />} />
                    <Route path="/payment" element={<Payment />} />
                    <Route path="/booking-success" element={<BookingSuccess />} />
                    <Route path="/admin" element={<AdminPanel />} />
                    <Route path="/complaints" element={<Complaints />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </Router>
          </LocalizationProvider>
        </AuthProvider>
      </ThemeProvider>
    </FavoriteProvider>
  );
}

export default App;
