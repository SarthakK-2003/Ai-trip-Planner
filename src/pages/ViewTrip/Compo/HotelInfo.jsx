import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalAPI';

function HotelInfo({ trip }) {
  const [hotelPhotos, setHotelPhotos] = useState({});

  useEffect(() => {
    const fetchHotelPhotos = async () => {
      if (!trip?.tripdata?.hotelOptions?.length) return;

      const photos = {};
      await Promise.all(
        trip.tripdata.hotelOptions.map(async (hotel) => {
          if (!hotel?.hotelName) return;

          try {
            const textQuery = hotel.hotelName;
            const result = await GetPlaceDetails(textQuery);
            if (
              result?.data?.places &&
              result.data.places.length > 0 &&
              result.data.places[0].photos &&
              result.data.places[0].photos.length > 0
            ) {
              const photoName = result.data.places[0].photos[0].name; // Get first available photo
              photos[hotel.hotelName] = PHOTO_REF_URL.replace('{NAME}', photoName);
            }
          } catch (error) {
            console.error("Error fetching hotel photo:", error);
          }
        })
      );
      setHotelPhotos(photos);
    };

    fetchHotelPhotos();
  }, [trip]);

  return (
    <div>
      <h2 className='font-extrabold text-2xl mt-5 mb-5'>Hotel Recommendations</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {trip?.tripdata?.hotelOptions?.length > 0 ? (
          trip.tripdata.hotelOptions.map((hotel, index) => {
            const query = `${hotel?.hotelName}, ${hotel?.hotelAddress}`;
            const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
            
            return (
              <Link to={googleMapsLink} target="_blank" key={index} className="no-underline text-black">
                <div className="border p-3 bg-orange-50 rounded-lg shadow-[#9c6f34] shadow-lg mb-3 hover:scale-110 transition-all cursor-pointer">
                  <img
                    src={hotelPhotos[hotel.hotelName] || '/travel.jpg'}
                    alt="Hotel"
                    className='rounded-xl w-full h-40 object-cover'
                  />
                  <div className='my-3 flex flex-col gap-2'>
                    <h3 className="font-bold mt-2 text-s">{hotel?.hotelName}</h3>
                    <p className='text-xs'>📍 {hotel?.hotelAddress}</p>
                    <p className='text-xs'>💸 {hotel?.price}</p>
                    <p className='text-xs'>🌟 Rating: {hotel?.rating}</p>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <p className="text-gray-500">No hotel recommendations available.</p>
        )}
      </div>
    </div>
  );
}

export default HotelInfo;
