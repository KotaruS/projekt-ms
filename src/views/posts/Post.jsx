import { useMutation, useQuery, useQueryClient } from "react-query"
import { useParams, Link, useNavigate } from "react-router-dom"
import { UserContext } from "../../App"
import { FaCalendar, FaCommentAlt, FaPaperPlane, } from "react-icons/fa"
import { getDataFromURI, getUser, createComment, deleteComment, updateComment, } from "../../lib/api"
import { useContext, useEffect, useState } from "react"
import { ContextMenu, DismissArea } from "../../components"

function Post() {
  const [commentEdit, setCommentEdit] = useState(null)
  const { context, setContext } = useContext(UserContext)
  const queryClient = useQueryClient()
  const { uri } = useParams()
  const navigate = useNavigate()
  const post = useQuery(['post', uri], getDataFromURI, {
    retry: 0,
    onError: (error) => {
      if (error.message === "Invalid URL address") {
        navigate('/404')
      }
    }
  })
  const { data: user } = useQuery(['user', 'me'], getUser, {
    retry: 1,
    enabled: !!context.token
  })

  useEffect(() => {
    if (commentEdit) {
      document.querySelector(`.content[data-id="${commentEdit}"] textarea`).focus()
    }
  }, [commentEdit])

  const sendComment = useMutation(createComment, {
    onSuccess: () => {
      setContext({
        ...context, message: {
          type: 'success',
          text: `Comment sent!`
        }
      })
      queryClient.invalidateQueries(['post', uri])
    }
  })
  const deleteCom = useMutation(deleteComment, {
    onSuccess: () => {
      setContext({
        ...context, message: {
          text: `Comment deleted!`
        }
      })
      queryClient.invalidateQueries(['post', uri])
    }
  })

  const updateCom = useMutation(updateComment, {
    onSuccess: () => {
      setContext({
        ...context, message: {
          text: `Comment updated!`
        }
      })
      setCommentEdit(null)
      queryClient.invalidateQueries(['post', uri])
    },
    onError: error => {
      setContext({
        ...context, message: {
          type: 'error',
          text: error.message
        }
      })
    }
  })

  const color = { '--color': 'var(--purple)' }
  const color2 = { '--color': 'var(--blue)' }

  const editComment = id => {
    setCommentEdit(id)
  }

  const handleSubmit = e => {
    e.preventDefault()
    sendComment.mutate({
      uri: uri,
      data: { content: e.target.comment.value }
    })
    e.target.comment.value = ''
  }

  const handleUpdate = e => {
    e.preventDefault()
    updateCom.mutate({
      id: commentEdit,
      data: { content: e.target.comment.value }
    })
  }

  return post.isSuccess && (
    <>
      <div className="detail">
        <div className="post-card" >
          <div className="header">
            <div className="keeper">
              <div className="label">In</div>
              <Link className="buttoner item" style={color} to={`/group/${post.data.group?.uri}`}>
                <img src={post.data.group?.image || "/group-blank.svg"} alt="group icon" />
                {post.data.group?.name}
              </Link>
            </div>
            <div className="keeper">
              <div className="label">by</div>
              {post.data.author
                ? <Link className="buttoner item" style={color} to={`/user/${post.data.author?.uri}`}>
                  <img src={post.data.author?.image || "/user-blank.svg"} alt="user icon" />
                  {post.data.author?.name}
                </Link>
                : <>
                  <span className="buttoner item empty" style={color}>
                    <img src="/user-blank.svg" alt="user icon" />
                    deleted user
                  </span>
                </>
              }
            </div>
            <div className="icon-group" style={color}>
              <FaCalendar className="icon" />
              <span>{context.timeFormat.format(new Date(post.data.createdAt)) + ' | ' + context.dateFormat.format(new Date(post.data.createdAt))}</span>
            </div>
            {(user && user?._id === post.data.author?._id) &&
              <ContextMenu
                content={[
                  {
                    text: 'Edit post',
                    link: 'edit',
                  },
                  {
                    text: 'Delete post',
                    link: 'delete',
                  },
                ]}
              />
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
                <img src={user?.image || '/user-blank.svg'} alt={post.data.author?.name} />
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
                  {comment.author
                    ?
                    <Link className="buttoner" to={`/user/${comment.author?.uri}`}>
                      <img src={comment.author?.image || '/user-blank.svg'} alt={comment.author?.name} />
                      <span>{comment.author?.name}</span>
                    </Link>
                    : <span className="buttoner empty" >
                      <img src='/user-blank.svg' alt='deleted user' />
                      <span>deleted user</span>
                    </span>
                  }
                  <div className="icon-group">
                    <FaCalendar className="icon" />
                    <span>{context.timeFormat.format(new Date(comment.updatedAt)) + ' | ' + context.dateFormat.format(new Date(comment.updatedAt))}</span>
                  </div>
                  {(user && comment.author?._id == user?._id) &&
                    <ContextMenu
                      content={[
                        {
                          text: 'Edit comment',
                          func: e => editComment(comment._id),
                        },
                        {
                          text: 'Delete comment',
                          func: e => deleteCom.mutate(comment._id),
                        },
                      ]}
                    />}
                </div>
                <div className="content" data-id={comment._id}>
                  {commentEdit === comment._id
                    ? <form className="nested" action="/" onSubmit={handleUpdate} method="post">
                      <textarea
                        name="comment"
                        id="comment"
                        defaultValue={comment.content}
                        rows={5}
                        required
                      />
                      <button type="submit"><FaPaperPlane /></button>
                    </form>
                    : <p>
                      {comment.content}
                    </p>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
        <DismissArea />
      </div>
    </>
  )
}
export default Post