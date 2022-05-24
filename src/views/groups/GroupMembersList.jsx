import React, { useContext, useEffect } from "react"
import { IoRepeat, IoCheckmark, IoClose, IoThumbsDownSharp } from "react-icons/io5"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { Link } from "react-router-dom"
import { UserContext } from "../../App"
import { getDataFromURI, getGroupMembers, getUser, updateMember } from "../../lib/api"

function GroupMembersList({ groupData, state, setState }) {
  const { context, setContext } = useContext(UserContext)
  const queryClient = useQueryClient()

  const user = useQuery(['user', 'me'], getUser, {
    retry: 1,
    enabled: !!context.token && !!state
  })

  const members = useQuery(['members', state?.pendingList && 'pending', groupData?.uri], getGroupMembers, {
    retry: 0,
    enabled: !!state
  })


  const mutateMember = useMutation(updateMember, {
    onSuccess: (data) => {
      setContext({
        ...context, message: {
          type: 'success',
          text: data.message
        }
      })
      queryClient.invalidateQueries(['user', 'me'])
      queryClient.invalidateQueries(['members'])
    },
    onError: error => {
      setContext({
        ...context, message: {
          type: 'error',
          text: error.message
        }
      })
    }
  })

  useEffect(() => {
    queryClient.invalidateQueries(['members'])
  }, [state])

  const close = () => {
    setState(false)
    queryClient.invalidateQueries(['group', groupData?.uri])
  }

  if (groupData?.uri && !user) {
    close()
  }

  const handleClick = data => {
    mutateMember.mutate({ ...data, uri: groupData?.uri })
  }


  return state && members.isSuccess && (
    <>
      <div className="members-list">
        <div className="header">
          <h3>{state?.pendingList ? 'Pending members ' : 'Groups members'}</h3>
        </div>
        <ul>
          {members?.data?.map(member =>
            <li key={member?._id}>
              <Link className="buttoner blue" to={`/user/${member?.uri}`}>
                <img src={member?.image || '/user-blank.svg'} alt={member?.name} />
                <span className="member-name">
                  {(user && user?.data?._id === member?._id) ? 'You' : member?.name}
                </span>
              </Link>
              <div className="right">
                {user && user?.data?._id === groupData?.owner &&
                  <>
                    {state?.pendingList
                      ? <>
                        <button className="green"
                          onClick={() => handleClick({ accept: member?._id })}>
                          <IoCheckmark />
                          Accept
                        </button>
                        <button className="red"
                          onClick={() => handleClick({ decline: member?._id })}>
                          <IoClose />
                          Decline
                        </button>
                      </>
                      : user?.data?._id !== member?._id &&
                      <>
                        <button className="purple"
                          onClick={() => handleClick({ newOwner: member?._id })}>
                          <IoRepeat />
                          Transfer ownership
                        </button>
                        <button className="blue"
                          onClick={() => handleClick({ kick: member?._id })}>
                          <IoThumbsDownSharp />
                          Kick
                        </button>
                      </>
                    }
                  </>
                }
              </div>
            </li>
          )}
          {members?.data?.length === 0 &&
            <h4>The list is empty<span>…</span></h4>
          }
        </ul>
        <div className="footer">
          <button onClick={() => close()} >
            Close
          </button>
        </div>
      </div>
      <div onClick={() => close()} className='modal-background' />
    </>
  )
}
export default GroupMembersList