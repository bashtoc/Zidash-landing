const defaultBase = import.meta.env.PROD ? 'https://api.zidash.com/api/v1' : '/api/v1'
const configuredBase = import.meta.env.VITE_API_URL || defaultBase
export const API_BASE = configuredBase.replace(/\/$/, '')

const SESSION_KEY = 'zidash_web_session'

export class ApiError extends Error {
  constructor(message, { status = 0, code = 'REQUEST_ERROR', details = null } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }
}

export function getStoredSession() {
  try {
    return JSON.parse(window.localStorage.getItem(SESSION_KEY) || 'null')
  } catch {
    return null
  }
}

export function storeSession(session) {
  if (!session?.accessToken) {
    window.localStorage.removeItem(SESSION_KEY)
    return
  }
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearStoredSession() {
  window.localStorage.removeItem(SESSION_KEY)
}

function normalizeTokens(tokens = {}) {
  return {
    accessToken: tokens.accessToken || tokens.token || '',
    refreshToken: tokens.refreshToken || '',
  }
}

async function parseResponse(response) {
  const body = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = body?.error || {}
    throw new ApiError(error.message || body?.message || `Request failed (${response.status})`, {
      status: response.status,
      code: error.code,
      details: error.details,
    })
  }
  return {
    data: body?.data ?? body,
    meta: body?.meta || null,
  }
}

async function rawRequest(path, options = {}, accessToken = '') {
  const isForm = options.body instanceof FormData
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(!isForm && options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(options.headers || {}),
    },
  })
  return parseResponse(response)
}

let refreshPromise = null

async function refreshSession(currentSession) {
  if (!currentSession?.refreshToken) throw new ApiError('Your session has expired.', { status: 401 })
  if (!refreshPromise) {
    refreshPromise = rawRequest('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: currentSession.refreshToken }),
    }).then(({ data }) => {
      const next = {
        ...currentSession,
        ...normalizeTokens(data?.tokens),
        user: data?.user || currentSession.user,
      }
      storeSession(next)
      return next
    }).finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
}

export async function apiRequest(path, options = {}) {
  const { auth = false, retry = true, ...fetchOptions } = options
  const session = getStoredSession()
  try {
    return await rawRequest(path, fetchOptions, auth ? session?.accessToken : '')
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401 || !auth || !retry) throw error
    try {
      const refreshed = await refreshSession(session)
      return await rawRequest(path, fetchOptions, refreshed.accessToken)
    } catch (refreshError) {
      clearStoredSession()
      window.dispatchEvent(new Event('zidash:session-expired'))
      throw refreshError
    }
  }
}

export function buildQuery(params = {}) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '' || value === 'all') return
    query.set(key, String(value))
  })
  const value = query.toString()
  return value ? `?${value}` : ''
}

export const api = {
  requestOtp(payload) {
    return apiRequest('/auth/request-otp', { method: 'POST', body: JSON.stringify(payload) })
  },
  verifyOtp(payload) {
    return apiRequest('/auth/verify-otp', { method: 'POST', body: JSON.stringify(payload) })
  },
  googleAuth(idToken) {
    return apiRequest('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    })
  },
  logout(refreshToken) {
    return apiRequest('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    })
  },
  bootstrap() {
    return apiRequest('/app/bootstrap', { auth: true })
  },
  taxonomy(section) {
    return apiRequest(`/taxonomy${buildQuery({ section })}`)
  },
  listings(params = {}, signal) {
    return apiRequest(`/listings${buildQuery(params)}`, { signal })
  },
  listing(id) {
    return apiRequest(`/listings/${encodeURIComponent(id)}`)
  },
  seller(id) {
    return apiRequest(`/seller-profiles/${encodeURIComponent(id)}`)
  },
  sellerListings(id, page = 1) {
    return apiRequest(`/listings${buildQuery({ sellerId: id, page, limit: 20 })}`)
  },
  preferred() {
    return apiRequest('/app/preferred-products', { auth: true })
  },
  togglePreferred(id) {
    return apiRequest(`/app/preferred-products/${encodeURIComponent(id)}/toggle`, {
      method: 'POST',
      body: '{}',
      auth: true,
    })
  },
  followStatus(id) {
    return apiRequest(`/app/seller-profiles/${encodeURIComponent(id)}/follow-status`, { auth: true })
  },
  toggleFollow(id) {
    return apiRequest(`/app/seller-profiles/${encodeURIComponent(id)}/follow-toggle`, {
      method: 'POST',
      body: '{}',
      auth: true,
    })
  },
  sellerRatingStatus(id) {
    return apiRequest(`/app/seller-profiles/${encodeURIComponent(id)}/rating`, { auth: true })
  },
  rateSeller(id, score) {
    return apiRequest(`/app/seller-profiles/${encodeURIComponent(id)}/rating`, {
      method: 'PUT',
      body: JSON.stringify({ score }),
      auth: true,
    })
  },
  createListing(payload) {
    return apiRequest('/app/listings', { method: 'POST', body: JSON.stringify(payload), auth: true })
  },
  myListings(status = 'listed') {
    return apiRequest(`/app/my-listings${buildQuery({ status })}`, { auth: true })
  },
  updateMyListing(id, payload) {
    return apiRequest(`/app/my-listings/${encodeURIComponent(id)}`, {
      method: 'PATCH', body: JSON.stringify(payload), auth: true,
    })
  },
  listingAction(id, action) {
    return apiRequest(`/app/my-listings/${encodeURIComponent(id)}/${action}`, {
      method: 'POST', body: '{}', auth: true,
    })
  },
  deleteMyListing(id) {
    return apiRequest(`/app/my-listings/${encodeURIComponent(id)}`, { method: 'DELETE', auth: true })
  },
  promotionPayment(id, payload) {
    return apiRequest(`/app/my-listings/${encodeURIComponent(id)}/promotion-payment`, {
      method: 'POST', body: JSON.stringify(payload), auth: true,
    })
  },
  jobs(params = {}) {
    return apiRequest(`/jobs${buildQuery(params)}`)
  },
  job(id) {
    return apiRequest(`/jobs/${encodeURIComponent(id)}`)
  },
  createJob(payload) {
    return apiRequest('/app/jobs', { method: 'POST', body: JSON.stringify(payload), auth: true })
  },
  myJobs(status) {
    return apiRequest(`/app/my-jobs${buildQuery({ status })}`, { auth: true })
  },
  updateMyJob(id, payload) {
    return apiRequest(`/app/my-jobs/${encodeURIComponent(id)}`, {
      method: 'PATCH', body: JSON.stringify(payload), auth: true,
    })
  },
  jobAction(id, action) {
    return apiRequest(`/app/my-jobs/${encodeURIComponent(id)}/${action}`, {
      method: 'POST', body: '{}', auth: true,
    })
  },
  deleteMyJob(id) {
    return apiRequest(`/app/my-jobs/${encodeURIComponent(id)}`, { method: 'DELETE', auth: true })
  },
  applyForJob(id, payload) {
    return apiRequest(`/app/jobs/${encodeURIComponent(id)}/apply`, {
      method: 'POST', body: JSON.stringify(payload), auth: true,
    })
  },
  creators(params = {}) {
    return apiRequest(`/creators${buildQuery(params)}`)
  },
  creator(id) {
    return apiRequest(`/creators/${encodeURIComponent(id)}`)
  },
  becomeCreator(payload) {
    return apiRequest('/app/creators', { method: 'POST', body: JSON.stringify(payload), auth: true })
  },
  campaignRequest(payload) {
    return apiRequest('/campaign-requests', { method: 'POST', body: JSON.stringify(payload), auth: true })
  },
  community(location) {
    return apiRequest(`/app/community/posts${buildQuery({ location: location === 'All' ? '' : location })}`)
  },
  createCommunityPost(payload) {
    return apiRequest('/app/community/posts', { method: 'POST', body: JSON.stringify(payload), auth: true })
  },
  myCommunityPosts() {
    return apiRequest('/app/my-community-posts', { auth: true })
  },
  updateCommunityPost(id, payload) {
    return apiRequest(`/app/my-community-posts/${encodeURIComponent(id)}`, {
      method: 'PATCH', body: JSON.stringify(payload), auth: true,
    })
  },
  deleteCommunityPost(id) {
    return apiRequest(`/app/my-community-posts/${encodeURIComponent(id)}`, { method: 'DELETE', auth: true })
  },
  toggleCommunityLike(id) {
    return apiRequest(`/app/community/posts/${encodeURIComponent(id)}/like`, {
      method: 'POST', body: '{}', auth: true,
    })
  },
  report(payload) {
    return apiRequest('/reports', { method: 'POST', body: JSON.stringify(payload), auth: true })
  },
  conversations() {
    return apiRequest('/app/conversations', { auth: true })
  },
  conversationMessages(id) {
    return apiRequest(`/app/conversations/${encodeURIComponent(id)}/messages`, { auth: true })
  },
  startConversation(payload) {
    return apiRequest('/app/conversations/start', {
      method: 'POST', body: JSON.stringify(payload), auth: true,
    })
  },
  sendMessage(id, payload) {
    return apiRequest(`/app/conversations/${encodeURIComponent(id)}/messages`, {
      method: 'POST', body: JSON.stringify(payload), auth: true,
    })
  },
  updateProfile(payload) {
    return apiRequest('/app/profile', { method: 'PATCH', body: JSON.stringify(payload), auth: true })
  },
  removeProfileCover() {
    return apiRequest('/app/profile/cover', { method: 'DELETE', auth: true })
  },
  deleteAccount() {
    return apiRequest('/app/account', { method: 'DELETE', auth: true })
  },
  phoneVerificationRequest(payload) {
    return apiRequest('/app/phone-verifications/request', {
      method: 'POST', body: JSON.stringify(payload), auth: true,
    })
  },
  phoneVerificationConfirm(code) {
    return apiRequest('/app/phone-verifications/verify', {
      method: 'POST', body: JSON.stringify({ code }), auth: true,
    })
  },
  identityVerification(payload) {
    return apiRequest('/app/identity-verifications', {
      method: 'POST', body: JSON.stringify(payload), auth: true,
    })
  },
  async upload(files) {
    const form = new FormData()
    Array.from(files).forEach((file) => form.append('files', file))
    const { data } = await apiRequest('/uploads', { method: 'POST', body: form, auth: true })
    return Array.isArray(data) ? data.map((item) => item.url).filter(Boolean) : []
  },
}

export function unwrapItems(response) {
  if (Array.isArray(response?.data)) return response.data
  if (Array.isArray(response?.data?.items)) return response.data.items
  if (Array.isArray(response?.items)) return response.items
  return []
}

export function unwrapMeta(response) {
  return response?.meta || response?.data?.meta || null
}

export function sessionFromAuthResponse(response) {
  const data = response?.data || response || {}
  return {
    ...normalizeTokens(data.tokens),
    user: data.user || null,
  }
}
