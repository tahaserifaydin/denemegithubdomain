const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const hotelsRouter = require('./routes/hotels');
const bookingsRouter = require('./routes/bookings');
const reviewsRoutes = require('./routes/reviews');
const favoritesRoutes = require('./routes/favorites');
const campaignsRoutes = require('./routes/campaigns');
const feedbackRoutes = require('./routes/feedback');
const complaintsRoutes = require('./routes/complaints');

app.use('/api/auth', authRoutes);
app.use('/api/hotels', hotelsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/campaigns', campaignsRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/complaints', complaintsRoutes);

// Rezervasyon işlemleri için endpoint
app.post('/api/bookings', (req, res) => {
  const { hotelId, checkIn, checkOut, guests, roomType, name, email, phone } = req.body;
  
  // Burada veritabanına kayıt işlemi yapılacak
  // Şimdilik sadece başarılı yanıt dönüyoruz
  res.status(200).json({
    success: true,
    message: 'Rezervasyon başarıyla oluşturuldu',
    booking: {
      hotelId,
      checkIn,
      checkOut,
      guests,
      roomType,
      name,
      email,
      phone,
      bookingDate: new Date().toISOString()
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Bir şeyler ters gitti!' });
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});
