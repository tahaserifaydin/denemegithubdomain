const express = require('express');
const router = express.Router();

// Örnek değerlendirme verileri
let reviews = [];

// Yeni değerlendirme ekle
router.post('/', (req, res) => {
  const { hotelId, userId, rating, comment } = req.body;
  
  const newReview = {
    id: reviews.length + 1,
    hotelId,
    userId,
    rating,
    comment,
    createdAt: new Date()
  };

  reviews.push(newReview);
  res.status(201).json(newReview);
});

// Otelin değerlendirmelerini getir
router.get('/hotel/:hotelId', (req, res) => {
  const hotelReviews = reviews.filter(review => review.hotelId === req.params.hotelId);
  res.json(hotelReviews);
});

// Kullanıcının değerlendirmelerini getir
router.get('/user/:userId', (req, res) => {
  const userReviews = reviews.filter(review => review.userId === req.params.userId);
  res.json(userReviews);
});

// Değerlendirmeyi güncelle
router.put('/:id', (req, res) => {
  const review = reviews.find(r => r.id === parseInt(req.params.id));
  if (!review) {
    return res.status(404).json({ message: 'Değerlendirme bulunamadı' });
  }

  const { rating, comment } = req.body;
  review.rating = rating;
  review.comment = comment;
  res.json(review);
});

// Değerlendirmeyi sil
router.delete('/:id', (req, res) => {
  const index = reviews.findIndex(r => r.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Değerlendirme bulunamadı' });
  }

  reviews.splice(index, 1);
  res.json({ message: 'Değerlendirme silindi' });
});

module.exports = router; 