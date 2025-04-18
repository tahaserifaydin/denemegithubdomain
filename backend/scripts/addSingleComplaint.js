const mongoose = require('mongoose');
const Complaint = require('../models/Complaint');

const singleComplaint = {
    name: "Ayşe Kaya",
    email: "ayse@example.com",
    hotelName: "Sunset Resort",
    rating: 4,
    comment: "Otel çok güzeldi, özellikle plajı muhteşemdi. Personel çok yardımcı oldu. Tek eksisi kahvaltının biraz geç servis edilmesiydi."
};

mongoose.connect('mongodb://localhost:27017/tatilim', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log('MongoDB bağlantısı başarılı');
    
    // Önce tüm şikayetleri temizleyelim
    await Complaint.deleteMany({});
    console.log('Eski şikayetler temizlendi');
    
    // Yeni şikayeti ekleyelim
    return Complaint.create(singleComplaint);
})
.then(() => {
    console.log('Yeni şikayet başarıyla eklendi');
    mongoose.connection.close();
})
.catch((error) => {
    console.error('Hata:', error);
    mongoose.connection.close();
}); 