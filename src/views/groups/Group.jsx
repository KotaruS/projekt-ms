import { useMutation, useQuery, useQueryClient } from "react-query"
import { useParams, Link, useNavigate, useLocation } from "react-router-dom"
import { UserContext } from "../../App"
import { getDataFromURI, getUser } from "../../lib/api"
import { useContext } from "react"
import Feed from "../Feed"
import { FaUsers, FaUserPlus, FaPen, FaGhost, FaTrash, FaPlusSquare } from "react-icons/fa"
import { contains } from "../../lib/utility"
import { ContextMenu } from "../../components"

function Group() {
  const { context, setContext } = useContext(UserContext)
  const queryClient = useQueryClient()
  const { uri } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const group = useQuery(['group', uri], getDataFromURI, {
    retry: 0,
    onError: (error) => {
      if (error.message === "Invalid URL address") {
        navigate('/404', { replace: true })
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
          {((user?.data?._id === group?.data?.owner) || (contains(user?.data?._id, group?.data?.members))) &&
            <ContextMenu
              className='absolute-r'
              content={[
                ...(user?.data?._id === group?.data?.owner)
                  ? [{
                    text: 'Edit group',
                    link: 'edit',
                  },
                  {
                    text: 'Delete group',
                    link: 'delete',
                  }]
                  : [],
                ...(contains(user?.data?._id, group?.data?.members))
                  ? [{
                    text: 'Leave group',
                    link: 'leave',
                  }]
                  : [],
              ]}
            />}
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
      {user.isSuccess &&
        <div className="button-group">
          {group.isSuccess && (contains(user?.data?._id, group?.data?.members))
            ? <Link to="/post/create" state={{ background: location, group: group?.data?._id }} >
              <button className="blue"><FaPlusSquare />Create Post</button>
            </Link>
            : <Link to="join" >
              <button className="blue">
                <FaUserPlus />Join group
              </button>
            </Link>
          }
        </div>
      }
      {group?.data?.posts?.length !== 0
        ? <Feed />
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