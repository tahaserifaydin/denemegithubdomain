import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>
            We are dedicated to providing the best hotel booking experience for our customers.
            Find your perfect stay with our extensive collection of hotels worldwide.
          </p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/hotels">Hotels</Link></li>
            <li><Link to="/campaigns">Campaigns</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Us</h3>
          <div className="contact-info">
            <p>Email: info@hotelbooking.com</p>
            <p>Phone: +1 234 567 8900</p>
            <p>Address: 123 Hotel Street, City, Country</p>
          </div>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook className="social-icon" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter className="social-icon" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="social-icon" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="social-icon" />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Hotel Booking. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
