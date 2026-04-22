import * as React from "react"

const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)"

function getSystemTheme(): "dark" | "light" {
  return window.matchMedia(COLOR_SCHEME_QUERY).matches ? "dark" : "light"
}

function disableTransitionsTemporarily() {
  const style = document.createElement("style")
  style.appendChild(
    document.createTextNode(
      "*,*::before,*::after{-webkit-transition:none!important;transition:none!important}"
    )
  )
  document.head.appendChild(style)

  return () => {
    window.getComputedStyle(document.body)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        style.remove()
      })
    })
  }
}

type ThemeProviderProps = {
  children: React.ReactNode
  disableTransitionOnChange?: boolean
}

/**
 * Applies `light` / `dark` on `<html>` from the OS color scheme only (no persistence, no manual toggle).
 */
export function ThemeProvider({
  children,
  disableTransitionOnChange = true,
}: ThemeProviderProps) {
  const applyTheme = React.useCallback(() => {
    const root = document.documentElement
    const resolvedTheme = getSystemTheme()
    const restoreTransitions = disableTransitionOnChange
      ? disableTransitionsTemporarily()
      : null

    root.classList.remove("light", "dark")
    root.classList.add(resolvedTheme)

    if (restoreTransitions) {
      restoreTransitions()
    }
  }, [disableTransitionOnChange])

  React.useLayoutEffect(() => {
    applyTheme()

    const mediaQuery = window.matchMedia(COLOR_SCHEME_QUERY)
    const handleChange = () => {
      applyTheme()
    }

    mediaQuery.addEventListener("change", handleChange)

    return () => {
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [applyTheme])

  return <>{children}</>
}
