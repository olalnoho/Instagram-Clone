import {
   useEffect,
   useState,
   useCallback,
   useRef
} from 'react'

const useAutoScroll = (when, deps) => {
   const el = useRef()
   const [hasScrolled, setHasScrolled] = useState(false)

   const shouldAutoScroll = useCallback(() => {
      if (el.current.scrollHeight - (el.current.scrollTop + el.current.offsetHeight) < when) {
         return true
      }
      return false
   }, [when])

   useEffect(() => {
      if (!hasScrolled || shouldAutoScroll(el.current)) {
         el.current.scrollTop = el.current.scrollHeight
      }
      // lint is disabled for spread operator in dependency array
      // eslint-disable-next-line
   }, [...deps, hasScrolled, el, shouldAutoScroll])

   useEffect(() => {
      el.current.addEventListener('scroll', () => {
         setHasScrolled(true)
      }, { once: true })
   }, [el])

   return el
}

export default useAutoScroll