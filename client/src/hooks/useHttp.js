import { useState, useCallback } from 'react'
import axios from 'axios'
const useHttp = url => {
   const [data, setData] = useState(null)
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState(null)

   const fetchData = useCallback(body => {
      return new Promise((res, rej) => {
         setLoading(true)
         if (error) {
            setError(null)
         }
         axios.post(url, body)
            .then(({ data }) => {
               setData(data)
               setLoading(false)
               res(data)
            })
            .catch(err => {
               setError(err.response.data.err)
               setLoading(false)
               rej(err)
            })
      })
   }, [url, error])

   return {
      loading,
      data,
      error,
      fetchData
   }
}

export default useHttp