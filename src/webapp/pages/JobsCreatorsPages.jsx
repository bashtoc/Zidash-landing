import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, BriefcaseBusiness, Building2, CalendarDays, ChevronRight, FileText, ImagePlus, MapPin, Megaphone, Search, UsersRound, WalletCards } from 'lucide-react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { api, unwrapItems } from '../api'
import { useAuth } from '../auth-context'
import { Avatar, EmptyState, ErrorState, LoadingState, PageIntro, Pagination } from '../components'
import { money, relativeTime } from '../data'
import { useRemote } from '../hooks'
import { usePopup } from '../popup-context'

function creatorNiches(creator) {
  if (Array.isArray(creator?.niches)) return creator.niches
  if (typeof creator?.niches === 'string') {
    try {
      const parsed = JSON.parse(creator.niches)
      if (Array.isArray(parsed)) return parsed
    } catch {
      return creator.niches.split(',').map((item) => item.trim()).filter(Boolean)
    }
  }
  return []
}

function creatorName(creator) {
  const accountName = `${creator.user?.firstName || ''} ${creator.user?.lastName || ''}`.trim()
  if (accountName) return accountName
  const niche = creatorNiches(creator)[0] || 'UGC'
  const suffix = creator.id ? ` ${String(creator.id).slice(0, 4)}` : ''
  return `${niche} Creator${suffix}`
}

function creatorImage(creator) {
  return creator?.brandingImageUrl || creator?.user?.avatarUrl || ''
}

export function JobsHubPage() {
  const jobs = useRemote(() => api.jobs({ page: 1, limit: 5 }), [])
  const actions = [
    ['/app/jobs/find', 'Find a job', 'Browse available vacancies and apply.'],
    ['/app/jobs/post', 'Post a job', 'Hire professionals for your business.'],
    ['/app/creators', 'Find UGC creators', 'Connect with creators to promote your brand.'],
    ['/app/creators/become', 'Become a UGC creator', 'Monetize your creativity and influence.'],
  ]
  return <div className="app-page jobs-hub-page"><PageIntro eyebrow="Jobs & talent" title="What would you like to do today?" description="Find opportunities, hire great people, or work with creators." /><div className="job-action-grid">{actions.map(([to, title, text]) => <Link key={to} to={to}><div><h2>{title}</h2><p>{text}</p></div><ChevronRight /></Link>)}</div><section className="app-section"><div className="app-section-heading"><div><h2>Jobs posted already</h2><p>Fresh opportunities from the Zidash community</p></div><Link to="/app/jobs/find">View all <ChevronRight size={16} /></Link></div>{jobs.loading ? <LoadingState label="Loading jobs" /> : jobs.error ? <ErrorState message={jobs.error} retry={jobs.reload} /> : <JobList jobs={unwrapItems(jobs)} />}</section></div>
}

function JobList({ jobs }) {
  if (!jobs.length) return <EmptyState icon={BriefcaseBusiness} title="No jobs posted yet" message="New opportunities will appear here when employers publish them." />
  return <div className="job-list">{jobs.map((job) => <Link key={job.id} to={`/app/jobs/${job.id}`} className="job-card"><span className="job-card__logo"><Building2 size={23} /><strong>{job.title || 'Untitled job'}</strong></span><div className="job-card__body"><div><p>{job.company || 'Company'}</p></div><div className="job-card__meta"><span><MapPin size={14} /> {job.location || 'Remote'}</span><span><BriefcaseBusiness size={14} /> {String(job.employmentType || 'full_time').replaceAll('_', ' ')}</span><span><WalletCards size={14} /> {job.salaryMin || job.salaryMax ? `${money(job.salaryMin || 0)} – ${money(job.salaryMax || job.salaryMin)}` : 'Salary open'}</span></div></div><div className="job-card__side"><span>{relativeTime(job.createdAt)}</span><ChevronRight size={18} /></div></Link>)}</div>
}

export function JobsListPage() {
  const [params, setParams] = useSearchParams()
  const page = Math.max(1, Number(params.get('page')) || 1)
  const q = params.get('q') || ''
  const [input, setInput] = useState(q)
  const jobs = useRemote(() => api.jobs({ page, limit: 20, q }), [page, q])
  return <div className="app-page"><PageIntro eyebrow="Jobs & talent" title="Find your next opportunity" description="Search open roles from businesses across the Zidash community." actions={<Link className="app-button app-button--primary" to="/app/jobs/post">Post a job</Link>} /><form className="jobs-search" onSubmit={(event) => { event.preventDefault(); const next = new URLSearchParams(params); if (input.trim()) next.set('q', input.trim()); else next.delete('q'); next.delete('page'); setParams(next) }}><Search size={19} /><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Search job title or company" /><button type="submit">Search jobs</button></form>{jobs.loading ? <LoadingState label="Loading jobs" /> : jobs.error ? <ErrorState message={jobs.error} retry={jobs.reload} /> : <><JobList jobs={unwrapItems(jobs)} /><Pagination page={jobs.meta?.page || page} pages={jobs.meta?.pages || 1} onPage={(nextPage) => { const next = new URLSearchParams(params); next.set('page', nextPage); setParams(next) }} /></>}</div>
}

export function JobDetailPage() {
  const { jobId } = useParams()
  const auth = useAuth()
  const navigate = useNavigate()
  const { showPopup } = usePopup()
  const job = useRemote(() => api.job(jobId), [jobId])
  const [applying, setApplying] = useState(false)
  const [resumeFile, setResumeFile] = useState(null)

  function selectResume(event) {
    const file = event.target.files?.[0]
    if (!file) {
      setResumeFile(null)
      return
    }
    if (!['application/pdf', 'image/png'].includes(file.type)) {
      event.target.value = ''
      setResumeFile(null)
      showPopup({ tone: 'error', message: 'Choose a resume in PDF or PNG format.' })
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      event.target.value = ''
      setResumeFile(null)
      showPopup({ tone: 'error', message: 'The resume must be 10 MB or smaller.' })
      return
    }
    setResumeFile(file)
  }

  async function apply(event) {
    event.preventDefault()
    if (!auth.isAuthenticated) return navigate(`/auth?returnTo=${encodeURIComponent(`/app/jobs/${jobId}`)}`)
    const applicationForm = event.currentTarget
    const form = new FormData(applicationForm)
    setApplying(true)
    try {
      let resumeUrl = ''
      if (resumeFile) {
        [resumeUrl] = await api.upload([resumeFile])
        if (!resumeUrl) throw new Error('The resume upload did not return a usable URL.')
      }
      await api.applyForJob(jobId, { coverLetter: form.get('coverLetter'), ...(resumeUrl ? { resumeUrl } : {}) })
      applicationForm.reset()
      setResumeFile(null)
      showPopup({ tone: 'success', message: 'Application submitted.' })
    } catch (error) { showPopup({ tone: 'error', message: error.message }) } finally { setApplying(false) }
  }
  if (job.loading) return <div className="app-page"><LoadingState label="Loading job" /></div>
  if (job.error || !job.data) return <div className="app-page"><ErrorState message={job.error || 'Job not found'} retry={job.reload} /></div>
  const item = job.data
  return <div className="app-page"><button className="back-link" type="button" onClick={() => navigate(-1)}><ArrowLeft size={17} /> Back to jobs</button><div className="job-detail-layout"><article className="job-detail-card"><span className="job-detail-card__logo"><Building2 size={30} /></span><span className="app-eyebrow">{String(item.employmentType || 'full_time').replaceAll('_', ' ')}</span><h1>{item.title}</h1><p className="job-company">{item.company}</p><div className="job-detail-meta"><span><MapPin /> {item.location || 'Remote'}</span><span><WalletCards /> {item.salaryMin || item.salaryMax ? `${money(item.salaryMin || 0)} – ${money(item.salaryMax || item.salaryMin)}` : 'Salary open'}</span><span><CalendarDays /> Posted {relativeTime(item.createdAt)}</span></div><h2>About this role</h2><p className="preserve-lines">{item.description}</p></article><aside className="application-card"><h2>Apply for this job</h2><p>Introduce yourself and explain why you are a good fit.</p><form className="mini-form" onSubmit={apply}><label>Application message<textarea name="coverLetter" required minLength="10" rows="7" placeholder="Write a short cover letter" /></label><div className="resume-upload-field"><div className="resume-upload-heading"><strong>Resume</strong><span>optional</span></div><label className="resume-upload-picker"><FileText size={23} /><span><strong>{resumeFile?.name || 'Choose a PDF or PNG file'}</strong><small>{resumeFile ? `${(resumeFile.size / (1024 * 1024)).toFixed(1)} MB` : 'Maximum file size: 10 MB'}</small></span><input name="resumeFile" type="file" accept=".pdf,.png,application/pdf,image/png" onChange={selectResume} disabled={applying} /></label></div><button disabled={applying} className="app-button app-button--primary" type="submit">{applying ? resumeFile ? 'Uploading and submitting…' : 'Submitting…' : 'Submit application'}</button></form></aside></div></div>
}

function JobForm({ initial = {}, onSubmit, submitLabel = 'Post job' }) {
  const taxonomy = useRemote(() => api.taxonomy('jobs'), [])
  const categories = unwrapItems(taxonomy).flatMap((category) => (category.children || []).map((child) => ({ ...child, parentName: category.name })))
  if (taxonomy.loading) return <LoadingState label="Loading job categories" />
  if (taxonomy.error) return <ErrorState message={taxonomy.error} retry={taxonomy.reload} />
  if (!categories.length) return <EmptyState title="Job categories could not be loaded" message="Active job subcategories are required before a job can be posted." action={<button className="app-button app-button--outline" type="button" onClick={taxonomy.reload}>Retry</button>} />
  return <form className="app-form app-form--wide" onSubmit={onSubmit}><div className="form-grid"><label>Job title<input name="title" defaultValue={initial.title || ''} required minLength="3" /></label><label>Company<input name="company" defaultValue={initial.company || ''} required minLength="2" /></label><label>Category<select name="categoryId" defaultValue={initial.categoryId || ''} required><option value="">Choose category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label><label>Location<input name="location" defaultValue={initial.location || 'Remote'} /></label><label>Employment type<select name="employmentType" defaultValue={initial.employmentType || 'full_time'}><option value="full_time">Full-time</option><option value="part_time">Part-time</option><option value="contract">Contract</option><option value="internship">Internship</option></select></label><span /><label>Minimum salary<input name="salaryMin" type="number" min="0" defaultValue={initial.salaryMin || ''} /></label><label>Maximum salary<input name="salaryMax" type="number" min="0" defaultValue={initial.salaryMax || ''} /></label></div><label>Description<textarea name="description" rows="8" required minLength="10" defaultValue={initial.description || ''} /></label><button className="app-button app-button--primary" type="submit">{submitLabel}</button></form>
}

export function PostJobPage() {
  const navigate = useNavigate()
  const { showPopup } = usePopup()
  const [saving, setSaving] = useState(false)
  async function submit(event) {
    event.preventDefault(); setSaving(true)
    const form = new FormData(event.currentTarget)
    const payload = Object.fromEntries(form.entries())
    payload.salaryMin = payload.salaryMin ? Number(payload.salaryMin) : undefined
    payload.salaryMax = payload.salaryMax ? Number(payload.salaryMax) : undefined
    try { await api.createJob(payload); showPopup({ tone: 'success', message: 'Job posted.' }); navigate('/app/jobs/mine') } catch (error) { showPopup({ tone: 'error', message: error.message }) } finally { setSaving(false) }
  }
  return <div className="app-page"><PageIntro eyebrow="Hire talent" title="Post a job" description="Share the role with people across the Zidash community." /><JobForm onSubmit={submit} submitLabel={saving ? 'Posting…' : 'Post job'} /></div>
}

export function MyJobsPage() {
  const { showPopup } = usePopup()
  const state = useRemote(() => api.myJobs(), [])
  async function action(job, nextAction) {
    try { if (nextAction === 'delete') await api.deleteMyJob(job.id); else await api.jobAction(job.id, nextAction); showPopup({ tone: 'success', message: `Job ${nextAction === 'close' ? 'closed' : nextAction === 'reopen' ? 'reopened' : 'deleted'}.` }); state.reload() } catch (error) { showPopup({ tone: 'error', message: error.message }) }
  }
  return <div className="app-page"><PageIntro eyebrow="Your jobs" title="My job posts" description="Manage roles you have published." actions={<Link to="/app/jobs/post" className="app-button app-button--primary">Post another job</Link>} />{state.loading ? <LoadingState /> : state.error ? <ErrorState message={state.error} retry={state.reload} /> : unwrapItems(state).length ? <div className="manage-list">{unwrapItems(state).map((job) => <article key={job.id}><div><span className="status-pill">{job.status}</span><h2>{job.title}</h2><p>{job.company} · {job.location || 'Remote'}</p></div><div><Link to={`/app/jobs/${job.id}/edit`}>Edit</Link>{job.status === 'closed' ? <button type="button" onClick={() => action(job, 'reopen')}>Reopen</button> : <button type="button" onClick={() => action(job, 'close')}>Close</button>}<button className="danger-link" type="button" onClick={() => action(job, 'delete')}>Delete</button></div></article>)}</div> : <EmptyState title="You have not posted a job" message="Create a role to start receiving applications." action={<Link className="app-button app-button--primary" to="/app/jobs/post">Post a job</Link>} />}</div>
}

export function EditJobPage() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const { showPopup } = usePopup()
  const jobs = useRemote(() => api.myJobs(), [])
  const [saving, setSaving] = useState(false)
  const job = unwrapItems(jobs).find((item) => item.id === jobId)
  async function submit(event) { event.preventDefault(); setSaving(true); const form = new FormData(event.currentTarget); const payload = Object.fromEntries(form.entries()); payload.salaryMin = payload.salaryMin ? Number(payload.salaryMin) : null; payload.salaryMax = payload.salaryMax ? Number(payload.salaryMax) : null; try { await api.updateMyJob(jobId, payload); showPopup({ tone: 'success', message: 'Job updated.' }); navigate('/app/jobs/mine') } catch (error) { showPopup({ tone: 'error', message: error.message }) } finally { setSaving(false) } }
  if (jobs.loading) return <div className="app-page"><LoadingState label="Loading job" /></div>
  if (jobs.error) return <div className="app-page"><ErrorState message={jobs.error} retry={jobs.reload} /></div>
  if (!job) return <div className="app-page"><EmptyState title="Job not found" message="This job is not available in your job posts." /></div>
  return <div className="app-page"><PageIntro eyebrow="Your jobs" title="Edit job" description="Update the role details applicants see." /><JobForm initial={job} onSubmit={submit} submitLabel={saving ? 'Saving…' : 'Save job'} /></div>
}

export function CreatorsPage() {
  const [query, setQuery] = useState('')
  const [niche, setNiche] = useState('All')
  const state = useRemote(() => api.creators({ page: 1, limit: 100 }), [])
  const creators = unwrapItems(state)
  const niches = useMemo(() => ['All', ...new Set(creators.flatMap((creator) => creatorNiches(creator)))], [creators])
  const filtered = creators.filter((creator) => {
    const availableNiches = creatorNiches(creator)
    const matchesNiche = niche === 'All' || availableNiches.includes(niche)
    const userName = creatorName(creator)
    return matchesNiche && `${userName} ${creator.bio || ''} ${availableNiches.join(' ')}`.toLowerCase().includes(query.toLowerCase())
  })
  return <div className="app-page creator-page"><PageIntro eyebrow="UGC creators" title="Find creators who understand your audience" description="Discover available creators by niche, audience, and portfolio." actions={<Link className="app-button app-button--primary" to="/app/creators/become">Become a creator</Link>} /><label className="creator-search"><Search size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search niche, bio, or creator" /></label>{state.loading ? <LoadingState label="Loading creators" /> : state.error ? <ErrorState message={state.error} retry={state.reload} /> : <><div className="niche-chips">{niches.map((item) => <button type="button" className={item === niche ? 'is-active' : ''} key={item} onClick={() => setNiche(item)}>{item}</button>)}</div>{filtered.length ? <div className="creator-grid">{filtered.map((creator) => { const name = creatorName(creator); return <Link key={creator.id} to={`/app/creators/${creator.id}`} className="creator-card"><div className="creator-card__top"><Avatar name={name} src={creatorImage(creator)} size="large" /><span className={`availability ${creator.isAvailable ? 'is-available' : ''}`}>{creator.isAvailable ? 'Available' : 'Unavailable'}</span></div><h2>{name}</h2><p>{creator.bio || 'UGC creator on Zidash'}</p><div className="niche-row">{creatorNiches(creator).slice(0, 3).map((item) => <span key={item}>{item}</span>)}</div><div className="creator-stats"><span><strong>{Number(creator.followersCount || 0).toLocaleString()}</strong> followers</span><span><strong>{Number(creator.engagementRate || 0)}%</strong> engagement</span></div></Link> })}</div> : <EmptyState icon={UsersRound} title="No creators match your search" message="Try another niche or clear the search." />}</>}</div>
}

export function CreatorDetailPage() {
  const { creatorId } = useParams()
  const auth = useAuth()
  const navigate = useNavigate()
  const { showPopup } = usePopup()
  const state = useRemote(() => api.creator(creatorId), [creatorId])
  async function requestCampaign(event) {
    event.preventDefault()
    if (!auth.isAuthenticated) return navigate(`/auth?returnTo=${encodeURIComponent(`/app/creators/${creatorId}`)}`)
    const form = new FormData(event.currentTarget)
    try { await api.campaignRequest({ brandId: auth.user.id, creatorId, title: form.get('title'), brief: form.get('brief'), budget: Number(form.get('budget')) || undefined }); event.currentTarget.reset(); showPopup({ tone: 'success', message: 'Campaign request sent.' }) } catch (error) { showPopup({ tone: 'error', message: error.message }) }
  }
  if (state.loading) return <div className="app-page"><LoadingState label="Loading creator" /></div>
  if (state.error || !state.data) return <div className="app-page"><ErrorState message={state.error || 'Creator not found'} retry={state.reload} /></div>
  const creator = state.data; const name = creatorName(creator)
  return <div className="app-page"><div className="creator-profile"><Avatar name={name} src={creatorImage(creator)} size="xlarge" /><div><span className="app-eyebrow">UGC creator</span><h1>{name}</h1><p>{creator.bio}</p><div className="niche-row">{creatorNiches(creator).map((item) => <span key={item}>{item}</span>)}</div></div><div className="creator-profile__stats"><span><strong>{Number(creator.followersCount || 0).toLocaleString()}</strong>Followers</span><span><strong>{Number(creator.engagementRate || 0)}%</strong>Engagement</span></div></div><div className="creator-detail-grid"><section className="panel-card"><h2>Portfolio</h2>{creator.portfolio?.length ? <div className="portfolio-grid">{creator.portfolio.map((item) => <a key={item.id} href={item.mediaUrl} target="_blank" rel="noreferrer"><span><FileText /></span><strong>{item.title}</strong></a>)}</div> : <EmptyState title="No portfolio items yet" message="This creator has not added portfolio work." />}</section><aside className="panel-card"><h2>Start a campaign</h2><p>Share your brief and budget with this creator.</p><form className="mini-form" onSubmit={requestCampaign}><label>Campaign title<input name="title" required /></label><label>Brief<textarea name="brief" required minLength="10" rows="4" /></label><label>Budget<input name="budget" type="number" min="0" /></label><button className="app-button app-button--primary" type="submit"><Megaphone size={16} /> Send request</button></form></aside></div></div>
}

export function BecomeCreatorPage() {
  const navigate = useNavigate()
  const auth = useAuth()
  const { showPopup } = usePopup()
  const [saving, setSaving] = useState(false)
  const [brandingFile, setBrandingFile] = useState(null)
  const [brandingPreview, setBrandingPreview] = useState(auth.user?.avatarUrl || '')
  const accountName = `${auth.user?.firstName || ''} ${auth.user?.lastName || ''}`.trim() || 'Zidash creator'

  useEffect(() => {
    if (!brandingFile) setBrandingPreview(auth.user?.avatarUrl || '')
  }, [auth.user?.avatarUrl, brandingFile])

  useEffect(() => () => {
    if (brandingPreview.startsWith('blob:')) URL.revokeObjectURL(brandingPreview)
  }, [brandingPreview])

  function selectBrandingImage(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      showPopup({ tone: 'error', message: 'Choose a JPG, PNG, or WebP image.' })
      return
    }
    setBrandingFile(file)
    setBrandingPreview(URL.createObjectURL(file))
  }

  function useAccountImage() {
    setBrandingFile(null)
    setBrandingPreview(auth.user?.avatarUrl || '')
  }

  async function submit(event) {
    event.preventDefault()
    setSaving(true)
    const form = new FormData(event.currentTarget)
    const niches = String(form.get('niches')).split(',').map((item) => item.trim()).filter(Boolean).slice(0, 5)
    try {
      let brandingImageUrl = null
      if (brandingFile) {
        [brandingImageUrl] = await api.upload([brandingFile])
        if (!brandingImageUrl) throw new Error('The branding image upload did not return a usable URL.')
      }
      await api.becomeCreator({
        bio: form.get('bio'),
        niches,
        followersCount: Number(form.get('followersCount')) || 0,
        engagementRate: Number(form.get('engagementRate')) || 0,
        pricingPackages: form.get('price') ? [{ name: 'Starter', price: Number(form.get('price')) }] : [],
        brandingImageUrl,
      })
      await auth.refreshBootstrap()
      showPopup({ tone: 'success', message: 'Creator profile created.' })
      navigate('/app/profile')
    } catch (error) {
      showPopup({ tone: 'error', message: error.message })
    } finally {
      setSaving(false)
    }
  }

  return <div className="app-page creator-onboarding-page"><PageIntro eyebrow="Creator economy" title="Become a UGC creator" description="Build a profile that brands can discover." /><form className="app-form creator-onboarding-form" onSubmit={submit}><section className="creator-branding-field" aria-labelledby="creator-image-title"><div className="creator-branding-preview">{brandingPreview ? <img src={brandingPreview} alt={`${accountName} creator profile preview`} /> : <Avatar name={accountName} size="xlarge" />}</div><div className="creator-branding-copy"><h2 id="creator-image-title">Creator profile image</h2><p>{brandingFile ? `Selected: ${brandingFile.name}` : auth.user?.avatarUrl ? 'Your Zidash profile photo will be used automatically.' : 'Add a clear photo of yourself so brands can recognize you.'}</p><div className="creator-branding-actions"><label className="app-button app-button--outline creator-branding-upload"><ImagePlus size={17} /> {brandingPreview ? 'Choose another image' : 'Choose image'}<input type="file" accept="image/jpeg,image/png,image/webp" onChange={selectBrandingImage} /></label>{brandingFile && auth.user?.avatarUrl ? <button className="app-button app-button--ghost" type="button" onClick={useAccountImage}>Use profile photo</button> : null}</div></div></section><label>Creator bio<textarea name="bio" required minLength="10" rows="7" placeholder="Tell brands about your content and audience" /></label><label>Niches <span>up to five, separated by commas</span><input name="niches" required placeholder="Fashion, Beauty, Technology" /></label><div className="form-grid"><label>Followers<input name="followersCount" type="number" min="0" defaultValue="0" /></label><label>Engagement rate (%)<input name="engagementRate" type="number" min="0" step="0.01" defaultValue="0" /></label></div><label>Starter package price (₦)<input name="price" type="number" min="0" /></label><button className="app-button app-button--primary" type="submit" disabled={saving}>{saving ? 'Creating profile…' : 'Create creator profile'}</button></form></div>
}
