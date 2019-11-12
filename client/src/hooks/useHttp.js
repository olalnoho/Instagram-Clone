import { useState, useCallback } from 'react'
import axios from 'axios'
const useHttp = url => {
   const [data, setData] = useState(null)
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState(null)

   const fetchData = useCallback(body => {
      setLoading(true)
      if (error) {
         setError(null)
      }
      axios.post(url, body)
         .then(({ data }) => {
            setData(data)
            setLoading(false)
         })
         .catch(err => {
            setError(err.response.data.err)
            setLoading(false)
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