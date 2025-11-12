import axios from 'axios'

import { Outlet, useLocation, Navigate,useNavigate } from 'react-router-dom'
import { useEffect, useContext } from 'react'

import { authContext } from '../contexts/authContext'

import Header from '../layout/header'
import Footer from '../layout/footer'
import Loader from '../components/loader'


export default function ProtectedRoute () {
  const { user, authLoading} = useContext(authContext);
  let navigate = useNavigate();

  useEffect(()=>{
    if (!authLoading){
      if(!user){
       navigate('/');
      }
  }},[authLoading,user])


    return(
    <div className='bg-black w-screen overflow-hidden'>
      {authLoading?<Loader/>:
        <>
         {user &&
         <>
         <Outlet/>
         <Footer/>
         </>}
         </>}
    </div>)
}
