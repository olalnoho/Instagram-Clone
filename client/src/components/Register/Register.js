import React, { useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { Redirect } from 'react-router-dom'
import useHttp from '../../hooks/useHttp'
import axios from '../../axios/axios'
const Register = () => {
   const { setUser, user } = useContext(AuthContext)
   const [username, setUsername] = useState('')
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const { fetchData, data, loading, error } = useHttp('/api/users/register')

   if (user) {
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
      axios.defaults.headers.common['Authorization'] = data.token
      setUser(data.user)
      return <Redirect to="/profile" />
   }

   return (
      <div className="register">
         {error && <p className="error"> {error} </p>}
         <button className="btn btn--primary"
            style={{ width: '80%', margin: '0 auto 2rem auto', display: 'block', padding: '0.9rem 0rem 0.7rem 0.9rem' }}>Log in with Github</button>
         <form className="form" onSubmit={submitRegister}>
            <span> OR </span>
            <input value={username} onChange={e => setUsername(e.target.value)} type="text" placeholder="Username" />
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email" />
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" />
            <input type="submit" value="Next" />
         </form>
      </div>
   )
}

export default Register
