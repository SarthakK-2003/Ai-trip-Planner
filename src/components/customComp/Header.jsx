import { GrGoogle } from "react-icons/gr"; 
import React, { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import {Popover,PopoverContent,PopoverTrigger,  } from "@/components/ui/popover"
import { googleLogout } from '@react-oauth/google';
import { useNavigation } from 'react-router-dom';
import {Dialog,DialogContent,DialogDescription,DialogHeader,DialogTitle,DialogTrigger} from "@/components/ui/dialog"
import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from "axios";

function Header() {
  const user = JSON.parse(localStorage.getItem('user'));
  // const navigation = useNavigation();
  const [openDialog, setOpenDialog] = useState(false);
  
  useEffect(() =>{
    console.log(user);
  },[])

  const login = useGoogleLogin({
    onSuccess:(codeResp) => GetUserProfile(codeResp),
    onError:(error) => console.log(error) 
  })

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
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error fetching user profile:", error.response ? error.response.data : error.message);
    });
  };

  return (
    <div className='p-2 shadow-md flex justify-between items-center px-5'>
        <img src="/logo2.svg" alt="" />
        <div>
          {user ? 
            <div className='flex items-center gap-5'>
              <a href='/my-trips' className="rounded-full text-black bg-orange-100">
                <Button variant="outline" className='rounded-full '>My Trips</Button>
              </a>
              <Popover>
                <PopoverTrigger>
                  <img src={user?.picture} alt="" className='h-[38px] w-[38px] rounded-full '/>
                </PopoverTrigger>
                <PopoverContent>
                  <h2 className='cursor-pointer' onClick={()=>{
                    googleLogout();
                    localStorage.clear();
                    window.location.reload();
                  }}>LOGOUT</h2>
                </PopoverContent>
              </Popover>
            </div>
            :
            <Button onClick={()=>setOpenDialog(true)}>Sign in</Button>
          }
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
  )
}

export default Header
