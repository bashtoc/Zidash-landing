import { useEffect, useState } from 'react'
import { ArrowRight, Heart, ImageOff, MapPin, RefreshCw, Search, SlidersHorizontal } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from './api'
import { CONDITIONS, listingImage, money, NIGERIAN_LOCATIONS, REPORT_REASONS, sellerName, SORT_OPTIONS } from './data'
import { useAuth } from './auth-context'
import { usePopup } from './popup-context'

export function PageIntro({ eyebrow, title, description, actions }) {
  return <header className="app-page-intro">
    <div>
      {eyebrow && <span className="app-eyebrow">{eyebrow}</span>}
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
    {actions && <div className="app-page-actions">{actions}</div>}
  </header>
}

export function LoadingState({ label = 'Loading' }) {
  return <div className="app-state" role="status"><span className="page-loader" /><strong>{label}</strong></div>
}

export function EmptyState({ icon: Icon = ImageOff, title, message, action }) {
  return <div className="app-state app-state--empty"><span className="app-state__icon"><Icon size={26} /></span><h2>{title}</h2><p>{message}</p>{action}</div>
}

export function ErrorState({ message, retry }) {
  return <div className="app-state app-state--error"><span className="app-state__icon"><RefreshCw size={25} /></span><h2>Could not load this section</h2><p>{message}</p>{retry && <button className="app-button app-button--outline" type="button" onClick={retry}><RefreshCw size={16} /> Try again</button>}</div>
}

export function SectionHeading({ title, subtitle, to, linkLabel = 'See all' }) {
  return <div className="app-section-heading"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{to && <Link to={to}>{linkLabel} <ArrowRight size={16} /></Link>}</div>
}

export function ListingCard({ listing, saved = false, onSavedChange }) {
  const auth = useAuth()
  const navigate = useNavigate()
  const { showPopup } = usePopup()
  const [isSaved, setIsSaved] = useState(saved)
  const [saving, setSaving] = useState(false)
  const image = listingImage(listing)

  useEffect(() => setIsSaved(saved), [saved])

  async function toggleSave(event) {
    event.preventDefault()
    event.stopPropagation()
    if (!auth.isAuthenticated) {
      navigate(`/auth?returnTo=${encodeURIComponent(window.location.pathname + window.location.search)}`)
      return
    }
    if (!listing?.id || saving) return
    const previous = isSaved
    setIsSaved(!previous)
    setSaving(true)
    try {
      const response = await api.togglePreferred(listing.id)
      const next = response.data?.saved ?? !previous
      setIsSaved(next)
      onSavedChange?.(next)
    } catch (error) {
      setIsSaved(previous)
      showPopup({ tone: 'error', message: error.message })
    } finally {
      setSaving(false)
    }
  }

  return <Link className="listing-card" to={`/app/listing/${listing.id}`}>
    <div className="listing-card__media">
      {image ? <img src={image} alt={listing.title || 'Marketplace listing'} loading="lazy" /> : <span><ImageOff size={28} /></span>}
      <button type="button" className={`save-button ${isSaved ? 'is-saved' : ''}`} onClick={toggleSave} disabled={saving} aria-label={isSaved ? 'Remove from preferred products' : 'Save to preferred products'}><Heart size={18} fill={isSaved ? 'currentColor' : 'none'} /></button>
      {listing.promotedUntil && <em className="promoted-pill">Promoted</em>}
    </div>
    <div className="listing-card__body">
      <strong className="listing-card__price">{money(listing.price, listing.currency)}</strong>
      <h3>{listing.title || 'Untitled listing'}</h3>
      <p className="listing-card__seller">{sellerName(listing)}</p>
      <span className="listing-card__location"><MapPin size={13} /> {listing.location || 'Nigeria'}</span>
    </div>
  </Link>
}

export function ListingGrid({ listings, emptyTitle = 'No listings found', onSavedChange }) {
  if (!listings?.length) return <EmptyState title={emptyTitle} message="Try a different search or check back after new items are posted." />
  return <div className="listing-grid">{listings.map((listing) => <ListingCard key={listing.id} listing={listing} saved={Boolean(listing.savedByMe || listing.isSaved || listing._saved)} onSavedChange={onSavedChange ? (saved) => onSavedChange(listing, saved) : undefined} />)}</div>
}

export function MarketplaceSearch({ initialQuery = '', onSubmit, filters, onFiltersChange, categories = [] }) {
  const [query, setQuery] = useState(initialQuery)
  useEffect(() => setQuery(initialQuery), [initialQuery])
  return <form className="market-search" onSubmit={(event) => { event.preventDefault(); onSubmit?.(query.trim()) }}>
    <label className="market-search__input"><Search size={20} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search for items, categories, or sellers" aria-label="Search marketplace" /><button type="submit">Search</button></label>
    {onFiltersChange && <details className="filter-popover">
      <summary><SlidersHorizontal size={19} /> Filters</summary>
      <div className="filter-popover__panel">
        <button type="button" className="filter-close" onClick={(event) => event.currentTarget.closest('details').removeAttribute('open')} aria-label="Close filters">×</button>
        <label>Category<select value={filters.categoryId || ''} onChange={(event) => onFiltersChange({ ...filters, categoryId: event.target.value })}><option value="">All categories</option>{categories.flatMap((category) => [<option key={category.id} value={category.id}>{category.name}</option>, ...(category.children || []).map((child) => <option key={child.id} value={child.id}>— {child.name}</option>)])}</select></label>
        <label>Condition<select value={filters.condition || ''} onChange={(event) => onFiltersChange({ ...filters, condition: event.target.value })}><option value="">Any condition</option>{CONDITIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
        <label>Location<select value={filters.location || 'all'} onChange={(event) => onFiltersChange({ ...filters, location: event.target.value })}><option value="all">All locations</option>{NIGERIAN_LOCATIONS.filter((item) => item !== 'All').map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        <div className="filter-price-row"><label>Minimum price<input type="number" min="0" value={filters.minPrice || ''} onChange={(event) => onFiltersChange({ ...filters, minPrice: event.target.value })} /></label><label>Maximum price<input type="number" min="0" value={filters.maxPrice || ''} onChange={(event) => onFiltersChange({ ...filters, maxPrice: event.target.value })} /></label></div>
        <label>Sort<select value={filters.sort || 'newest'} onChange={(event) => onFiltersChange({ ...filters, sort: event.target.value })}>{SORT_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
        <button type="button" className="app-button app-button--ghost" onClick={() => onFiltersChange({ categoryId: '', condition: '', location: 'all', minPrice: '', maxPrice: '', sort: 'newest' })}>Clear filters</button>
      </div>
    </details>}
  </form>
}

export function ReportDialog({ title, subjectLabel = 'item', submitting = false, requireOtherDetails = false, onClose, onSubmit }) {
  const [reason, setReason] = useState(REPORT_REASONS[0])
  const [details, setDetails] = useState('')
  const needsDetails = requireOtherDetails && reason === 'Other'
  const submitDisabled = submitting || (needsDetails && !details.trim())
  return <div className="app-modal-scrim" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <form className="app-modal report-dialog" role="dialog" aria-modal="true" aria-labelledby="report-dialog-title" onSubmit={(event) => { event.preventDefault(); if (!submitDisabled) onSubmit(reason, details.trim()) }}>
      <button className="app-modal__close" type="button" onClick={onClose} aria-label="Close report form">×</button>
      <h2 id="report-dialog-title">{title}</h2>
      <p>Tell us why you are reporting this {subjectLabel}. Our moderation team will review it.</p>
      <div className="report-reasons">{REPORT_REASONS.map((item) => <label key={item} className={reason === item ? 'is-selected' : ''}><input type="radio" name="reportReason" value={item} checked={reason === item} onChange={() => setReason(item)} /><span>{item}</span></label>)}</div>
      {needsDetails && <label className="report-dialog__details">Describe the issue<textarea value={details} onChange={(event) => setDetails(event.target.value)} maxLength="1000" rows="4" placeholder={`Tell us what happened with this ${subjectLabel}`} required autoFocus /><small>{details.length}/1000</small></label>}
      <div className="report-dialog__actions"><button type="button" className="app-button app-button--ghost" onClick={onClose}>Cancel</button><button type="submit" className="app-button app-button--primary" disabled={submitDisabled}>{submitting ? 'Submitting…' : 'Submit report'}</button></div>
    </form>
  </div>
}

export function Pagination({ page = 1, pages = 1, onPage }) {
  if (pages <= 1) return null
  return <nav className="app-pagination" aria-label="Pagination"><button type="button" disabled={page <= 1} onClick={() => onPage(page - 1)}>Previous</button><span>Page <strong>{page}</strong> of {pages}</span><button type="button" disabled={page >= pages} onClick={() => onPage(page + 1)}>Next</button></nav>
}

export function Avatar({ name, src, size = 'medium' }) {
  return <span className={`app-avatar app-avatar--${size}`}>{src ? <img src={src} alt="" /> : String(name || 'ZD').split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()}</span>
}

export function SecurityNotice() {
  return <aside className="security-notice">For your security, verify purchases, do not make payment to unverified merchants</aside>
}
