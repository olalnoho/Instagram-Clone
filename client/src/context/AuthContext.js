import React, { useState, useEffect } from 'react'
import axios from '../axios/axios'
export const AuthContext = React.createContext({
   user: {},
   setUser: () => { },
   authLoading: true
})

export default props => {
   const [user, setUser] = useState(null)
   const [authLoading, setAuthLoading] = useState(true)
   useEffect(() => {
      if (localStorage.getItem('token')) {
         axios.get('/auth/me')
            .then(res => {
               setUser(res.data)
               setAuthLoading(false)
            })
            .catch(err => {
               setAuthLoading(false)
            })
      } else {
         setAuthLoading(false)
      }
   }, [])
   return <AuthContext.Provider value={{
      user,
      setUser,
      authLoading,
   }}>
      {props.children}
   </AuthContext.Provider>
}
