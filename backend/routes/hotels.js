const express = require('express');
const router = express.Router();

// Örnek otel verileri
const hotels = [
  {
    id: 1,
    name: 'Lüks Otel',
    location: 'İstanbul',
    description: 'Merkezi konumda lüks otel',
    rating: 5,
    price: 1500,
    image: 'https://example.com/hotel1.jpg',
    type: 'hotel'
  },
  {
    id: 2,
    name: 'Deniz Manzaralı Villa',
    location: 'Bodrum',
    description: 'Deniz manzaralı özel villa',
    rating: 4,
    price: 2500,
    image: 'https://example.com/villa1.jpg',
    type: 'villa'
  },
  {
    id: 3,
    name: 'Orman Bungalovu',
    location: 'Antalya',
    description: 'Doğa ile iç içe bungalov',
    rating: 4,
    price: 1200,
    image: 'https://example.com/bungalow1.jpg',
    type: 'bungalow'
  },
  {
    id: 4,
    name: 'Butik Otel',
    location: 'İzmir',
    description: 'Şık butik otel',
    rating: 4,
    price: 1000,
    image: 'https://example.com/hotel2.jpg',
    type: 'hotel'
  },
  {
    id: 5,
    name: 'Dağ Evi Villa',
    location: 'Uludağ',
    description: 'Kar manzaralı dağ evi',
    rating: 5,
    price: 3000,
    image: 'https://example.com/villa2.jpg',
    type: 'villa'
  },
  {
    id: 6,
    name: 'Sahil Bungalovu',
    location: 'Çeşme',
    description: 'Sahile sıfır bungalov',
    rating: 4,
    price: 1800,
    image: 'https://example.com/bungalow2.jpg',
    type: 'bungalow'
  },
  {
    id: 7,
    name: 'Termal Otel',
    location: 'Pamukkale',
    description: 'Termal suyu olan otel',
    rating: 4,
    price: 2000,
    image: 'https://example.com/hotel3.jpg',
    type: 'hotel'
  },
  {
    id: 8,
    name: 'Göl Kenarı Villa',
    location: 'Abant',
    description: 'Göl manzaralı villa',
    rating: 5,
    price: 2800,
    image: 'https://example.com/villa3.jpg',
    type: 'villa'
  },
  {
    id: 9,
    name: 'Ağaç Ev Bungalov',
    location: 'Ayvalık',
    description: 'Ağaçların arasında bungalov',
    rating: 4,
    price: 1500,
    image: 'https://example.com/bungalow3.jpg',
    type: 'bungalow'
  },
  {
    id: 10,
    name: 'Tarihi Otel',
    location: 'Safranbolu',
    description: 'Tarihi konak otel',
    rating: 5,
    price: 2200,
    image: 'https://example.com/hotel4.jpg',
    type: 'hotel'
  }
];

// Tüm otelleri getir
router.get('/', (req, res) => {
  res.json(hotels);
});

// Belirli bir oteli getir
router.get('/:id', (req, res) => {
  const hotel = hotels.find(h => h.id === parseInt(req.params.id));
  if (!hotel) {
    return res.status(404).json({ message: 'Otel bulunamadı' });
  }
  res.json(hotel);
});

// Otele ait yorumları getir
router.get('/:id/reviews', (req, res) => {
  const hotelId = parseInt(req.params.id);
  const hotelReviews = [
    {
      id: 1,
      hotelId: hotelId,
      userName: 'Ahmet Y.',
      rating: 4.5,
      comment: 'Harika bir deneyimdi, kesinlikle tekrar geleceğim.',
      date: '2024-04-15'
    },
    {
      id: 2,
      hotelId: hotelId,
      userName: 'Ayşe K.',
      rating: 5,
      comment: 'Mükemmel hizmet, çok temiz ve konforlu.',
      date: '2024-04-14'
    }
  ];
  res.json(hotelReviews);
});

module.exports = router; 