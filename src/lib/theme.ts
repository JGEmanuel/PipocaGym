import { useCallback, useSyncExternalStore } from 'react'

const STORAGE_KEY = 'pipoca-gym.theme'
const listeners = new Set<() => void>()

function isDark(): boolean {
  return document.documentElement.classList.contains('dark')
}

function setDark(dark: boolean) {
  const root = document.documentElement
  root.classList.add('theme-transition')
  root.classList.toggle('dark', dark)
  localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light')
  setTimeout(() => root.classList.remove('theme-transition'), 250)
  listeners.forEach((fn) => fn())
}

function subscribe(fn: () => void) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function useTheme() {
  const dark = useSyncExternalStore(subscribe, isDark)
  const toggle = useCallback(() => setDark(!isDark()), [])
  return { dark, toggle }
}
