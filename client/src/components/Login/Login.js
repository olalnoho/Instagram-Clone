import React, { useState, useContext } from 'react'
import useHttp from '../../hooks/useHttp'
import { Link, Redirect } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import axios from '../../axios/axios'
const Login = () => {
   const [identifier, setIdentifier] = useState('')
   const [password, setPassword] = useState('')
   const { fetchData, data, error, loading } = useHttp('/api/auth/login')
   const { setUser, user } = useContext(AuthContext)
   const isValid = identifier && password.length > 5

   const submitLogin = e => {
      e.preventDefault()
      fetchData({ identifier, password })
   }

   if (user) {
      return <Redirect to="/profile" />
   }

   if (loading) {
      return <div className="login">

      </div>
   }


   if (data) {
      localStorage.setItem('token', data.token)
      axios.defaults.headers.common['Authorization'] = data.token
      setUser(data.user)
      return <Redirect to="/profile" />
   }

   return (
      <div className="container flex">
         <div className="login">
            <h2 className="heading-2 Pacifico centertext">
               Testagram
         </h2>
            {error && <p className="error"> {error} </p>}
            <form className="form" onSubmit={submitLogin}>
               <input
                  type="text"
                  placeholder="Username or email"
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)} />
               <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)} />
               <input disabled={!isValid} type="submit" value="Log in" />
            </form>
            <p className="lead centertext mt">
               Don't have an account? <Link to="/">Sign Up</Link>
            </p>
         </div>
      </div>
   )
}

export default Login