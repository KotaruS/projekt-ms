import { updateGroup } from "../../lib/api"
import GroupForm from "./GroupForm"
import { useContext, useEffect } from "react"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { useNavigate, useParams } from "react-router-dom"
import { UserContext } from "../../App"
import { getDataFromURI, getUser } from "../../lib/api"

function UpdateGroup() {
  const { context, setContext } = useContext(UserContext)
  const { uri } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const user = useQuery(['user', 'me'], getUser, {
    retry: 1,
    enabled: !!context.token
  })
  const group = useQuery(['group', uri], getDataFromURI, {
    retry: 0,
  })

  useEffect(() => {
    if (!context.token) {
      navigate('/401', { replace: true })
    }
  }, [])

  if (user.isSuccess && group.isSuccess && (user?.data?._id !== group?.data?.owner)) {
    navigate('/403', { replace: true })
  }

  const update = useMutation(updateGroup, {
    onSuccess: data => {
      setContext({
        ...context, message: {
          type: 'success',
          text: `Group ${data.name} updated!`
        }
      })
      queryClient.invalidateQueries(['user', 'me'])
      queryClient.invalidateQueries(['group', data.uri])
      navigate(`/group/${data.uri}`)
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
    <GroupForm mutation={update} prefill={group.data} title="Edit group details" />
  )
}
export default UpdateGroup
