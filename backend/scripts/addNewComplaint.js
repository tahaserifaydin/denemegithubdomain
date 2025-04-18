const mongoose = require('mongoose');
const Complaint = require('../models/Complaint');

const newComplaint = {
    name: "Mehmet Demir",
    email: "mehmet@example.com",
    hotelName: "Blue Hotel",
    rating: 5,
    comment: "Harika bir otel, kesinlikle tavsiye ederim. Personel çok ilgili ve odalar çok temiz."
};

async function addComplaint() {
    try {
        console.log('MongoDB bağlantısı başlatılıyor...');
        await mongoose.connect('mongodb://localhost:27017/tatilim', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB bağlantısı başarılı');

        // Önce tüm şikayetleri temizleyelim
        console.log('Eski şikayetler temizleniyor...');
        await Complaint.deleteMany({});
        console.log('Eski şikayetler temizlendi');

        // Yeni şikayeti ekleyelim
        console.log('Yeni şikayet ekleniyor...');
        const complaint = await Complaint.create(newComplaint);
        console.log('Yeni şikayet başarıyla eklendi:', complaint);

        // Şikayetleri kontrol edelim
        const allComplaints = await Complaint.find();
        console.log('Tüm şikayetler:', allComplaints);

        await mongoose.connection.close();
        console.log('MongoDB bağlantısı kapatıldı');
    } catch (error) {
        console.error('Hata:', error);
        await mongoose.connection.close();
    }
}

addComplaint(); 