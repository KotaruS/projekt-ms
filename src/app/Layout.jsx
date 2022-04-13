import { createContext, useContext, useMemo, useState } from "react"
import { Outlet, Link, useLocation } from "react-router-dom"
import Logo from "../logo.svg"
import { backend_url, UserContext } from "../App"
import { useQuery } from "react-query"
import { getUser } from "../lib/api"

function Layout() {
  const { context, setContext } = useContext(UserContext)
  const user = useQuery(['user', 'me',], getUser, { retry: 1 })
  // const userGroups = useQuery('userGroups', getUserGroups)
  const location = useLocation()
  return (
    <>
      <nav className="main-nav">
        <Link to='/'>
          <img src={Logo} alt="logo" width="200" />
        </Link>
        <form action="/" method="get">
          <input type="search" name="searchbar" id="searchbar-top" placeholder="Search for groups or posts..." />
        </form>
        <ul>
          <li><Link to='/me'>Profile</Link></li>
          <li><Link to='/login' state={{ background: location }}>Login</Link></li>
          <li><Link to='/register' state={{ background: location }}>Register</Link></li>
        </ul>
      </nav>
      <div className="page-content">
        <nav className="side-nav">
          {user.isSuccess && (
            <>
              <div className="profile">
                <img className="profile-image" src={`/cdn/tm.svg`} alt="" />
                <h4>{user.data.name}</h4>
              </div>
              <h4>Groups</h4>
            </>
          )}
          <ul>
            <li><Link to='/'>Group 1</Link></li>
            <li><Link to='/'>Group 2</Link></li>
            <li><Link to='/'>Group 3</Link></li>
            <li><Link to='/'>Group 4</Link></li>
          </ul>
        </nav>
        <div className="feed">
          <Outlet />
        </div>
      </div>
    </>
  )
}
export default Layout