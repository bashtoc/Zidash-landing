export const NIGERIAN_LOCATIONS = [
  'All', 'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Abuja FCT',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
  'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers',
  'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
]

export const CONDITIONS = [
  { value: 'new', label: 'New' },
  { value: 'like_new', label: 'Like new' },
  { value: 'used', label: 'Used' },
  { value: 'refurbished', label: 'Refurbished' },
]

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'trending', label: 'Trending' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
  { value: 'oldest', label: 'Oldest first' },
]

export const REPORT_REASONS = [
  'Scam or fraud', 'Offensive content', 'Prohibited item', 'Misleading information', 'Other',
]

export function money(value, currency = 'NGN') {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)
}

export function shortDate(value) {
  const date = new Date(value)
  if (!value || Number.isNaN(date.getTime())) return 'Recently'
  return new Intl.DateTimeFormat('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }).format(date)
}

export function relativeTime(value) {
  const date = new Date(value)
  if (!value || Number.isNaN(date.getTime())) return ''
  const seconds = Math.round((date.getTime() - Date.now()) / 1000)
  const ranges = [
    ['year', 31536000], ['month', 2592000], ['week', 604800], ['day', 86400],
    ['hour', 3600], ['minute', 60], ['second', 1],
  ]
  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  const [unit, size] = ranges.find(([, amount]) => Math.abs(seconds) >= amount) || ranges.at(-1)
  return formatter.format(Math.round(seconds / size), unit)
}

export function initials(value = '') {
  return value.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'ZD'
}

export function listingImage(listing) {
  const images = listing?.images || listing?.listingImages || []
  return images?.[0]?.url || listing?.imageUrl || listing?.metadata?.imageUrl || ''
}

export function sellerName(listing) {
  return listing?.seller?.displayName || listing?.sellerProfile?.displayName || listing?.sellerName || 'Zidash seller'
}

export function parseCommunityPost(post) {
  if (post?.content && typeof post.content === 'object') return { ...post, ...post.content }
  const raw = post?.body
  if (raw && typeof raw === 'object') return { ...post, ...raw }
  try {
    const parsed = JSON.parse(raw || '{}')
    return { ...post, ...parsed }
  } catch {
    return { ...post, description: raw || '' }
  }
}
