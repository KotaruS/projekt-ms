import { FaGhost } from "react-icons/fa";
import { useQuery } from "react-query";
import { Link, useSearchParams } from "react-router-dom";
import { BlankCard } from "../components";
import { getGroups, getPosts } from "../lib/api";
import Feed from "./Feed"

function Wrapper() {
  const [search, setSearch] = useSearchParams();


  const { data: groups } = useQuery(['groupList', search.get('searchbar')], getGroups, {
    retry: 0,
  })
  const posts = useQuery(['posts', { 'search': search.get('searchbar') }], getPosts,)

  return (
    <div className="feed-wrap">
      {search.has('searchbar')
        ? <>
          <h3>Results for '<span style={{ 'fontWeight': 700 }}>{search.get('searchbar')}</span>'</h3>
          <h4>Groups</h4>
          {groups?.length !== 0
            ? <div className="group-list">
              {groups?.map(group =>
                <div className="card" key={group?._id}>
                  <Link to={`/group/${group?.uri}`}>
                    <img src={group?.image || '/group-blank.svg'} alt={group?.name} />
                    <span>
                      {group?.name}
                    </span>
                  </Link>
                </div>
              )}
            </div>
            : <BlankCard>
              <h5>No groups found</h5>
              <p>It seems there are no posts under searched query...</p>
            </BlankCard>
          }
          <h4>Posts</h4>
          {posts?.data?.length !== 0
            ? <Feed />
            : <BlankCard>
              <h5>No posts found</h5>
              <p>It seems there are no posts under searched query...</p>
            </BlankCard>

          }
        </>
        : <Feed />
      }
    </div>

  )
}
export default Wrapper