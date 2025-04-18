const mongoose = require('mongoose');
const Complaint = require('../models/Complaint');

const testComplaint = {
    name: "Test Kullanıcı",
    email: "test@example.com",
    hotelName: "Test Otel",
    rating: 3,
    comment: "Bu bir test şikayetidir. Otel genel olarak iyiydi ama bazı eksiklikler vardı."
};

mongoose.connect('mongodb://localhost:27017/tatilim', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('MongoDB bağlantısı başarılı');
    return Complaint.create(testComplaint);
})
.then(() => {
    console.log('Test şikayeti başarıyla eklendi');
    mongoose.connection.close();
})
.catch((error) => {
    console.error('Hata:', error);
    mongoose.connection.close();
}); 