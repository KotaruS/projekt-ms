import { useMutation, useQuery, useQueryClient } from "react-query"
import { useParams, Link } from "react-router-dom"
import { UserContext } from "../App"
import {
  FaCalendar,
  FaCommentAlt,
  FaPaperPlane,
  FaShapes,
  FaTrash,
} from "react-icons/fa"
import { getDataFromURI, getUser, createComment, deleteComment } from "../lib/api"
import { useContext } from "react"
import Feed from "./Feed"

function User() {
  const { uri } = useParams('uri')
  const { context, setContext } = useContext(UserContext)
  const { data: user, isSuccess } = useQuery(['profile', uri], getUser, {
    retry: 1,
  })

  return isSuccess && (
    <div className="detail">
      <div className="user-card" >
        <img src={user.image ? user.image : '/user-blank.svg'} alt={user.name} />
        <h2>{user.name}</h2>
      </div>
      <Feed />

    </div>
  )
}
export default User