import { useContext, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { UserContext } from "../../App"
import { createPost } from "../../lib/api"
import PostForm from "./PostForm"

function CreatePost() {
  const { context } = useContext(UserContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [group, setGroup] = useState(null)
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
  return group && (
    <PostForm mutationFunc={createPost} prefill={group} title="Create a new post" />
  )
}
export default CreatePost