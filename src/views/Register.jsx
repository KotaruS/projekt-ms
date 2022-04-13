import { useState, useEffect, useContext } from 'react'
import { IoArrowBack } from 'react-icons/io5'
import { useQueryClient, useMutation, useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../App'
import { checkForExistance, registerUser } from '../lib/api'
import { useDebouncedState } from '../lib/utility'
import { StatusMessage } from '../components'


function Register() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { context, setContext } = useContext(UserContext)
  const [username, setUsername] = useDebouncedState('', 300)
  const [email, setEmail] = useDebouncedState('', 300)
  const [passwords, setPasswords] = useState({ original: '', compare: '' })
  const [match, setMatch] = useState(null)
  const [form, setForm] = useState(false);
  const nameExists = useQuery(['name', username], checkForExistance, { refetchOnWindowFocus: false, retry: 0, })
  const emailExists = useQuery(['email', email], checkForExistance, { refetchOnWindowFocus: false, retry: 0, })
  const sendData = useMutation(registerUser, {
    onSuccess: (data) => {
      const { token } = data
      localStorage.setItem('token', token)
      setContext({ ...context, token })
      setForm('success')
      queryClient.invalidateQueries(['user', 'me'])
      setTimeout(() => {
        navigate('/')
      }, 2000)
    },
    onError: () => {
      setForm('failed')
    }
  })

  const color = { '--color': 'var(--blue)' }

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


  const validateFormData = data => {
    if (nameExists.status !== 'success' && emailExists.status !== 'success') {
      setForm('failed')
      console.log(1);
      return null
    }
    if (data.name.value !== username || data.email.value !== email) {
      setForm('failed')
      console.log(2);
      return null
    }
    if (data.password.value !== data.password2.value) {
      setForm('failed')
      return null
    }

    sendData.mutate({
      name: data.name.value,
      email: data.email.value,
      password: data.password.value,
    })

    // checks if username and email input is in sync with debounced state
  }

  const handleChange = ({ target }) => {
    if (target.name === 'name') {
      setUsername(target.value)
      target.setCustomValidity('')
    }
    if (target.name === 'email') {
      setEmail(target.value)
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
    validateFormData(e.target)
  }


  return (
    <div className="form-modal">
      <div className="card">
        <div className='header'>
          <h3>Sign up</h3>
          <div className="icon-group" onClick={handleClick} style={color}>
            <div className="icon">
              <IoArrowBack />
            </div>
            <span>Go back</span>
          </div>
        </div>
        <StatusMessage
          isLoading={{ condition: form === 'submiting', message: 'Processing data...' }}
          isSuccess={{ condition: form === 'success', message: 'Registration succesfull! Redirecting in a moment...' }}
          isError={{ condition: form === 'failed', message: 'Registration failed, please try again' }}
        />
        <form action="/" onSubmit={handleSubmit} method="post">
          <label htmlFor="name">Username</label>
          <input
            type="text"
            name="name"
            className={nameExists.data === true ? "error" : undefined}
            id="name"
            placeholder="Your Unique Username"
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
          <label htmlFor="email">Email Adress</label>
          <input
            type="email"
            name="email"
            className={emailExists.data === true ? "error" : undefined}
            id="email"
            placeholder="johndoe@email.com"
            onChange={handleChange}
            pattern={emailExists.data === true ? "" : undefined}
            required
          />
          <StatusMessage
            isLoading={{ condition: emailExists.isLoading, message: 'Checking for matches...' }}
            isSuccess={{ condition: emailExists.data === false, message: 'Email is unique' }}
            isError={{ condition: emailExists.data === true, message: 'Email is already taken' }}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Your Password"
            value={passwords.original}
            onChange={handleChange}
            required />
          <label htmlFor="password2">Confirm password</label>
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
          <input type="submit" value="Sign up" />
        </form>
      </div >
    </div >

  )
}

export default Register