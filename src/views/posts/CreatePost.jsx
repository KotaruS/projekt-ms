import { createPost } from "../../lib/api"
import PostForm from "./PostForm"

function CreatePost() {
  return (
    <PostForm mutationFunc={createPost} title="Create a new post" />
  )
}
export default CreatePost