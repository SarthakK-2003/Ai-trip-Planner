import { GrGoogle } from "react-icons/gr";
import { AiOutlineLoading } from "react-icons/ai";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AI_PROMPT, SelectBudgetOptions, SelectTravelsList} from '@/constants/options';
import { chatSession } from '@/service/AIModal';
import React, { useEffect } from 'react'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete'
import { toast } from 'sonner';
import {Dialog,DialogContent,DialogDescription,DialogHeader,DialogTitle,DialogTrigger} from "@/components/ui/dialog"
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { db } from "@/service/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function CreateTrip() {
    const[place,setPlace] = React.useState();
    const[formData,setFormData] = React.useState([]);
    const [openDialog, setOpenDialog] = React.useState(false);
    const[loading,setLoading] = React.useState(false);

    const navigate = useNavigate();

    const handleInputChange = (name,value) => {
        setFormData({
          ...formData,
          [name]:value
        })
    }

    useEffect(() => {
      console.log(formData);
    },[formData])

    const login = useGoogleLogin({
      onSuccess:(codeResp) => GetUserProfile(codeResp),
      onError:(error) => console.log(error) 
    })


    const OnGenerateTrip = async() => {

      const user= localStorage.getItem('user');

      if(!user){
        setOpenDialog(true);
        return 
      }

      if (formData?.noOfDays > 5 && (!formData?.location || !formData?.budget || !formData?.traveller)) {
        toast("Please fill all the fields", { type: "error" });
        return;
      }
      setLoading(true);
      const FINAL_PROMPT = AI_PROMPT
      .replace('{location}',formData.location.label)
      .replace('{totalDays}',formData.noOfDays)
      .replace('{traveler}',formData.traveller)
      .replace('{budget}',formData.budget)
      .replace('{totalDays}',formData.noOfDays);

      // console.log(FINAL_PROMPT);
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      console.log(result?.response?.text());
      setLoading(false);  
      SaveAiTrip(result?.response?.text());
    };

    const SaveAiTrip = async(TripData) => {
      setLoading(true);
      const docID = Date.now().toString();  
      const user = JSON.parse(localStorage.getItem('user')); 
      await setDoc(doc(db, "AItrips", docID), {
        userChoice: formData,
        tripdata : JSON.parse(TripData),
        userEmail : user?.email,
        id : docID
      });
      setLoading(false);
      navigate('/view-trip/'+docID);  
    }

    const GetUserProfile = (tokenInfo) => {
      axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
        headers: {
          Authorization: `Bearer ${tokenInfo?.access_token}`,
          Accept: 'application/json',
        },
      })
      .then((res) => {
        console.log(res.data);
        localStorage.setItem('user',JSON.stringify(res.data));
        setOpenDialog(false); 
        OnGenerateTrip();
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error.response ? error.response.data : error.message);
      });
    };
    




    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    // if (!apiKey) {
    //   console.error("Google Maps API Key is missing!");
    // }
  return (
    <div className='sm:px-10 md:px-25 lg:px-48 xl:px-15 px-5'>
      <h2 className='font-extrabold text-4xl mt-6'>Help Us to Tailor Your Perfect Trip : Share Your Choices or Preferences!🛫</h2>
       <p className=' font-semibold text-xl mt-4 text-[#9c6f34]'>Provide a few details, and we'll craft the perfect trip : for you, family, friends, or couples!</p>

      <div className='mt-10 flex flex-col gap-10'>
        <div> 
          <h2 className='text-xl font-extrabold mt-2 mb-2'>Where do you wanna Travel : 🌏</h2>
          <GooglePlacesAutocomplete
            apiKey= {apiKey}
            selectProps={{
              place,
              onChange:(v) => {setPlace(v);handleInputChange('location',v)}  
            }}
          />   
        </div>

        <div>
          <h2 className='text-xl font-extrabold mt-2 mb-2'>For how many Days you want to Travel? : ⏳</h2>
          <Input placeholder='Enter Number of Days(Ex. 3)' type="number" 
          onChange = {(e) => handleInputChange('noOfDays',e.target.value)}/>
        </div>

        <div>
          <h2 className='text-xl font-extrabold mt-2 mb-2'>What's Your Budget?</h2>
          {/* <h2 className='text-l font-medium mt-2 mb-2'>The budget is solely designated for activities and dining : </h2> */}
          <div className='grid grid-cols-3 gap-5 mt-5'>
            {SelectBudgetOptions.map((item, index) => (
              <div
                key={index} 
                onClick={() => handleInputChange('budget',item.title)}
                className={`p-4 border border-[#f09c30] rounded-lg flex flex-col items-center gap-2 cursor-pointer
                  ${formData.budget === item.title ? 'shadow-lg shadow-[#9c6f34]' : 'hover:shadow-lg'}
                `}
              >
                <h2 className='text-4xl'>{item.icon}</h2>
                <h2 className='font-bold text-lg'>{item.title}</h2>
                <h2 className='text-sm'>{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>

        <div className='mb-5'>
          <h2 className='text-xl font-extrabold mt-2 mb-2'>How do you intend to travel on your next adventure?: </h2>
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-5 mt-5'>
            {SelectTravelsList.map((item, index) => (
              <div
                key={index}
                onClick={() => handleInputChange('traveller',item.people)}
                className={`p-4 border border-[#f09c30] rounded-lg flex flex-col items-center gap-2 cursor-pointer 
                ${formData.traveller === item.people ? 'shadow-lg shadow-[#9c6f34]' : 'hover:shadow-lg'}
                `}
              >
                <h2 className='text-4xl'>{item.icon}</h2>
                <h2 className='font-bold text-lg'>{item.title}</h2>
                <h2 className='text-sm'>{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>

        <div className='flex justify-center mb-10'>
          <Button disabled = {loading} onClick = {OnGenerateTrip}> 
            {loading? <AiOutlineLoading className='animate-spin'/> : 'Generate Trip'}
          </Button>
        </div>

        <Dialog open={openDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogDescription>
                <img src="logo3.svg" alt="" />
                <h2 className='font-bold text-lg mt-7'>Sign in with the Google</h2>
                <p>Sign in to the app with Google Authentication</p>
                <Button
                className='w-full mt-5 flex items-center gap-2'
                onClick = {login}
                ><GrGoogle /> Sign in with Google
                </Button>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default CreateTrip
