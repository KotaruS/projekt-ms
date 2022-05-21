import { useContext, useEffect } from "react"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { useNavigate, useParams } from "react-router-dom"
import { UserContext } from "../../App"
import { deleteGroup, getDataFromURI, getUser } from "../../lib/api"

function DeleteGroup() {
  const { context } = useContext(UserContext)
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

  const deleteG = useMutation(deleteGroup, {
    onSuccess: () => {
      queryClient.invalidateQueries('group')
      queryClient.invalidateQueries(['user', 'me'])
      navigate('/', { replace: true })
    }
  })

  useEffect(() => {
    if (!context.token) {
      navigate('/401', { replace: true })
    }
    if (user.isSuccess && group.isSuccess && (user?.data?._id !== group?.data?.owner)) {
      navigate('/403', { replace: true })
    } else {
      deleteG.mutate(uri)
    }
  }, [])

  return (
    <></>
  )
}
export default DeleteGroup