import { useMutation, useQuery, useQueryClient } from "react-query"
import { useParams, Link, useNavigate } from "react-router-dom"
import { UserContext } from "../../App"
import {
  FaCalendar,
  FaCommentAlt,
  FaPaperPlane,
  FaShapes,
  FaTrash,
} from "react-icons/fa"
import { getDataFromURI, getUser, createComment, deleteComment, deletePost } from "../../lib/api"
import { useContext } from "react"

function Post() {
  const { context, setContext } = useContext(UserContext)
  const queryClient = useQueryClient()
  const { uri } = useParams()
  const navigate = useNavigate()
  const post = useQuery(['post', uri], getDataFromURI)
  const { data: user } = useQuery(['user', 'me'], getUser, {
    retry: 1,
    enabled: !!context.token
  })
  const postDel = useMutation(deletePost, {
    onSuccess: () => {
      queryClient.invalidateQueries('posts')
    }
  })

  const sendComment = useMutation(createComment, {
    onSuccess: () => {
      queryClient.invalidateQueries(['post', uri])
    }
  })
  const deleteCom = useMutation(deleteComment, {
    onSuccess: () => {
      queryClient.invalidateQueries(['post', uri])
    }
  })

  const color = { '--color': 'var(--purple)' }
  const color2 = { '--color': 'var(--blue)' }
  const handleSubmit = e => {
    e.preventDefault()
    sendComment.mutate({
      uri: uri,
      data: { content: e.target.comment.value }
    })
    e.target.comment.value = ''
  }
  const handleClick = (e, uri) => {
    postDel.mutate({ uri })
    navigate('/')
  }

  return post.isSuccess && (
    <div className="detail">
      <div className="post-card" >
        <div className="header">
          <div className="label">By</div>
          <Link className="buttoner item" style={color} to={`/user/${post.data.author.uri}`}>
            <img src={post.data.author.image || "/user-blank.svg"} alt="user icon" />
            {post.data.author.name}
          </Link>
          <div className="label">in</div>
          <Link className="buttoner item" style={color} to={`/group/${post.data.group.uri}`}>
            <img src={post.data.group.image || "/group-blank.svg"} alt="group icon" />
            {post.data.group.name}
          </Link>
          <div className="icon-group" style={color2}>
            <FaCalendar className="icon" />
            <span>{context.dateFormat.format(new Date(post.data.updatedAt))}</span>
          </div>
          {(user?._id === post.data.author._id) &&
            <FaTrash title="Delete comment" className="delete" onClick={e => handleClick(e, post.data.uri)} />
          }
        </div>
        <div className="body">
          <h2>{post.data.title}</h2>
          <p>{post.data.content}</p>
          {post.data.image &&
            <img src={post.data.image} alt={post.data.title} />
          }
        </div>
        <div className="tools">
          <div className="icon-group" style={color2}>
            <FaCommentAlt className="icon" />
            <span>{(post.data.comments.length > 1 || post.data.comments.length === 0)
              ? post.data.comments.length + ' comments'
              : post.data.comments.length + ' comment'}</span>
          </div>
        </div>
        <div className="comments">
          {user && (
            <form action="/" onSubmit={handleSubmit} method="post">
              <img src={user?.image || '/user-blank.svg'} alt={post.data.author.naem} />
              <textarea
                name="comment"
                id="comment"
                placeholder="Write your thoughts..."
                rows={4}
                required
              />
              <button type="submit"><FaPaperPlane /></button>
            </form>
          )}
          {post.data.comments.map(comment => (
            <div className="comment" key={comment.content} style={color2}>
              <div className="header">
                <Link className="buttoner" to={`/user/${comment.author.uri}`}>
                  <img src={comment.author.image || '/user-blank.svg'} alt={comment.author.name} />
                  <span>{comment.author.name}</span>
                </Link>
                <div className="icon-group">
                  <FaCalendar className="icon" />
                  <span>{context.timeFormat.format(new Date(comment.updatedAt)) + ' | ' + context.dateFormat.format(new Date(comment.updatedAt))}</span>
                </div>
                {(comment.author._id == user?._id) &&
                  <FaTrash title="Delete comment" className="delete" onClick={e => deleteCom.mutate({ uri: comment._id })} />
                }
              </div>
              <p>
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
export default Post