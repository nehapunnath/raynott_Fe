import { useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'

import './App.css'
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
import CollegeDetails from './pages/CollegeDetails'
import AllSchools from './pages/AllSchools'
import AllColleges from './pages/AllColleges'
import AllPuColleges from './pages/AllPuColleges'
import AllCoaching from './pages/AllCoaching'
import AllTuition from './pages/AllTuition'
import TuitionDetails from './pages/TuitionDetails'
import PUCollegeDetails from './pages/PuCollegeDetails'
import CoachingDetail from './pages/CoachingDetail'
import AllTeachers from './pages/AllTeachers'
import TeachersList from './pages/TeachersList'
import TeachersDetails from './pages/TeachersDetails'
import BestSellers from './pages/BestSellers'
import AdminDashboard from './pages/Admin/AdminDashboard'
import EditSchool from './pages/Admin/EditSchool'
import ViewSchool from './pages/Admin/ViewSchool'

function App() {
  const location = useLocation()

  // Paths where footer should be hidden
  const hideFooterPaths = ['/login', '/admin/dashboard','/admin/edit-school/:id','/admin/view-school/:id']

  const shouldShowFooter = !hideFooterPaths.includes(location.pathname)

  return (
    <>
      {/* <Header /> */}
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/listed' element={<Listedpage/>}/>

        <Route path='/listing' element={<Listing/>}/> 
        <Route path='/colleges' element={<Colleges/>}/>
        <Route path='/pu-colleges' element={<PuCollegeList/>}/>
        <Route path='/coaching' element={<CoachingList/>}/>
        <Route path='/tuition' element={<TutionList/>}/>
        <Route path='/teachers' element={<TeachersList/>}/>

        {/* category wise listing */}
        <Route path='/all-schools' element={<AllSchools/>}/>
        <Route path='/all-colleges' element={<AllColleges/>}/>
        <Route path='/all-pucolleges' element={<AllPuColleges/>}/>
        <Route path='/all-coaching' element={<AllCoaching/>}/>
        <Route path='/all-tuition' element={<AllTuition/>}/>
        <Route path='/all-teachers' element={<AllTeachers/>}/>
        <Route path='/best-sellers' element={<BestSellers/>}/>

        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/bookdemo' element={<BookaDemo/>}/>

        <Route path='/school-details' element={<SchoolDetails/>}/>
        <Route path='/college-details' element={<CollegeDetails/>}/>
        <Route path='/pucollege-details' element={<PUCollegeDetails/>}/>
        <Route path='/coaching-details' element={<CoachingDetail/>}/>
        <Route path='/tuition-details' element={<TuitionDetails/>}/>
        <Route path='/teachers-details' element={<TeachersDetails/>}/>

        <Route path='/register' element={<Register/>}/>
        <Route path='/register-form' element={<RegisterForm/>}/>
        <Route path='/contact' element={<ContactUs/>}/>

        <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
        <Route path='/admin/edit-school/:id' element={<EditSchool/>}/>
        <Route path='/admin/school-details/:id' element={<ViewSchool/>}/>


      </Routes>

      {/* Only show footer if path is not in hideFooterPaths */}
      {shouldShowFooter && <Footer />}
    </>
  )
}

export default App
