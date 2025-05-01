import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ShowForm from './pages/ShowForm';
import FillForm from './pages/FillForm';
import Auth from './pages/auth/Auth';
import DashBoard from './pages/DashBoard';

export default function App() {
  return (
    <BrowserRouter>
      <div className='app-container'>
        <Routes>
          <Route path='/show-form' element={<ShowForm />} />
          <Route path='/dashboard' element={<DashBoard />} />
          <Route path='/fill-form' element={<FillForm />} />
          <Route path='/' element={<Auth />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
