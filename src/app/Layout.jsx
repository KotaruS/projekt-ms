import { useContext, } from "react"
import { Outlet, Link, useLocation } from "react-router-dom"
import Logo from "../styles/logo.svg"
import { UserContext } from "../App"
import {
  FaSignOutAlt,
  FaSignInAlt,
  FaRegPlusSquare,
  FaShapes,
} from "react-icons/fa"
import { useQuery } from "react-query"
import { getUser } from "../lib/api"

function Layout() {
  const { context, setContext } = useContext(UserContext)

  const user = useQuery(['user', 'me'], getUser, {
    retry: 1,
    enabled: !!context.token
  })

  const location = useLocation()
  const color = { '--color': 'var(--purple)' }
  const handleScroll = e => {
    console.log("aeea");
  }

  return (
    <>
      <nav className="main-nav">
        <Link className="spacer" to='/'>
          <img src={Logo} alt="logo" width="200" />
        </Link>
        <form action="/" method="get">
          <input type="search" name="searchbar" id="searchbar-top" placeholder="Search for groups or posts..." />
        </form>
        <ul>
          {user.isSuccess ?
            <>
              <li><Link to='/post/create' className="btn" style={color}>
                <FaRegPlusSquare /> Create post
              </Link></li>
              <li><Link to='/group/create' className="btn" style={color}>
                <FaRegPlusSquare /> Create group
              </Link></li>
              <li><Link to='/logout' className="btn" style={color} >
                <FaSignOutAlt />Log out
              </Link></li>
            </>
            : <>
              <li><Link to='/login' className="btn" style={color} state={{ background: location }}>
                <FaSignInAlt />Sign in
              </Link></li>
              <li><Link to='/register' className="btn" style={color} state={{ background: location }}>
                <FaSignInAlt />Sign up
              </Link></li>
            </>
          }
        </ul>
      </nav>
      <div className="page-content" >
        <nav className="side-nav" >
          {user.isSuccess && (
            <>
              <Link to={`/user/${user.data?.uri}`} title="Go to your profile" className="profile">
                <img className="profile-image" src={user.data?.image || '/user-blank.svg'} onError={(e) => e.target.src = '/user-blank.svg'} alt="user image" />
                <h4>{user.data?.name}</h4>
              </Link>
              <div>
                <FaShapes className="icon" /><h4>Groups</h4>
              </div>
              <ul>
                {user.data?.groups.map(({ uri, name }) => (
                  <li key={uri}><Link to={`/group/${uri}`}>{name}</Link></li>
                ))
                }
              </ul>
            </>)
          }
        </nav>
        <Outlet />
      </div>
    </>
  )
}
export default Layout