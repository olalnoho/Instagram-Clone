import axios from 'axios'
const token = localStorage.getItem('token')

if(token) {
   axios.defaults.headers.common['Authorization'] = token
}

export default axios