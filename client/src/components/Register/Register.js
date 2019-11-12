import React, { useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { Redirect } from 'react-router-dom'
import useHttp from '../../hooks/useHttp'
const Register = () => {
   const { setUser, user } = useContext(AuthContext)
   const [username, setUsername] = useState('')
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const { fetchData, data, loading, error } = useHttp('/users/register')

   if(user) {
      return <Redirect to="/profile" />
   }
   if (loading) {
      return <div className="register">
      </div>
   }
   const submitRegister = e => {
      e.preventDefault()
      fetchData({
         username,
         email,
         password
      })
   }

   if (data) {
      localStorage.setItem('token', data.token)
      setUser(data.user)
      return <Redirect to="/profile" />
   }

   return (
      <div className="register">
         {error && <p className="error"> {error} </p>}
         <form className="form" onSubmit={submitRegister}>
            {/* <input type="submit" value="Log in with Facebook" />
            <span> OR </span> */}
            <input value={username} onChange={e => setUsername(e.target.value)} type="text" placeholder="Username" />
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email" />
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" />
            <input type="submit" value="Next" />
         </form>
      </div>
   )
}

export default Register
