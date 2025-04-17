const express = require('express');
const router = express.Router();

// Örnek geri bildirim verileri
let feedbacks = [];

// Yeni geri bildirim ekle
router.post('/', (req, res) => {
  const { userId, type, title, description } = req.body;

  const newFeedback = {
    id: feedbacks.length + 1,
    userId,
    type, // 'suggestion' veya 'complaint'
    title,
    description,
    status: 'pending',
    createdAt: new Date()
  };

  feedbacks.push(newFeedback);
  res.status(201).json(newFeedback);
});

// Kullanıcının geri bildirimlerini getir
router.get('/user/:userId', (req, res) => {
  const userFeedbacks = feedbacks.filter(feedback => feedback.userId === req.params.userId);
  res.json(userFeedbacks);
});

// Geri bildirim detaylarını getir
router.get('/:id', (req, res) => {
  const feedback = feedbacks.find(f => f.id === parseInt(req.params.id));
  if (!feedback) {
    return res.status(404).json({ message: 'Geri bildirim bulunamadı' });
  }
  res.json(feedback);
});

// Geri bildirim sil
router.delete('/:id', (req, res) => {
  const index = feedbacks.findIndex(f => f.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Geri bildirim bulunamadı' });
  }

  feedbacks.splice(index, 1);
  res.json({ message: 'Geri bildirim silindi' });
});

// Geri bildirim durumunu güncelle
router.put('/:id/status', (req, res) => {
  const feedback = feedbacks.find(f => f.id === parseInt(req.params.id));
  if (!feedback) {
    return res.status(404).json({ message: 'Geri bildirim bulunamadı' });
  }

  const { status } = req.body;
  feedback.status = status;
  res.json(feedback);
});

module.exports = router; 