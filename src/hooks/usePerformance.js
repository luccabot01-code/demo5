import { useEffect, useCallback, useRef } from 'react'

// Debounce hook for performance
export const useDebounce = (callback, delay) => {
  const timeoutRef = useRef(null)

  return useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      callback(...args)
    }, delay)
  }, [callback, delay])
}

// Throttle hook for performance
export const useThrottle = (callback, delay) => {
  const lastRun = useRef(Date.now())

  return useCallback((...args) => {
    const now = Date.now()
    if (now - lastRun.current >= delay) {
      callback(...args)
      lastRun.current = now
    }
  }, [callback, delay])
}

// Lazy load images
export const useLazyLoad = () => {
  useEffect(() => {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target
            if (img.dataset.src) {
              img.src = img.dataset.src
              img.removeAttribute('data-src')
              imageObserver.unobserve(img)
            }
          }
        })
      }, {
        rootMargin: '50px'
      })

      document.querySelectorAll('img[data-src]').forEach((img) => {
        imageObserver.observe(img)
      })

      return () => imageObserver.disconnect()
    }
  }, [])
}

// Optimize scroll performance
export const useOptimizedScroll = (callback, delay = 100) => {
  const throttledCallback = useThrottle(callback, delay)

  useEffect(() => {
    let rafId = null
    const handleScroll = () => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        throttledCallback()
        rafId = null
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [throttledCallback])
}

// Preload critical resources
export const usePreload = (resources = []) => {
  useEffect(() => {
    resources.forEach((resource) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = resource.as || 'fetch'
      link.href = resource.href
      if (resource.type) link.type = resource.type
      document.head.appendChild(link)
    })
  }, [resources])
}
