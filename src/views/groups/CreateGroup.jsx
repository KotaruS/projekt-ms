import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../../App"
import { createGroup } from "../../lib/api"
import GroupForm from "./GroupForm"

function CreateGroup() {
  const { context } = useContext(UserContext)
  const navigate = useNavigate()
  useEffect(() => {
    if (!context.token) {
      navigate('/401', { replace: true })
    }
  }, [])
  return (
    <GroupForm mutationFunc={createGroup} title="Create a new group" />
  )
}
export default CreateGroup