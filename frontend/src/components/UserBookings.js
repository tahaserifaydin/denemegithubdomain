import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await axios.get(`http://localhost:5001/api/bookings/user/${userId}`);
        setBookings(response.data);
        setLoading(false);
      } catch (err) {
        setError('Rezervasyonlar alınamadı');
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    try {
      await axios.put(`http://localhost:5001/api/bookings/${bookingId}/cancel`);
      setBookings(bookings.map(booking => 
        booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
      ));
    } catch (err) {
      setError('Rezervasyon iptal edilemedi');
    }
  };

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Rezervasyonlarım</h1>
      
      <div className="space-y-4">
        {bookings.map(booking => (
          <div key={booking.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">{booking.hotelName}</h2>
                <p className="text-gray-600">{booking.roomType}</p>
                <div className="mt-2">
                  <p>Giriş: {format(new Date(booking.checkIn), 'dd MMMM yyyy', { locale: tr })}</p>
                  <p>Çıkış: {format(new Date(booking.checkOut), 'dd MMMM yyyy', { locale: tr })}</p>
                  <p>Misafir Sayısı: {booking.guests}</p>
                  <p>Toplam Fiyat: {booking.totalPrice} TL</p>
                  <p>Ödeme Yöntemi: {
                    booking.paymentMethod === 'credit_card' ? 'Kredi Kartı' : 'Banka Havalesi'
                  }</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {booking.status === 'confirmed' ? 'Onaylandı' :
                   booking.status === 'cancelled' ? 'İptal Edildi' :
                   'Beklemede'}
                </span>
                {booking.status === 'confirmed' && (
                  <button
                    onClick={() => handleCancel(booking.id)}
                    className="mt-2 text-red-600 hover:text-red-800"
                  >
                    İptal Et
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {bookings.length === 0 && (
        <div className="text-center text-gray-500">
          Henüz rezervasyonunuz bulunmamaktadır.
        </div>
      )}
    </div>
  );
};

export default UserBookings; 