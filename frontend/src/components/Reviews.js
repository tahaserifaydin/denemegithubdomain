import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import './Reviews.css';

const Reviews = ({ hotelId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: ''
  });
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, [hotelId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`http://localhost:5002/api/reviews/${hotelId}`);
      const data = await response.json();
      setReviews(data);
      setLoading(false);
    } catch (err) {
      setError('Yorumlar yüklenirken bir hata oluştu.');
      setLoading(false);
    }
  };

  const handleRatingClick = (rating) => {
    setNewReview(prev => ({ ...prev, rating }));
  };

  const handleRatingHover = (rating) => {
    setHoverRating(rating);
  };

  const handleRatingLeave = () => {
    setHoverRating(0);
  };

  const handleCommentChange = (e) => {
    setNewReview(prev => ({ ...prev, comment: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5002/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hotelId,
          ...newReview
        }),
      });

      if (response.ok) {
        setNewReview({ rating: 0, comment: '' });
        fetchReviews();
      } else {
        setError('Yorum gönderilirken bir hata oluştu.');
      }
    } catch (err) {
      setError('Yorum gönderilirken bir hata oluştu.');
    }
  };

  if (loading) return <div className="loading">Yükleniyor...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="reviews-container">
      <h2>Misafir Yorumları</h2>

      <form onSubmit={handleSubmit} className="review-form">
        <h3>Yorum Yap</h3>
        <div className="rating-input">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              className={`star-button ${(hoverRating || newReview.rating) >= rating ? 'active' : ''}`}
              onClick={() => handleRatingClick(rating)}
              onMouseEnter={() => handleRatingHover(rating)}
              onMouseLeave={handleRatingLeave}
            >
              <FaStar />
            </button>
          ))}
        </div>
        <textarea
          value={newReview.comment}
          onChange={handleCommentChange}
          placeholder="Deneyiminizi paylaşın..."
          required
        />
        <button type="submit" className="submit-button">
          Yorumu Gönder
        </button>
      </form>

      <div className="reviews-divider" />

      {reviews.length === 0 ? (
        <p className="no-reviews">Henüz yorum yapılmamış.</p>
      ) : (
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review._id} className="review-card">
              <div className="review-header">
                <div className="user-avatar">
                  {review.user.name.charAt(0).toUpperCase()}
                </div>
                <div className="review-info">
                  <h4>{review.user.name}</h4>
                  <div className="rating-display">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={`star ${star <= review.rating ? 'filled' : ''}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="review-comment">{review.comment}</p>
              <span className="review-date">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews; 