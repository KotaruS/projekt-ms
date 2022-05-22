import { useState, useEffect, useContext, useRef } from 'react'
import { IoArrowBack, IoClose } from 'react-icons/io5'
import { useQueryClient, useMutation, useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { getUser, updateUser, } from '../../lib/api'
import { DismissArea, StatusMessage } from '../../components'
import { UserContext } from '../../App'

function ChangePass() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { context, setContext } = useContext(UserContext)
  const [passwords, setPasswords] = useState({ original: '', compare: '' })
  const [match, setMatch] = useState(null)
  const [form, setForm] = useState(false)

  const { uri } = useParams('uri')

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
  }, [])

  const sendData = useMutation(updateUser, {
    onSuccess: () => {
      setForm('success')
      setContext({
        ...context, message: {
          type: 'success',
          text: 'Password changed!'
        }
      })
      queryClient.invalidateQueries(['user', 'me'])
      navigate('/')
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

  useEffect(() => {
    if (passwords.original === passwords.compare) {
      setMatch(true)
    } else { setMatch(false) }
    if (passwords.original === '' && passwords.compare === '') {
      setMatch(null)
    }
  }, [passwords])

  const handleChange = ({ target }) => {
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
    formData.append('oldPassword', e.target.oldPassword.value)
    formData.append('newPassword', e.target.password.value)
    sendData.mutate({ uri, data: formData })
  }

  return user?.isSuccess && (
    <>
      <div className="form-modal">
        <div className='header'>
          <h3>Password Change</h3>
          <div className="icon-group" onClick={handleClick} style={color}>
            <IoArrowBack className="icon" />
            <span>Go back</span>
          </div>
        </div>
        <StatusMessage
          isLoading={{ condition: form === 'submiting', message: 'Processing data...' }}
          isSuccess={{ condition: form === 'success', message: 'Password change succesfull! Redirecting in a moment...' }}
          isError={{ condition: form === 'failed', message: 'Password change failed, please try again' }}
        />
        <form action="/" onSubmit={handleSubmit} method="post">
          <label htmlFor="oldPassword">Old password</label>
          <input
            type="password"
            name="oldPassword"
            id="oldPassword"
            placeholder="Your current password"
            required />
          <label htmlFor="password">New password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Your Password"
            value={passwords.original}
            onChange={handleChange}
            required />
          <label htmlFor="password2">Confirm new password</label>
          <input
            type="password"
            name="password2"
            id="password2"
            placeholder="Confirm Your Password"
            className={match === false ? "error" : undefined}
            value={passwords.compare}
            onChange={handleChange}
            pattern={!match ? passwords.original : undefined}
            onInvalid={(e) => {
              e.target.value === passwords.original ? e.target.setCustomValidity('') : e.target.setCustomValidity('Passwords do not match')
            }}
            required />
          <StatusMessage
            isSuccess={{ condition: match === true, message: 'Passwords are the same' }}
            isError={{ condition: match === false, message: 'Password does not match' }}
          />
          <input type="submit" value="Change password" />
        </form>
      </div>
      <DismissArea />
    </>
  )
}

export default ChangePass
