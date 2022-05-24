import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { FaGhost } from 'react-icons/fa'
import {
  IoInformationCircle,
  IoCheckmarkCircleOutline,
  IoEllipsisHorizontal,
  IoInformationCircleOutline,
  IoSync,
  IoAlertCircle,
  IoChatbubbleOutline,
  IoClose
} from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../App'

function StatusMessage({ isInfo, isLoading, isSuccess, isError }) {
  return (
    <div>
      {isInfo?.condition &&
        <span className='form-msg' style={{ 'marginBottom': '.5em' }}>
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

const useWindowDimensions = () => {
  const [width, setWidth] = useState(window.innerWidth)
  const [height, setHeight] = useState(window.innerHeight)

  const updateDimensions = () => {
    setWidth(window.innerWidth)
    setHeight(window.innerHeight)
  }

  useEffect(() => {
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  })
  return [width, height]
}

function ContextMenu({ content, className }) {
  const [toggle, setToggle] = useState(false)
  const menu = useRef(null)
  const [width, height] = useWindowDimensions()

  useEffect(() => {
    const dimensions = menu.current.getBoundingClientRect()
    menu.current.maxHeight = (height - dimensions.top) + 'px'
    if (dimensions.left < 0) {
      menu.current.style.left = 0
    } else {
      menu.current.style.left = null
    }
  }, [width])

  const handleClick = e => {
    setToggle(!toggle)

  }
  return (
    <>
      <div
        className={
          toggle
            ? 'context-dismiss on'
            : 'context-dismiss'}
        onClick={handleClick}
      />
      <div className={`context ${className ? className : ''}`}>
        <div
          className={toggle ? 'context-trigger on' : 'context-trigger'}
          onClick={handleClick}
        >
          <IoEllipsisHorizontal />
        </div>
        <ul
          ref={menu}
          className='context-list'
        >
          {content.map(item => (
            <li key={item.text} onClick={handleClick}>
              {item.link
                ? <Link
                  to={item.link}
                  state={item.state ?? null}>
                  {item.text}
                </Link>
                : <span onClick={item.func}>
                  {item.text}
                </span>}
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

function Toast({ getter, setter }) {
  const [design, setDesign] = useState(null)
  const [timer, setTimer] = useState(null)
  const toast = useRef(null)

  const clearToast = () => {
    toast.current.className = toast.current.className.search('disappear') === -1
      ? toast.current.className + ' disappear'
      : toast.current.className
    toast.current.addEventListener('animationend', clearAnimation, { once: true })
  }

  const clearAnimation = e => {
    if (e.animationName === 'popOut') {
      const { message, ...rest } = getter
      setter(rest)
    }
  }

  useEffect(() => {
    if (getter.message) {
      setDesign(changeDesign)
      clearTimeout(timer)
      const timeid = setTimeout(clearToast, 8000)
      setTimer(timeid)
    }
  }, [getter.message])

  function changeDesign() {
    let icon, color
    if (getter.message?.type === 'error') {
      icon = <IoAlertCircle className="icon" />
      color = 'red'
    } else if (getter.message?.type === 'success') {
      icon = <IoCheckmarkCircleOutline className="icon" />
      color = 'green'
    } else if (getter.message?.type === 'info') {
      icon = <IoInformationCircle className="icon" />
      color = 'blue'
    } else {
      icon = <IoChatbubbleOutline className="icon" />
      color = 'purple'
    }
    return { icon, color }
  }
  const handleClick = () => {
    clearTimeout(timer)
    clearToast()
  }

  return (
    <>
      {getter.message && (
        <div
          ref={toast}
          className={`toast ${design?.color}`}
        >
          {design?.icon}
          <span>{getter.message.text}</span>
          <button onClick={handleClick}>
            <IoClose />
          </button>
        </div>
      )}
    </>
  )
}
function DismissArea(props) {
  const navigate = useNavigate()

  return (
    <div onClick={() => navigate(-1)} className='modal-background' />
  )
}
function BlankCard({ children }) {
  return <div className="problem-card">
    <FaGhost />
    <div>
      {children}
    </div>
  </div>
}



export { StatusMessage, ContextMenu, Toast, DismissArea, BlankCard }
