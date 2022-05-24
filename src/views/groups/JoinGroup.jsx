import { useContext, useEffect } from "react"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { useNavigate, useParams } from "react-router-dom"
import { UserContext } from "../../App"
import { getDataFromURI, getUser, joinGroup } from "../../lib/api"
import { contains } from "../../lib/utility"

function JoinGroup() {
  const { context, setContext } = useContext(UserContext)
  const queryClient = useQueryClient()
  const { uri } = useParams()
  const navigate = useNavigate()
  const user = useQuery(['user', 'me'], getUser, {
    retry: 1,
    enabled: !!context.token
  })
  const group = useQuery(['group', uri], getDataFromURI, {
    retry: 0,
    onError: (error) => {
      if (error.message === "Invalid URL address") {
        navigate('/404', { replace: true })
      }
    }
  })

  const joinG = useMutation(joinGroup, {
    onSuccess: data => {
      queryClient.invalidateQueries('group')
      queryClient.invalidateQueries(['user', 'me'])
      setContext({
        ...context, message: {
          type: 'success',
          text: data.message
        }
      })
      navigate(-1)
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
    if (user.isSuccess && group.isSuccess &&
      (contains(user?.data?._id, group?.data?.members))) {
      navigate('/404', { replace: true })
    } else {
      joinG.mutate(uri)
    }
  }, [])

  return (
    <></>
  )
}
export default JoinGroup