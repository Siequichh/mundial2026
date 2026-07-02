import { useEffect, useRef, useState } from 'react'

// ponytail: native IntersectionObserver covers scroll-reveal, no animation library needed.
export function useReveal(threshold = 0.15) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); io.disconnect() } },
      { threshold }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  return [ref, visible]
}
