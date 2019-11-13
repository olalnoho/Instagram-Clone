import React, { useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { AuthContext } from '../../../context/AuthContext'
const Header = () => {
   const history = useHistory()
   const { user, authLoading, setUser } = useContext(AuthContext)
   return (
      <nav className="header">
         <div className="header__items">
            <div className="header__items--logo">
               <Link to="/"><i className="fas fa-camera-retro"></i></Link> <span className="line"></span> <p className="Pacifico lead"> Testagram </p>
            </div>
            <div className="header__items--search">
               <input type="text" placeholder="Search" />
               <i className="fab fa-sistrix"></i>
            </div>
            <div className="header__items--actions">
               {
                  !user && !authLoading ?
                     <>
                        <Link to="/login" className="btn btn--primary">Log In</Link>
                        <Link to="/" className="btn btn--secondary"> Sign Up </Link>
                     </> :
                     <>
                        <button onClick={() => {
                           history.push('/')
                           localStorage.removeItem('token')
                           setUser(null)
                        }} className="btn btn--thirdary">Log out</button>
                     </>
               }
            </div>
         </div>
      </nav >
   )
}

export default Header