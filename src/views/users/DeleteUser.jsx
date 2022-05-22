import { useContext, useEffect } from "react"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { useNavigate, useParams } from "react-router-dom"
import { UserContext } from "../../App"
import { deleteUser, getUser } from "../../lib/api"

function DeleteUser() {
  const { context, setContext } = useContext(UserContext)
  const queryClient = useQueryClient()
  const { uri } = useParams()
  const navigate = useNavigate()

  const loggedUser = useQuery(['user', 'me'], getUser, {
    retry: 1,
    enabled: !!context.token
  })

  const userDel = useMutation(deleteUser, {
    onSuccess: data => {
      setContext({
        ...context,
        message: {
          type: 'success',
          text: data.message
        },
        token: '',
      })
      localStorage.removeItem('token')
      queryClient.resetQueries('user')
      queryClient.invalidateQueries('posts')
      navigate('/', { replace: true })
    },
    onError: error => {
      setContext({
        ...context, message: {
          type: 'error',
          text: error.message
        }
      })
      navigate(-1)
    }
  })

  useEffect(() => {
    if (!context.token) {
      navigate('/401', { replace: true })
    }
    if (loggedUser?.data?.uri !== uri) {
      navigate('/403', { replace: true })
    } else {
      userDel.mutate(uri)
    }
  }, [])

  return (
    <></>
  )
}
export default DeleteUser