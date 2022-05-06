import { IoSync, IoCheckmarkCircleOutline, IoInformationCircleOutline } from 'react-icons/io5'

function StatusMessage({ isInfo, isLoading, isSuccess, isError }) {
  return (
    <div>
      {isInfo?.condition &&
        <span className='form-msg'>
          <IoInformationCircleOutline className='msg-icon' />
          {isInfo?.message}
        </span>}
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