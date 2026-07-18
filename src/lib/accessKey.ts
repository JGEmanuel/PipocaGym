const STORAGE_KEY = 'pipoca-gym.access-key'

export function getAccessKey(): string | null {
  return localStorage.getItem(STORAGE_KEY)
}

export function saveAccessKey(key: string) {
  localStorage.setItem(STORAGE_KEY, key.trim())
}

export function clearAccessKey() {
  localStorage.removeItem(STORAGE_KEY)
}
