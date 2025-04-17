import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const HotelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/hotels/${id}`);
        setHotel(response.data);
        setLoading(false);
      } catch (err) {
        setError('Otel bilgileri alınamadı');
        setLoading(false);
      }
    };

    fetchHotel();
  }, [id]);

  const handleBooking = () => {
    navigate(`/bookings/${id}`);
  };

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!hotel) return <div>Otel bulunamadı</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <img 
            src={hotel.image} 
            alt={hotel.name} 
            className="w-full h-64 object-cover rounded-lg"
          />
          <div className="mt-4">
            <h1 className="text-3xl font-bold">{hotel.name}</h1>
            <p className="text-gray-600">{hotel.location}</p>
            <div className="flex items-center mt-2">
              <span className="text-yellow-400">★</span>
              <span className="ml-1">{hotel.rating}</span>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Oda Tipleri</h2>
            <div className="space-y-4">
              {hotel.rooms.map(room => (
                <div key={room.type} className="border p-4 rounded-lg">
                  <h3 className="font-semibold">{room.type}</h3>
                  <p>Kapasite: {room.capacity} kişi</p>
                  <p>Fiyat: {room.price} TL/gece</p>
                </div>
              ))}
            </div>
            <button
              onClick={handleBooking}
              className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Rezervasyon Yap
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Otel Hakkında</h2>
        <p className="text-gray-700">{hotel.description}</p>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Olanaklar</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {hotel.amenities.map((amenity, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded-lg text-center">
              {amenity}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HotelDetail; 