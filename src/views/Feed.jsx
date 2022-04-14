import { useContext } from "react"
import { useQuery } from "react-query"
import { Link, useNavigate } from "react-router-dom"
import { UserContext } from "../App"
import { getPosts } from "../lib/api"
import { FaCommentAlt, FaCalendar } from 'react-icons/fa'

function Feed() {
  const feed = useQuery('posts', getPosts)
  const { context, setContext } = useContext(UserContext)
  const color = { '--color': 'var(--blue)' }
  const navigate = useNavigate()
  const handleClick = (uri) => {
    navigate(`/post/${uri}`)
  }

  return feed.isSuccess && (
    <>
      <h1>Today's posts</h1>
      {feed.data.map((post) => (
        <div key={post._id} className="post-feed-card" >
          <div className="post-info">
            <div>Posted in <Link className="buttoner" style={color} to={`/group/${post.group.uri}`}>{post.group.name}</Link> </div>
            <div>by <Link className="buttoner" style={color} to={`/user/${post.author.uri}`}>{post.author.name}</Link></div>
            <div className="icon-group" style={color}>
              <FaCalendar className="icon" />
              <span>{context.dateFormat.format(new Date(post.updatedAt))}</span>
            </div>
          </div>
          <Link to={`/post/${post.uri}`}><h3>{post.title}</h3>
            <div className="content" >{post.content}</div></Link>
          <div className="tools" >
            <div className="icon-group" style={color}>
              <FaCommentAlt className="icon" />
              <span>{(post.comments.length > 1 || post.comments.length === 0)
                ? post.comments.length + ' comments'
                : post.comments.length + ' comment'}</span>
            </div>
          </div>
        </div>
      ))
      }
    </>
  )
}

export default Feed