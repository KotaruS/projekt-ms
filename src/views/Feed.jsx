import { Link } from "react-router-dom"

function Feed() {
  return (
    <div className="Feed">
      <h1>Feed links</h1>
      <Link to='/'>Home</Link>
      <Link to='/login'>login</Link>
      <Link to='/register'>register</Link>
    </div>
  )
}

export default Feed