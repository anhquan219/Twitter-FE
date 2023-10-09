import './App.css'
import { RouterProvider } from 'react-router-dom'
import router from './router/router'
import { useEffect } from 'react'
import axios from "axios";

function App() {

  useEffect(() => {
    axios
    .get(`${import.meta.env.VITE_API_URI}/users/me`, 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}` 
          },
        }, 
    ).then((res) => {
      localStorage.setItem('profile', JSON.stringify(res.data.result))
    })
  }, [])

  return (
    <RouterProvider router={router} />
  )
}

export default App
