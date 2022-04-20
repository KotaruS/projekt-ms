import { useMutation, useQuery, useQueryClient } from "react-query"
import { useParams, Link } from "react-router-dom"
import { UserContext } from "../../App"
import { getDataFromURI, getUser, createComment, deleteComment, joinGroup } from "../../lib/api"
import { useContext } from "react"
import Feed from "../Feed"
import { FaUsers, FaUserPlus } from "react-icons/fa"

function Group() {
  const { context, setContext } = useContext(UserContext)
  const queryClient = useQueryClient()
  const { uri } = useParams()
  const joinG = useMutation(joinGroup)
  const group = useQuery(['group', uri], getDataFromURI)
  const user = useQuery(['user', 'me'], getUser, {
    retry: 1,
    enabled: !!context.token
  })
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
      {user.isSuccess && (
        <div className="button-group">
          <button onClick={() => joinG.mutate(group.data?.uri)}><FaUserPlus />Join group</button>
        </div>
      )}
      <Feed />

    </div>
  )
}
export default Group