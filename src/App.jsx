import { useState } from 'react'

import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Footer from './components/Footer'
import Listedpage from './pages/Listedpage'
import LoginPage from './pages/LoginPage'
import SchoolDetails from './pages/SchoolDetails'
import StickyButton from './components/StickyButton'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/listed' element={<Listedpage/>}/>
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/details' element={<SchoolDetails/>}/>



    </Routes>
    <StickyButton/>
    <Footer/>

    </>
  )
}

export default App
