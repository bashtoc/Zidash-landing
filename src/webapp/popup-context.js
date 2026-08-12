import { createContext, useContext } from 'react'

export const PopupContext = createContext(null)

export function usePopup() {
  const value = useContext(PopupContext)
  if (!value) throw new Error('usePopup must be used inside PopupProvider')
  return value
}
