const GOOGLE_IDENTITY_SCRIPT_ID = 'zidash-google-identity'
const GOOGLE_IDENTITY_SCRIPT_URL = 'https://accounts.google.com/gsi/client'

let googleIdentityPromise

export function loadGoogleIdentity() {
  if (window.google?.accounts?.id) return Promise.resolve(window.google)
  if (googleIdentityPromise) return googleIdentityPromise

  googleIdentityPromise = new Promise((resolve, reject) => {
    const resolveGoogle = () => {
      if (window.google?.accounts?.id) resolve(window.google)
      else reject(new Error('Google Identity Services did not initialize.'))
    }
    const rejectGoogle = () => reject(new Error('Google Identity Services could not be loaded.'))
    const existing = document.getElementById(GOOGLE_IDENTITY_SCRIPT_ID)

    if (existing) {
      existing.addEventListener('load', resolveGoogle, { once: true })
      existing.addEventListener('error', rejectGoogle, { once: true })
      return
    }

    const script = document.createElement('script')
    script.id = GOOGLE_IDENTITY_SCRIPT_ID
    script.src = GOOGLE_IDENTITY_SCRIPT_URL
    script.async = true
    script.defer = true
    script.addEventListener('load', resolveGoogle, { once: true })
    script.addEventListener('error', rejectGoogle, { once: true })
    document.head.appendChild(script)
  }).catch((error) => {
    googleIdentityPromise = undefined
    throw error
  })

  return googleIdentityPromise
}
