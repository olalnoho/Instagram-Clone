import React, { useContext } from 'react'
// import { AuthContext } from '../../../context/AuthContext'
import { Link } from 'react-router-dom'
import Register from '../../Register/Register'
const imageSrc2 = 'https://cdn.pixabay.com/photo/2016/09/20/11/27/phone-1682317_960_720.png'
const imageSrc = 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Black-android-phone.svg'
const Landing = () => {
   // const { user, authLoading } = useContext(AuthContext)
   return (
      <div className="landing">
         <div className="landing__content">
            <div className="landing__left">
               <img className="landing__left--img1" src={imageSrc} alt="phones" />
               <img className="landing__left--img2" src={imageSrc2} alt="phone2" />
            </div>
            <div className="landing__right">
               <div className="landing__right--content">

                  <h2 className="heading-2 Pacifico">
                     Testagram
               </h2>
                  <p className="landing__lead">
                     Sign up to see photos and videos from your friends.
                  </p>
                  <Register />
                  <p className="landing__disc centertext">
                     By signing up, you agree to our Terms . Learn how we collect, use and share your data in our Data Policy and how we use cookies and similar technology in our Cookies Policy .
                  </p>
                  <p className="lead">
                     Already have an account? <Link to="/login">Log in</Link>
                  </p>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Landing