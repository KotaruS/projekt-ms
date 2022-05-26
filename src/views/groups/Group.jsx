import { useQuery } from "react-query"
import { useParams, Link, useNavigate, useLocation } from "react-router-dom"
import { UserContext } from "../../App"
import { getDataFromURI, getUser } from "../../lib/api"
import { useContext, useState } from "react"
import Feed from "../Feed"
import { FaUsers, FaUserPlus, FaPlusSquare } from "react-icons/fa"
import { contains } from "../../lib/utility"
import { BlankCard, ContextMenu } from "../../components"
import GroupMembersList from "./GroupMembersList"

function Group() {
  const { context } = useContext(UserContext)
  const { uri } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [membersDialog, setMembersDialog] = useState(false)

  const group = useQuery(['group', uri], getDataFromURI, {
    retry: 0,
    onError: (error) => {
      if (error?.message === "Invalid URL address") {
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
    <>
      <GroupMembersList
        groupData={{ uri, owner: group?.data?.owner }}
        state={membersDialog}
        setState={setMembersDialog}
      />
      <div className="detail">
        <div className="group-card">
          <div className="header">
            {(user && (user?.data?._id === group?.data?.owner) || (contains(user?.data?._id, group?.data?.members))) &&
              <ContextMenu
                className='absolute-r'
                content={[
                  ...(user?.data?._id === group?.data?.owner)
                    ? [{
                      text: 'Edit group',
                      link: 'edit',
                    },
                    ...(group?.data?.pendingMembers?.length !== 0)
                      ? [{
                        text: 'View pending members',
                        func: () => setMembersDialog({ pendingList: true }),
                      }]
                      : [],
                    {
                      text: 'Delete group',
                      link: 'delete',
                    }]
                    : (contains(user?.data?._id, group?.data?.members))
                      ? [{
                        text: 'Leave group',
                        link: 'leave',
                      }]
                      : [],
                ]}
              />}
            <img src={group?.data.image ? group?.data?.image : '/group-blank.svg'} alt={group?.data?.name} />
            <h2>{group?.data?.name}</h2>
          </div>
          <p>{group?.data?.description}</p>
          {group?.data?.members &&
            <div className="stats">
              <div className="icon-group buttoner" style={color}
                onClick={() => setMembersDialog(true)}
                title="Show members of the group">
                <FaUsers className="icon" />
                <span>{(group?.data?.members?.length > 1 || group?.data?.members?.length === 0)
                  ? group?.data?.members?.length + ' members'
                  : group?.data?.members?.length + ' member'}</span>
              </div>
            </div>
          }
        </div>
        {user.isSuccess &&
          <div className="button-group">
            {group.isSuccess && (contains(user?.data?._id, group?.data?.members))
              ? <Link to="/post/create" state={{ background: location, group: group?.data?._id }} >
                <button className="blue"><FaPlusSquare />Create Post</button>
              </Link>
              : <Link to="join" >
                <button className="blue">
                  <FaUserPlus />
                  Join group
                </button>
              </Link>
            }
          </div>
        }
        <h4>Posts</h4>
        {group?.data?.posts?.length !== 0
          ? <Feed />
          : <BlankCard>
            <h5>It seems there are no posts</h5>
            <p>Nobody in the group has posted yet or you need to be a member of the group to see them</p>
          </BlankCard>}
      </div>
    </>
  )
}
export default Group