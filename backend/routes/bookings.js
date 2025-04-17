const express = require('express');
const router = express.Router();

// Örnek rezervasyon verileri
let bookings = [];

// Yeni rezervasyon oluştur
router.post('/', (req, res) => {
  const { userId, hotelId, roomType, checkIn, checkOut, guests, totalPrice, paymentMethod } = req.body;

  const newBooking = {
    id: bookings.length + 1,
    userId,
    hotelId,
    roomType,
    checkIn,
    checkOut,
    guests,
    totalPrice,
    paymentMethod,
    status: 'confirmed',
    createdAt: new Date()
  };

  bookings.push(newBooking);
  res.status(201).json(newBooking);
});

// Kullanıcının rezervasyonlarını getir
router.get('/user/:userId', (req, res) => {
  const userBookings = bookings.filter(booking => booking.userId === req.params.userId);
  res.json(userBookings);
});

// Rezervasyon detaylarını getir
router.get('/:id', (req, res) => {
  const booking = bookings.find(b => b.id === parseInt(req.params.id));
  if (!booking) {
    return res.status(404).json({ message: 'Rezervasyon bulunamadı' });
  }
  res.json(booking);
});

// Rezervasyonu iptal et
router.put('/:id/cancel', (req, res) => {
  const booking = bookings.find(b => b.id === parseInt(req.params.id));
  if (!booking) {
    return res.status(404).json({ message: 'Rezervasyon bulunamadı' });
  }

  booking.status = 'cancelled';
  booking.cancelledAt = new Date();
  res.json(booking);
});

// Ödeme yöntemini güncelle
router.put('/:id/payment', (req, res) => {
  const booking = bookings.find(b => b.id === parseInt(req.params.id));
  if (!booking) {
    return res.status(404).json({ message: 'Rezervasyon bulunamadı' });
  }

  const { paymentMethod } = req.body;
  booking.paymentMethod = paymentMethod;
  res.json(booking);
});

// Müsaitlik kontrolü
router.get('/availability/:hotelId', (req, res) => {
  const { checkIn, checkOut, roomType } = req.query;
  
  // Bu kısım gerçek uygulamada daha detaylı kontrol edilmeli
  const conflictingBookings = bookings.filter(booking => 
    booking.hotelId === parseInt(req.params.hotelId) &&
    booking.roomType === roomType &&
    (
      (new Date(checkIn) >= new Date(booking.checkIn) && new Date(checkIn) <= new Date(booking.checkOut)) ||
      (new Date(checkOut) >= new Date(booking.checkIn) && new Date(checkOut) <= new Date(booking.checkOut))
    )
  );

  const isAvailable = conflictingBookings.length === 0;
  res.json({ isAvailable });
});

module.exports = router; 