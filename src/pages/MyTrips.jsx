import { db } from '@/service/firebaseConfig';
import { query, where, collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserCardItem from './UserCardItem';

function MyTrips() {
  const navigate = useNavigate();
  const [tripsOfUser, setTripsOfUser] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      const userData = localStorage.getItem('user');
      if (!userData) {
        navigate('/');
        return;
      }

      const user = JSON.parse(userData); // Parse stored user data
      if (!user?.email) {
        navigate('/');
        return;
      }

      try {
        const tripQuery = query(collection(db, 'AItrips'), where('userEmail', '==', user.email));
        const querySnapshot = await getDocs(tripQuery);

        const trips = []; // Collect trips first
        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
          trips.push(doc.data());
        });

        setTripsOfUser(trips); // Update state once after collecting data
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };

    fetchTrips();
  }, [navigate]);

  return (
    <div className='p-10 md:px-20 lg:px-40 xl:px-50'>
      <h2 className='text-3xl font-extrabold'>My Trips</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {tripsOfUser.map((trip, index) => (
          <UserCardItem key={index} trip={trip} />
        ))}
      </div>
    </div>
  );
}

export default MyTrips;
