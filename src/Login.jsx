import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

export default function Login() {
  const [params] = useSearchParams()
  const navigate = useNavigate()

  // Sau khi login thành công:
  // Lấy ra các data từ URL params BR trả về
  // Set access_token, refresh_token vào localStorage
  // Redirect về trang Home
  useEffect(() => {
    const access_token = params.get('access_token')
    const refresh_token = params.get('refresh_token')
    const new_user = params.get('new_user')
    const verify = params.get('verify')
    
    localStorage.setItem('access_token', access_token)
    localStorage.setItem('refresh_token', refresh_token)
    navigate('/')
  }, [params, navigate])
  
  return (
    <div>Login</div>
  )
}
