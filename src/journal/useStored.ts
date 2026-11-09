import { useState } from 'react'

export function useStored<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const json = localStorage.getItem(key)
      return json ? JSON.parse(json) as T : initial
    } catch { return initial }
  })
  function update(next: T | ((previous: T) => T)) {
    setValue(previous => {
      const updated = typeof next === 'function' ? (next as (previous: T) => T)(previous) : next
      localStorage.setItem(key, JSON.stringify(updated))
      return updated
    })
  }
  return [value, update] as const
}
