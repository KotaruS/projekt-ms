import { useEffect } from "react"
import { useQueryClient } from "react-query"
import { useNavigate } from "react-router-dom"

function Logout() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  useEffect(() => {
    localStorage.removeItem('token')
    queryClient.invalidateQueries(['user', 'me'])
    navigate('/')
  }, [])
  return (
    <></>
  )
}
export default Logout