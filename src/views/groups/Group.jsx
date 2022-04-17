import { useMutation, useQuery, useQueryClient } from "react-query"
import { useParams, Link } from "react-router-dom"
import { UserContext } from "../../App"
import { getDataFromURI, getUser, createComment, deleteComment } from "../../lib/api"
import { useContext } from "react"
import Feed from "../Feed"
import { FaUsers } from "react-icons/fa"

function Group() {
  const { context, setContext } = useContext(UserContext)
  const queryClient = useQueryClient()
  const { uri } = useParams()

  const group = useQuery(['group', uri], getDataFromURI)
  // const { data: user } = useQuery(['user', 'me'], getUser, {
  //   retry: 1,
  //   enabled: !!context.token
  // })
  const color = { '--color': 'var(--purple)' }

  return group.isSuccess && (
    <div className="detail">
      <div className="group-card">
        <div className="header">
          <img src={group.data.image ? group.data.image : '/group-blank.svg'} alt={group.data.name} />
          <h2>{group.data.name}</h2>
        </div>
        <p>{group.data.description}</p>
        <div className="stats">
          <div className="icon-group" style={color}>
            <FaUsers className="icon" />
            <span>{(group.data.members.length > 1 || group.data.members.length === 0)
              ? group.data.members.length + ' members'
              : group.data.members.length + ' member'}</span>
          </div>
        </div>
      </div>
      <Feed />

    </div>
  )
}
export default Group