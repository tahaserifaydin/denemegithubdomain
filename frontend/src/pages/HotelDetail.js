import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight, FaTimes, FaHeart, FaRegHeart, FaComment, FaTrash, FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import { useFavorite } from '../contexts/FavoriteContext';
import '../styles/HotelDetail.css';

const HotelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorite();
  const [hotel, setHotel] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    rooms: 1,
    name: '',
    email: '',
    phone: '',
    specialRequests: '',
  });
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
  });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHotelDetails();
    fetchReviews();
  }, [id]);

  const fetchHotelDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5002/api/hotels/${id}`);
      const data = await response.json();
      setHotel(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading hotel details:', error);
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(`http://localhost:5002/api/hotels/${id}/reviews`);
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? hotel.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === hotel.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleImageClick = () => {
    setShowImageDialog(true);
  };

  const handleCloseDialog = () => {
    setShowImageDialog(false);
  };

  const handleBookingOpen = () => {
    setShowBookingDialog(true);
  };

  const handleBookingClose = () => {
    setShowBookingDialog(false);
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5002/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hotelId: id,
          ...bookingData,
        }),
      });

      if (response.ok) {
        setAlert({ type: 'success', message: 'Booking successful!' });
        handleBookingClose();
        setTimeout(() => setAlert(null), 3000);
      } else {
        throw new Error('Booking failed');
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Error making booking. Please try again.' });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5002/api/hotels/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newReview),
      });

      if (response.ok) {
        setAlert({ type: 'success', message: 'Review submitted successfully!' });
        setNewReview({ rating: 0, comment: '' });
        fetchReviews();
        setTimeout(() => setAlert(null), 3000);
      } else {
        throw new Error('Failed to submit review');
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Error submitting review. Please try again.' });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await fetch(`http://localhost:5002/api/hotels/${id}/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAlert({ type: 'success', message: 'Review deleted successfully!' });
        fetchReviews();
        setTimeout(() => setAlert(null), 3000);
      } else {
        throw new Error('Failed to delete review');
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Error deleting review. Please try again.' });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="stars" />);
      } else if (i - 0.5 <= rating) {
        stars.push(<FaStar key={i} className="stars" style={{ opacity: 0.5 }} />);
      } else {
        stars.push(<FaStar key={i} className="stars" style={{ opacity: 0.2 }} />);
      }
    }
    return stars;
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!hotel) {
    return <div className="error">Hotel not found</div>;
  }

  return (
    <div className="hotel-detail-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </button>

      <div className="hotel-header">
        <h1 className="hotel-title">{hotel.name}</h1>
        <div className="hotel-location">
          <FaMapMarkerAlt />
          <span>{hotel.location}</span>
        </div>
        <div className="hotel-rating">
          <div className="rating-stars">
            {renderStars(hotel.rating)}
          </div>
          <span className="rating-value">({hotel.rating})</span>
        </div>
        <div className="hotel-price">
          ${hotel.price}
          <span className="price-period"> / night</span>
        </div>
      </div>

      <div className="hotel-images">
        <img
          src={hotel.images[currentImageIndex]}
          alt={`${hotel.name} - Image ${currentImageIndex + 1}`}
          className="main-image"
          onClick={handleImageClick}
        />
        <button className="image-nav prev-button" onClick={handlePreviousImage}>
          <FaArrowLeft />
        </button>
        <button className="image-nav next-button" onClick={handleNextImage}>
          <FaArrowRight />
        </button>
      </div>

      {showImageDialog && (
        <div className="image-dialog" onClick={handleCloseDialog}>
          <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={handleCloseDialog}>
              <FaTimes />
            </button>
            <img
              src={hotel.images[currentImageIndex]}
              alt={`${hotel.name} - Image ${currentImageIndex + 1}`}
              className="dialog-image"
            />
          </div>
        </div>
      )}

      <div className="hotel-description">
        <p>{hotel.description}</p>
      </div>

      <div className="hotel-amenities">
        <h2 className="amenities-title">Amenities</h2>
        <div className="amenities-list">
          {hotel.amenities.map((amenity, index) => (
            <span key={index} className="amenity-chip">
              {amenity}
            </span>
          ))}
        </div>
      </div>

      <div className="booking-section">
        <button className="booking-button" onClick={handleBookingOpen}>
          Book Now
        </button>
      </div>

      {showBookingDialog && (
        <div className="booking-dialog" onClick={handleBookingClose}>
          <div className="booking-form" onClick={(e) => e.stopPropagation()}>
            <h2 className="booking-title">Book Your Stay</h2>
            <form onSubmit={handleBookingSubmit}>
              <div className="form-group">
                <label className="form-label">Check-in Date</label>
                <input
                  type="date"
                  name="checkIn"
                  value={bookingData.checkIn}
                  onChange={handleBookingChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Check-out Date</label>
                <input
                  type="date"
                  name="checkOut"
                  value={bookingData.checkOut}
                  onChange={handleBookingChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Number of Guests</label>
                <select
                  name="guests"
                  value={bookingData.guests}
                  onChange={handleBookingChange}
                  className="form-select"
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Number of Rooms</label>
                <select
                  name="rooms"
                  value={bookingData.rooms}
                  onChange={handleBookingChange}
                  className="form-select"
                >
                  {[1, 2, 3, 4].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Room' : 'Rooms'}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={bookingData.name}
                  onChange={handleBookingChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={bookingData.email}
                  onChange={handleBookingChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={bookingData.phone}
                  onChange={handleBookingChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Special Requests</label>
                <textarea
                  name="specialRequests"
                  value={bookingData.specialRequests}
                  onChange={handleBookingChange}
                  className="form-input"
                  rows="4"
                />
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={handleBookingClose}>
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Book Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="reviews-section">
        <h2 className="reviews-title">Reviews</h2>
        <div className="review-form">
          <h3 className="review-title">Write a Review</h3>
          <form onSubmit={handleReviewSubmit}>
            <div className="review-rating">
              {renderStars(newReview.rating)}
              <span className="rating-value">({newReview.rating})</span>
            </div>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              placeholder="Share your experience..."
              className="review-textarea"
              required
            />
            <button type="submit" className="review-submit">
              Submit Review
            </button>
          </form>
        </div>

        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="reviewer-info">
                  <img
                    src={review.userAvatar || '/default-avatar.png'}
                    alt={review.userName}
                    className="reviewer-avatar"
                  />
                  <div>
                    <div className="reviewer-name">{review.userName}</div>
                    <div className="review-date">{new Date(review.date).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="rating-stars">
                  {renderStars(review.rating)}
                </div>
              </div>
              <p className="review-content">{review.comment}</p>
              <div className="review-actions">
                <button
                  className="delete-button"
                  onClick={() => handleDeleteReview(review.id)}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {alert && (
        <div className={`alert ${alert.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {alert.message}
        </div>
      )}
    </div>
  );
};

export default HotelDetail;
