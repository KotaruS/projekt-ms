import { useQuery, } from "react-query"
import { useParams, Link, useNavigate } from "react-router-dom"
import { UserContext } from "../../App"
import { getUser, } from "../../lib/api"
import { useContext } from "react"
import Feed from "../Feed"
import { ContextMenu } from "../../components"

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
      <Feed />

    </div>
  )
}
export default User