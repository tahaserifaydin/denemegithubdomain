import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { FavoriteProvider } from './contexts/FavoriteContext';
import './styles/App.css';
import './styles/TatilStyles.css';
import './styles/AuthStyles.css';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import SearchResults from './pages/SearchResults';
import HotelDetail from './pages/HotelDetail';
import Payment from './pages/Payment';
import BookingSuccess from './pages/BookingSuccess';
import AdminPanel from './pages/AdminPanel';
import Complaints from './pages/Complaints';

function App() {
  return (
    <FavoriteProvider>
      <AuthProvider>
        <Router>
          <div className="app">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/hotels/:id" element={<HotelDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/booking-success" element={<BookingSuccess />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/complaints" element={<Complaints />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </FavoriteProvider>
  );
}

export default App;
