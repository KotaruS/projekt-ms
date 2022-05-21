
const API_URL = '/api'

const getConfig = () => ({
  'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : undefined,
})

// group requests 
const createGroup = async ({ data }) => {
  try {
    const res = await fetch(`${API_URL}/groups/create`, {
      method: 'POST',
      headers: getConfig(),
      body: data,
    })
    const group = await res.json()
    if (!res.ok) {
      throw group.message
    }
    return group
  } catch (err) {
    throw new Error(err)
  }
}

const joinGroup = async (uri) => {
  try {
    const res = await fetch(`${API_URL}/groups/join/${uri}`, {
      method: 'GET',
      headers: getConfig(),
    })
    const group = await res.json()
    if (!res.ok) {
      throw group.message
    }
    return group
  } catch (err) {
    throw new Error(err)
  }
}

const leaveGroup = async (uri) => {
  try {
    const res = await fetch(`${API_URL}/groups/leave/${uri}`, {
      method: 'GET',
      headers: getConfig(),
    })
    const group = await res.json()
    if (!res.ok) {
      throw group.message
    }
    return group
  } catch (err) {
    throw new Error(err)
  }
}

const updateGroup = async ({ data, uri }) => {
  try {
    const res = await fetch(`${API_URL}/groups/${uri}`, {
      method: 'PUT',
      headers: getConfig(),
      body: data,
    })
    const group = await res.json()
    if (!res.ok) {
      throw group.message
    }
    return group
  } catch (err) {
    throw new Error(err)
  }
}

const deleteGroup = async (uri) => {
  try {
    const res = await fetch(`${API_URL}/groups/${uri}`, {
      method: 'DELETE',
      headers: getConfig(),
    })
    const group = await res.json()
    if (!res.ok) {
      throw group.message
    }
    return group
  } catch (err) {
    throw new Error(err)
  }
}
// post requests 
const createPost = async ({ data }) => {
  try {
    const res = await fetch(`${API_URL}/posts/create`, {
      method: 'POST',
      headers: getConfig(),
      body: data,
    })
    const post = await res.json()
    if (!res.ok) {
      throw post.message
    }
    return post
  } catch (err) {
    throw new Error(err)
  }
}

const getPosts = async ({ queryKey, pageParam = 0 }) => {
  try {
    const [_key, key, value] = queryKey
    const query =
      (key && value)
        ? pageParam
          ? `/?${key}=${value}&pointer=${pageParam}`
          : `/?${key}=${value}`
        : pageParam
          ? `/?pointer=${pageParam}`
          : ''
    const res = await fetch(`${API_URL}/posts${query}`, {
      headers: getConfig(),
    })
    const post = await res.json()
    if (!res.ok) {
      throw post.message
    }
    return post
  } catch (err) {
    throw (err)
  }
}

const updatePost = async ({ data, uri }) => {
  try {
    const res = await fetch(`${API_URL}/posts/${uri}`, {
      method: 'PUT',
      headers: getConfig(),
      body: data,
    })
    const post = await res.json()
    if (!res.ok) {
      throw post.message
    }
    return post
  } catch (err) {
    throw new Error(err)
  }
}

const deletePost = async (uri) => {
  try {
    const res = await fetch(`${API_URL}/posts/${uri}`, {
      method: 'DELETE',
      headers: getConfig(),
    })
    const post = await res.json()
    if (!res.ok) {
      throw post.message
    }
    return post
  } catch (err) {
    throw new Error(err)
  }
}

// comment requests
const createComment = async ({ uri, data }) => {
  try {
    const res = await fetch(`${API_URL}/comments/${uri}/create`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        ...getConfig()
      },
      body: JSON.stringify(data),
    })
    const group = await res.json()
    if (!res.ok) {
      throw group.message
    }
    return group
  } catch (err) {
    throw new Error(err)
  }
}

const updateComment = async ({ uri }) => {
  try {
    const res = await fetch(`${API_URL}/comments/${uri}`, {
      method: 'DELETE',
      headers: getConfig(),
    })
    const group = await res.json()
    if (!res.ok) {
      throw group.message
    }
    return group
  } catch (err) {
    throw new Error(err)
  }
}


const deleteComment = async (uri) => {
  try {
    const res = await fetch(`${API_URL}/comments/${uri}`, {
      method: 'DELETE',
      headers: getConfig(),
    })
    const group = await res.json()
    if (!res.ok) {
      throw group.message
    }
    return group
  } catch (err) {
    throw new Error(err)
  }
}

// user requests

const registerUser = async (data) => {
  try {
    const res = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      body: data,
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
      headers: getConfig(),
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


// universal requests
const getDataFromURI = async ({ queryKey }) => {
  try {
    const [_key, uri] = queryKey
    const res = await fetch(`${API_URL}/${_key}s/${uri}`, {
      headers: getConfig(),
    })
    const data = await res.json()
    if (!res.ok) {
      throw data.message
    }
    return data
  } catch (err) {
    throw new Error(err)
  }
}

const checkForExistance = async ({ queryKey }) => {
  try {
    const [route, key, value] = queryKey
    if (value === '') { return }
    const exists = await fetch(`${API_URL}/${route}s/?${key}=${value}`)
    return exists.json()
  } catch (err) {
    throw new Error(err)
  }
}

export {
  createGroup,
  joinGroup,
  leaveGroup,
  getUser,
  updateGroup,
  deleteGroup,
  loginUser,
  registerUser,
  createPost,
  getPosts,
  updatePost,
  deletePost,
  createComment,
  updateComment,
  deleteComment,
  checkForExistance,
  getDataFromURI,
}
