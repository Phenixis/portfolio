"use client"

import { useState, useEffect } from "react"

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(null)
  const [prevScrollY, setPrevScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < 10) {
        setIsVisible(true)
        return
      }

      if (currentScrollY > prevScrollY) {
        // Scrolling down
        if (scrollDirection !== "down") {
          setScrollDirection("down")
          setIsVisible(false)
        }
      } else {
        // Scrolling up
        if (scrollDirection !== "up") {
          setScrollDirection("up")
          setIsVisible(true)
        }
      }

      setPrevScrollY(currentScrollY)
    }

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll, { passive: true })

    // Clean up
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [prevScrollY, scrollDirection])

  return { isVisible, scrollDirection }
}

