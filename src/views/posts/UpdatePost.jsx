import { useContext, useEffect } from "react"
import { useQuery } from "react-query"
import { useNavigate, useParams } from "react-router-dom"
import { UserContext } from "../../App"
import { getDataFromURI, getUser, updatePost } from "../../lib/api"
import PostForm from "./PostForm"

function UpdatePost() {
  const { context, setContext } = useContext(UserContext)
  const { uri } = useParams()
  const navigate = useNavigate()
  const user = useQuery(['user', 'me'], getUser, {
    retry: 1,
    enabled: !!context.token
  })
  const post = useQuery(['post', uri], getDataFromURI, {
    retry: 0,
  })

  useEffect(() => {
    if (!context.token) {
      navigate('/401', { replace: true })
    }
  }, [])

  if (user.isSuccess && post.isSuccess && (user?.data?._id !== post?.data?.author?._id)) {
    navigate('/403', { replace: true })
  }

  return (user.isSuccess && post.isSuccess) && (
    <PostForm mutationFunc={updatePost} prefill={post.data} title="Edit post" />
  )
}
export default UpdatePost