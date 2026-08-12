import { useEffect, useRef, useState } from 'react'
import { BadgeCheck, Camera, ChevronRight, ImagePlus, LockKeyhole, LogOut, Mail, PackageCheck, PlusCircle, Store, Trash2, UploadCloud, WalletCards } from 'lucide-react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { api, unwrapItems } from '../api'
import { useAuth } from '../auth-context'
import { EmptyState, ErrorState, LoadingState, PageIntro } from '../components'
import { CONDITIONS, listingImage, money, NIGERIAN_LOCATIONS } from '../data'
import { useRemote } from '../hooks'
import { loadGoogleIdentity } from '../google-identity'
import { usePopup } from '../popup-context'
import '../WebApp.css'

export function AuthPage() {
  const auth = useAuth()
  const { completeAuthentication } = auth
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [step, setStep] = useState('email')
  const mode = 'auto'
  const [email, setEmail] = useState('')
  const [digits, setDigits] = useState(Array(6).fill(''))
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const inputs = useRef([])
  const googleButton = useRef(null)
  const returnTo = params.get('returnTo')?.startsWith('/') ? params.get('returnTo') : '/app'
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim()

  useEffect(() => { if (auth.isAuthenticated) navigate(returnTo, { replace: true }) }, [auth.isAuthenticated, navigate, returnTo])

  useEffect(() => {
    if (step !== 'email' || !googleClientId || !googleButton.current) return undefined

    let active = true
    const buttonContainer = googleButton.current

    loadGoogleIdentity().then((google) => {
      if (!active || !buttonContainer) return

      google.accounts.id.initialize({
        client_id: googleClientId,
        cancel_on_tap_outside: true,
        callback: async ({ credential }) => {
          if (!credential || !active) {
            if (active) setError('Google did not return a valid sign-in credential. Please try again.')
            return
          }

          setGoogleLoading(true)
          setError('')
          try {
            const response = await api.googleAuth(credential)
            await completeAuthentication(response)
            navigate(returnTo, { replace: true })
          } catch (googleError) {
            if (active) setError(googleError.message)
          } finally {
            if (active) setGoogleLoading(false)
          }
        },
      })

      buttonContainer.replaceChildren()
      google.accounts.id.renderButton(buttonContainer, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        shape: 'pill',
        text: 'continue_with',
        logo_alignment: 'left',
        width: Math.min(400, Math.floor(buttonContainer.getBoundingClientRect().width || 400)),
      })
    }).catch(() => {
      if (active) setError('Google sign-in could not load. Check your connection and try again.')
    })

    return () => { active = false }
  }, [completeAuthentication, googleClientId, navigate, returnTo, step])

  async function requestCode(event) {
    event.preventDefault(); setLoading(true); setError('')
    try {
      await api.requestOtp({ email: email.trim().toLowerCase(), mode })
      setStep('code')
      requestAnimationFrame(() => inputs.current[0]?.focus())
    } catch (requestError) { setError(requestError.message) } finally { setLoading(false) }
  }

  function setCode(index, value) {
    const numeric = value.replace(/\D/g, '')
    if (numeric.length > 1) {
      const next = Array(6).fill('')
      numeric.slice(0, 6).split('').forEach((digit, digitIndex) => { next[digitIndex] = digit })
      setDigits(next)
      inputs.current[Math.min(numeric.length, 6) - 1]?.focus()
      return
    }
    const next = [...digits]; next[index] = numeric; setDigits(next)
    if (numeric && index < 5) inputs.current[index + 1]?.focus()
  }

  function handlePaste(event) {
    const value = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!value) return
    event.preventDefault()
    const next = Array(6).fill(''); value.split('').forEach((digit, index) => { next[index] = digit }); setDigits(next); inputs.current[Math.min(value.length, 6) - 1]?.focus()
  }

  async function verifyCode(event) {
    event.preventDefault(); const code = digits.join(''); if (code.length !== 6) return setError('Enter the complete six-digit code.')
    setLoading(true); setError('')
    try { const response = await api.verifyOtp({ email: email.trim().toLowerCase(), code, ...(mode !== 'auto' ? { mode } : {}) }); await completeAuthentication(response); navigate(returnTo, { replace: true }) } catch (verifyError) { setError(verifyError.message) } finally { setLoading(false) }
  }

  return <main className="auth-web-page"><Link className="auth-web-brand" to="/" aria-label="Zidash home"><img src="/zidashfavicon.png" alt="" /><strong>zidash</strong><img className="auth-web-brand__mobile-logo" src="/zidashlogo.png" alt="Zidash" /></Link><section className="auth-web-visual"><span>BUY</span><span>SELL</span><span>CONNECT</span><div><p className="app-eyebrow">Welcome to Zidash</p><h1>Everything local, one trusted community.</h1><p>Shop products, find opportunities, meet creators, and grow your business.</p></div></section><section className="auth-web-card">{step === 'email' ? <><span className="auth-icon"><Mail /></span><h1>Continue to Zidash</h1><p>Sign in or create an account with Google or your email address.</p><div className={`google-auth ${googleLoading ? 'is-loading' : ''}`} aria-busy={googleLoading}>{googleClientId ? <div ref={googleButton} className="google-auth__button" /> : <button className="google-auth__unconfigured" type="button" onClick={() => setError('Google sign-in needs a Web OAuth client ID. Add VITE_GOOGLE_CLIENT_ID to enable it.')}><img src="/googleicon.svg" alt="" />Continue with Google</button>}{googleLoading && <small>Signing you in…</small>}</div><div className="auth-divider"><span>or continue with email</span></div><form className="mini-form" onSubmit={requestCode}><label>Email address<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="you@example.com" /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="app-button app-button--primary" disabled={loading || googleLoading} type="submit">{loading ? 'Sending code…' : 'Send verification code'}</button></form></> : <><span className="auth-icon"><LockKeyhole /></span><h1>Check your email</h1><p>Enter the six-digit code sent to <strong>{email}</strong>.</p><form className="mini-form" onSubmit={verifyCode}><div className="otp-fields" onPaste={handlePaste}>{digits.map((digit, index) => <input key={index} ref={(element) => { inputs.current[index] = element }} value={digit} onChange={(event) => setCode(index, event.target.value)} onKeyDown={(event) => { if (event.key === 'Backspace' && !digits[index] && index > 0) inputs.current[index - 1]?.focus() }} inputMode="numeric" autoComplete={index === 0 ? 'one-time-code' : 'off'} maxLength="1" aria-label={`Verification digit ${index + 1}`} />)}</div>{error && <p className="form-error" role="alert">{error}</p>}<button className="app-button app-button--primary" disabled={loading} type="submit">{loading ? 'Verifying…' : 'Verify and continue'}</button><button className="text-button" type="button" onClick={() => { setStep('email'); setDigits(Array(6).fill('')); setError('') }}>Use another email</button></form></>}</section></main>
}

export function ProfilePage() {
  const auth = useAuth()
  const navigate = useNavigate()
  const { showPopup } = usePopup()
  const [editing, setEditing] = useState(false)
  const data = auth.bootstrap
  if (auth.loading && !data) return <div className="app-page"><LoadingState label="Loading profile" /></div>
  const user = data?.user || auth.user || {}
  const seller = data?.sellerProfile || {}
  const wallet = data?.walletBalance || {}
  const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Zidash member'
  const links = [
    ['/app/my-listings', 'listings', 'My listings', `${data?.listingsCount || 0} listings`],
    ['/app/saved', 'saved', 'Preferred products', 'Saved items'],
    ['/app/community/mine', 'community', 'My community posts', 'Posts you shared'],
    ['/app/jobs/mine', 'jobs', 'My job posts', 'Roles you published'],
    ['/app/wallet', 'wallet', 'Zidash Wallet', money(wallet.availableBalance, wallet.currency)],
    ['/app/profile/verification', 'verification', 'Verification', data?.latestVerification?.status || (user.phoneVerifiedAt ? 'Phone verified' : 'Get verified')],
  ]

  async function saveProfile(event) {
    event.preventDefault(); const form = new FormData(event.currentTarget)
    try { await api.updateProfile({ firstName: form.get('firstName'), lastName: form.get('lastName'), phone: form.get('phone') || undefined, sellerProfile: { displayName: form.get('displayName'), bio: form.get('bio'), location: form.get('location') } }); await auth.refreshBootstrap(); setEditing(false); showPopup({ tone: 'success', message: 'Profile updated successfully.' }) } catch (error) { showPopup({ tone: 'error', message: error.message }) }
  }

  async function logout() { await auth.logout(); navigate('/app') }
  async function deleteAccount() { showPopup({ tone: 'warning', title: 'Delete your account?', message: 'This removes access to your Zidash account and cannot be undone from this screen.', action: { label: 'Delete account', onClick: async () => { try { await api.deleteAccount(); await auth.logout(); navigate('/') } catch (error) { showPopup({ tone: 'error', message: error.message }) } } } }) }

  return <div className="app-page"><section className="profile-hero">{seller.coverImageUrl ? <img className="profile-cover" src={seller.coverImageUrl} alt="" /> : <div className="profile-cover profile-cover--empty"><Camera size={24} /> Public profile header</div>}<div className="profile-identity"><span className="profile-avatar">{user.avatarUrl ? <img src={user.avatarUrl} alt="" /> : name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2)}</span><div><h1>{name}</h1><p>{user.email}</p><span><WalletCards size={14} /> Balance {money(wallet.availableBalance, wallet.currency)}</span></div><button className="app-button app-button--outline" type="button" onClick={() => setEditing(!editing)}>{editing ? 'Cancel editing' : 'Edit profile'}</button></div></section>{editing && <form className="app-form profile-edit-form" onSubmit={saveProfile}><div className="form-grid"><label>First name<input name="firstName" defaultValue={user.firstName || ''} required /></label><label>Last name<input name="lastName" defaultValue={user.lastName || ''} required /></label><label>Phone<input name="phone" defaultValue={user.phone || ''} /></label><label>Store display name<input name="displayName" defaultValue={seller.displayName || name} /></label><label>Location<select name="location" defaultValue={seller.location || 'Lagos'}>{NIGERIAN_LOCATIONS.filter((item) => item !== 'All').map((item) => <option key={item}>{item}</option>)}</select></label></div><label>Store bio<textarea name="bio" rows="4" defaultValue={seller.bio || ''} /></label><button className="app-button app-button--primary" type="submit">Save changes</button></form>}<div className="profile-tool-grid">{links.map(([to, icon, title, subtitle]) => <Link key={to} to={to}><span className={`profile-tool-icon profile-tool-icon--${icon}`} aria-hidden="true" /><div><h2>{title}</h2><p>{subtitle}</p></div><ChevronRight size={18} /></Link>)}</div><section className="account-actions"><h2>Account</h2><button className="is-danger" type="button" onClick={deleteAccount}><Trash2 size={18} /><span><strong>Delete account</strong><small>Permanently remove your account</small></span><ChevronRight size={17} /></button><button type="button" onClick={logout}><LogOut size={18} /><span><strong>Logout</strong><small>Sign out of this device</small></span><ChevronRight size={17} /></button></section></div>
}

export function SellPage() {
  const taxonomy = useRemote(() => api.taxonomy('marketplace'), [])
  const navigate = useNavigate()
  const { showPopup } = usePopup()
  const [categoryId, setCategoryId] = useState('')
  const [saving, setSaving] = useState(false)
  const categories = unwrapItems(taxonomy)
  const selectable = categories.flatMap((category) => (category.children || []).map((child) => ({ ...child, parentName: category.name })))
  async function submit(event) {
    event.preventDefault(); setSaving(true); const form = new FormData(event.currentTarget)
    try { const urls = await api.upload(form.getAll('images').filter((file) => file?.size)); await api.createListing({ title: form.get('title'), description: form.get('description'), price: Number(form.get('price')), currency: 'NGN', categoryId: form.get('categoryId'), condition: form.get('condition'), location: form.get('location'), imageUrls: urls, sellerName: form.get('sellerName') || undefined }); showPopup({ tone: 'success', title: 'Listing submitted', message: 'Your listing was submitted for admin review.' }); navigate('/app/my-listings') } catch (error) { showPopup({ tone: 'error', message: error.message }) } finally { setSaving(false) }
  }
  return <div className="app-page"><PageIntro eyebrow="Marketplace" title="Create a listing" description="Add clear details, choose your location, and upload up to eight photos." />{taxonomy.loading ? <LoadingState label="Loading categories" /> : taxonomy.error ? <ErrorState message={taxonomy.error} retry={taxonomy.reload} /> : !selectable.length ? <EmptyState title="Categories could not be loaded" message="Active marketplace subcategories are required before a listing can be created." action={<button className="app-button app-button--outline" type="button" onClick={taxonomy.reload}>Retry</button>} /> : <form className="app-form app-form--wide" onSubmit={submit}><div className="form-grid"><label>Category and subcategory<select name="categoryId" required value={categoryId} onChange={(event) => setCategoryId(event.target.value)}><option value="">Choose category</option>{selectable.map((category) => <option key={category.id} value={category.id}>{category.parentName} — {category.name}</option>)}</select></label><label>Condition<select name="condition" defaultValue="used">{CONDITIONS.map((condition) => <option key={condition.value} value={condition.value}>{condition.label}</option>)}</select></label><label>Title<input name="title" required minLength="3" maxLength="180" placeholder="What are you selling?" /></label><label>Price (₦)<input name="price" required type="number" min="0" /></label><label>Seller/store name<input name="sellerName" placeholder="Your public store name" /></label><label>Location<select name="location" required defaultValue="Lagos">{NIGERIAN_LOCATIONS.filter((item) => item !== 'All').map((item) => <option key={item}>{item}</option>)}</select></label></div><label>Description<textarea name="description" required minLength="10" rows="7" placeholder="Describe the item, its condition, and important details" /></label><label className="upload-field"><UploadCloud size={28} /><strong>Upload product photos</strong><span>Choose up to 8 images</span><input name="images" type="file" accept="image/*" multiple required /></label><button className="app-button app-button--primary" disabled={saving} type="submit">{saving ? 'Creating listing…' : 'Submit listing'}</button></form>}</div>
}

export function EditListingPage() {
  const { listingId } = useParams()
  const navigate = useNavigate()
  const { showPopup } = usePopup()
  const listings = useRemote(() => api.myListings('listed'), [])
  const taxonomy = useRemote(() => api.taxonomy('marketplace'), [])
  const [saving, setSaving] = useState(false)
  const listing = unwrapItems(listings).find((item) => item.id === listingId)
  const categories = unwrapItems(taxonomy).flatMap((category) => (category.children || []).map((child) => ({ ...child, parentName: category.name })))
  async function submit(event) { event.preventDefault(); setSaving(true); const form = new FormData(event.currentTarget); try { await api.updateMyListing(listingId, { categoryId: form.get('categoryId'), title: form.get('title'), description: form.get('description'), price: Number(form.get('price')), condition: form.get('condition'), location: form.get('location') }); showPopup({ tone: 'success', message: 'Listing updated.' }); navigate('/app/my-listings') } catch (error) { showPopup({ tone: 'error', message: error.message }) } finally { setSaving(false) } }
  if (listings.loading || taxonomy.loading) return <div className="app-page"><LoadingState label="Loading listing" /></div>
  if (listings.error || taxonomy.error) return <div className="app-page"><ErrorState message={listings.error || taxonomy.error} retry={() => { listings.reload(); taxonomy.reload() }} /></div>
  if (!listing) return <div className="app-page"><EmptyState title="Listing not found" message="This listing is not available in your seller hub." /></div>
  return <div className="app-page"><PageIntro eyebrow="Seller hub" title="Edit listing" description="Update the product details buyers see." /><form className="app-form app-form--wide" onSubmit={submit}><div className="form-grid"><label>Subcategory<select name="categoryId" defaultValue={listing.categoryId} required><option value="">Choose subcategory</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.parentName} — {category.name}</option>)}</select></label><label>Condition<select name="condition" defaultValue={listing.condition || 'used'}>{CONDITIONS.map((condition) => <option key={condition.value} value={condition.value}>{condition.label}</option>)}</select></label><label>Title<input name="title" defaultValue={listing.title} required minLength="3" maxLength="180" /></label><label>Price (₦)<input name="price" defaultValue={listing.price} required type="number" min="0" /></label><label>Location<select name="location" required defaultValue={listing.location || 'Lagos'}>{NIGERIAN_LOCATIONS.filter((item) => item !== 'All').map((item) => <option key={item}>{item}</option>)}</select></label></div><label>Description<textarea name="description" defaultValue={listing.description} required minLength="10" rows="7" /></label><button className="app-button app-button--primary" disabled={saving} type="submit">{saving ? 'Saving…' : 'Save listing'}</button></form></div>
}

export function MyListingsPage() {
  const [status, setStatus] = useState('listed')
  const { showPopup } = usePopup()
  const state = useRemote(() => api.myListings(status), [status])
  async function action(listing, nextAction) { try { if (nextAction === 'delete') await api.deleteMyListing(listing.id); else await api.listingAction(listing.id, nextAction); showPopup({ tone: 'success', message: `Listing ${nextAction === 'close' ? 'closed' : nextAction === 'reopen' ? 'reopened' : 'deleted'}.` }); state.reload() } catch (error) { showPopup({ tone: 'error', message: error.message }) } }
  return <div className="app-page"><PageIntro eyebrow="Seller hub" title="My listings" description="Edit, close, reopen, delete, or promote your products." actions={<Link to="/app/sell" className="app-button app-button--primary"><PlusCircle size={17} /> New listing</Link>} /><div className="segment-control">{['listed', 'active', 'closed'].map((item) => <button type="button" className={status === item ? 'is-active' : ''} key={item} onClick={() => setStatus(item)}>{item}</button>)}</div>{state.loading ? <LoadingState /> : state.error ? <ErrorState message={state.error} retry={state.reload} /> : unwrapItems(state).length ? <div className="manage-list listing-manage-list">{unwrapItems(state).map((listing) => <article key={listing.id}>{listingImage(listing) ? <img src={listingImage(listing)} alt="" /> : <span className="manage-image-empty"><ImagePlus /></span>}<div><span className="status-pill">{listing.status}</span><h2>{listing.title}</h2><p>{money(listing.price, listing.currency)} · {listing.location}</p></div><div><Link to={`/app/my-listings/${listing.id}/edit`}>Edit</Link><Link to={`/app/my-listings/${listing.id}/boost`}>Boost</Link>{listing.status === 'sold' || listing.status === 'paused' ? <button type="button" onClick={() => action(listing, 'reopen')}>Reopen</button> : <button type="button" onClick={() => action(listing, 'close')}>Close</button>}<button className="danger-link" type="button" onClick={() => action(listing, 'delete')}>Delete</button></div></article>)}</div> : <EmptyState icon={PackageCheck} title="No listings in this section" message="Create a listing or choose another status." />}</div>
}

export function BoostListingPage() {
  const { listingId } = useParams(); const auth = useAuth(); const { showPopup } = usePopup(); const [days, setDays] = useState(7); const [method, setMethod] = useState('wallet'); const [paying, setPaying] = useState(false); const [bank, setBank] = useState(null)
  const wallet = auth.bootstrap?.walletBalance || {}
  async function pay() { setPaying(true); try { const response = await api.promotionPayment(listingId, { days, method }); if (response.data?.status === 'pending') setBank(response.data.bankTransfer); else { await auth.refreshBootstrap(); showPopup({ tone: 'success', message: 'Promotion payment received. Your listing is now promoted.' }) } } catch (error) { showPopup({ tone: 'error', message: error.message }) } finally { setPaying(false) } }
  return <div className="app-page"><PageIntro eyebrow="Promote your listing" title="Review and pay" description="Choose a promotion duration and payment method." /><div className="boost-layout"><section className="panel-card"><h2>Promotion duration</h2><div className="boost-plans"><button type="button" className={days === 7 ? 'is-active' : ''} onClick={() => setDays(7)}><strong>7-Day Boost</strong><span>Popular · ₦3,000</span></button><button type="button" className={days === 30 ? 'is-active' : ''} onClick={() => setDays(30)}><strong>30-Day Boost</strong><span>Power Seller · ₦9,000</span></button></div><h2>Payment method</h2><div className="payment-methods"><button type="button" className={method === 'wallet' ? 'is-active' : ''} onClick={() => { setMethod('wallet'); setBank(null) }}><WalletCards /><span><strong>Zidash Wallet</strong><small>Balance {money(wallet.availableBalance, wallet.currency)}</small></span></button><button type="button" className={method === 'bank_transfer' ? 'is-active' : ''} onClick={() => { setMethod('bank_transfer'); setBank(null) }}><Store /><span><strong>Bank transfer</strong><small>Transfer using the account details provided</small></span></button></div><button type="button" onClick={pay} disabled={paying} className="app-button app-button--primary pay-button">{paying ? 'Preparing payment…' : 'Continue to payment'}</button></section>{bank && <aside className="bank-details panel-card"><h2>Bank transfer details</h2><dl><div><dt>Bank</dt><dd>{bank.bankName}</dd></div><div><dt>Account name</dt><dd>{bank.accountName}</dd></div><div><dt>Account number</dt><dd>{bank.accountNumber}</dd></div><div><dt>Amount</dt><dd>{money(bank.amount, bank.currency)}</dd></div><div><dt>Reference</dt><dd>{bank.reference}</dd></div></dl><button type="button" className="app-button app-button--primary" onClick={() => showPopup({ tone: 'success', title: 'Transfer noted', message: 'Your promo will start automatically once your payment is confirmed.' })}>I have made the transfer</button></aside>}</div></div>
}

export function WalletPage() {
  const auth = useAuth(); const wallet = auth.bootstrap?.walletBalance || {}
  return <div className="app-page"><PageIntro eyebrow="Your account" title="Zidash Wallet" description="Your wallet balance is currently used for listing promotions." /><section className="wallet-hero"><WalletCards size={34} /><span>Available balance</span><strong>{money(wallet.availableBalance, wallet.currency)}</strong><p>Pending: {money(wallet.pendingBalance, wallet.currency)}</p></section><div className="wallet-note"><BadgeCheck size={21} /><div><h2>Wallet activity</h2><p>The current consumer API does not expose a complete transaction history. Promotion payments will appear here after that endpoint is added.</p></div></div></div>
}

export function VerificationPage() {
  const auth = useAuth(); const { showPopup } = usePopup(); const [tab, setTab] = useState('phone'); const [requestSent, setRequestSent] = useState(false); const [phoneCode, setPhoneCode] = useState('')
  async function requestPhone(event) { event.preventDefault(); const form = new FormData(event.currentTarget); try { const response = await api.phoneVerificationRequest({ phone: form.get('phone'), identityMethod: form.get('identityMethod'), identityNumber: form.get('identityNumber') || undefined }); setRequestSent(true); if (response.data?.devCode) setPhoneCode(response.data.devCode); showPopup({ tone: 'success', message: 'Verification code sent.' }) } catch (error) { showPopup({ tone: 'error', message: error.message }) } }
  async function verifyPhone(event) { event.preventDefault(); try { await api.phoneVerificationConfirm(new FormData(event.currentTarget).get('code')); await auth.refreshBootstrap(); showPopup({ tone: 'success', message: 'Phone number verified.' }) } catch (error) { showPopup({ tone: 'error', message: error.message }) } }
  async function submitIdentity(event) { event.preventDefault(); const form = new FormData(event.currentTarget); try { const files = [form.get('selfie'), form.get('front'), form.get('back')].filter((file) => file?.size); const urls = await api.upload(files); await api.identityVerification({ documentType: form.get('documentType'), selfieUrl: urls[0], frontUrl: urls[1], ...(urls[2] ? { backUrl: urls[2] } : {}), notes: form.get('notes'), submittedFrom: 'web' }); await auth.refreshBootstrap(); showPopup({ tone: 'success', message: 'Verification submitted for review.' }) } catch (error) { showPopup({ tone: 'error', message: error.message }) } }
  return <div className="app-page"><PageIntro eyebrow="Trust & safety" title="Account verification" description="Verify your phone and identity to build trust on Zidash." /><div className="segment-control"><button type="button" className={tab === 'phone' ? 'is-active' : ''} onClick={() => setTab('phone')}>Phone</button><button type="button" className={tab === 'identity' ? 'is-active' : ''} onClick={() => setTab('identity')}>Identity</button></div>{tab === 'phone' ? <section className="panel-card verification-card"><h2>{auth.user?.phoneVerifiedAt ? 'Phone verified' : 'Verify your phone'}</h2>{!requestSent ? <form className="mini-form" onSubmit={requestPhone}><label>Phone number<input name="phone" type="tel" defaultValue={auth.user?.phone || ''} required /></label><label>Identity method<select name="identityMethod" defaultValue="nin"><option value="nin">NIN</option><option value="bvn">BVN</option></select></label><label>11-digit identity number <span>optional</span><input name="identityNumber" inputMode="numeric" pattern="[0-9]{11}" /></label><button className="app-button app-button--primary" type="submit">Send verification code</button></form> : <form className="mini-form" onSubmit={verifyPhone}><label>Six-digit code<input name="code" inputMode="numeric" pattern="[0-9]{6}" autoComplete="one-time-code" defaultValue={phoneCode} required /></label><button className="app-button app-button--primary" type="submit">Verify phone</button></form>}</section> : <section className="panel-card verification-card"><h2>Identity verification</h2><p>Status: <strong>{auth.bootstrap?.latestVerification?.status || 'Not submitted'}</strong></p><form className="mini-form" onSubmit={submitIdentity}><label>Document type<select name="documentType"><option value="national_id">National ID</option><option value="passport">Passport</option><option value="drivers_license">Driver’s licence</option><option value="voters_card">Voter’s card</option></select></label><label>Selfie<input name="selfie" type="file" accept="image/*" required /></label><label>Document front<input name="front" type="file" accept="image/*" required /></label><label>Document back <span>optional</span><input name="back" type="file" accept="image/*" /></label><label>Notes <span>optional</span><textarea name="notes" rows="3" /></label><button className="app-button app-button--primary" type="submit">Submit for review</button></form></section>}</div>
}
