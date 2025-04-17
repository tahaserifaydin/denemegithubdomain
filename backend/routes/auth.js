const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Örnek kullanıcı verileri
let users = [];

// Kayıt ol
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Email kontrolü
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'Bu email adresi zaten kullanımda' });
  }

  // Şifreyi hashle
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: users.length + 1,
    name,
    email,
    password: hashedPassword,
    createdAt: new Date()
  };

  users.push(newUser);
  res.status(201).json({ message: 'Kullanıcı başarıyla oluşturuldu' });
});

// Giriş yap
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Kullanıcıyı bul
  const user = users.find(user => user.email === email);
  if (!user) {
    return res.status(400).json({ message: 'Geçersiz email veya şifre' });
  }

  // Şifreyi kontrol et
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json({ message: 'Geçersiz email veya şifre' });
  }

  // JWT token oluştur
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    'your-secret-key', // Gerçek uygulamada bu değer environment variable'dan alınmalı
    { expiresIn: '24h' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
});

// Kullanıcı bilgilerini getir
router.get('/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Yetkilendirme başarısız' });
  }

  try {
    const decoded = jwt.verify(token, 'your-secret-key');
    const user = users.find(u => u.id === decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email
    });
  } catch (error) {
    res.status(401).json({ message: 'Geçersiz token' });
  }
});

module.exports = router; 