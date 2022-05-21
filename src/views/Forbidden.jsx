import { Link } from "react-router-dom"

function Forbidden() {
  return (
    <>
      <div className="error-page">
        <h1>401: Forbidden</h1>
        <h2>It seems that you are not authorized to access the resource.</h2>
        <p>In case you want to go back ⬇️</p>
        <Link to="/">Take me home <sup>country roads</sup></Link>
      </div>
      <div className="blur-background"></div>
    </>
  )
}
export default Forbidden