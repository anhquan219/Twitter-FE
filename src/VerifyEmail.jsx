import { useEffect, useState } from "react";
import useQueryParams from "./useQueryParams"
import axios from "axios";

export default function VerifyEmail() {
    const {token} = useQueryParams()
    const [message, setMessage] = useState('')

    useEffect(() => {
        const controller = new AbortController()

        if (token) {
            axios
                .post('/users/verify-email', 
                    { email_verify_token: token }, 
                    {
                        baseURL: import.meta.env.VITE_API_URI,
                        signal: controller.signal
                    }
                )
            .then((res) => {
                setMessage(res.data.message)
                alert('Verify email thành công')
                if (res.data.result) {
                    const {access_token, refresh_token} = res.data.result
                    localStorage.setItem('access_token', access_token)
                    localStorage.setItem('refresh_token', refresh_token)
                }
            }).catch((err) => {
                setMessage(err.response.data.message)
            })
        }
        return () => {
            controller.abort()
        }
    }, [token])
  return (
    <div>{message}</div>
  )
}
