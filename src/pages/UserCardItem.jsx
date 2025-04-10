import React, { useEffect, useState } from "react";
import { GetPlaceDetails, PHOTO_REF_URL } from "@/service/GlobalAPI";
import { Link } from "react-router-dom";

function UserCardItem({ trip }) {
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    const fetchPlacePhoto = async () => {
      if (!trip?.userChoice?.location?.label) return;

      try {
        const textQuery = trip.userChoice.location.label;
        const result = await GetPlaceDetails(textQuery);

        if (
          result?.data?.places &&
          result.data.places.length > 0 &&
          result.data.places[0].photos &&
          result.data.places[0].photos.length > 0
        ) {
          // Get the first available photo instead of assuming index [3]
          const photoName = result.data.places[0].photos[0].name;
          const UrlPhoto = PHOTO_REF_URL.replace("{NAME}", photoName);
          setPhoto(UrlPhoto);
        }
      } catch (error) {
        console.error("Error fetching place details:", error);
      }
    };

    fetchPlacePhoto();
  }, [trip]);

  return (
    <Link to={`/view-trip/${trip?.id}` }>
      <div className="border p-3 bg-orange-50 rounded-lg shadow-[#9c6f34] shadow-lg mb-3 hover:scale-110 transition-all cursor-pointer">
        <img
          src={photo || "/default-travel.jpg"} // Fallback image
          alt={trip?.userChoice?.location?.label || "Trip Location"}
          className="object-cover rounded-lg w-full h-48"
        />
        <div>
          <h2 className="font-bold text-xl">{trip?.userChoice?.location?.label || "Unknown Location"}</h2>
          <h2 className="font-medium text-s">
            {trip?.userChoice?.noOfDays || "N/A"} Days of Trip with {trip?.userChoice?.budget || "N/A"} Budget
          </h2>
        </div>
      </div>
    </Link>
  );
}

export default UserCardItem;
