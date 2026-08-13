import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { BadgeCheck, ChevronRight, Heart, ImagePlus, MapPin, MessageCircle, MoreHorizontal, Plus, Send, Store, Trash2, UsersRound, X } from 'lucide-react'
import { io } from 'socket.io-client'
import { Link, useLocation, useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { API_BASE, api, getStoredSession, unwrapItems } from '../api'
import { useAuth } from '../auth-context'
import { Avatar, EmptyState, ErrorState, LoadingState, PageIntro, ReportDialog, SecurityNotice } from '../components'
import { money, NIGERIAN_LOCATIONS, parseCommunityPost, relativeTime } from '../data'
import { useRemote } from '../hooks'
import { usePopup } from '../popup-context'

function CommunityCard({ post }) {
  const item = parseCommunityPost(post)
  const auth = useAuth()
  const navigate = useNavigate()
  const { showPopup } = usePopup()
  const [liked, setLiked] = useState(Boolean(post.likedByMe))
  const [likes, setLikes] = useState(Number(post.likesCount || 0))
  const [reportOpen, setReportOpen] = useState(false)
  const [reporting, setReporting] = useState(false)
  const authorName = `${post.author?.firstName || ''} ${post.author?.lastName || ''}`.trim() || 'Zidash member'
  const image = post.media?.[0]?.url || item.imageUrl

  async function toggleLike() {
    if (!auth.isAuthenticated) return navigate(`/auth?returnTo=${encodeURIComponent('/app/community')}`)
    const before = liked
    setLiked(!before); setLikes((count) => count + (before ? -1 : 1))
    try { const response = await api.toggleCommunityLike(post.id); setLiked(Boolean(response.data?.liked)) } catch (error) { setLiked(before); setLikes((count) => count + (before ? 1 : -1)); showPopup({ tone: 'error', message: error.message }) }
  }

  function report() {
    if (!auth.isAuthenticated) return navigate(`/auth?returnTo=${encodeURIComponent('/app/community')}`)
    setReportOpen(true)
  }

  async function submitReport(reason) { setReporting(true); try { await api.report({ reporterId: auth.user.id, subjectType: 'post', subjectId: post.id, reason, details: 'Reported from the Zidash web community feed' }); setReportOpen(false); showPopup({ tone: 'success', message: 'Post reported. Thank you.' }) } catch (error) { showPopup({ tone: 'error', message: error.message }) } finally { setReporting(false) } }

  return <><article className="community-card"><header><Avatar name={authorName} src={post.author?.avatarUrl} /><div><strong>{authorName} {post.author?.identityVerifiedAt && <BadgeCheck size={15} />}</strong><span><MapPin size={12} /> {post.location || 'Nigeria'} · {relativeTime(post.createdAt)}</span></div><button type="button" onClick={report} aria-label="Report community post"><MoreHorizontal size={20} /></button></header><div className="community-card__copy"><h2>{item.title || 'Community post'}</h2>{item.description && <p>{item.description}</p>}{item.price !== undefined && <strong className="community-price">{money(item.price, item.currency)}</strong>}</div>{image && <img className="community-card__image" src={image} alt={item.title || 'Community post'} loading="lazy" />}<footer><button type="button" className={liked ? 'is-active' : ''} onClick={toggleLike}><Heart size={18} fill={liked ? 'currentColor' : 'none'} /> {likes}</button>{post.author?.id && <Link to={`/app/messages/new`} state={{ sellerId: post.author.id, sellerName: authorName }}><Send size={18} /> Message</Link>}</footer></article>{reportOpen && <ReportDialog title="Report community post" subjectLabel="post" submitting={reporting} onClose={() => setReportOpen(false)} onSubmit={submitReport} />}</>
}

export function CommunityPage() {
  const auth = useAuth()
  const navigate = useNavigate()
  const { appLocation } = useOutletContext()
  const [locationFilter, setLocationFilter] = useState('All')
  const [composerOpen, setComposerOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const state = useRemote(() => api.community(locationFilter), [locationFilter])
  const { showPopup } = usePopup()

  function openComposer() {
    if (!auth.isAuthenticated) return navigate(`/auth?returnTo=${encodeURIComponent('/app/community')}`)
    setComposerOpen(true)
  }

  async function createPost(event) {
    event.preventDefault(); setSaving(true)
    const form = new FormData(event.currentTarget)
    try {
      let imageUrl
      const file = form.get('image')
      if (file?.size) [imageUrl] = await api.upload([file])
      await api.createCommunityPost({ title: form.get('title'), description: form.get('description'), price: Number(form.get('price')), currency: 'NGN', location: form.get('location'), scope: form.get('scope'), ...(imageUrl ? { imageUrl } : {}) })
      setComposerOpen(false); state.reload(); showPopup({ tone: 'success', message: 'Community post created.' })
    } catch (error) { showPopup({ tone: 'error', message: error.message }) } finally { setSaving(false) }
  }

  return <div className="app-page community-page"><PageIntro eyebrow="Communities" title="Discover what people are sharing" description="Browse sale posts from every Nigerian state and Abuja FCT." actions={<button type="button" className="app-button app-button--primary" onClick={openComposer}><Plus size={17} /> Create post</button>} /><SecurityNotice /><div className="community-toolbar"><label><MapPin size={17} /><span>Show posts from</span><select value={locationFilter} onChange={(event) => setLocationFilter(event.target.value)}>{NIGERIAN_LOCATIONS.map((item) => <option key={item}>{item}</option>)}</select></label><span>Your saved location: {appLocation}</span></div>{state.loading ? <LoadingState label="Loading community posts" /> : state.error ? <ErrorState message={state.error} retry={state.reload} /> : unwrapItems(state).length ? <div className="community-feed">{unwrapItems(state).map((post) => <CommunityCard key={post.id} post={post} />)}</div> : <EmptyState icon={UsersRound} title="No community posts here yet" message="Choose another location or be the first person to post." action={<button className="app-button app-button--primary" type="button" onClick={openComposer}>Create a post</button>} />}{composerOpen && <div className="app-modal-scrim" onMouseDown={(event) => event.target === event.currentTarget && setComposerOpen(false)}><section className="app-modal" role="dialog" aria-modal="true" aria-label="Create community post"><button className="app-modal__close" type="button" onClick={() => setComposerOpen(false)}>×</button><h2>Create community sale post</h2><p>Share an item with people around you.</p><form className="mini-form" onSubmit={createPost}><label>Title<input name="title" required minLength="3" /></label><label>Description<textarea name="description" rows="4" /></label><label>Price (₦)<input name="price" type="number" min="0" required /></label><label>Location<select name="location" defaultValue={appLocation} required>{NIGERIAN_LOCATIONS.filter((item) => item !== 'All').map((item) => <option key={item}>{item}</option>)}</select></label><label>Who should see it?<select name="scope" defaultValue="state"><option value="near_me">Near me</option><option value="state">My state</option><option value="country">Nigeria</option><option value="global">Everyone</option></select></label><label>Image <span>optional</span><input name="image" type="file" accept="image/*" /></label><button className="app-button app-button--primary" disabled={saving} type="submit">{saving ? 'Publishing…' : 'Publish post'}</button></form></section></div>}</div>
}

export function MyCommunityPostsPage() {
  const { showPopup } = usePopup()
  const state = useRemote(() => api.myCommunityPosts(), [])
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  async function remove(post) {
    try { await api.deleteCommunityPost(post.id); showPopup({ tone: 'success', message: 'Community post deleted.' }); state.reload() } catch (error) { showPopup({ tone: 'error', message: error.message }) }
  }
  async function save(event) { event.preventDefault(); setSaving(true); const form = new FormData(event.currentTarget); try { await api.updateCommunityPost(editing.id, { title: form.get('title'), description: form.get('description'), price: Number(form.get('price')), currency: 'NGN', scope: form.get('scope') }); setEditing(null); state.reload(); showPopup({ tone: 'success', message: 'Community post updated.' }) } catch (error) { showPopup({ tone: 'error', message: error.message }) } finally { setSaving(false) } }
  const editContent = editing ? parseCommunityPost(editing) : null
  return <div className="app-page"><PageIntro eyebrow="Your community" title="My community posts" description="Review and manage the posts you have shared." actions={<Link to="/app/community" className="app-button app-button--primary">Create post</Link>} />{state.loading ? <LoadingState /> : state.error ? <ErrorState message={state.error} retry={state.reload} /> : unwrapItems(state).length ? <div className="manage-list">{unwrapItems(state).map((post) => { const item = parseCommunityPost(post); return <article key={post.id}><div><span className="status-pill">{post.scope}</span><h2>{item.title || 'Community post'}</h2><p>{money(item.price, item.currency)} · {post.location}</p></div><div><button type="button" onClick={() => setEditing(post)}>Edit</button><button className="danger-link" type="button" onClick={() => remove(post)}><Trash2 size={15} /> Delete</button></div></article> })}</div> : <EmptyState title="You have not posted yet" message="Community sale posts you create will appear here." />}{editing && <div className="app-modal-scrim" onMouseDown={(event) => event.target === event.currentTarget && setEditing(null)}><section className="app-modal" role="dialog" aria-modal="true" aria-label="Edit community post"><button className="app-modal__close" type="button" onClick={() => setEditing(null)}>×</button><h2>Edit community post</h2><p>Update the sale details shown in the community.</p><form className="mini-form" onSubmit={save}><label>Title<input name="title" defaultValue={editContent.title || ''} required minLength="3" /></label><label>Description<textarea name="description" defaultValue={editContent.description || ''} rows="4" /></label><label>Price (₦)<input name="price" type="number" min="0" defaultValue={editContent.price || 0} required /></label><label>Who should see it?<select name="scope" defaultValue={editing.scope || 'state'}><option value="near_me">Near me</option><option value="state">My state</option><option value="country">Nigeria</option><option value="global">Everyone</option></select></label><button className="app-button app-button--primary" disabled={saving} type="submit">{saving ? 'Saving…' : 'Save changes'}</button></form></section></div>}</div>
}

function conversationName(conversation) {
  return `${conversation.otherUser?.firstName || ''} ${conversation.otherUser?.lastName || ''}`.trim() || 'Zidash member'
}

export function MessagesPage() {
  const state = useRemote(() => api.conversations(), [])
  return <div className="app-page messages-page"><PageIntro eyebrow="Inbox" title="Messages" description="Your marketplace, job, and creator conversations." />{state.loading ? <LoadingState label="Loading messages" /> : state.error ? <ErrorState message={state.error} retry={state.reload} /> : unwrapItems(state).length ? <div className="conversation-list">{unwrapItems(state).map((conversation) => <Link key={conversation.id} to={`/app/messages/${conversation.id}`}><Avatar name={conversationName(conversation)} src={conversation.otherUser?.avatarUrl} size="large" /><div><div><strong>{conversationName(conversation)}</strong><span>{relativeTime(conversation.lastMessageAt)}</span></div><p>{conversation.lastMessage?.body || (conversation.lastMessage?.type === 'image' ? 'Photo' : 'Open conversation')}</p>{conversation.listing?.title && <small><Store size={12} /> {conversation.listing.title}</small>}</div>{conversation.unreadCount > 0 && <em>{conversation.unreadCount}</em>}<ChevronRight size={18} /></Link>)}</div> : <EmptyState icon={MessageCircle} title="No messages yet" message="When you message a seller, the conversation appears here." action={<Link className="app-button app-button--primary" to="/app">Browse products</Link>} />}</div>
}

export function NewConversationPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { showPopup } = usePopup()
  const target = location.state || {}
  const [sending, setSending] = useState(false)
  async function send(event) {
    event.preventDefault(); const body = new FormData(event.currentTarget).get('message')?.trim(); if (!body) return
    setSending(true)
    try { const response = await api.startConversation({ sellerId: target.sellerId, listingId: target.listingId, message: body }); const conversation = response.data?.conversation || response.data; navigate(`/app/messages/${conversation.id}`, { replace: true }) } catch (error) { showPopup({ tone: 'error', message: error.message }) } finally { setSending(false) }
  }
  if (!target.sellerId && !target.listingId) return <div className="app-page"><EmptyState title="Choose someone to message" message="Open a product or community post and select Message." /></div>
  return <div className="app-page chat-page"><header className="chat-header"><Avatar name={target.sellerName || 'Seller'} /><div><h1>{target.sellerName || 'Start a conversation'}</h1><p>{target.listingTitle || 'Zidash member'}</p></div></header><SecurityNotice /><div className="new-chat-empty"><MessageCircle size={35} /><h2>Start the conversation</h2><p>Ask a clear question and avoid making payment to an unverified merchant.</p></div><form className="chat-composer" onSubmit={send}><input name="message" placeholder="Write a message…" autoFocus /><button className="chat-composer__send" disabled={sending} type="submit" aria-label="Send message"><Send size={19} /></button></form></div>
}

export function ChatPage() {
  const { conversationId } = useParams()
  const auth = useAuth()
  const { showPopup } = usePopup()
  const state = useRemote(() => api.conversationMessages(conversationId), [conversationId])
  const [messages, setMessages] = useState([])
  const [attachments, setAttachments] = useState([])
  const [sending, setSending] = useState(false)
  const threadRef = useRef(null)
  const hasPositionedThreadRef = useRef(false)
  const fileInputRef = useRef(null)
  const messageInputRef = useRef(null)
  const attachmentsRef = useRef([])
  const payload = state.data
  const conversation = payload?.conversation
  const other = conversation?.otherUser || (conversation?.buyerId === auth.user?.id ? conversation?.seller : conversation?.buyer)
  const otherName = `${other?.firstName || ''} ${other?.lastName || ''}`.trim() || 'Zidash member'

  useEffect(() => { if (Array.isArray(payload?.messages)) setMessages(payload.messages) }, [payload])
  useLayoutEffect(() => {
    const thread = threadRef.current
    if (!thread || !messages.length) return
    thread.scrollTo({
      top: thread.scrollHeight,
      behavior: hasPositionedThreadRef.current ? 'smooth' : 'auto',
    })
    hasPositionedThreadRef.current = true
  }, [messages.length])
  useEffect(() => { hasPositionedThreadRef.current = false }, [conversationId])
  useEffect(() => { attachmentsRef.current = attachments }, [attachments])
  useEffect(() => () => attachmentsRef.current.forEach((attachment) => URL.revokeObjectURL(attachment.previewUrl)), [])
  useEffect(() => {
    const token = getStoredSession()?.accessToken
    if (!token) return undefined
    const origin = API_BASE.startsWith('http') ? API_BASE.replace(/\/api\/v1\/?$/, '') : window.location.origin
    const socket = io(origin, { auth: { token }, transports: ['websocket', 'polling'] })
    socket.emit('conversation:join', { conversationId })
    const onMessage = (message) => { if (message.conversationId === conversationId) setMessages((current) => current.some((item) => item.id === message.id) ? current : [...current, message]) }
    socket.on('message:new', onMessage)
    return () => { socket.off('message:new', onMessage); socket.disconnect() }
  }, [conversationId])

  function selectImages(event) {
    const selected = Array.from(event.target.files || [])
    event.target.value = ''
    const images = selected.filter((file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type))
    if (images.length !== selected.length) showPopup({ tone: 'warning', message: 'Choose JPEG, PNG, or WebP images only.' })
    const availableSlots = Math.max(0, 8 - attachments.length)
    if (images.length > availableSlots) showPopup({ tone: 'warning', message: 'You can send up to 8 images at a time.' })
    const additions = images.slice(0, availableSlots).map((file) => ({
      id: `${file.name}-${file.lastModified}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }))
    if (additions.length) setAttachments((current) => [...current, ...additions])
  }

  function removeAttachment(id) {
    setAttachments((current) => current.filter((attachment) => {
      if (attachment.id !== id) return true
      URL.revokeObjectURL(attachment.previewUrl)
      return false
    }))
  }

  function appendMessage(message) {
    setMessages((current) => current.some((item) => item.id === message.id) ? current : [...current, message])
  }

  async function send(event) {
    event.preventDefault()
    const form = event.currentTarget
    const body = new FormData(form).get('message')?.trim()
    if ((!body && !attachments.length) || sending) return
    setSending(true)
    try {
      if (attachments.length) {
        const selectedAttachments = [...attachments]
        const urls = await api.upload(selectedAttachments.map((attachment) => attachment.file))
        if (urls.length !== selectedAttachments.length) throw new Error('One or more images could not be uploaded.')
        for (let index = 0; index < urls.length; index += 1) {
          const response = await api.sendMessage(conversationId, {
            type: 'image',
            mediaUrl: urls[index],
            ...(index === 0 && body ? { body } : {}),
          })
          appendMessage(response.data)
          removeAttachment(selectedAttachments[index].id)
          if (index === 0 && body && messageInputRef.current) messageInputRef.current.value = ''
        }
      } else {
        const response = await api.sendMessage(conversationId, { type: 'text', body })
        appendMessage(response.data)
      }
      form.reset()
    } catch (error) {
      showPopup({ tone: 'error', message: error.message })
    } finally {
      setSending(false)
    }
  }

  if (state.loading) return <div className="app-page"><LoadingState label="Opening conversation" /></div>
  if (state.error) return <div className="app-page"><ErrorState message={state.error} retry={state.reload} /></div>
  const storeId = other?.sellerProfile?.id
  const identity = <><Avatar name={otherName} src={other?.avatarUrl} /><div><h1>{otherName}</h1>{conversation?.listing?.title && <p>{conversation.listing.title}</p>}</div><Store className="chat-user-link__store" size={17} /></>
  return <div className="app-page chat-page"><header className="chat-header">{storeId ? <Link className="chat-user-link" to={`/app/seller/${storeId}`} aria-label={`Open ${otherName}'s store`}>{identity}</Link> : <button className="chat-user-link" type="button" onClick={() => showPopup({ tone: 'warning', title: 'Seller profile not available', message: 'This user has not created a public store profile yet.' })}>{identity}</button>}</header><SecurityNotice /><div ref={threadRef} className="chat-thread">{messages.map((message) => { const mine = message.senderId === (payload?.currentUserId || auth.user?.id); return <div key={message.id} className={`chat-bubble ${mine ? 'is-mine' : ''}`}>{message.type === 'image' && message.mediaUrl && <img src={message.mediaUrl} alt="Shared attachment" loading="lazy" />}{message.body && <p>{message.body}</p>}<span>{relativeTime(message.createdAt)}</span></div> })}</div><form className={`chat-composer ${attachments.length ? 'has-attachments' : ''}`} onSubmit={send}>{attachments.length > 0 && <div className="chat-attachment-previews" aria-label="Selected images">{attachments.map((attachment) => <figure key={attachment.id}><img src={attachment.previewUrl} alt={attachment.file.name} /><button type="button" onClick={() => removeAttachment(attachment.id)} aria-label={`Remove ${attachment.file.name}`}><X size={14} /></button></figure>)}</div>}<input ref={fileInputRef} className="chat-composer__file" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={selectImages} /><button className="chat-composer__attach" disabled={sending || attachments.length >= 8} type="button" onClick={() => fileInputRef.current?.click()} aria-label="Select images"><ImagePlus size={20} /></button><input ref={messageInputRef} name="message" placeholder={attachments.length ? 'Add a message…' : 'Write a message…'} autoComplete="off" /><button className="chat-composer__send" disabled={sending} type="submit" aria-label={sending ? 'Sending message' : 'Send message'}><Send size={19} /></button></form></div>
}
