import { useContext, useEffect } from "react"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { useNavigate, useParams } from "react-router-dom"
import { UserContext } from "../../App"
import { deletePost, getDataFromURI, getUser } from "../../lib/api"

function DeletePost() {
  const { context } = useContext(UserContext)
  const queryClient = useQueryClient()
  const { uri } = useParams()
  const navigate = useNavigate()
  const user = useQuery(['user', 'me'], getUser, {
    retry: 1,
    enabled: !!context.token
  })
  const post = useQuery(['post', uri], getDataFromURI, {
    retry: 0,
  })
  const postDel = useMutation(deletePost, {
    onSuccess: () => {
      queryClient.invalidateQueries('posts')
      navigate('/', { replace: true })
    }
  })

  useEffect(() => {
    if (!context.token) {
      navigate('/401', { replace: true })
    }
    if (user.isSuccess && post.isSuccess && (user?.data?._id !== post?.data?.author?._id)) {
      navigate('/403', { replace: true })
    } else {
      postDel.mutate(uri)
    }
  }, [])

  return (
    <></>
  )
}
export default DeletePost