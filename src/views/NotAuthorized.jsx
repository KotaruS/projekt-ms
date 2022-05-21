import { Link } from "react-router-dom"

function NotAuthorized() {
  return (
    <>
      <div className="error-page">
        <h1>401: Not Authorized</h1>
        <h2>I am terribly sorry, but this page is not available to you.</h2>
        <p>If you want to view this page you might need to log in or register</p>
        <Link to="/login">Log in</Link>
        <p>or</p>
        <Link to="/register">Register</Link>
        <p>or you can always go back</p>
        <Link to="/">Take me home <sup>country roads</sup></Link>
      </div>
      <div className="blur-background"></div>
    </>
  )
}
export default NotAuthorized