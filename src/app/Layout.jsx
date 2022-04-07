import { Outlet, Link } from "react-router-dom"

function Layout() {
  return (
    <>
      <h1>Layout</h1>
      <Link to='/'>Home</Link>
      <Link to='/login'>Login</Link>
      <Link to='/register'>Register</Link>

      <div>
        <Outlet />
      </div>
    </>
  )
}
export default Layout