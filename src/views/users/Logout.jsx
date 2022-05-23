import { useContext, useEffect } from "react"
import { useQueryClient } from "react-query"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../../App"

function Logout() {
  const { context, setContext } = useContext(UserContext)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  useEffect(() => {
    localStorage.removeItem('token')

    setContext({
      ...context,
      message: {
        type: 'info',
        text: 'You have been logged out.',
      },
      token: ''
    })
    queryClient.resetQueries('user')
    navigate('/', { replace: true })
  }, [])
  return (
    <></>
  )
}
export default Logout