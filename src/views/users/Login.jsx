import { useContext } from 'react'
import { IoArrowBack } from 'react-icons/io5'
import { useQueryClient, useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../App'
import { loginUser } from '../../lib/api'
import { DismissArea, StatusMessage } from '../../components'



function Login() {
  const navigate = useNavigate()
  const { context, setContext } = useContext(UserContext)
  const queryClient = useQueryClient()
  const user = useMutation(loginUser, {
    onSuccess: (data) => {
      const { token } = data
      localStorage.setItem('token', token)
      setContext({ ...context, token })
      queryClient.invalidateQueries(['user', 'me'])
      navigate('/')
    }
  })
  const handleClick = (event) => {
    navigate(-1)
  }
  const color = { '--color': 'var(--purple)' }

  const handleSubmit = e => {
    e.preventDefault()
    user.mutate({
      identifier: e.target.identifier.value,
      password: e.target.password.value,
    })
  }
  return (
    <>

      <div className="form-modal">
        <div className='header'>
          <h3>Login</h3>
          <div className="icon-group" onClick={handleClick} style={color}>
            <IoArrowBack className="icon" />
            <span>Go back</span>
          </div>
        </div>
        <StatusMessage
          isLoading={{ condition: user.isLoading, message: 'Processing data...' }}
          isSuccess={{ condition: user.isSuccess, message: 'Logged in succesfully! Redirecting in a moment...' }}
          isError={{ condition: user.isError, message: user.error?.message }}
        />
        <form action="/" onSubmit={handleSubmit} method="post">
          <label htmlFor="name">Username or Email Adress</label>
          <input
            type="text"
            name="identifier"
            id="identifier"
            placeholder="Log in by Username/Email Adress"
            required
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Your Password"
            required
          />
          <div className="footer">
            <input type="submit" value="Sign in" />
          </div>
        </form>
      </div>
      <DismissArea />
    </>
  )
}
export default Login