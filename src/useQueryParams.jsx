import { useSearchParams } from 'react-router-dom'


// Đây là 1 custom hook lấy ra param trên thanh URL
export default function useQueryParams() {
  const [searchParams] = useSearchParams()
  return Object.fromEntries([...searchParams])
}