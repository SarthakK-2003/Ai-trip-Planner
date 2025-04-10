import { db } from '@/service/firebaseConfig'
import { doc, getDoc } from 'firebase/firestore'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import InfoSection from '../Compo/InfoSection'
import HotelInfo from '../Compo/HotelInfo'
import Itinerary from '../Compo/Itinerary'

function ViewTrip() {
  const {tripID} = useParams()
  const [trip,setTrip] = React.useState([])

  useEffect(() => {
    const fetchData = async () => {
      if (tripID) await GetTripData();
    };
    fetchData();
  }, [tripID]);
  

//   use to get information from firebase
  const GetTripData = async() => {
    const docRef = doc(db, 'AItrips', tripID);
    const docSnap = await getDoc(docRef);

    if(docSnap.exists()){
      console.log("Document",docSnap.data());
      setTrip(docSnap.data());
    }
    else{
        console.log('No such document!');
        toast('No such document!',{type:'error'});
    }
  }
  return (
    <div className='p-10 md:px-20 lg:px-40 xl-px-50'>
        {/* Imformation Section */}
        <InfoSection trip={trip} /> 

        {/* Recommended Hotels */}
        <HotelInfo trip={trip}/>

        {/* Daily Plan */}
        <Itinerary trip={trip}/>
    </div>
  )
}

export default ViewTrip