import { useEffect, useState, useCallback } from 'react'

export const useAutoScroll = (ref, when, deps) => {
   const [hasScrolled, setHasScrolled] = useState(false)

   const shouldAutoScroll = useCallback(box => {
      if (box.scrollHeight - (box.scrollTop + box.offsetHeight) < when) {
         return true
      }
      return false
   }, [when])

   useEffect(() => {
      if (!hasScrolled || shouldAutoScroll(ref.current)) {
         ref.current.scrollTop = ref.current.scrollHeight
      }
      // lint is disabled for spread operator in dependency array
      // eslint-disable-next-line
   }, [...deps, hasScrolled, ref, shouldAutoScroll])

   useEffect(() => {
      ref.current.addEventListener('scroll', () => {
         setHasScrolled(true)
      }, { once: true })
   }, [ref])
}