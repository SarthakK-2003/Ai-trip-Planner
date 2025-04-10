import { useState } from 'react'
import { Button } from "@/components/ui/button"
import './App.css'
import './index.css'
import Hero from './components/customComp/Hero'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Hero />
    </>
  )
}

export default App
