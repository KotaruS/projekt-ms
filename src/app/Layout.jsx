import { useContext, useEffect, useRef, useState, } from "react"
import { Outlet, Link, useLocation, useSearchParams } from "react-router-dom"
import Logo from "../styles/logo.svg"
import LogoIcon from "../styles/logo-icon.svg"
import { UserContext } from "../App"
import {
  FaSignOutAlt,
  FaSignInAlt,
  FaRegPlusSquare,
  FaBars,
  FaShapes,
  FaCrown,
} from "react-icons/fa"
import { useQuery } from "react-query"
import { getUser } from "../lib/api"
import { Toast } from "../components"

function Layout() {
  const { context, setContext } = useContext(UserContext)
  const [navbar, setNavbar] = useState(false)
  const user = useQuery(['user', 'me'], getUser, {
    retry: 1,
    enabled: !!context.token
  })
  const location = useLocation()
  const color = { '--color': 'var(--purple)' }

  return (
    <>
      <Toast getter={context} setter={setContext} />
      <nav className="main-nav">
        <Link className="spacer" to='/'>
          <img src={Logo} alt="logo" width="140" />
        </Link>
        <Link className="mobile" to='/'>
          <img src={LogoIcon} alt="logo" width="40" />
        </Link>
        <form action="/" method="get">
          <input type="search" name="searchbar" id="searchbar-top" placeholder="Search for groups or posts..." />
        </form>
        <button className="mobile menu" onClick={() => setNavbar(!navbar)}>
          <FaBars />
        </button>
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
        <nav className={navbar === true
          ? 'side-nav show'
          : 'side-nav'}>
          {user.isSuccess
            ? <>
              <Link className="profile"
                to={`/user/${user.data?.uri}`}
                title="Go to your profile"
                onClick={() => setNavbar(false)} >
                <img className="profile-image" src={user.data?.image || '/user-blank.svg'} onError={(e) => e.target.src = '/user-blank.svg'} alt="user image" />
                <h4>{user.data?.name}</h4>
              </Link>
              <ul className="mobile buttons">
                <li><Link to='/post/create' className="btn" style={color}
                  onClick={() => setNavbar(false)}>
                  <FaRegPlusSquare /> Create post
                </Link></li>
                <li><Link to='/group/create' className="btn" style={color}
                  onClick={() => setNavbar(false)}>
                  <FaRegPlusSquare /> Create group
                </Link></li>
                <li><Link to='/logout' className="btn" style={color}
                  onClick={() => setNavbar(false)}>
                  <FaSignOutAlt />Log out
                </Link></li>
              </ul>
              <div>
                <FaShapes className="icon" />
                <h4>Groups</h4>
              </div>
              <ul>
                {user.data?.groups.map(({ uri, name, owner }) => (
                  <li key={uri}>
                    <Link to={`/group/${uri}`}
                      onClick={() => setNavbar(false)}>
                      {name}
                      {owner === user?.data?._id &&
                        <FaCrown className="icon" />
                      }
                    </Link>
                  </li>
                ))}
              </ul>
            </>
            : <>
              <h4>To see more please login</h4>
              <ul className="mobile buttons">
                <li><Link to='/login' className="btn" style={color} state={{ background: location }}
                  onClick={() => setNavbar(false)}>
                  <FaSignInAlt />Sign in
                </Link></li>
                <li><Link to='/register' className="btn" style={color} state={{ background: location }}
                  onClick={() => setNavbar(false)}>
                  <FaSignInAlt />Sign up
                </Link></li>
              </ul>
            </>
          }
        </nav>
        <Outlet />
      </div>
      <footer>
        <img src={Logo} alt="logo" className="desktop" />
        <div>Reactí projekt k předmětu OWE</div>
        <div>©2022 Martin Soukup</div>
      </footer>
    </>
  )
}
export default Layout
