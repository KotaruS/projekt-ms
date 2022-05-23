import { useQuery, } from "react-query"
import { useParams, Link, useNavigate } from "react-router-dom"
import { UserContext } from "../../App"
import { getUser, } from "../../lib/api"
import { useContext } from "react"
import Feed from "../Feed"
import { ContextMenu } from "../../components"
import { FaGhost } from "react-icons/fa"

function User() {
  const { uri } = useParams('uri')
  const navigate = useNavigate()
  const { context, setContext } = useContext(UserContext)
  const { data: user, isSuccess } = useQuery(['profile', uri], getUser, {
    retry: 0,
    onError: (error) => {
      if (error.message === "Invalid URL address") {
        navigate('/404')
      }
    }
  })

  const loggedUser = useQuery(['user', 'me'], getUser, {
    retry: 1,
    enabled: !!context.token
  })

  return isSuccess && (
    <div className="detail">
      <div className="user-card" >
        <div className="header">
          <img src={user.image ? user.image : '/user-blank.svg'} alt={user.name} />
          <h2>{user.name}</h2>
          {loggedUser?.data?._id === user?._id &&
            <ContextMenu
              className='absolute-r'
              content={[
                {
                  text: 'Change password',
                  link: 'pswd',
                },
                {
                  text: 'Edit profile',
                  link: 'edit',
                },
                {
                  text: 'Delete profile',
                  link: 'delete',
                },
              ]}
            />}
        </div>
      </div>
      {user?.groups?.length !== 0
        ? <>
          <h4>Groups</h4>
          <div className="group-list">
            {user.groups?.map(group =>
              <div className="card" key={group?._id}>
                <Link to={`/group/${group?.uri}`}>
                  <img src={group?.image || '/group-blank.svg'} alt={group?.name} />
                  <span>
                    {group?.name}
                  </span>
                </Link>
              </div>
            )}
          </div>
        </>
        : <div className="problem-card">
          <FaGhost />
          <div>
            <h5>It seems there are no groups</h5>
            <p>{user?.name} either hasn't joined any or he doesn't want anyone to see his groups...</p>
          </div>
        </div>
      }
      <h4>Posts</h4>
      {user?.posts?.length !== 0
        ? <Feed />
        : <div className="problem-card">
          <FaGhost />
          <div>
            <h5>It seems there are no posts</h5>
            <p>{user?.name} either hasn't posted yet or he doesn't want anyone to see his posts...</p>
          </div>
        </div>
      }
    </div>
  )
}
export default User