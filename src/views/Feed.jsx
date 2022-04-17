import { useContext, useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { UserContext } from "../App"
import { getPosts, getUser, deletePost } from "../lib/api"
import { FaCommentAlt, FaCalendar, FaTrash } from 'react-icons/fa'

function Feed() {
  const queryClient = useQueryClient()
  const { context, setContext } = useContext(UserContext)
  const [path, setPath] = useState('')
  const location = useLocation()
  const feed = useQuery(['posts', ...path], getPosts)
  const { data: user } = useQuery(['user', 'me'], getUser, {
    retry: 1,
    enabled: !!context.token
  })
  useEffect(() => {
    const path = location.pathname.split('/')
    const keys = path.slice(path.length - 2)
    if (keys[0]) {
      setPath(keys)
    } else {
      setPath('')
    }
  }, [location])


  const color = { '--color': 'var(--blue)' }
  const postDel = useMutation(deletePost, {
    onSuccess: () => {
      queryClient.invalidateQueries('posts')
    }
  })

  const handleClick = (e, uri) => {
    postDel.mutate({ uri })
  }

  return !!feed.data && (
    <div className="feed">
      {feed.data.map((post) => (
        <div key={post._id} className="post-feed-card" >
          <div className="post-info">
            <div>Posted in <Link className="buttoner" style={color} to={`/group/${post.group.uri}`}>{post.group.name}</Link> </div>
            <div>by <Link className="buttoner" style={color} to={`/user/${post.author.uri}`}>{post.author.name}</Link></div>
            <div className="icon-group" style={color}>
              <FaCalendar className="icon" />
              <span>{context.timeFormat.format(new Date(post.createdAt)) + ' | ' + context.dateFormat.format(new Date(post.createdAt))}</span>
            </div>
            {(user?._id == post.author._id) &&
              <FaTrash title="Delete comment" className="delete" onClick={e => { handleClick(e, post.uri) }} />
            }
          </div>
          <Link to={`/post/${post.uri}`}><h3>{post.title}</h3>
            <div className="content" >
              {post.image ? <img src={post.image} alt={post.title} /> : post.content}
            </div></Link>
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
    </div>
  )
}

export default Feed