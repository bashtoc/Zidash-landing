import { useCallback, useEffect, useRef, useState } from 'react'
import { AlertTriangle, CheckCircle2, CircleAlert, Info, X } from 'lucide-react'
import { PopupContext } from './popup-context'

const toneConfig = {
  success: { title: 'Done', icon: CheckCircle2 },
  warning: { title: 'Please check', icon: AlertTriangle },
  error: { title: 'Something went wrong', icon: CircleAlert },
  info: { title: 'Notice', icon: Info },
}

export function PopupProvider({ children }) {
  const [popup, setPopup] = useState(null)
  const closeRef = useRef(null)
  const showPopup = useCallback((next) => setPopup({ tone: 'info', ...next }), [])
  const closePopup = useCallback(() => setPopup(null), [])

  useEffect(() => {
    if (!popup) return undefined
    const prior = document.activeElement
    closeRef.current?.focus()
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closePopup()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      prior?.focus?.()
    }
  }, [popup, closePopup])

  return (
    <PopupContext.Provider value={{ showPopup, closePopup }}>
      {children}
      {popup && (() => {
        const config = toneConfig[popup.tone] || toneConfig.info
        const Icon = popup.icon || config.icon
        return (
          <div className="z-popup-scrim" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && closePopup()}>
            <section className={`z-popup z-popup--${popup.tone}`} role="dialog" aria-modal="true" aria-labelledby="z-popup-title" aria-describedby="z-popup-message">
              <button ref={closeRef} type="button" className="z-popup__close" onClick={closePopup} aria-label="Close popup"><X size={20} /></button>
              <span className="z-popup__icon"><Icon size={36} /></span>
              <h2 id="z-popup-title">{popup.title || config.title}</h2>
              <p id="z-popup-message">{popup.message}</p>
              {popup.action && (
                <button type="button" className="app-button app-button--primary z-popup__action" onClick={() => {
                  popup.action.onClick?.()
                  closePopup()
                }}>{popup.action.label}</button>
              )}
            </section>
          </div>
        )
      })()}
    </PopupContext.Provider>
  )
}
