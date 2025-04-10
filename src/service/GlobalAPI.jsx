import axios from 'axios';

const BASE_URL = 'https://places.googleapis.com/v1/places:searchText';

export const GetPlaceDetails = (textQuery) => {
    const data = { textQuery };
    
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
            'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.priceLevel,places.photos'
        }
    };

    return axios.post(BASE_URL, data, config);
};

export const PHOTO_REF_URL = 'https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=1000&maxWidthPx=1000&key='+import.meta.env.VITE_GOOGLE_MAPS_API_KEY; 