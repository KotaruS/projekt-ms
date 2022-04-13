import { IoSync, IoCheckmarkCircleOutline } from 'react-icons/io5'

function StatusMessage({ isLoading, isSuccess, isError }) {
  return (
    <div>
      {isLoading?.condition &&
        <span className='form-msg '>
          <IoSync className='msg-icon spin' />
          {isLoading?.message}
        </span>
      }
      {isError?.condition && <span className='form-msg error'>{isError?.message}</span>}
      {isSuccess?.condition &&
        <span className='form-msg success'>
          <IoCheckmarkCircleOutline className='msg-icon' />
          {isSuccess?.message}
        </span>
      }
    </div>
  )
}
export { StatusMessage }