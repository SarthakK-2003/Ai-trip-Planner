import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GetPlaceDetails, PHOTO_REF_URL } from "@/service/GlobalAPI";

function Itinerary({ trip }) {
  const [placePhotos, setPlacePhotos] = useState({});

  useEffect(() => {
    const fetchPlacePhotos = async () => {
      if (!trip?.tripdata?.itinerary) return;

      const photos = {};
      const placeList = [];

      Object.keys(trip.tripdata.itinerary).forEach((dayKey) => {
        const day = trip.tripdata.itinerary[dayKey];
        ["morning", "afternoon", "evening"].forEach((timeOfDay) => {
          if (day[timeOfDay]?.placeName) {
            placeList.push(day[timeOfDay]);
          }
        });
      });

      await Promise.all(
        placeList.map(async (place) => {
          try {
            const textQuery = place.placeName;
            const result = await GetPlaceDetails(textQuery);
            if (result?.data?.places?.[0]?.photos?.length > 0) {
              const photoName = result.data.places[0].photos[0].name; // Get first available photo
              photos[place.placeName] = PHOTO_REF_URL.replace(
                "{NAME}",
                photoName
              );
            }
          } catch (error) {
            console.error("Error fetching place details:", error);
          }
        })
      );

      setPlacePhotos(photos);
    };

    fetchPlacePhotos();
  }, [trip]);

  return (
    <div>
      <h2 className="font-extrabold text-2xl mt-5 mb-5">
        Must-See Destinations
      </h2>

      <div>
        {trip?.tripdata?.itinerary ? (
          Object.keys(trip.tripdata.itinerary)
            .sort((a, b) => a.localeCompare(b, undefined, { numeric: true })) // Sort days
            .map((dayKey, index) => {
              const day = trip.tripdata.itinerary[dayKey];
              const timeOfDayOrder = ["morning", "afternoon", "evening"];

              return (
                <div key={index} className="mb-8">
                  <h2 className="font-bold text-xl capitalize">{dayKey}</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                    {timeOfDayOrder.map((timeOfDay, idx) => {
                      const place = day[timeOfDay];

                      if (place) {
                        const query = `${place.placeName}, ${place.location}`;
                        const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          query
                        )}`;

                        return (
                          <Link
                            key={idx}
                            to={googleMapsLink}
                            target="_blank"
                            className="no-underline text-black"
                          >
                            <div className="border p-3 bg-orange-50 rounded-lg shadow-[#9c6f34] shadow-lg mb-3 hover:scale-110 transition-all cursor-pointer">
                              <h3 className="font-bold text-lg capitalize">
                                {timeOfDay}
                              </h3>
                              <img
                                src={
                                  placePhotos[place.placeName] || "/travel.jpg"
                                } // Default image
                                alt={place.placeName}
                                className="w-full h-48 object-cover rounded-md mt-2"
                              />
                              <p className="text-md mt-2 font-bold">
                                📍 {place.placeName}
                              </p>
                              <p>⌚ : {place.bestTimeToVisit}</p>
                              <p>
                                <strong>Details: </strong>
                                {place.placeDetails}
                              </p>
                              <p>💰: {place.ticketPricing}</p>
                              <p>
                                <strong>Travel Info:</strong>{" "}
                                {place.timeToTravel}
                              </p>
                            </div>
                          </Link>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              );
            })
        ) : (
          <p>No itinerary available.</p>
        )}
      </div>
    </div>
  );
}

export default Itinerary;
