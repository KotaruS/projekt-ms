import { useContext, useState } from "react"
import { useMutation, useQueryClient } from "react-query"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../../App"
import { IoArrowBack, IoImage } from "react-icons/io5"
import ImageIcon from "../../styles/image-upload.svg"
import { createGroup } from "../../lib/api"

function CreateGroup() {
  const queryClient = useQueryClient()
  const [imageblob, setImageBlob] = useState('')
  const navigate = useNavigate()
  const { context, setContext } = useContext(UserContext)
  const submit = useMutation(createGroup)
  const color = { '--color': 'var(--blue)' }

  const handleClick = () => {
    navigate(-1)
  }
  const refreshImage = (e) => {
    const blob = URL.createObjectURL(e.target.files[0])
    setImageBlob(blob)
  }
  const handleSubmit = e => {
    e.preventDefault()
    const formStuff = new FormData()
    formStuff.append('name', e.target.name.value)
    formStuff.append('description', e.target.description.value)
    formStuff.append('image', e.target.image.files[0])
    submit.mutate(formStuff)
  }


  return (
    <>
      <div className="form-modal">
        <div className='header'>
          <h3>Create a new group</h3>
          <div className="icon-group" onClick={handleClick} style={color}>
            <IoArrowBack className="icon" />
            <span>Go back</span>
          </div>
        </div>
        <form action="/" onSubmit={handleSubmit} method="post">
          <label htmlFor="image">Group image
            <img src={imageblob ? imageblob : ImageIcon} alt="Group image"></img>
          </label>
          <input
            style={{ "display": "none" }}
            type="file"
            name="image"
            id="image"
            accept="image/*"
            onChange={refreshImage}
            placeholder="Your a"
          />
          <label htmlFor="name">Name of the group</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Your Unique Group Name"
            maxLength="64"
            required
          />
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            id="description"
            placeholder="Short description of the group"
            maxLength="512"
            rows="4"
          />
          <input type="submit" value="Create" />
        </form>
      </div>
      <div onClick={handleClick} className='modal-background' />
    </>
  )
}
export default CreateGroup