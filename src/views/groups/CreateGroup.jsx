import { useContext, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../../App"
import { IoArrowBack, IoImage } from "react-icons/io5"
import { checkForExistance, createGroup } from "../../lib/api"
import { StatusMessage } from "../../components"
import { useDebouncedState } from "../../lib/utility"

function CreateGroup() {
  const queryClient = useQueryClient()
  const [imageblob, setImageBlob] = useState('')
  const [name, setName] = useDebouncedState('', 300)
  const navigate = useNavigate()
  const [form, setForm] = useState('')

  const nameExists = useQuery(['group', 'name', name], checkForExistance)
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
  const refreshImage = (e) => {
    const blob = URL.createObjectURL(e.target.files[0])
    setImageBlob(blob)
  }
  const handleSubmit = e => {
    setForm('submiting')
    e.preventDefault()
    const formStuff = new FormData()
    formStuff.append('name', e.target.name.value)
    formStuff.append('description', e.target.description.value)
    formStuff.append('image', e.target.image.files[0])
    submit.mutate(formStuff)
  }
  const handleChange = ({ target }) => {
    setName(target.value)
    target.setCustomValidity('')
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

        <StatusMessage
          isLoading={{ condition: form === 'submiting', message: 'Processing data...' }}
          isSuccess={{ condition: form === 'success', message: 'Group created succesfully! Redirecting in a moment...' }}
          isError={{ condition: form === 'failed', message: 'Submition failed, please try again' }}
        />
        <form action="/" onSubmit={handleSubmit} method="post">
          <label htmlFor="image">Group image
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
          />
          <label htmlFor="name">Name of the group</label>
          <input
            type="text"
            name="name"
            id="name"
            className={nameExists.data === true ? "error" : undefined}
            placeholder="Your Unique Group Name"
            maxLength="64"
            onChange={handleChange}
            onInvalid={(e) => {
              nameExists.data === true ? e.target.setCustomValidity('Name is already used') : e.target.setCustomValidity('')
            }}
            pattern={nameExists.data === true ? "" : undefined}
            required
          />
          <StatusMessage
            isLoading={{ condition: nameExists.isLoading, message: 'Checking for matches...' }}
            isSuccess={{ condition: nameExists.data === false, message: 'Username is unique' }}
            isError={{ condition: nameExists.data === true, message: 'Username is already taken' }}
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