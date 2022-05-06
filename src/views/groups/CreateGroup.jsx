import { createGroup } from "../../lib/api"
import GroupForm from "./GroupForm"

function CreateGroup() {

  return (
    <GroupForm mutationFunc={createGroup} title="Create a new group" />
  )
}
export default CreateGroup