import React from 'react'
import { Button } from "@/components/ui/button"
import { Link } from 'react-router-dom'
function Hero() {
  return (
    <div className='flex flex-col items-center mx-55 gap-9'>
        <h1 className='font-extrabold text-5.5xl text-center mt-16 underline'>
            Plan your dream trip, explore the world with ease : <span className='text-[#f09c30] underline'>Personalised Itineraries at your fingertips</span>
        </h1>
        <p className='text-center text-xl'>
            Your Personal Trip Planner & Curator : For You, Friends & Family! for Every Occasion.
        </p>
        <Link to={'/create-trip'}>
            <Button>Lets Make a Trip</Button>
        </Link>
    </div>
  )
}

export default Hero
