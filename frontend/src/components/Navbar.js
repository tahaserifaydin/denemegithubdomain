import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaHotel, FaHeart, FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          TATİLİM
        </Link>

        <button className="menu-icon" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Ana Sayfa
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/hotels" className="nav-link">
              <FaHotel className="nav-icon" />
              Oteller
            </Link>
          </li>
          {isAuthenticated && (
            <>
              <li className="nav-item">
                <Link to="/favorites" className="nav-link">
                  <FaHeart className="nav-icon" />
                  Favoriler
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/profile" className="nav-link">
                  <FaUser className="nav-icon" />
                  Profil
                </Link>
              </li>
            </>
          )}
          {isAdmin && (
            <li className="nav-item">
              <Link to="/admin" className="nav-link">
                Admin Panel
              </Link>
            </li>
          )}
          {!isAuthenticated ? (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link login-btn">
                  Giriş Yap
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link register-btn">
                  Kayıt Ol
                </Link>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <button onClick={handleLogout} className="nav-link logout-btn">
                Çıkış Yap
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
