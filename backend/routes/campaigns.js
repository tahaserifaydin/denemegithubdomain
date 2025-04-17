const express = require('express');
const router = express.Router();

// Örnek kampanya verileri
let campaigns = [];

// Yeni kampanya ekle
router.post('/', (req, res) => {
  const { title, description, discount, startDate, endDate, hotels } = req.body;

  const newCampaign = {
    id: campaigns.length + 1,
    title,
    description,
    discount,
    startDate,
    endDate,
    hotels,
    createdAt: new Date()
  };

  campaigns.push(newCampaign);
  res.status(201).json(newCampaign);
});

// Tüm kampanyaları getir
router.get('/', (req, res) => {
  res.json(campaigns);
});

// Belirli bir kampanyayı getir
router.get('/:id', (req, res) => {
  const campaign = campaigns.find(c => c.id === parseInt(req.params.id));
  if (!campaign) {
    return res.status(404).json({ message: 'Kampanya bulunamadı' });
  }
  res.json(campaign);
});

// Kampanya güncelle
router.put('/:id', (req, res) => {
  const index = campaigns.findIndex(c => c.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Kampanya bulunamadı' });
  }

  campaigns[index] = {
    ...campaigns[index],
    ...req.body,
    updatedAt: new Date()
  };
  res.json(campaigns[index]);
});

// Kampanya sil
router.delete('/:id', (req, res) => {
  const index = campaigns.findIndex(c => c.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Kampanya bulunamadı' });
  }

  campaigns.splice(index, 1);
  res.json({ message: 'Kampanya silindi' });
});

module.exports = router; 