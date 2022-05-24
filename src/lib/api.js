
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

const getGroups = async ({ queryKey }) => {
  try {
    const [_key, keyword] = queryKey
    const param = keyword ? `?search=${keyword}` : ''
    const res = await fetch(`${API_URL}/groups/${param}`, {
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

const getGroupMembers = async ({ queryKey }) => {
  try {
    const [key, status, uri] = queryKey
    const param = status ? '?pendingList=true' : ''
    const res = await fetch(`${API_URL}/groups/members/${uri}${param}`, {
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

const updateMember = async (data) => {
  try {
    const { uri, ...rest } = data
    const res = await fetch(`${API_URL}/groups/members/${uri}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        ...getConfig()
      },
      body: JSON.stringify(rest),
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
    const [_key, spec] = queryKey
    const entries = { ...spec, pointer: pageParam }
    let query = ''
    for (const [key, value] of Object.entries(entries)) {
      if (value) {
        query += query === '' ? `/?${key}=${value}` : `&${key}=${value}`
      }
    }
    const res = await fetch(`${API_URL}/posts${query}`, {
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
    const res = await fetch(`${API_URL}/comments/${uri}`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        ...getConfig()
      },
      body: JSON.stringify(data),
    })
    const comment = await res.json()
    if (!res.ok) {
      throw comment.message
    }
    return comment
  } catch (err) {
    throw new Error(err)
  }
}

const updateComment = async ({ id, data }) => {
  try {
    const res = await fetch(`${API_URL}/comments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        ...getConfig()
      },
      body: JSON.stringify(data),
    })
    const comment = await res.json()
    if (!res.ok) {
      throw comment.message
    }
    return comment
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
    const comment = await res.json()
    if (!res.ok) {
      throw comment.message
    }
    return comment
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

const updateUser = async ({ uri, data }) => {
  try {
    const res = await fetch(`${API_URL}/users/${uri}`, {
      method: 'PUT',
      headers: getConfig(),
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


const deleteUser = async (uri) => {
  try {
    const res = await fetch(`${API_URL}/users/${uri}`, {
      method: 'DELETE',
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
    const exists = await fetch(`${API_URL}/${route}s/check?${key}=${value}`)
    return exists.json()
  } catch (err) {
    throw new Error(err)
  }
}

export {
  createGroup,
  getGroups,
  getGroupMembers,
  joinGroup,
  updateMember,
  leaveGroup,
  updateGroup,
  deleteGroup,
  registerUser,
  getUser,
  loginUser,
  updateUser,
  deleteUser,
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
