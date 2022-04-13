const API_URL = 'http://localhost:5310/api'

const getConfig = () => ({
  'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : undefined,
})

// post requests 
const getPosts = async () => {
  try {
    const posts = await fetch(`${API_URL}/posts/dev`)
    return posts.json()
  } catch (err) {
    throw new Error(err)
  }
}

// user requests

const registerUser = async (data) => {
  try {
    const res = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    const user = await res.json()
    if (!res.ok) {
      throw user.message
    }
    return user
  } catch (err) {
    throw new Error(err)
  }
}

const checkForExistance = async ({ queryKey }) => {
  try {
    const [_key, value] = queryKey
    if (value === '') { return }
    const exists = await fetch(`${API_URL}/users/?${_key}=${value}`)
    return exists.json()
  } catch (err) {
    throw new Error(err)
  }
}

const loginUser = async (data) => {
  try {
    const res = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    const user = await res.json()

    if (!res.ok) {
      throw user.message
    } else {
      return user
    }
  } catch (err) {
    throw new Error(err)
  }
}

const getUser = async ({ queryKey }) => {
  try {
    const [_key, uri] = queryKey
    const res = await fetch(`${API_URL}/users/${uri}`, {
      headers: getConfig()
    })
    const user = await res.json()
    if (!res.ok) {
      throw user.message
    }
    return user
  } catch (err) {
    throw new Error(err)
  }
}


// const getUserGroups = async () => {
//   try {
//     const res = await fetch(`${API_URL}/posts/dev`)
//     return res.json()
//   } catch (err) {
//     throw new Error(err)
//   }
// }


const createPost = async () => {
  try {
    const posts = await fetch(`${API_URL}/posts/create`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        ...getConfig(),
      },
      body: {},
    })
    return posts.json()
  } catch (err) {
    throw new Error(err)
  }
}
export {
  createPost,
  getPosts,
  getUser,
  registerUser,
  loginUser,
  checkForExistance,
}