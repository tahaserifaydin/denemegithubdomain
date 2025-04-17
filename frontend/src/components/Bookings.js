import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const Bookings = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    paymentMethod: 'credit_card'
  });
  const [availability, setAvailability] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/hotels/${hotelId}`);
        setHotel(response.data);
        setLoading(false);
      } catch (err) {
        setError('Otel bilgileri alınamadı');
        setLoading(false);
      }
    };

    fetchHotel();
  }, [hotelId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const checkAvailability = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/bookings/availability/${hotelId}`, {
        params: {
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          roomType: selectedRoom?.type
        }
      });
      setAvailability(response.data.isAvailable);
    } catch (err) {
      setError('Müsaitlik kontrolü yapılamadı');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const bookingData = {
        userId: localStorage.getItem('userId'),
        hotelId,
        roomType: selectedRoom.type,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guests: parseInt(formData.guests),
        totalPrice: selectedRoom.price * 
          Math.ceil((new Date(formData.checkOut) - new Date(formData.checkIn)) / (1000 * 60 * 60 * 24)),
        paymentMethod: formData.paymentMethod
      };

      await axios.post('http://localhost:5001/api/bookings', bookingData);
      navigate('/bookings');
    } catch (err) {
      setError('Rezervasyon oluşturulamadı');
    }
  };

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!hotel) return <div>Otel bulunamadı</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{hotel.name} - Rezervasyon</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <img 
            src={hotel.image} 
            alt={hotel.name} 
            className="w-full h-64 object-cover rounded-lg"
          />
          <div className="mt-4">
            <h2 className="text-xl font-semibold">Oda Seçimi</h2>
            <div className="space-y-4 mt-2">
              {hotel.rooms.map(room => (
                <div 
                  key={room.type}
                  className={`p-4 border rounded-lg cursor-pointer ${
                    selectedRoom?.type === room.type ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedRoom(room)}
                >
                  <h3 className="font-semibold">{room.type}</h3>
                  <p>Kapasite: {room.capacity} kişi</p>
                  <p>Fiyat: {room.price} TL/gece</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Giriş Tarihi</label>
              <input
                type="date"
                name="checkIn"
                value={formData.checkIn}
                onChange={handleInputChange}
                min={format(new Date(), 'yyyy-MM-dd')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Çıkış Tarihi</label>
              <input
                type="date"
                name="checkOut"
                value={formData.checkOut}
                onChange={handleInputChange}
                min={formData.checkIn || format(new Date(), 'yyyy-MM-dd')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Misafir Sayısı</label>
              <input
                type="number"
                name="guests"
                value={formData.guests}
                onChange={handleInputChange}
                min="1"
                max={selectedRoom?.capacity || 4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Ödeme Yöntemi</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="credit_card">Kredi Kartı</option>
                <option value="bank_transfer">Banka Havalesi</option>
              </select>
            </div>

            {selectedRoom && formData.checkIn && formData.checkOut && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold">Rezervasyon Özeti</h3>
                <p>Oda: {selectedRoom.type}</p>
                <p>Giriş: {format(new Date(formData.checkIn), 'dd MMMM yyyy', { locale: tr })}</p>
                <p>Çıkış: {format(new Date(formData.checkOut), 'dd MMMM yyyy', { locale: tr })}</p>
                <p>Toplam Fiyat: {
                  selectedRoom.price * 
                  Math.ceil((new Date(formData.checkOut) - new Date(formData.checkIn)) / (1000 * 60 * 60 * 24))
                } TL</p>
              </div>
            )}

            {!availability && (
              <div className="text-red-500">
                Seçilen tarihlerde müsait oda bulunmamaktadır.
              </div>
            )}

            <button
              type="submit"
              disabled={!selectedRoom || !availability}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              Rezervasyon Yap
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Bookings; 