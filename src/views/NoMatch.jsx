import { Link } from "react-router-dom"

function NoMatch() {
  return (
    <>
      <div className="no-match">
        <h1>Error 404</h1>
        <h2>You have wondered far beyond our reach.🤌</h2>
        <p>I am afraid the thing you're looking for doesn't exist,</p>
        <Link to="/">Take me home <sup>country roads</sup></Link>
      </div>
      <div className="blur-background"></div>
    </>
  )
}
export default NoMatch