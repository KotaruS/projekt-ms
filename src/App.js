import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Feed from './views/Feed'
import Login from './views/Login'
import Post from './views/Post'
import NoMatch from './views/NoMatch'
import Layout from './app/Layout'

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Feed />} />
          <Route path='*' element={<NoMatch />} />
          <Route path='/login' element={<Login />} />
          <Route path='/post/:postId' element={<Post />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App;
