const mongoose = require('mongoose');
const Complaint = require('../models/Complaint');

const sampleComplaints = [
    {
        name: "Ahmet Yılmaz",
        email: "ahmet@example.com",
        hotelName: "İstanbul Bosphorus Hotel",
        rating: 2,
        comment: "Otel temizliği çok kötüydü. Odamızda böcekler vardı ve personel yardımcı olmadı."
    },
    {
        name: "Ayşe Demir",
        email: "ayse@example.com",
        hotelName: "Antalya Beach Resort",
        rating: 3,
        comment: "Havuz temizliği yetersizdi ve yemekler çok yağlıydı. Fiyatına göre beklentilerimi karşılamadı."
    },
    {
        name: "Mehmet Kaya",
        email: "mehmet@example.com",
        hotelName: "Bodrum Paradise Hotel",
        rating: 1,
        comment: "Rezervasyon yaptığımız oda başka birine verilmişti. 2 saat lobide bekledik. Çok kötü bir deneyimdi."
    },
    {
        name: "Zeynep Şahin",
        email: "zeynep@example.com",
        hotelName: "Cappadocia Cave Hotel",
        rating: 4,
        comment: "Otel güzeldi ama internet bağlantısı çok yavaştı. Personel çok yardımcı oldu."
    },
    {
        name: "Mustafa Öztürk",
        email: "mustafa@example.com",
        hotelName: "İzmir Seaside Hotel",
        rating: 2,
        comment: "Oda servisi çok yavaştı ve yemekler soğuk geldi. Fiyatına göre kalitesiz bir otel."
    }
];

mongoose.connect('mongodb://localhost:27017/tatilim', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('MongoDB bağlantısı başarılı');
    return Complaint.insertMany(sampleComplaints);
})
.then(() => {
    console.log('Örnek şikayetler başarıyla eklendi');
    mongoose.connection.close();
})
.catch((error) => {
    console.error('Hata:', error);
    mongoose.connection.close();
}); 