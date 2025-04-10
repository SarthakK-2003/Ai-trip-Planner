import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import CreateTrip from './pages/CreateTrip.jsx'
import { createBrowserRouter ,RouterProvider} from 'react-router-dom'
import Header from './components/customComp/header'
import { Toaster } from './components/ui/sonner'
import { GoogleOAuthProvider } from '@react-oauth/google';
import ViewTrip from './pages/ViewTrip/[tripID]/ViewTrip'
import MyTrips from './pages/MyTrips'
// import Footer from './components/customComp/footer'

const router =createBrowserRouter([
  {
  path: '/',
  element : <App />
  },
  {
    path: '/create-trip',
    element : <CreateTrip />
  },
  {
    path: '/view-trip/:tripID',
    element : <ViewTrip/>
  },
  {
    path:'/my-trips',
    element : <MyTrips />
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
      <Header />
      <Toaster />
      <RouterProvider router={router} />
      {/* <Footer /> */}
    </GoogleOAuthProvider>;
  </StrictMode>,
)
