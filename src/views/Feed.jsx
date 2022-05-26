import React, { useContext, useEffect, useState } from "react"
import { useInfiniteQuery, useQuery, useQueryClient } from "react-query"
import { Link, useLocation } from "react-router-dom"
import { UserContext } from "../App"
import { getPosts, getUser } from "../lib/api"
import { FaCommentAlt, FaCalendar } from 'react-icons/fa'
import { truncate } from "../lib/utility"
import { useInView } from "react-intersection-observer"
import { ContextMenu } from "../components"

function Feed() {
  const { ref, inView } = useInView()
  const { context } = useContext(UserContext)
  const [path, setPath] = useState('')
  const location = useLocation()
  const feed = useInfiniteQuery(
    ['posts', path],
    getPosts,
    {
      getNextPageParam: (lastPage, pages) => {
        return lastPage[lastPage.length - 1] !== []
          ? lastPage[lastPage.length - 1]?._id
          : undefined
      }
    })
  const { data: user } = useQuery(['user', 'me'], getUser, {
    retry: 1,
    enabled: !!context.token
  })

  useEffect(() => {
    const path = location.pathname.split('/')
    const [_, search] = location.search.split('?searchbar=')
    const [key, value] = path.slice(path.length - 2)
    if (key) {
      setPath({ [key]: value, search })
    } else if (search) {
      setPath({ search })
    } else {
      setPath('')
    }
  }, [location])

  useEffect(() => {
    if (inView && feed?.hasNextPage) {
      feed?.fetchNextPage()
    }
  }, [inView, feed?.hasNextPage])


  const color = { '--color': 'var(--blue)' }

  return feed.isSuccess && (
    <div className="feed">
      {feed?.data?.pages?.map((page) => (
        <React.Fragment key={page[page.length - 1]?._id || 'last'}>
          {page?.map((post) => (
            <div key={post._id} className="post-feed-card" >
              <div className="post-info">
                <div>Posted in
                  {post.group
                    ? <Link className="linker" style={color}
                      to={`/group/${post.group.uri}`}>
                      {truncate(post.group.name, 30)}
                    </Link>
                    : 'deleted group'
                  }
                </div>
                <div>by
                  {post.author
                    ?
                    <Link className="linker" style={color}
                      to={`/user/${post.author?.uri}`}>
                      {truncate(post.author?.name, 30)}

                    </Link>
                    : ' deleted user'
                  }
                </div>
                <div className="icon-group" style={color}>
                  <FaCalendar className="icon" />
                  <span>{context.dateFormat.format(new Date(post.createdAt))}</span>
                </div>
                {(user && user?._id === post.author?._id) &&
                  <ContextMenu
                    content={[
                      {
                        text: 'Edit post',
                        link: "/post/" + post.uri + "/edit",
                      },
                      {
                        text: 'Delete post',
                        link: "/post/" + post.uri + "/delete",
                      },
                    ]}
                  />
                }
              </div>
              <Link to={`/post/${post.uri}`} ><h3>{post.title}</h3>
                <div className={(!post.image && post.content.length > 300) ? "content excerpt" : "content"} >
                  {post.image ? <img src={post.image} alt={post.title} /> : truncate(post.content, 300)}
                </div></Link>
              <div className="tools" >
                <Link to={`/post/${post.uri}#comment`} className="icon-group buttoner" style={color}>
                  <FaCommentAlt className="icon" />
                  <span>{(post.comments.length > 1 || post.comments.length === 0)
                    ? post.comments.length + ' comments'
                    : post.comments.length + ' comment'}</span>
                </Link>
              </div>
            </div>
          ))}
        </React.Fragment>
      ))}
      {feed?.isFetchingNextPage && <svg className="loading-dots" viewBox="0 0 500 100" xmlns="http://www.w3.org/2000/svg">
        <circle id="one" cx="50" cy="50" r="50" />
        <circle id="two" cx="200" cy="50" r="50" />
        <circle id="three" cx="350" cy="50" r="50" />
      </svg>}
      <button
        ref={ref}
        className={feed?.isFetchingNextPage ? 'hidden' : 'load-btn'}
        onClick={() => feed?.fetchNextPage()}
        disabled={!feed?.hasNextPage || feed?.isFetchingNextPage}
      >
        {feed?.isFetchingNextPage
          ? 'Loading more...'
          : feed?.hasNextPage
            ? 'Load more'
            : 'Nothing more to load'}
      </button>
    </div>
  )
}

export default Feed