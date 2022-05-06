import { useEffect, useMemo, useState } from "react";

function debounce(callback, delay = 250) {
  let timer

  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      callback(...args)
    }, delay)
  }
}

function useDebounce(callback, delay = 250, target) {
  useEffect(() => {
    const timer = setTimeout(
      (...args) => callback(...args), delay)
    return () => { clearTimeout(timer) } // executes on the 2nd call and later
  }, target)
}

function useDebouncedState(value, delay = 250) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  // setValue is for debouncing the actual setting 
  const setValue = useMemo(
    () => debounce((value) => {
      setDebouncedValue(value)
    }, delay), [])

  // debouncing initial value
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => { clearTimeout(timer) } // executes on the 2nd call and later
  }, [value])
  return [debouncedValue, setValue]
}


function useDebouncedValue(value, delay = 250) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => { clearTimeout(timer) } // executes on the 2nd call and later
  }, [value])
  return debouncedValue
}

function truncate(text, length = 256) {
  return text.length > length
    ? text.slice(0, length).trim().concat('…')
    : text.trim()
}

function contains(target, subject) {
  for (const object of subject) {
    if (target === object) {
      return true
    }
  }
  return false
}

export {
  useDebounce,
  useDebouncedState,
  useDebouncedValue,
  truncate,
  contains,
}