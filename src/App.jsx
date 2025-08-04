import { useState } from 'react'

import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Footer from './components/Footer'
import Listedpage from './pages/Listedpage'
import LoginPage from './pages/LoginPage'
import SchoolDetails from './pages/SchoolDetails'
import StickyButton from './components/StickyButton'
import Listing from './pages/Listing'
import BookaDemo from './pages/BookaDemo'
import Register from './pages/Register'
import RegisterForm from './pages/RegisterForm'
import ContactUs from './pages/ContactUs'
import Header from './components/Header'
import Colleges from './pages/Colleges'
import CoachingCenter from './components/CoachingCenter'
import TutionList from './pages/TutionList'
import PuCollegeList from './pages/PuCollegeList'
import CoachingList from './pages/CoachingList'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    {/* <Header/> */}
    <Routes>
      
      <Route path='/' element={<Home/>}/>
      <Route path='/listed' element={<Listedpage/>}/>
      <Route path='/listing' element={<Listing/>}/>
      <Route path='/colleges' element={<Colleges/>}/>
      <Route path='/pu-colleges' element={<PuCollegeList/>}/>
      <Route path='/coaching' element={<CoachingList/>}/>
      <Route path='/tuition' element={<TutionList/>}/>




      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/bookdemo' element={<BookaDemo/>}/>
      <Route path='/details' element={<SchoolDetails/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/register-form' element={<RegisterForm/>}/>
      <Route path='/contact' element={<ContactUs/>}/>





    </Routes>
    {/* <StickyButton/> */}
    <Footer/>

    </>
  )
}

export default App
