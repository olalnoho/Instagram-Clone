import React, { useEffect, useState } from 'react'
import useHttp from './hooks/useHttp'
const Test = () => {
   const { doFetch, data, loading } = useHttp()
   const [endpoint, setEndpoint] = useState('')
   const request = e => {
      e.preventDefault()
      doFetch(`https://jsonplaceholder.typicode.com/${endpoint}`)
   }

   if (loading) return <p>Loading...</p>
   if (data) console.log(data);

   return (
      <div>
         <form className="form" onSubmit={request}>
            <input value={endpoint} onChange={e => setEndpoint(e.target.value)} type="text" />
            <input type="submit" />
         </form>
      </div>
   )
}

export default Test
