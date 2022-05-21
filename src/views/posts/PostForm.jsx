import { useContext, useEffect, useRef, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../../App"
import { IoArrowBack, IoClose } from "react-icons/io5"
import { getUser, createPost } from "../../lib/api"
import { DismissArea, StatusMessage } from "../../components"

function PostForm({ mutationFunc = createPost, prefill, title }) {
  const { context, setContext } = useContext(UserContext)
  const queryClient = useQueryClient()
  const [imageblob, setImageBlob] = useState('')
  const navigate = useNavigate()
  const [form, setForm] = useState('')
  const input = useRef(undefined)
  const { data: user } = useQuery(['user', 'me'], getUser, {
    retry: 1,
    enabled: !!context.token
  })
  const submit = useMutation(mutationFunc, {
    onSuccess: (data) => {
      setForm('success')
      navigate('/')
      queryClient.invalidateQueries(['user', 'me'])
      queryClient.invalidateQueries(['posts'])
      queryClient.invalidateQueries(['post', data.uri])
    },
    onError: () => {
      setForm('failed')
    }
  })

  const color = { '--color': 'var(--purple)' }
  const visible = { 'display': title === 'Edit post' ? 'none' : 'block' }
  useEffect(() => {
    if (prefill?.image) {
      setImageBlob(prefill?.image)
    }
  }, [])

  const handleClick = () => {
    navigate(-1)
  }
  const refreshImage = (e) => {
    const blob = URL.createObjectURL(e.target.files[0])
    setImageBlob(blob)
  }
  const handleSubmit = e => {
    setForm('submiting')
    e.preventDefault()
    const formStuff = new FormData()
    formStuff.append('group', e.target.group.value)
    formStuff.append('title', e.target.title.value)
    formStuff.append('content', e.target.content.value)
    formStuff.append('image', imageblob ? e.target.image.files[0] : '')
    formStuff.append('restricted', !e.target.restricted.checked)
    submit.mutate({ data: formStuff, uri: prefill?.uri })
  }

  return (
    <>
      <div className="form-modal">
        <div className='header'>
          <h3>{title}</h3>
          <div className="icon-group" onClick={handleClick} style={color}>
            <IoArrowBack className="icon" />
            <span>Go back</span>
          </div>
        </div>
        <StatusMessage
          isLoading={{ condition: form === 'submiting', message: 'Processing data...' }}
          isSuccess={{ condition: form === 'success', message: 'Group created succesfully! Redirecting in a moment...' }}
          isError={{ condition: form === 'failed', message: 'Submition failed, please try again' }}
        />
        <form action="/" onSubmit={handleSubmit} method="post">
          <label htmlFor="group" style={visible}>Select group</label>
          <select name="group" id="group" style={visible} defaultValue={prefill?.group?._id} required>
            <option value="">Select a group</option>
            {user?.groups.map(group =>
              <option
                key={group._id}
                value={group._id}>
                {group.name}
              </option>
            )}
          </select>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            defaultValue={prefill?.title}
            placeholder="Your Brilliant Title"
            maxLength="128"
            required
          />
          <label htmlFor="content">Content</label>
          <textarea
            name="content"
            id="content"
            defaultValue={prefill?.content}
            placeholder="Empty your thoughts here..."
            maxLength="2048"
            rows="4"
            required
          />
          <label className={imageblob && 'contains'} htmlFor="image">Image
            <img className={imageblob ? 'free' : 'place'} src={imageblob || '/image-upload.svg'} alt="post image"></img>
            <IoClose
              title="Clear image"
              onClick={e => {
                e.preventDefault()
                input.current.value = null
                setImageBlob('')
              }} />
          </label>
          <input
            style={{ "display": "none" }}
            type="file"
            name="image"
            id="image"
            ref={input}
            accept="image/*"
            onChange={refreshImage}
          />
          <StatusMessage
            isInfo={{ condition: !imageblob, message: 'Upload image smaller than 1MB.' }}
          />
          <label htmlFor="restricted">Visibility</label>
          <input
            type="checkbox"
            name="restricted"
            id="restricted"
            defaultChecked={prefill?.restricted ? !prefill?.restricted : true}
          />
          <div className="footer">
            <input type="submit" value="Submit" />
          </div>
        </form>
      </div>
      <DismissArea />
    </>
  )
}
export default PostForm