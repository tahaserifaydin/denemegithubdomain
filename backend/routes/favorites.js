const express = require('express');
const router = express.Router();

// Örnek favori verileri
let favorites = [];

// Favori ekle
router.post('/', (req, res) => {
  const { userId, hotelId } = req.body;
  
  // Eğer zaten favorilerde varsa hata döndür
  const existingFavorite = favorites.find(f => f.userId === userId && f.hotelId === hotelId);
  if (existingFavorite) {
    return res.status(400).json({ message: 'Bu otel zaten favorilerinizde' });
  }

  const newFavorite = {
    id: favorites.length + 1,
    userId,
    hotelId,
    createdAt: new Date()
  };

  favorites.push(newFavorite);
  res.status(201).json(newFavorite);
});

// Kullanıcının favorilerini getir
router.get('/user/:userId', (req, res) => {
  const userFavorites = favorites.filter(favorite => favorite.userId === req.params.userId);
  res.json(userFavorites);
});

// Favoriyi kaldır
router.delete('/:id', (req, res) => {
  const index = favorites.findIndex(f => f.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Favori bulunamadı' });
  }

  favorites.splice(index, 1);
  res.json({ message: 'Favori kaldırıldı' });
});

// Belirli bir otelin favori olup olmadığını kontrol et
router.get('/check/:userId/:hotelId', (req, res) => {
  const isFavorite = favorites.some(f => f.userId === req.params.userId && f.hotelId === req.params.hotelId);
  res.json({ isFavorite });
});

module.exports = router; 