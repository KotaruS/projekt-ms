import { useState, useEffect, useContext, useRef } from 'react'
import { IoArrowBack, IoClose } from 'react-icons/io5'
import { useQueryClient, useMutation, useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { UserContext } from '../../App'
import { checkForExistance, getUser, registerUser, updateUser } from '../../lib/api'
import { useDebouncedState } from '../../lib/utility'
import { DismissArea, StatusMessage } from '../../components'


function UpdateUser() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { context, setContext } = useContext(UserContext)
  const [imageblob, setImageBlob] = useState('')
  const [username, setUsername] = useDebouncedState('', 300)
  const [passwords, setPasswords] = useState({ original: '', compare: '' })
  const [form, setForm] = useState(false)
  const input = useRef(undefined)
  const { uri } = useParams('uri')
  const nameExists = useQuery(['user', 'name', username], checkForExistance, { refetchOnWindowFocus: false, retry: 0, })

  const user = useQuery(['profile', uri], getUser, {
    retry: 0,
    onError: (error) => {
      if (error.message === "Invalid URL address") {
        navigate('/404')
      }
    }
  })

  const loggedUser = useQuery(['user', 'me'], getUser, {
    retry: 1,
    enabled: !!context.token
  })

  useEffect(() => {
    if (!context.token) {
      navigate('/401', { replace: true })
    }
    if (loggedUser?.data?.uri !== uri) {
      navigate('/403', { replace: true })
    }
    if (user?.data?.image) {
      setImageBlob(user?.data?.image)
    }
  }, [])

  useEffect(() => {
    if (user?.data?.name === username) {
      setUsername('')
    }
  }, [username])


  const sendData = useMutation(updateUser, {
    onSuccess: (data) => {
      setForm('success')
      setContext({
        ...context, message: {
          type: 'success',
          text: 'User updated!'
        }
      })
      console.log(data);
      queryClient.invalidateQueries(['user', 'me'])
      navigate(`/user/${data.uri}`)
    },
    onError: error => {
      setContext({
        ...context, message: {
          type: 'error',
          text: error.message
        }
      })
      setForm('failed')
    }
  })

  const color = { '--color': 'var(--purple)' }

  const handleClick = () => {
    navigate(-1)
  }

  const refreshImage = (e) => {
    const blob = URL.createObjectURL(e.target.files[0])
    setImageBlob(blob)
  }

  const handleChange = ({ target }) => {
    if (target.name === 'name') {
      setUsername(target.value)
      target.setCustomValidity('')
    }
    if (target.name === 'password') {
      setPasswords({ ...passwords, original: target.value })
    }
    if (target.name === 'password2') {
      setPasswords({ ...passwords, compare: target.value })
    }
  }

  const handleSubmit = e => {
    e.preventDefault()
    setForm('submiting')
    const formData = new FormData()
    formData.append('name', e.target.name.value)
    formData.append('image', imageblob ? e.target.image.files[0] : '')
    formData.append('restricted', JSON.stringify({
      posts: !e.target.restrictedPosts.checked,
      groups: !e.target.restrictedGroups.checked
    }))

    sendData.mutate({ uri, data: formData })
  }

  return (
    <>
      <div className="form-modal">
        <div className='header'>
          <h3>Updating user details</h3>
          <div className="icon-group" onClick={handleClick} style={color}>
            <IoArrowBack className="icon" />
            <span>Go back</span>
          </div>
        </div>
        <StatusMessage
          isLoading={{ condition: form === 'submiting', message: 'Processing data...' }}
          isSuccess={{ condition: form === 'success', message: 'Update succesfull! Redirecting in a moment...' }}
          isError={{ condition: form === 'failed', message: 'Submision failed, please try again' }}
        />
        <form action="/" onSubmit={handleSubmit} method="post">
          <label className={imageblob && 'contains'} htmlFor="image">Group image
            <img src={imageblob ? imageblob : '/image-upload.svg'} alt="Group image"></img>
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
            placeholder="Your a"
          />
          <label htmlFor="name">Username</label>
          <input
            type="text"
            name="name"
            className={nameExists.data === true ? "error" : undefined}
            id="name"
            placeholder="Your Unique Username"
            maxLength="64"
            defaultValue={user?.data?.name}
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
          <fieldset>
            <legend>Visibility</legend>
            <div className='split'>
              <label htmlFor="restrictedPosts">Posts</label>
              <input
                type="checkbox"
                name="restrictedPosts"
                id="restrictedPosts"
                defaultChecked={user?.data?.restricted?.posts
                  ? !user?.data?.restricted?.posts
                  : true
                }
              />
            </div>
            <div className='split'>
              <label htmlFor="restrictedGroups">Groups</label>
              <input
                type="checkbox"
                name="restrictedGroups"
                id="restrictedGroups"
                defaultChecked={user?.data?.restricted?.groups
                  ? !user?.data?.restricted?.groups
                  : true
                }
              />
            </div>
          </fieldset>

          <input type="submit" value="Submit" />
        </form>
      </div>
      <DismissArea />
    </>
  )
}

export default UpdateUser
