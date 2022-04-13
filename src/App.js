import "./styles/App.css"
import { createContext, useContext, useMemo, useState } from "react"
import { QueryClient, QueryClientProvider, } from "react-query"
import { ReactQueryDevtools } from "react-query/devtools"
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Feed from './views/Feed'
import Login from './views/Login'
import Register from './views/Register'
import Post from './views/Post'
import NoMatch from './views/NoMatch'
import Layout from './app/Layout'

const queryClient = new QueryClient()

const backend_url = 'http://localhost:5310'

const UserContext = createContext()

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <Router >
          <ForumApp />
        </Router>
      </UserProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

function ForumApp() {
  const location = useLocation()
  const background = location.state?.background
  return (
    <>
      <Routes location={background || location}>
        <Route element={<Layout />}>
          <Route index element={<Feed />} />
          <Route path='*' element={<NoMatch />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/post/:postId' element={<Post />} />
        </Route>
      </Routes>
      {background && (
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Routes>)
      }
    </>

  )
}

function UserProvider(props) {
  const token = localStorage.getItem('token')
  const [context, setContext] = useState({
    dateFormat: new Intl.DateTimeFormat('default', { dateStyle: 'long', }),
    timeFormat: new Intl.DateTimeFormat('default', { timeStyle: 'short', }),
    token,
  })
  const value = useMemo(() => ({ context, setContext }), [context])
  return (
    <UserContext.Provider {...props} value={value} />
  )
}





export { App, UserContext, backend_url };
