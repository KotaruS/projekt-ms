import { useMutation, useQuery, useQueryClient } from "react-query"
import { useParams, Link } from "react-router-dom"
import { UserContext } from "../../App"
import {
  FaCalendar,
  FaCommentAlt,
  FaPaperPlane,
  FaShapes,
  FaTrash,
} from "react-icons/fa"
import { getDataFromURI, getUser, createComment, deleteComment } from "../../lib/api"
import { useContext } from "react"

function Post() {
  const { context, setContext } = useContext(UserContext)
  const queryClient = useQueryClient()
  const { uri } = useParams()
  const post = useQuery(['post', uri], getDataFromURI)
  const { data: user } = useQuery(['user', 'me'], getUser, {
    retry: 1,
    enabled: !!context.token
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
    deleteCom.mutate({ uri })
  }

  return post.isSuccess && (
    <div className="detail">
      <div className="post-card" >
        <div className="header">
          <Link className="buttoner item" style={color} to={`/user/${post.data.author.uri}`}>
            <img src="/user-blank.svg" />
            {post.data.author.name}
          </Link>
          <div>in </div>
          <Link className="buttoner item" style={color} to={`/group/${post.data.group.uri}`}>
            <img src="/group-blank.svg" />
            {post.data.group.name}
          </Link>
          <div className="icon-group" style={color}>
            <FaCalendar className="icon" />
            <span>{context.dateFormat.format(new Date(post.data.updatedAt))}</span>
          </div>
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
          <form action="/" onSubmit={handleSubmit} method="post">
            <img src={post.data.author.image || '/user-blank.svg'} alt={post.data.author.naem} />
            <textarea
              name="comment"
              id="comment"
              placeholder="Write your thoughts..."
              rows={4}
              required
            />
            <button type="submit"><FaPaperPlane /></button>
          </form>
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
                  <FaTrash title="Delete comment" className="delete" onClick={e => { handleClick(e, comment._id) }} />
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