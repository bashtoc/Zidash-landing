import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Armchair, ArrowLeft, Baby, BadgeCheck, BookOpen, Boxes, BriefcaseBusiness, CarFront, ChevronRight, CircleAlert, Dumbbell, Gamepad2, Gift, HardHat, House, ImageOff, MapPin, MessageCircle, Monitor, PawPrint, Phone, ShieldCheck, Shirt, ShoppingBasket, Smartphone, Sparkles, Star, Store, Sun, Tractor, UsersRound, Wrench, X } from 'lucide-react'
import { Link, useNavigate, useOutletContext, useParams, useSearchParams } from 'react-router-dom'
import { api, unwrapItems } from '../api'
import { useAuth } from '../auth-context'
import { EmptyState, ErrorState, ListingGrid, LoadingState, MarketplaceSearch, PageIntro, Pagination, ReportDialog, SectionHeading } from '../components'
import { CONDITIONS, listingImage, money, relativeTime, sellerName, shortDate } from '../data'
import { useRemote } from '../hooks'
import { usePopup } from '../popup-context'

function categoryIcon(category) {
  const icons = {
    phone: Smartphone,
    computer: Monitor,
    vehicle: CarFront,
    property: House,
    home: Armchair,
    fashion: Shirt,
    beauty: Sparkles,
    baby: Baby,
    food: ShoppingBasket,
    sports: Dumbbell,
    business: BriefcaseBusiness,
    tools: Wrench,
    agriculture: Tractor,
    pets: PawPrint,
    education: BookOpen,
    entertainment: Gamepad2,
    construction: HardHat,
    solar: Sun,
    gifts: Gift,
    service: UsersRound,
  }
  return icons[String(category?.iconKey || '').toLowerCase()] || Boxes
}

function categoryLabel(name) {
  return String(name || '').replace(/\s*&\s*/g, ' and ')
}

const categoryArtwork = {
  food: [0, 0],
  baby: [1, 0],
  gifts: [1, 0],
  entertainment: [1, 0],
  vehicle: [2, 0],
  property: [3, 0],
  phone: [0, 1],
  computer: [1, 1],
  home: [2, 1],
  beauty: [3, 1],
  fashion: [0, 2],
  sports: [1, 2],
  education: [2, 2],
  service: [3, 2],
  wholesale: [3, 2],
  job: [0, 3],
  jobs: [0, 3],
  other: [0, 3],
  pets: [1, 3],
  business: [0, 3],
  tools: [2, 3],
  construction: [3, 3],
}

const categoryArtworkFiles = {
  agriculture: '/category-icons/agriculture.webp',
  business: '/category-icons/office-business-equipment.png',
  education: '/category-icons/books-education.png',
  entertainment: '/category-icons/entertainment-hobbies.png',
  gifts: '/category-icons/gifts-events.png',
  other: '/category-icons/other-items.png',
  solar: '/category-icons/solar-power.webp',
  wholesale: '/category-icons/wholesale-bulk.png',
}

function categoryArtworkPosition(category) {
  const key = String(category?.iconKey || '').toLowerCase()
  if (categoryArtwork[key]) return categoryArtwork[key]

  const name = String(category?.name || '').toLowerCase()
  const match = Object.keys(categoryArtwork).find((candidate) => name.includes(candidate))
  return match ? categoryArtwork[match] : null
}

function CategoryMark({ category, size = 24 }) {
  if (category?.iconUrl) return <img src={category.iconUrl} alt="" />
  const artworkFile = categoryArtworkFiles[String(category?.iconKey || '').toLowerCase()]
  if (artworkFile) return <img className="category-artwork-image" src={artworkFile} alt="" />
  const artworkPosition = categoryArtworkPosition(category)
  if (artworkPosition) {
    const [column, row] = artworkPosition
    return <span className="category-artwork" aria-hidden="true" style={{ backgroundPosition: `${column * 100 / 3}% ${row * 100 / 3}%` }} />
  }
  const Icon = categoryIcon(category)
  return <Icon size={size} />
}

export function MarketplaceHome() {
  const navigate = useNavigate()
  const auth = useAuth()
  const { appLocation } = useOutletContext()
  const taxonomy = useRemote(() => api.taxonomy('marketplace'), [])
  const featured = useRemote(() => api.listings({ section: 'marketplace', location: appLocation, sort: 'newest', page: 1, limit: 8 }), [appLocation])
  const recent = useRemote(() => api.listings({ section: 'marketplace', location: appLocation, sort: 'newest', page: 1, limit: 8 }), [appLocation])
  const [trending, setTrending] = useState([])
  const [trendingPage, setTrendingPage] = useState(0)
  const [trendingPages, setTrendingPages] = useState(1)
  const [trendingLoading, setTrendingLoading] = useState(false)
  const [trendingError, setTrendingError] = useState('')
  const trendingLoadingRef = useRef(false)
  const trendingSentinelRef = useRef(null)

  const loadTrending = useCallback(async (nextPage = 1, { replace = false } = {}) => {
    if (trendingLoadingRef.current) return
    trendingLoadingRef.current = true
    setTrendingLoading(true)
    setTrendingError('')
    try {
      const response = await api.listings({ section: 'marketplace', location: appLocation, sort: 'trending', page: nextPage, limit: 12 })
      const incoming = unwrapItems(response)
      setTrending((current) => replace ? incoming : [...current, ...incoming.filter((item) => !current.some((existing) => existing.id === item.id))])
      setTrendingPage(response.meta?.page || nextPage)
      setTrendingPages(response.meta?.pages || nextPage)
    } catch (error) {
      setTrendingError(error.message)
    } finally {
      trendingLoadingRef.current = false
      setTrendingLoading(false)
    }
  }, [appLocation])

  useEffect(() => {
    setTrending([])
    setTrendingPage(0)
    setTrendingPages(1)
    loadTrending(1, { replace: true })
  }, [appLocation, loadTrending])

  useEffect(() => {
    const sentinel = trendingSentinelRef.current
    if (!sentinel || trendingLoading || trendingPage >= trendingPages) return undefined
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) loadTrending(trendingPage + 1)
    }, { rootMargin: '400px 0px' })
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [loadTrending, trendingLoading, trendingPage, trendingPages])

  const categories = unwrapItems(taxonomy)
  return <div className="app-page marketplace-home">
    <section className="marketplace-welcome">
      <div><span className="app-eyebrow"><MapPin size={13} /> Shopping around {appLocation}</span><h1>Buy, Sell, Hire, and Grow Your Business</h1><p>Shop verified local listings, discover services, and grow within the Zidash community.</p></div>
      <div className="marketplace-welcome__art" aria-label="Zidash mobile app preview"><img src="/heroimage.png" alt="Zidash mobile app shown on two phones" /></div>
    </section>
    <MarketplaceSearch onSubmit={(query) => navigate(`/app/search${query ? `?q=${encodeURIComponent(query)}` : ''}`)} />

    <section className="app-section">
      <SectionHeading title="Explore categories" subtitle="Browse the live Zidash marketplace taxonomy" />
      {taxonomy.loading ? <div className="category-skeletons dashboard-category-skeletons">{Array.from({ length: 8 }, (_, index) => <span key={index} />)}</div> : taxonomy.error ? <ErrorState message="Categories could not be loaded." retry={taxonomy.reload} /> : categories.length ? <div className="app-category-row dashboard-category-row">{categories.slice(0, 7).map((category) => <Link className="app-category-tile" key={category.id} to={`/app/category/${category.id}`}><span><CategoryMark category={category} /></span><strong>{categoryLabel(category.name)}</strong><small>{category.children?.length || 0} subcategories</small></Link>)}<Link className="app-category-see-all" to="/app/categories"><strong>See all categories</strong><small>Browse everything</small></Link></div> : <EmptyState icon={Boxes} title="Categories could not be loaded" message="No active marketplace categories were returned." action={<button type="button" className="app-button app-button--outline" onClick={taxonomy.reload}>Retry</button>} />}
    </section>

    <section className="app-shortcuts" aria-label="More on Zidash">
      <Link to="/app/jobs"><div><strong>Jobs & talent</strong><span>Find work or hire locally</span></div><ChevronRight /></Link>
      <Link to="/app/creators"><div><strong>UGC creators</strong><span>Find creators for your brand</span></div><ChevronRight /></Link>
      <Link to="/app/community"><div><strong>Communities</strong><span>Discover posts across Nigeria</span></div><ChevronRight /></Link>
    </section>

    <section className="app-section"><SectionHeading title="Featured Listings" to="/app/search?sort=newest" />{featured.loading ? <LoadingState label="Loading featured listings" /> : featured.error ? <ErrorState message={featured.error} retry={featured.reload} /> : <ListingGrid listings={unwrapItems(featured)} emptyTitle="No featured listings yet" />}</section>
    <aside className="seller-callout"><div><strong>Turn unused items into opportunity.</strong><p>Create a listing, reach local buyers, and boost it when you want more visibility.</p></div><Link className="app-button app-button--primary" to="/app/sell">Start selling</Link></aside>
    <section className="app-section"><SectionHeading title="Recently Posted" to="/app/search?sort=newest" />{recent.loading ? <LoadingState label="Loading recent listings" /> : recent.error ? <ErrorState message={recent.error} retry={recent.reload} /> : <ListingGrid listings={unwrapItems(recent)} emptyTitle="No recent listings" />}</section>
    <aside className="promote-post-callout">
      <div className="promote-post-callout__copy"><span>Get more visibility</span><strong>Promote your post</strong><p>Select one of your listings and place it in front of more buyers.</p></div>
      <Link className="app-button app-button--light" to={auth.isAuthenticated ? '/app/my-listings' : `/auth?returnTo=${encodeURIComponent('/app/my-listings')}`}>Choose a post <ChevronRight size={16} /></Link>
    </aside>
    <section className="app-section"><SectionHeading title="Trending" subtitle="Popular items, loaded in batches as you scroll" />{trending.length ? <ListingGrid listings={trending} /> : !trendingLoading && !trendingError ? <EmptyState title="Nothing is trending yet" message="Trending items will appear as people view and save listings." /> : null}{trendingError && <ErrorState message={trendingError} retry={() => loadTrending(trendingPage || 1, { replace: trending.length === 0 })} />}{trendingLoading && <LoadingState label="Loading trending listings" />}{trendingPage < trendingPages && <div ref={trendingSentinelRef} className="load-more"><button type="button" className="app-button app-button--outline" disabled={trendingLoading} onClick={() => loadTrending(trendingPage + 1)}>Load more trending items</button></div>}</section>
  </div>
}

export function CategoriesPage() {
  const state = useRemote(() => api.taxonomy('marketplace'), [])
  const categories = unwrapItems(state)
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase()
    if (!value) return categories
    return categories.map((category) => {
      if (category.name.toLowerCase().includes(value)) return category
      const children = (category.children || []).filter((child) => child.name.toLowerCase().includes(value))
      return children.length ? { ...category, children } : null
    }).filter(Boolean)
  }, [categories, query])
  return <div className="app-page categories-page"><PageIntro eyebrow="Marketplace" title="All categories" description="Choose a category or jump directly into a subcategory." /><label className="category-search"><span>Search categories</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search categories and subcategories" /></label>{state.loading ? <LoadingState label="Loading categories" /> : state.error ? <ErrorState message={state.error} retry={state.reload} /> : filtered.length ? <div className="category-directory">{filtered.map((category) => <section key={category.id} className="category-directory__group"><Link className="category-directory__parent" to={`/app/category/${category.id}`}><span><CategoryMark category={category} size={25} /></span><div><h2>{categoryLabel(category.name)}</h2><p>{category.children?.length ? `${category.children.length} subcategories` : 'Browse listings'}</p></div><ChevronRight /></Link>{category.children?.length > 0 && <div className="category-directory__children">{category.children.map((child) => <Link key={child.id} to={`/app/category/${child.id}`}><span>{categoryLabel(child.name)}</span><ChevronRight size={15} /></Link>)}</div>}</section>)}</div> : <EmptyState title={categories.length ? 'No categories match your search' : 'Categories could not be loaded'} message={categories.length ? 'Try another category name.' : 'There are no active marketplace categories right now.'} />}</div>
}

export function ListingsResultsPage({ categoryOnly = false }) {
  const { categoryId } = useParams()
  const { appLocation } = useOutletContext()
  const [searchParams, setSearchParams] = useSearchParams()
  const taxonomy = useRemote(() => api.taxonomy('marketplace'), [])
  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const filters = useMemo(() => ({
    q: searchParams.get('q') || '',
    categoryId: searchParams.get('categoryId') || categoryId || '',
    condition: searchParams.get('condition') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    location: searchParams.has('location') ? searchParams.get('location') : appLocation,
    sort: searchParams.get('sort') || 'newest',
  }), [searchParams, categoryId, appLocation])
  const state = useRemote(() => api.listings({ section: 'marketplace', ...filters, page, limit: 24 }), [filters.q, filters.categoryId, filters.condition, filters.minPrice, filters.maxPrice, filters.location, filters.sort, page])
  const categories = unwrapItems(taxonomy)
  const selectedCategory = categories.flatMap((item) => [item, ...(item.children || [])]).find((item) => item.id === filters.categoryId)

  function updateFilters(next) {
    const params = new URLSearchParams(searchParams)
    Object.entries(next).forEach(([key, value]) => value ? params.set(key, value) : params.delete(key))
    params.delete('page')
    setSearchParams(params)
  }

  return <div className={`app-page${categoryOnly ? ' category-results-page' : ''}`}><PageIntro eyebrow="Marketplace" title={categoryOnly ? categoryLabel(selectedCategory?.name) || 'Category listings' : filters.q ? `Results for “${filters.q}”` : 'Search marketplace'} description="Search, filter, and sort listings from the live Zidash marketplace." /><MarketplaceSearch initialQuery={filters.q} onSubmit={(query) => updateFilters({ q: query })} filters={filters} onFiltersChange={updateFilters} categories={categories} />{state.loading ? <LoadingState label="Searching listings" /> : state.error ? <ErrorState message={state.error} retry={state.reload} /> : <><ListingGrid listings={unwrapItems(state)} /><Pagination page={state.meta?.page || page} pages={state.meta?.pages || 1} onPage={(next) => { const params = new URLSearchParams(searchParams); params.set('page', next); setSearchParams(params); window.scrollTo({ top: 0, behavior: 'smooth' }) }} /></>}</div>
}

function SellerRatingControl({ sellerId, returnTo, onMetricsChange }) {
  const auth = useAuth()
  const navigate = useNavigate()
  const { showPopup } = usePopup()
  const [score, setScore] = useState(0)
  const [hoveredScore, setHoveredScore] = useState(0)
  const [busy, setBusy] = useState(false)
  const ownSellerId = auth.bootstrap?.sellerProfile?.id
  const [isOwnStore, setIsOwnStore] = useState(ownSellerId === sellerId)

  useEffect(() => {
    let cancelled = false
    setScore(0)
    setIsOwnStore(ownSellerId === sellerId)
    if (!sellerId || !auth.isAuthenticated) return () => { cancelled = true }
    api.sellerRatingStatus(sellerId).then((response) => {
      if (cancelled) return
      const data = response.data || {}
      setScore(Number(data.score || 0))
      setIsOwnStore(Boolean(data.isOwnStore))
      onMetricsChange?.({
        ratingAverage: Number(data.ratingAverage || 0),
        ratingCount: Number(data.ratingCount || 0),
        trustScore: Number(data.trustScore || 0),
      })
    }).catch(() => {})
    return () => { cancelled = true }
  }, [auth.isAuthenticated, onMetricsChange, ownSellerId, sellerId])

  async function submitRating(nextScore) {
    if (!auth.isAuthenticated) {
      navigate(`/auth?returnTo=${encodeURIComponent(returnTo)}`)
      return
    }
    if (busy || isOwnStore) return
    setBusy(true)
    try {
      const response = await api.rateSeller(sellerId, nextScore)
      const data = response.data || {}
      setScore(Number(data.score || nextScore))
      onMetricsChange?.({
        ratingAverage: Number(data.ratingAverage || 0),
        ratingCount: Number(data.ratingCount || 0),
        trustScore: Number(data.trustScore || 0),
      })
      showPopup({ tone: 'success', message: score ? 'Your seller rating was updated.' : 'Your seller rating was submitted.' })
    } catch (error) {
      showPopup({ tone: 'error', title: 'Rating not saved', message: error.message })
    } finally {
      setBusy(false)
    }
  }

  if (!sellerId || isOwnStore) return null
  const visibleScore = hoveredScore || score
  return <div className="seller-rating">
    <span>{score ? 'Your rating' : 'Rate this seller'}</span>
    <div className="seller-rating__stars" role="group" aria-label="Rate this seller from 1 to 5 stars" onMouseLeave={() => setHoveredScore(0)}>
      {[1, 2, 3, 4, 5].map((value) => <button key={value} type="button" className={value <= visibleScore ? 'is-active' : ''} disabled={busy} aria-label={`${value} star${value === 1 ? '' : 's'}`} aria-pressed={score === value} onMouseEnter={() => setHoveredScore(value)} onFocus={() => setHoveredScore(value)} onBlur={() => setHoveredScore(0)} onClick={() => submitRating(value)}><Star size={19} fill="currentColor" /></button>)}
    </div>
  </div>
}

export function ListingDetailPage() {
  const { listingId } = useParams()
  const auth = useAuth()
  const navigate = useNavigate()
  const { showPopup } = usePopup()
  const state = useRemote(() => api.listing(listingId), [listingId])
  const listing = state.data
  const sellerId = listing?.sellerId || listing?.seller?.id || listing?.sellerProfile?.id
  const similar = useRemote(() => listing?.categoryId ? api.listings({ categoryId: listing.categoryId, page: 1, limit: 5 }) : Promise.resolve({ data: [] }), [listing?.categoryId])
  const [reportTarget, setReportTarget] = useState(null)
  const [reporting, setReporting] = useState(false)
  const [selectedImageUrl, setSelectedImageUrl] = useState('')
  const [sellerMetrics, setSellerMetrics] = useState(null)
  const updateSellerMetrics = useCallback((metrics) => setSellerMetrics(metrics), [])

  useEffect(() => {
    setSelectedImageUrl('')
    setSellerMetrics(null)
  }, [listingId])

  async function messageSeller() {
    if (!auth.isAuthenticated) return navigate(`/auth?returnTo=${encodeURIComponent(`/app/listing/${listingId}`)}`)
    navigate('/app/messages/new', {
      state: {
        sellerId,
        listingId,
        sellerName: sellerName(listing),
        listingTitle: listing.title,
      },
    })
  }

  function openReport(target) {
    if (!auth.isAuthenticated) return navigate(`/auth?returnTo=${encodeURIComponent(`/app/listing/${listingId}`)}`)
    setReportTarget(target)
  }

  async function submitReport(reason, otherDetails = '') {
    const subjectType = reportTarget === 'seller' ? 'seller' : 'listing'
    const subjectId = reportTarget === 'seller' ? sellerId : listingId
    if (!subjectId) return
    setReporting(true)
    try {
      await api.report({ reporterId: auth.user.id, subjectType, subjectId, reason, details: reason === 'Other' && subjectType === 'seller' ? otherDetails : 'Reported from the Zidash web listing page' })
      setReportTarget(null)
      showPopup({ tone: 'success', message: `${subjectType === 'seller' ? 'Seller' : 'Product'} reported. Thank you.` })
    } catch (error) { showPopup({ tone: 'error', message: error.message }) } finally { setReporting(false) }
  }

  if (state.loading) return <div className="app-page"><LoadingState label="Loading product" /></div>
  if (state.error || !listing) return <div className="app-page"><ErrorState message={state.error || 'Listing not found'} retry={state.reload} /></div>
  const images = (listing.images || listing.listingImages || []).map((item, index) => typeof item === 'string' ? { id: `${listing.id}-${index}`, url: item } : item).filter((item) => item?.url)
  const image = selectedImageUrl || listingImage(listing)
  const phone = listing.seller?.user?.phone || listing.sellerProfile?.user?.phone || listing.sellerPhone
  const filteredSimilar = unwrapItems(similar).filter((item) => item.id !== listing.id).slice(0, 4)
  const trustScore = Number(sellerMetrics?.trustScore ?? listing.seller?.trustScore ?? 0)
  const ratingAverage = Number(sellerMetrics?.ratingAverage ?? listing.seller?.ratingAverage ?? 0)
  const ratingCount = Number(sellerMetrics?.ratingCount ?? listing.seller?.ratingCount ?? 0)
  const ratingLabel = ratingAverage > 0 ? ratingAverage.toFixed(2) : 'New'

  return <div className="app-page listing-detail-page">
    <button className="back-link" type="button" onClick={() => navigate(-1)}><ArrowLeft size={17} /> Back</button>
    <div className="listing-detail">
      <section className="listing-gallery"><div className="listing-gallery__main">{image ? <img src={image} alt={listing.title} /> : <span><ImageOff size={42} /></span>}</div>{images.length > 1 && <div className="listing-gallery__thumbs" aria-label="Listing images">{images.map((item, index) => <button key={item.id || item.url} type="button" className={image === item.url ? 'is-active' : ''} onClick={() => setSelectedImageUrl(item.url)} aria-label={`View image ${index + 1} of ${images.length}`} aria-pressed={image === item.url}><img src={item.url} alt="" /></button>)}</div>}</section>
      <section className="listing-summary"><div className="listing-summary__badges"><span>{CONDITIONS.find((item) => item.value === listing.condition)?.label || listing.condition}</span>{listing.promotedUntil && <span>Promoted</span>}</div><h1>{listing.title}</h1><strong className="listing-detail__price">{money(listing.price, listing.currency)}</strong><p className="listing-detail__location"><MapPin size={16} /> {listing.location || 'Nigeria'} · {relativeTime(listing.createdAt)}</p><div className="listing-detail__actions"><button type="button" className="app-button app-button--primary" onClick={messageSeller}><MessageCircle size={18} /> Chat with seller</button>{phone ? <><a className="app-button app-button--outline" href={`tel:${phone}`}><Phone size={18} /> Call</a><a className="app-button app-button--outline" href={`https://wa.me/${String(phone).replace(/\D/g, '')}`} target="_blank" rel="noreferrer">WhatsApp</a></> : <button type="button" className="app-button app-button--outline" onClick={() => showPopup({ title: 'Seller phone unavailable', message: 'This seller has not added a phone number. You can still contact them safely through Zidash chat.' })}><Phone size={18} /> Contact options</button>}</div><div className="listing-description"><h2>Description</h2><p>{listing.description}</p></div><div className="report-links"><button type="button" className="text-danger" onClick={() => openReport('listing')}><CircleAlert size={15} /> Report this product</button>{sellerId && <button type="button" className="text-danger" onClick={() => openReport('seller')}><CircleAlert size={15} /> Report seller</button>}</div></section>
    </div>
    <section className="seller-panel"><div className="seller-panel__avatar">{sellerName(listing).slice(0, 2).toUpperCase()}</div><div><span className="app-eyebrow">Seller</span><h2>{sellerName(listing)}</h2><p>{listing.seller?.location || listing.location || 'Nigeria'}</p><div className="seller-signals"><span><ShieldCheck size={15} /> Trust {trustScore}%</span><span><Star size={15} /> {ratingLabel}{ratingCount > 0 ? ` (${ratingCount})` : ''}</span></div><SellerRatingControl sellerId={sellerId} returnTo={`/app/listing/${listingId}`} onMetricsChange={updateSellerMetrics} /></div>{sellerId ? <Link className="app-button app-button--outline" to={`/app/seller/${sellerId}`}>View store</Link> : <button className="app-button app-button--outline" type="button" onClick={() => showPopup({ tone: 'warning', title: 'Seller profile not available', message: 'This seller has not created a public store profile yet.' })}>View store</button>}</section>
    {filteredSimilar.length > 0 && <section className="app-section similar-products"><SectionHeading title="Similar products" /><ListingGrid listings={filteredSimilar} /></section>}
    {reportTarget && <ReportDialog title={reportTarget === 'seller' ? 'Report seller' : 'Report product'} subjectLabel={reportTarget === 'seller' ? 'seller' : 'product'} submitting={reporting} requireOtherDetails={reportTarget === 'seller'} onClose={() => setReportTarget(null)} onSubmit={submitReport} />}
  </div>
}

export function SellerPage() {
  const { sellerId } = useParams()
  const auth = useAuth()
  const navigate = useNavigate()
  const { showPopup } = usePopup()
  const seller = useRemote(() => api.seller(sellerId), [sellerId])
  const listings = useRemote(() => api.sellerListings(sellerId), [sellerId])
  const [following, setFollowing] = useState(false)
  const [followersCount, setFollowersCount] = useState(0)
  const [followBusy, setFollowBusy] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [reporting, setReporting] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)
  useEffect(() => {
    if (seller.data) setFollowersCount(Number(seller.data.followersCount || 0))
  }, [seller.data])
  useEffect(() => {
    let cancelled = false
    if (!auth.isAuthenticated) {
      setFollowing(false)
      return () => { cancelled = true }
    }
    api.followStatus(sellerId).then((response) => {
      if (cancelled) return
      setFollowing(Boolean(response.data?.isFollowing))
      if (response.data?.followersCount !== undefined) setFollowersCount(Number(response.data.followersCount))
    }).catch(() => {})
    return () => { cancelled = true }
  }, [auth.isAuthenticated, sellerId])
  useEffect(() => {
    if (!previewImage) return undefined
    const previousOverflow = document.body.style.overflow
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setPreviewImage(null)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [previewImage])
  async function toggleFollow() {
    if (!auth.isAuthenticated) return navigate(`/auth?returnTo=${encodeURIComponent(`/app/seller/${sellerId}`)}`)
    if (followBusy) return
    const previousFollowing = following
    const previousCount = followersCount
    const nextFollowing = !previousFollowing
    setFollowBusy(true)
    setFollowing(nextFollowing)
    setFollowersCount((current) => Math.max(0, current + (nextFollowing ? 1 : -1)))
    try {
      const response = await api.toggleFollow(sellerId)
      setFollowing(Boolean(response.data?.isFollowing))
      if (response.data?.followersCount !== undefined) setFollowersCount(Number(response.data.followersCount))
    } catch (error) {
      setFollowing(previousFollowing)
      setFollowersCount(previousCount)
      showPopup({ tone: 'error', message: error.message })
    } finally {
      setFollowBusy(false)
    }
  }
  function openSellerReport() { if (!auth.isAuthenticated) return navigate(`/auth?returnTo=${encodeURIComponent(`/app/seller/${sellerId}`)}`); setReportOpen(true) }
  async function reportSeller(reason, otherDetails = '') { setReporting(true); try { await api.report({ reporterId: auth.user.id, subjectType: 'seller', subjectId: sellerId, reason, details: reason === 'Other' ? otherDetails : 'Reported from the Zidash web seller profile' }); setReportOpen(false); showPopup({ tone: 'success', message: 'Seller reported. Thank you.' }) } catch (error) { showPopup({ tone: 'error', message: error.message }) } finally { setReporting(false) } }
  if (seller.loading) return <div className="app-page"><LoadingState label="Loading seller store" /></div>
  if (seller.error || !seller.data) return <div className="app-page centered-page-state"><EmptyState icon={Store} title="Seller profile not available" message={seller.error || 'This seller has not created a public storefront.'} /></div>
  const profile = seller.data
  const isOwnStore = auth.bootstrap?.sellerProfile?.id === sellerId
  const sellerAvatarUrl = profile.user?.avatarUrl || profile.avatarUrl
  const sellerDisplayName = profile.displayName || 'Seller'
  return <div className="app-page"><section className="store-hero">{profile.coverImageUrl ? <button className="store-hero__cover store-hero__cover--preview" type="button" style={{ backgroundImage: `url(${profile.coverImageUrl})` }} onClick={() => setPreviewImage({ src: profile.coverImageUrl, alt: `${sellerDisplayName} store header`, kind: 'cover' })} aria-label={`Preview ${sellerDisplayName} store header image`} /> : <div className="store-hero__cover" aria-label={`${sellerDisplayName} header image`} />}<div className="store-hero__content">{sellerAvatarUrl ? <button className="store-avatar store-avatar--preview" type="button" onClick={() => setPreviewImage({ src: sellerAvatarUrl, alt: `${sellerDisplayName} profile`, kind: 'avatar' })} aria-label={`Preview ${sellerDisplayName} profile image`}><img src={sellerAvatarUrl} alt="" /></button> : <div className="store-avatar">{sellerDisplayName.slice(0, 2).toUpperCase()}</div>}<div className="store-hero__copy"><h1>{profile.displayName}</h1><p>{profile.bio || 'Local seller on Zidash'}</p><div className="store-meta"><span><MapPin size={15} /> {profile.location || 'Nigeria'}</span><span><BadgeCheck size={15} /> Trust score {profile.trustScore || 0}%</span><span><Star size={15} /> {profile.ratingAverage || 0} ({profile.ratingCount || 0})</span><span><UsersRound size={15} /> {followersCount.toLocaleString()} followers</span></div></div><div className="store-hero__actions">{!isOwnStore && <button type="button" className={`app-button ${following ? 'app-button--outline' : 'app-button--primary'}`} onClick={toggleFollow} disabled={followBusy} aria-busy={followBusy}>{following ? 'Following' : 'Follow seller'}</button>}{!isOwnStore && <button type="button" className="store-report-button" onClick={openSellerReport}><CircleAlert size={16} /> Report seller</button>}</div></div></section><section className="app-section"><SectionHeading title="Listings from this seller" subtitle={`Member since ${shortDate(profile.memberSince)}`} />{listings.loading ? <LoadingState /> : listings.error ? <ErrorState message={listings.error} retry={listings.reload} /> : <ListingGrid listings={unwrapItems(listings)} emptyTitle="This seller has no active listings" />}</section>{reportOpen && <ReportDialog title="Report seller" subjectLabel="seller" submitting={reporting} requireOtherDetails onClose={() => setReportOpen(false)} onSubmit={reportSeller} />}{previewImage && <div className="profile-photo-preview" onPointerDown={(event) => event.target === event.currentTarget && setPreviewImage(null)}><section className={`profile-photo-preview__dialog ${previewImage.kind === 'cover' ? 'profile-photo-preview__dialog--cover' : ''}`} role="dialog" aria-modal="true" aria-label={`${sellerDisplayName} ${previewImage.kind === 'cover' ? 'store header' : 'profile image'} preview`}><button className="profile-photo-preview__close" type="button" onClick={() => setPreviewImage(null)} aria-label="Close image preview" autoFocus><X size={22} /></button><img className={`profile-photo-preview__image ${previewImage.kind === 'cover' ? 'profile-photo-preview__image--cover' : ''}`} src={previewImage.src} alt={previewImage.alt} /></section></div>}</div>
}

export function SavedProductsPage() {
  const state = useRemote(() => api.preferred(), [])
  const [items, setItems] = useState([])
  useEffect(() => { if (!state.loading && !state.error) setItems(unwrapItems({ data: state.data }).map((item) => ({ ...item, _saved: true }))) }, [state.data, state.loading, state.error])
  return <div className="app-page"><PageIntro eyebrow="Your marketplace" title="Preferred products" description="Items you saved for another look." />{state.loading ? <LoadingState label="Loading preferred products" /> : state.error ? <ErrorState message={state.error} retry={state.reload} /> : <ListingGrid listings={items} emptyTitle="No preferred products yet" onSavedChange={(listing, saved) => { if (!saved) setItems((current) => current.filter((item) => item.id !== listing.id)) }} />}</div>
}
