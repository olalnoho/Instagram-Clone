import { useEffect, useState } from 'react'
import axios from '../axios/axios'

export default initUrl => {
   const [url, setUrl] = useState(initUrl)
   const [data, setData] = useState()
   const [error, setError] = useState(null)
   const [loading, setLoading] = useState(true)
   useEffect(() => {
      axios.get(url)
         .then(({ data }) => {
            setData(data)
            setLoading(false)
         })
         .catch(err => {
            setError(err)
            setLoading(false)
         })
   }, [url])

   return {
      data,
      error,
      loading,
      setUrl,
      setData
   }
}