import { updateGroup } from "../../lib/api"
import GroupForm from "./GroupForm"
import { useContext } from "react"
import { useQuery } from "react-query"
import { useNavigate, useParams } from "react-router-dom"
import { UserContext } from "../../App"
import { getDataFromURI, getUser } from "../../lib/api"

function UpdateGroup() {
  const { context, setContext } = useContext(UserContext)
  const { uri } = useParams()
  const navigate = useNavigate()
  const user = useQuery(['user', 'me'], getUser, {
    retry: 1,
    enabled: !!context.token
  })
  const group = useQuery(['group', uri], getDataFromURI, {
    retry: 0,
  })
  if (user.isSuccess && group.isSuccess && (user?.data?._id !== group?.data?.owner)) {
    navigate('/404')
  }

  return (
    <GroupForm mutationFunc={updateGroup} prefill={group.data} title="Edit group details" />
  )
}
export default UpdateGroup
