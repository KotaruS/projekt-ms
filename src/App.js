import "./styles/App.css"
import { createContext, useContext, useMemo, useState } from "react"
import { QueryClient, QueryClientProvider, } from "react-query"
import { ReactQueryDevtools } from "react-query/devtools"
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Feed from './views/Feed'
import Logout from './views/users/Logout'
import Login from './views/users/Login'
import Register from './views/users/Register'
import Post from './views/posts/Post'
import NoMatch from './views/NoMatch'
import Layout from './app/Layout'
import User from "./views/users/User"
import CreateGroup from "./views/groups/CreateGroup"
import CreatePost from "./views/posts/CreatePost"
import Group from "./views/groups/Group"
import UpdateGroup from "./views/groups/UpdateGroup"
import UpdatePost from "./views/posts/UpdatePost"
import NotAuthorized from "./views/NotAuthorized"
import Forbidden from "./views/Forbidden"
import DeletePost from "./views/posts/DeletePost"
import JoinGroup from "./views/groups/JoinGroup"
import DeleteGroup from "./views/groups/DeleteGroup"
import LeaveGroup from "./views/groups/LeaveGroup"

const queryClient = new QueryClient()

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
        <Route path='*' element={<NoMatch />} />
        <Route element={<Layout />}>
          <Route index element={
            <div className="feed-wrap">
              <Feed />
            </div>
          } />
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />
          <Route path='post' >
            <Route path=':uri' element={<Post />} />
            <Route path=':uri/edit' element={<UpdatePost />} />
            <Route path=':uri/delete' element={<DeletePost />} />
            <Route path='create' element={<CreatePost />} />
          </Route>
          <Route path='group' >
            <Route path=':uri' element={<Group />} />
            <Route path=':uri/join' element={<JoinGroup />} />
            <Route path=':uri/leave' element={<LeaveGroup />} />
            <Route path=':uri/edit' element={<UpdateGroup />} />
            <Route path=':uri/delete' element={<DeleteGroup />} />
            <Route path='create' element={<CreateGroup />} />
          </Route>
          <Route path='user' >
            <Route path=':uri' element={<User />} />
          </Route>
          <Route path='logout' element={<Logout />} />
        </Route>
        <Route path='401' element={<NotAuthorized />} />
        <Route path='403' element={<Forbidden />} />
      </Routes>

      {background && (
        <Routes>
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />
          <Route path='post' >
            <Route path=':uri' element={
              <div className="modal-post">
                <Post />
              </div>
            } />
            <Route path='create' element={<CreatePost />} />
          </Route>
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





export { App, UserContext };
