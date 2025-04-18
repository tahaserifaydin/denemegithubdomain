import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Tatilim
        </Link>

        <div className="menu-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span className={isMenuOpen ? 'fas fa-times' : 'fas fa-bars'} />
        </div>

        <ul className={isMenuOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className="nav-links">
              Ana Sayfa
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/search" className="nav-links">
              Oteller
            </Link>
          </li>
          {user ? (
            <>
              <li className="nav-item">
                <Link to="/favorites" className="nav-links">
                  Favorilerim
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/profile" className="nav-links">
                  Profilim
                </Link>
              </li>
              {user.role === 'admin' && (
                <li className="nav-item">
                  <Link to="/admin" className="nav-links">
                    Admin Panel
                  </Link>
                </li>
              )}
              <li className="nav-item">
                <button className="nav-links logout-btn" onClick={handleLogout}>
                  Çıkış Yap
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-links">
                  Giriş Yap
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-links">
                  Kayıt Ol
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
