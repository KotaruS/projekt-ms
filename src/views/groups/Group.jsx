import { useMutation, useQuery, useQueryClient } from "react-query"
import { useParams, Link, useNavigate } from "react-router-dom"
import { UserContext } from "../../App"
import { getDataFromURI, getUser, joinGroup } from "../../lib/api"
import { useContext } from "react"
import Feed from "../Feed"
import { FaUsers, FaUserPlus, FaPen, FaGhost } from "react-icons/fa"
import { contains } from "../../lib/utility"

function Group() {
  const { context, setContext } = useContext(UserContext)
  const queryClient = useQueryClient()
  const { uri } = useParams()
  const navigate = useNavigate()
  const joinG = useMutation(joinGroup, {
    onSuccess: () => {
      queryClient.invalidateQueries('group')
      queryClient.invalidateQueries(['user', 'me'])
    }
  })
  const group = useQuery(['group', uri], getDataFromURI, {
    retry: 0,
    onError: (error) => {
      if (error.message === "Invalid URL address") {
        navigate('/404')
      }
    }
  })
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
      <div className="button-group">
        {user.isSuccess && group.isSuccess && (!contains(user?.data?._id, group?.data?.members)) && (
          <button onClick={() => joinG.mutate(group.data?.uri)}><FaUserPlus />Join group</button>
        )}
        {user.isSuccess && (user?.data?._id === group?.data?.owner) && (
          <Link to="edit" >
            <button><FaPen />Edit group</button>
          </Link>
        )}
      </div>
      {group?.data?.posts?.length !== 0 ? <Feed />
        : <div className="problem-card">
          <FaGhost />
          <div>
            <h4>It seems there are no posts</h4>
            <p>just this friendly ghost...</p>
          </div>
        </div>}
    </div>
  )
}
export default Group