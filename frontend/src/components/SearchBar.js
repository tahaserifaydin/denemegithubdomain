import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaUser } from 'react-icons/fa';
import '../styles/SearchBar.css';

const SearchBar = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    const searchParams = new URLSearchParams({
      location,
      checkIn,
      checkOut,
      guests: guests.toString()
    });
    navigate(`/search?${searchParams.toString()}`);
  };

  const handleGuestChange = (value) => {
    const newValue = Math.max(1, Math.min(10, value));
    setGuests(newValue);
  };

  return (
    <form className="search-bar" onSubmit={handleSearch}>
      <div className="search-input">
        <FaMapMarkerAlt className="input-icon" />
        <input
          type="text"
          placeholder="Nereye gitmek istersiniz?"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <div className="search-input">
        <FaCalendarAlt className="input-icon" />
        <input
          type="date"
          placeholder="Giriş Tarihi"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
        />
      </div>

      <div className="search-input">
        <FaCalendarAlt className="input-icon" />
        <input
          type="date"
          placeholder="Çıkış Tarihi"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
        />
      </div>

      <div className="search-input guest-input">
        <FaUser className="input-icon" />
        <div
          className="guest-selector"
          onClick={() => setShowGuestDropdown(!showGuestDropdown)}
        >
          <span>{guests} Misafir</span>
        </div>
        {showGuestDropdown && (
          <div className="guest-dropdown">
            <button
              type="button"
              onClick={() => handleGuestChange(guests - 1)}
              disabled={guests <= 1}
            >
              -
            </button>
            <span>{guests}</span>
            <button
              type="button"
              onClick={() => handleGuestChange(guests + 1)}
              disabled={guests >= 10}
            >
              +
            </button>
          </div>
        )}
      </div>

      <button type="submit" className="search-button">
        <FaSearch />
        Ara
      </button>
    </form>
  );
};

export default SearchBar;
