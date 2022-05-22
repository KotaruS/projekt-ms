import { useContext, useEffect } from "react"
import { useMutation, useQueryClient } from "react-query"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../../App"
import { createGroup } from "../../lib/api"
import GroupForm from "./GroupForm"

function CreateGroup() {
  const { context, setContext } = useContext(UserContext)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!context.token) {
      navigate('/401', { replace: true })
    }
  }, [])

  const create = useMutation(createGroup, {
    onSuccess: data => {
      setContext({
        ...context, message: {
          type: 'success',
          text: `Group ${data.name} created!`
        }
      })
      queryClient.invalidateQueries(['user', 'me'])
      queryClient.invalidateQueries(['group', data.uri])
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

  return (
    <GroupForm mutation={create} title="Create a new group" />
  )
}
export default CreateGroup