import { useEffect, useState } from 'react'
import { account, appwriteConfigured, appwriteConfig, verifyStudioAdmin } from './lib/appwrite'
import { emptyContent, loadSiteContent, saveSiteContent, uploadSiteMedia } from './lib/contentStore'
import { ArrowLeft, Check, ImagePlus, LogOut, Music2, Plus, Save, Settings2, Upload, Video, X } from 'lucide-react'

const sections = [
  ['overview', 'Overview'], ['homepage', 'Homepage'], ['profile', 'Artist profile'],
  ['music', 'Music releases'], ['videos', 'Videos'], ['gallery', 'Photo gallery'],
  ['updates', 'Updates'], ['socials', 'Social links']
]

export default function AdminStudio() {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [content, setContent] = useState(emptyContent)
  const [section, setSection] = useState('overview')
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    if (!appwriteConfigured) return
    verifyStudioAdmin().then(async current => {
      setUser(current)
      try { setContent(await loadSiteContent()) } catch (e) { setError(e.message) }
    }).catch(() => {})
  }, [])

  const update = (path, value) => {
    setContent(current => {
      const next = structuredClone(current)
      const keys = path.split('.')
      let target = next
      while (keys.length > 1) target = target[keys.shift()]
      target[keys[0]] = value
      return next
    })
    setDirty(true)
    setNotice('')
  }

  const login = async event => {
    event.preventDefault()
    setBusy(true); setError('')
    try {
      const session = await account.createEmailPasswordSession(email.trim(), password)
      const current = await verifyStudioAdmin()
      setUser(current)
      setContent(await loadSiteContent())
      setPassword('')
    } catch (e) { setError(e.message || 'Sign-in failed.') }
    finally { setBusy(false) }
  }

  const logout = async () => {
    setBusy(true)
    try { await account.deleteSession('current'); setUser(null); setContent(emptyContent) }
    catch (e) { setError(e.message) }
    finally { setBusy(false) }
  }

  const save = async () => {
    setBusy(true); setError(''); setNotice('')
    try { await saveSiteContent(content); setDirty(false); setNotice('All changes saved to Appwrite.') }
    catch (e) { setError(e.message || 'Could not save changes.') }
    finally { setBusy(false) }
  }

  const upload = async (file, category, callback) => {
    if (!file) return
    setBusy(true); setError(''); setNotice('')
    try {
      const asset = await uploadSiteMedia(file, category)
      callback(asset)
      setDirty(true)
      setNotice(file.name + ' uploaded. Save changes to publish it.')
    } catch (e) { setError(e.message || 'Upload failed.') }
    finally { setBusy(false) }
  }

  if (!appwriteConfigured || !appwriteConfig.bucketId || !appwriteConfig.adminTeamId) return <div className="studio-gate"><div className="studio-login-card"><p className="studio-kicker">JOSEPH EMOTIONS / SETUP</p><h1>Connect the studio.</h1><p>The private studio is ready, but it needs your Appwrite project endpoint, project ID, Storage bucket ID and administrator Team ID before sign-in, uploads and permanent saving can work.</p><code>VITE_APPWRITE_ENDPOINT<br/>VITE_APPWRITE_PROJECT_ID<br/>VITE_APPWRITE_BUCKET_ID<br/>VITE_APPWRITE_ADMIN_TEAM_ID</code><p className="studio-hint">Add these values to your Appwrite Site environment variables, then redeploy. Keep the bucket's file read access public so the website can display published media. Do not share API keys here.</p><a href="https://cloud.appwrite.io/" target="_blank" rel="noreferrer">Open Appwrite Console ↗</a><a className="studio-back" href="/">← Back to website</a></div></div>

  if (!user) return <div className="studio-gate"><form className="studio-login-card" onSubmit={login}><p className="studio-kicker">JOSEPH EMOTIONS / PRIVATE AREA</p><h1>Artist studio<span>.</span></h1><p>Sign in with the administrator account configured in Appwrite Authentication.</p><label>Email address<input type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="username" required/></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" required/></label>{error && <p className="studio-error">{error}</p>}<button className="studio-primary" disabled={busy}>{busy ? 'SIGNING IN…' : 'ENTER STUDIO ↗'}</button><a className="studio-back" href="/">← Back to website</a></form></div>

  const field = (label, value, onChange, placeholder = '', multiline = false) => <label className="studio-field">{label}{multiline ? <textarea value={value || ''} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/> : <input value={value || ''} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/>}</label>
  const mediaPicker = (label, category, current, callback, accept='image/*') => <div className="studio-media"><span>{label}</span>{current?.url && (accept.startsWith('video') ? <video src={current.url} controls/> : <img src={current.url} alt="Selected media"/>)}<label className="studio-upload"><Upload size={16}/> Browse {accept.startsWith('video') ? 'video' : 'image'}<input type="file" accept={accept} onChange={e=>upload(e.target.files?.[0],category,callback)}/></label>{current?.name && <small>{current.name}</small>}</div>
  const listEditor = (key, kind) => {
    const items = content[key] || []
    const add = () => update(key,[...items,{id:crypto.randomUUID(),title:'New '+kind,description:'',year:String(new Date().getFullYear()),image:null,url:'',type:kind.toUpperCase()}])
    const patch = (id, patch) => update(key,items.map(item=>item.id===id?{...item,...patch}:item))
    return <div className="studio-list"><div className="studio-list-head"><p>{items.length} {kind.toLowerCase()} items</p><button onClick={add}><Plus size={15}/> ADD {kind.toUpperCase()}</button></div>{items.map(item=><article className="studio-item" key={item.id}><div className="studio-item-top"><strong>{item.title}</strong><button onClick={()=>update(key,items.filter(x=>x.id!==item.id))} aria-label="Remove item"><X size={16}/></button></div>{field('Title',item.title,v=>patch(item.id,{title:v}))}{field('Description',item.description,v=>patch(item.id,{description:v}), '',true)}{kind==='Release' && field('Year',item.year,v=>patch(item.id,{year:v}))}{kind==='Release' && field('Listening link',item.url,v=>patch(item.id,{url:v}),'https://')}{kind==='Video' && field('Video link (YouTube or Vimeo)',item.url,v=>patch(item.id,{url:v}),'https://')}{kind==='Update' && field('Date / label',item.year,v=>patch(item.id,{year:v}))}{mediaPicker(kind==='Video'?'Video thumbnail':'Cover photo','cover',item.image,asset=>patch(item.id,{image:asset}))}{kind==='Video' && mediaPicker('Video file (optional)','video',item.video,asset=>patch(item.id,{video:asset}),'video/*')}{kind==='Gallery' && mediaPicker('Gallery photograph','gallery',item.image,asset=>patch(item.id,{image:asset}))}</article>)}</div>
  }

  return <div className="studio-app"><aside className="studio-sidebar"><a href="/" className="studio-brand">JOSEPH<br/><span>EMOTIONS.</span></a><p className="studio-side-label">CONTENT MANAGEMENT</p>{sections.map(([id,label])=><button key={id} className={section===id?'selected':''} onClick={()=>setSection(id)}>{label}</button>)}<div className="studio-side-bottom"><span>{user.name || user.email}</span><button onClick={logout}><LogOut size={15}/> Sign out</button><a href="/">← View website</a></div></aside><main className="studio-main"><header className="studio-topbar"><div><p className="studio-kicker">JOSEPH EMOTIONS / STUDIO</p><h1>{sections.find(s=>s[0]===section)?.[1]}</h1></div><div className="studio-actions"><span className={dirty?'studio-unsaved':'studio-saved'}>{dirty?'UNSAVED CHANGES':'SAVED'}</span><button className="studio-save" onClick={save} disabled={busy || !dirty}><Save size={16}/>{busy?'WORKING…':'SAVE CHANGES'}</button></div></header>{error && <div className="studio-alert error">{error}</div>}{notice && <div className="studio-alert">{notice}</div>}
  {section==='overview' && <div className="studio-overview"><div className="studio-welcome"><p className="studio-kicker">YOUR DIGITAL HOME</p><h2>Everything in<br/><em>one place.</em></h2><p>Manage the artist website without editing code. Upload images and videos from your device, update your releases and publish when you're ready.</p></div><div className="studio-stat-grid">{[['Music releases',content.music.length],['Videos',content.videos.length],['Gallery photos',content.gallery.length],['Updates',content.updates.length]].map(([name,count])=><div key={name}><span>{name}</span><strong>{count}</strong></div>)}</div><div className="studio-tip"><Check size={18}/><p>Changes are saved to Appwrite Storage. Uploading a file does not publish it until you save the website content.</p></div></div>}
  {section==='homepage' && <div className="studio-panel"><h2>Homepage hero</h2><p className="studio-description">The main full-screen photograph is managed separately from gallery and update photos.</p>{mediaPicker('Hero background photograph','hero',content.hero.image,asset=>update('hero.image',asset))}{field('Eyebrow text',content.hero.eyebrow,v=>update('hero.eyebrow',v))}{field('Main title',content.hero.title,v=>update('hero.title',v))}{field('Hero subtitle',content.hero.subtitle,v=>update('hero.subtitle',v), '',true)}</div>}
  {section==='profile' && <div className="studio-panel"><h2>Artist profile</h2>{mediaPicker('Artist portrait','portrait',content.profile.portrait,asset=>update('profile.portrait',asset))}{field('Biography',content.profile.biography,v=>update('profile.biography',v),'Write the official artist biography…',true)}</div>}
  {section==='music' && <div className="studio-panel"><h2>Music releases</h2><p className="studio-description">Add artwork, release details and a listening link for each release.</p>{listEditor('music','Release')}</div>}
  {section==='videos' && <div className="studio-panel"><h2>Music videos</h2><p className="studio-description">Browse a video file from your phone or add a YouTube/Vimeo link.</p>{listEditor('videos','Video')}</div>}
  {section==='gallery' && <div className="studio-panel"><h2>Photo gallery</h2><p className="studio-description">Gallery photos are independent from the homepage hero and artist portrait.</p>{listEditor('gallery','Gallery')}</div>}
  {section==='updates' && <div className="studio-panel"><h2>Photo updates</h2><p className="studio-description">Each update has its own image and caption. These do not replace the hero photograph.</p>{listEditor('updates','Update')}</div>}
  {section==='socials' && <div className="studio-panel"><h2>Social destinations</h2>{[['instagram','Instagram'],['tiktok','TikTok'],['youtube','YouTube'],['spotify','Spotify'],['appleMusic','Apple Music']].map(([key,label])=>field(label,content.socials[key],v=>update('socials.'+key,v),'https://'))}</div>}
  <footer className="studio-footer">PRIVATE ARTIST STUDIO · JOSEPH EMOTIONS <span>APPWRITE STORAGE</span></footer></main></div>
}
