import { Button } from "@/components/ui/button";
import { FaShare } from "react-icons/fa";
import React, { useEffect } from "react";
import { useState } from "react";
import { GetPlaceDetails } from "@/service/GlobalAPI";
import { PHOTO_REF_URL } from "@/service/GlobalAPI";

function InfoSection({ trip }) {
  const[photo,setPhoto] = useState();

  useEffect(() => {
    if (trip) {
      GetPlacePhoto();
    }
  }, [trip]);

  const GetPlacePhoto = async () => {
    if (!trip?.userChoice?.location?.label) return;

    try {
      const textQuery = trip.userChoice.location.label;
      const result = await GetPlaceDetails(textQuery);
      console.log(result.data.places[0].photos[9].name);
      const UrlPhoto = PHOTO_REF_URL.replace('{NAME}',result.data.places[0].photos[9].name);
      setPhoto(UrlPhoto);
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  return (
    <div>
      <img
        src={photo}
        alt=""
        className="h-[350px] w-full object-cover rounded-xl"
      />
      <div className="flex justify-between items-center mt-5 flex-wrap">
        {/* Left Section */}
        <div className="my-5 flex flex-col gap-2 w-full sm:w-auto">
          <h2 className="font-extrabold text-2xl">
            {trip?.userChoice?.location?.label}
          </h2>

          {/* Responsive Tag Section */}
          <div className="flex flex-wrap gap-3 md:gap-6">
            <h2 className="p-1 px-3 bg-[#ecbf85] rounded-2xl text-black font-normal text-xs md:text-md">
              📅 Days : {trip?.userChoice?.noOfDays}
            </h2>
            <h2 className="p-1 px-3 bg-[#ecbf85] rounded-2xl text-black font-normal text-xs md:text-md">
              💸 Budget : {trip?.userChoice?.budget}
            </h2>
            <h2 className="p-1 px-3 bg-[#ecbf85] rounded-2xl text-black font-normal text-xs md:text-md">
              👪 Travellers : {trip?.userChoice?.traveller}
            </h2>
          </div>
        </div>

        {/* Right Section (Share Button) */}
        <Button className="md:ml-4">
          <FaShare />
        </Button>
      </div>
    </div>
  );
}

export default InfoSection;
