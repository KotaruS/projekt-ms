import { useContext, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../../App"
import { IoArrowBack, IoImage } from "react-icons/io5"
import { checkForExistance, createGroup } from "../../lib/api"
import { StatusMessage } from "../../components"
import { useDebouncedState } from "../../lib/utility"

function CreatePost() {
  const queryClient = useQueryClient()
  // const [imageblob, setImageBlob] = useState('')
  const navigate = useNavigate()
  const [form, setForm] = useState('')

  const submit = useMutation(createGroup, {
    onSuccess: () => {
      setForm('success')
      navigate('/')
      queryClient.invalidateQueries(['user', 'me'])
    },
    onError: () => {
      setForm('failed')
    }
  })

  const color = { '--color': 'var(--blue)' }

  const handleClick = () => {
    navigate(-1)
  }
  // const refreshImage = (e) => {
  //   const blob = URL.createObjectURL(e.target.files[0])
  //   setImageBlob(blob)
  // }
  const handleSubmit = e => {
    setForm('submiting')
    e.preventDefault()
    const formStuff = new FormData()
    formStuff.append('group', e.target.group.value)
    formStuff.append('title', e.target.title.value)
    formStuff.append('content', e.target.content.value)
    // formStuff.append('image', e.target.image.files[0])
    submit.mutate(formStuff)
  }

  return (
    <>
      <div className="form-modal">
        <div className='header'>
          <h3>Create a new post</h3>
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
          {/* <label htmlFor="image">Group image
            <img src={imageblob ? imageblob : '/image-upload.svg'} alt="Group image"></img>
          </label>
          <input
            style={{ "display": "none" }}
            type="file"
            name="image"
            id="image"
            accept="image/*"
            onChange={refreshImage}
            placeholder="Your a"
          /> */}

          <label htmlFor="group">Title of the Post</label>
          <select name="group" id="group" required>
            <option value="gruu">Gruu</option>
            <option value="gruu">Gruu</option>
            <option value="gruu">Gruu</option>
          </select>
          <label htmlFor="title">Title of the Post</label>
          <input
            type="text"
            name="title"
            id="title"
            placeholder="Your Brilliant Title"
            maxLength="128"
            required
          />
          <label htmlFor="content">Content of the post</label>
          <textarea
            name="content"
            id="content"
            placeholder="Empty your thoughts here..."
            maxLength="2048"
            rows="6"
          />
          <input type="submit" value="Create" />
        </form>
      </div>
      <div onClick={handleClick} className='modal-background' />
    </>
  )
}
export default CreatePost