import { Link } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { useState } from 'react'
import axios from "axios";

// Khởi tạo URL để truy cập vào Google API
const getGooleAuthUrl = () => {
  const {VITE_GOOGLE_CLIENT_ID, VITE_GOOGLE_REDIRECT_URI} = import.meta.env
  const url = `https://accounts.google.com/o/oauth2/v2/auth`  //URL mặc định của google
  const query = {
    client_id: VITE_GOOGLE_CLIENT_ID, //client_id khi đăng kí thành công trên Google API
    redirect_uri: VITE_GOOGLE_REDIRECT_URI, //redirect_uri: Phải khớp với URL tạo bên router BE
    response_type: "code",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(' '),
    prompt: 'consent',
    access_type: 'offline'  //Lấy thêm refresh_token trong data trả về
  }
  const queryString = new URLSearchParams(query).toString();
  return `${url}?${queryString}`
}

const googleOauthUrl = getGooleAuthUrl()

const handleLogout = () => {
  localStorage.setItem('access_token', '')
  localStorage.setItem('refresh_token', '')
  window.location.reload()
}

export default function Home() {
  const profile = JSON.parse(localStorage.getItem('profile')) || {}
  const isAuthenticated = Boolean(localStorage.getItem('access_token'))
  const [data, setdata] = useState({
    name: '',
    pass: ''
  })

  const handleChangeValue = (e) => {
    const value = e?.target.value
    setdata({...data, [e.target.name]: value})
  }

  const handleLogin = (e) => {
    e.preventDefault()
    axios
      .post('/users/login', 
          { 
            email: data.name, 
            password: data.pass
          },  
          {
              baseURL: import.meta.env.VITE_API_URI,
          }
      ).then((res) => {
        const data = res.data.result
        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('refresh_token',  data.refresh_token)
      })
  }
    return (
        <>
          <div>
            <span href="https://vitejs.dev" target="_blank">
              <img src={viteLogo} className="logo" alt="Vite logo" />
            </span>
            <span href="https://react.dev" target="_blank">
              <img src={reactLogo} className="logo react" alt="React logo" />
            </span>
          </div>
          <video controls width={500}>
            <source src='http://localhost:4000/static/video-stream/e3c9222d6d9268f2ef44b6c00.mp4' type='video/mp4'/>
          </video>

          <form onSubmit={handleLogin}>
            <input type="text" value={data.name} onChange={handleChangeValue} name="name"></input>
            <input type="text" value={data.pass} onChange={handleChangeValue} name="pass"></input>
            <button type='submit'>Login</button>
          </form>

          <span>Hello {profile.email}</span>
          <h1>Google Oauth 2.0</h1> 
          {
            isAuthenticated ? <button onClick={handleLogout}>Logout</button> : <Link to={googleOauthUrl}>Login with Google</Link>
          }
        </>
      )
}
