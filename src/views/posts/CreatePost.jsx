import { useContext, useEffect, useState } from "react"
import { useMutation, useQueryClient } from "react-query"
import { useLocation, useNavigate } from "react-router-dom"
import { UserContext } from "../../App"
import { createPost } from "../../lib/api"
import PostForm from "./PostForm"

function CreatePost() {
  const { context, setContext } = useContext(UserContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [group, setGroup] = useState(null)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!context.token) {
      navigate('/401', { replace: true })
    }
    if (location.state?.group) {
      setGroup({ group: { _id: location.state?.group } })
    } else {
      setGroup('empty')
    }
  }, [location])

  const create = useMutation(createPost, {
    onSuccess: data => {
      setContext({
        ...context, message: {
          type: 'success',
          text: `You have created a new post!`
        }
      })
      queryClient.invalidateQueries(['user', 'me'])
      queryClient.invalidateQueries(['posts'])
      queryClient.invalidateQueries(['post', data.uri])
      navigate('/')
    },
    onError: error => {
      setContext({
        ...context, message: {
          type: 'error',
          text: error.message
        }
      })
    }
  })
  return group && (
    <PostForm mutation={create} prefill={group} title="Create a new post" />
  )
}
export default CreatePost