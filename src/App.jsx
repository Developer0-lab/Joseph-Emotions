import { useEffect, useState } from 'react'
import { emptyContent, loadSiteContent } from './lib/contentStore'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Disc3, Menu, Music2, Play, Plus, X } from 'lucide-react'

const navItems = ['Home', 'Music', 'Videos', 'Gallery', 'Updates', 'About']

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activePage, setActivePage] = useState('Home')
  const [playing, setPlaying] = useState(false)
  const [selectedRelease, setSelectedRelease] = useState(null)
  const [activeHeroIndex, setActiveHeroIndex] = useState(0)
  const [siteContent, setSiteContent] = useState(emptyContent)
  const heroImages = siteContent.hero?.images?.length ? siteContent.hero.images : (siteContent.hero?.image ? [siteContent.hero.image] : [])
  const activeReleases = (siteContent.music || []).map((item, index) => ({ number: String(index + 1).padStart(2, '0'), title: item.title, type: item.type || 'RELEASE', year: item.year || '', image: item.image?.url || '', description: item.description || '', url: item.url || '', audio: item.audio || null }))

  useEffect(() => {
    loadSiteContent().then(setSiteContent).catch(error => console.error('Could not load published website content:', error))
  }, [])

  useEffect(() => {
    if (heroImages.length < 2) return
    const timer = window.setInterval(() => setActiveHeroIndex(index => (index + 1) % heroImages.length), 6500)
    return () => window.clearInterval(timer)
  }, [heroImages.length])

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12 })
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [activePage])

  const navigate = page => {
    setActivePage(page)
    setMenuOpen(false)
    setSelectedRelease(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div className="site-shell">
      <header className="site-header">
        <button className="wordmark" onClick={() => navigate('Home')} aria-label="Joseph Emotions home">
          <span>JOSEPH</span><span className="wordmark-second">EMOTIONS<span className="wordmark-dot">.</span></span>
        </button>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navItems.map(item => <button key={item} className={activePage === item ? 'nav-link active' : 'nav-link'} onClick={() => navigate(item)}>{item}</button>)}
        </nav>
        <button className="header-connect" onClick={() => navigate('Connect')}>LET'S CONNECT <ArrowUpRight size={14}/></button>
        <button className="mobile-menu-button" onClick={() => setMenuOpen(v => !v)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>{menuOpen ? <X/> : <Menu/>}</button>
      </header>

      {menuOpen && <div className="mobile-menu">
        {navItems.map(item => <button key={item} onClick={() => navigate(item)}>{item}<ArrowUpRight size={16}/></button>)}
        <button onClick={() => navigate('Connect')}>Connect<ArrowUpRight size={16}/></button>
      </div>}

      {activePage === 'Home' ? (
        <main>
          <section className="hero" data-hero-count={heroImages.length}>
            <div className="hero-slides" aria-hidden="true">{heroImages.map((image,index)=><div key={image.id || image.url || index} className={"hero-slide " + (index === activeHeroIndex ? "is-current" : index === (activeHeroIndex - 1 + heroImages.length) % heroImages.length ? "was-current" : "is-next")}><img src={image.url || image} alt="" /></div>)}</div>
            <div className="hero-grain"/>
            <div className="hero-topline"><span>INDEPENDENT ARTIST · OFFICIAL WEBSITE</span><span>KAMPALA / THE WORLD</span></div>
            <div className="hero-content">
              <p className="eyebrow reveal">{siteContent.hero?.eyebrow || "THE ARTIST. THE MUSIC. THE JOURNEY."}</p>
              <h1 className="hero-title reveal"><span>{(siteContent.hero?.title || "JOSEPH EMOTIONS.").split(" ").slice(0,-1).join(" ") || "JOSEPH"}</span><span>{(siteContent.hero?.title || "JOSEPH EMOTIONS.").split(" ").slice(-1)[0].replace(/\.$/,"")}<span className="gold-period">.</span></span></h1>
              <div className="hero-bottom reveal">
                <p>{siteContent.hero?.subtitle || "Music that moves you. Stories that stay with you."}</p>
                <button className="round-play" onClick={() => navigate('Music')} aria-label="Explore music"><ArrowUpRight size={22}/></button>
                <button className="hero-cta" onClick={() => navigate('Music')}>EXPLORE THE MUSIC <ArrowUpRight size={15}/></button>
              </div>
            </div>
            <div className="hero-footer"><span>SCROLL TO DISCOVER</span><span className="scroll-line"><i/></span><span>{heroImages.length ? String(activeHeroIndex + 1).padStart(2,'0') + ' — ' + String(heroImages.length).padStart(2,'0') : 'NO HERO IMAGES'}</span>{heroImages.length > 1 && <div className="hero-image-dots" aria-label="Homepage hero images">{heroImages.map((image,index)=><button key={image.id||image.url||index} type="button" className={index===activeHeroIndex?"active":""} aria-label={"Show hero image "+(index+1)} onClick={()=>setActiveHeroIndex(index)}/>)}</div>}</div>
          </section>

          <section className="intro-section section-pad">
            <div className="section-index reveal">01 <span> / THE INTRODUCTION</span></div>
            <div className="intro-grid">
              <h2 className="editorial-heading reveal">A voice.<br/><em>A feeling.</em><br/>A world of its own.</h2>
              <div className="intro-copy reveal"><p className="gold-kicker">WELCOME TO MY WORLD</p><p>Some things are better felt than explained. Step into the world of Joseph Emotions — where sound, emotion and storytelling meet.</p><button className="text-link" onClick={() => navigate('About')}>DISCOVER THE ARTIST <ArrowUpRight size={15}/></button></div>
              <div className="intro-image reveal">{siteContent.profile?.portrait?.url && <img src={siteContent.profile.portrait.url} alt="Joseph Emotions"/>}<span className="image-caption">THE PERSON BEHIND THE MUSIC</span></div>
            </div>
          </section>

          <section className="music-feature section-pad">
            <div className="section-top reveal"><div><p className="gold-kicker">SOUNDTRACKS TO THE MOMENT</p><h2 className="section-heading">The music<span>.</span></h2></div><button className="text-link" onClick={() => navigate('Music')}>ALL RELEASES <ArrowUpRight size={15}/></button></div>
            <div className="release-grid">{activeReleases.length ? activeReleases.map((release, i) => <button className="release-card reveal" key={release.number} onClick={() => { setSelectedRelease(release); setActivePage('Music'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}><div className="release-art"><img src={release.image} alt=""/><span className="release-play"><Play size={18} fill="currentColor"/></span><span className="release-number">{release.number}</span></div><div className="release-meta"><span>{release.type} · {release.year}</span><ArrowUpRight size={15}/></div><h3>{release.title}</h3><p>{release.description}</p></button>) : <p className="empty-content-note">Music releases will appear here after they are added in Artist Studio.</p>}</div>
          </section>

          <section className="statement-section" >
            <div className="statement-overlay"/>
            <div className="statement-content reveal"><p className="gold-kicker">MORE THAN MUSIC</p><h2>Feel every<br/><em>moment.</em></h2><p>Every note carries a story. Every story carries a feeling.</p><button className="outline-button" onClick={() => navigate('Videos')}>ENTER THE VISUAL WORLD <ArrowUpRight size={15}/></button></div>
          </section>

          <section className="journal-section section-pad">
            <div className="section-top reveal"><div><p className="gold-kicker">NOTES FROM THE JOURNEY</p><h2 className="section-heading">The journal<span>.</span></h2></div><button className="text-link" onClick={() => navigate('Updates')}>ALL UPDATES <ArrowUpRight size={15}/></button></div>
            {siteContent.updates?.length ? <div className="journal-grid"><button className="journal-feature reveal" onClick={() => navigate('Updates')}><img src={siteContent.updates[0].image?.url} alt={siteContent.updates[0].title || 'Artist update'}/><div><span>{siteContent.updates[0].year || 'JOSEPH EMOTIONS'}</span><h3>{siteContent.updates[0].title}</h3><p>{siteContent.updates[0].description}</p></div></button><div className="journal-side">{siteContent.updates.slice(1,3).map((item,index)=><button className="journal-small reveal" key={item.id || index} onClick={() => navigate('Updates')}><img src={item.image?.url} alt={item.title || 'Artist update'}/><span>{item.title || 'LATEST UPDATE'} <ArrowUpRight size={14}/></span></button>)}{siteContent.updates.length===1 && <button className="journal-small reveal" onClick={() => navigate('Gallery')}><span>IN THE STUDIO <ArrowUpRight size={14}/></span></button>}</div></div> : <div className="journal-grid"><button className="journal-feature reveal" onClick={() => navigate('Updates')}><img src={undefined} alt="Live music atmosphere"/><div><span>THE JOURNEY · 2026</span><h3>Every chapter has a sound.</h3><p>Behind the music, beyond the moment.</p></div></button><div className="journal-side"><button className="journal-small reveal" onClick={() => navigate('Gallery')}><img src={undefined} alt="Recording studio"/><span>IN THE STUDIO <ArrowUpRight size={14}/></span></button><button className="journal-small reveal" onClick={() => navigate('Videos')}><span>BEHIND THE VISUALS <ArrowUpRight size={14}/></span></button></div></div>}
          </section>

          <section className="closing-cta"><p className="gold-kicker reveal">STAY CLOSE TO THE MUSIC</p><h2 className="reveal">The story continues<span>.</span></h2><button className="gold-button reveal" onClick={() => navigate('Connect')}>FOLLOW THE JOURNEY <ArrowUpRight size={15}/></button></section>
        </main>
      ) : (
        <PageView page={activePage} navigate={navigate} playing={playing} setPlaying={setPlaying} selectedRelease={selectedRelease} releases={activeReleases} siteContent={siteContent}/>
      )}

      <footer className="site-footer">
        <div className="footer-main"><div><button className="footer-wordmark" onClick={() => navigate('Home')}>JOSEPH<br/><span>EMOTIONS.</span></button><p>Music that moves you.<br/>Stories that stay with you.</p></div><div className="footer-nav"><span className="gold-kicker">EXPLORE</span>{navItems.map(item => <button key={item} onClick={() => navigate(item)}>{item}</button>)}</div><div className="footer-social"><span className="gold-kicker">FOLLOW THE JOURNEY</span><div className="social-icon-row">{[{ name: 'YouTube', url: siteContent.socials?.youtube, icon: 'https://cdn.simpleicons.org/youtube/FF0033' }, { name: 'TikTok', url: siteContent.socials?.tiktok, icon: 'https://cdn.simpleicons.org/tiktok/FFFFFF' }, { name: 'Spotify', url: siteContent.socials?.spotify, icon: 'https://cdn.simpleicons.org/spotify/1ED760' }].map((social, index) => <a key={social.name} className={`social-icon-tile social-float-${index + 1}`} href={social.url || `https://www.${social.name.toLowerCase()}.com`} target="_blank" rel="noreferrer" aria-label={`Joseph Emotions on ${social.name}`} title={social.name}><img src={social.icon} alt="" /></a>)}</div></div></div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} JOSEPH EMOTIONS. ALL RIGHTS RESERVED.</span><span>MADE OF MUSIC & EMOTION.</span><a className="footer-studio-access" href="/studio" aria-label="Open Artist Studio" title="Artist Studio">···</a><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>BACK TO TOP ↑</button></div>
      </footer>

      {selectedRelease && <div className="release-modal" onClick={() => setSelectedRelease(null)}><div className="release-modal-card" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setSelectedRelease(null)}><X/></button><img src={selectedRelease.image} alt=""/><p className="gold-kicker">{selectedRelease.type} · {selectedRelease.year}</p><h2>{selectedRelease.title}</h2><p>{selectedRelease.description}</p><span className="modal-note">Release information and listening links will be managed in the artist studio.</span></div></div>}
    </div>
  )
}

function PageView({ page, navigate, playing, setPlaying, photos, releases, siteContent }) {
  const [filter, setFilter] = useState('ALL')
  const pageData = {
    Music: ['THE SOUND', 'Music', 'Every release is a chapter.'],
    Videos: ['THE VISUALS', 'Videos', 'See the feeling. Hear the story.'],
    Gallery: ['BEHIND THE MOMENTS', 'Gallery', 'A collection of moments along the way.'],
    Updates: ['THE JOURNAL', 'Updates', 'News, notes and moments from the journey.'],
    About: ['THE PERSON. THE PURPOSE.', 'About', 'The story behind Joseph Emotions.'],
    Connect: ['KEEP IN TOUCH', 'Connect', 'Follow the journey. Be part of the story.']
  }
  const data = pageData[page] || pageData.About
  return <main className="inner-page">
    <section className="page-masthead"><p className="gold-kicker">{data[0]}</p><h1>{data[1]}<span>.</span></h1><p>{data[2]}</p><span className="masthead-index">JOSEPH EMOTIONS / 2026</span></section>
    {page === 'Music' && <section className="inner-content section-pad"><div className="music-player"><div className="player-art"><img src={releases[0]?.image || undefined} alt="Featured release artwork"/><span><Disc3 size={38}/></span></div><div className="player-info"><p className="gold-kicker">FEATURED RELEASE</p><h2>{releases[0]?.title || 'Music from Joseph Emotions'}</h2><p>Joseph Emotions · {releases[0]?.type || 'Music'} · {releases[0]?.year || ''}</p>{releases[0]?.audio?.url ? <audio className="release-audio" controls preload="none" src={releases[0].audio.url}/> : releases[0]?.url ? <a className="player-play" href={releases[0].url} target="_blank" rel="noreferrer">LISTEN TO THE RELEASE ↗</a> : <p className="player-status">Audio or listening link will appear here when added in the studio.</p>}</div></div><div className="section-top release-list-title"><div><p className="gold-kicker">DISCOGRAPHY</p><h2 className="section-heading">All releases<span>.</span></h2></div><span className="muted-label">{releases.length} RELEASES</span></div><div className="discography">{releases.map(r => <div className="disc-row" key={r.number}><span>{r.number}</span><img src={r.image || undefined} alt=""/><div><h3>{r.title}</h3><p>{r.type} · {r.year}</p></div>{r.audio?.url ? <audio controls preload="none" src={r.audio.url}/> : r.url ? <a href={r.url} target="_blank" rel="noreferrer" aria-label="Open release link">↗</a> : <span/>}<ArrowUpRight size={17}/></div>)}</div></section>}{page === 'Videos' && <section className="inner-content section-pad">{siteContent.videos?.length ? <div className="video-library">{siteContent.videos.map((item,i) => <article className="video-entry" key={item.id || i}>{item.video?.url ? <video src={item.video.url} controls poster={item.image?.url || ''}/> : <a href={item.url || '#'} target="_blank" rel="noreferrer" className="empty-feature" style={{backgroundImage:`linear-gradient(0deg,#080808 0%,transparent 80%),url(${item.image?.url || ""})`}}><span className="play-large"><Play fill="currentColor"/></span></a>}<p className="gold-kicker">OFFICIAL VISUAL</p><h2>{item.title}</h2><p>{item.description}</p></article>)}</div> : <div className="empty-feature" style={{ backgroundImage: `linear-gradient(0deg,#080808 0%,transparent 80%),none` }}><span className="play-large"><Play fill="currentColor"/></span><div><p className="gold-kicker">FEATURED VISUAL</p><h2>The visual journey</h2><p>Official videos and visual stories will appear here.</p></div></div>}<p className="coming-note">VIDEO LIBRARY</p></section>}
    {page === 'Gallery' && <section className="inner-content section-pad"><div className="filter-row">{['ALL','PORTRAITS','MOMENTS','STUDIO'].map(x => <button className={filter === x ? 'filter active' : 'filter'} key={x} onClick={() => setFilter(x)}>{x}</button>)}</div><div className="gallery-grid">{siteContent.gallery?.length ? siteContent.gallery.filter(item => filter === 'ALL' || (item.category || 'MOMENTS') === filter).map((item,i) => <div className={`gallery-image gallery-image-${i+1}`} key={item.id || i}><img src={item.image?.url} alt={item.title || 'Joseph Emotions gallery photograph'}/><span>{item.title || 'THE JOURNEY'}</span></div>) : null}</div><p className="coming-note">{siteContent.gallery?.length ? 'PHOTOGRAPHY COLLECTION' : 'NO PHOTOS PUBLISHED YET'}</p></section>}
    {page === 'Updates' && <section className="inner-content section-pad">{siteContent.updates?.length ? <div className="updates-list">{siteContent.updates.map((item,i)=><article className="update-card" key={item.id || i}>{item.image?.url && <img src={item.image.url} alt={item.title || 'Artist update'}/>}<div><p className="gold-kicker">{item.year || 'JOSEPH EMOTIONS'}</p><h2>{item.title}</h2><p>{item.description}</p></div></article>)}</div> : <div className="update-card"><div><p className="gold-kicker">THE JOURNEY · 2026</p><h2>Every chapter has a sound.</h2><p>Updates, announcements and stories will be published here from the artist studio.</p><span className="coming-note">LATEST STORY · CONTENT PLACEHOLDER</span></div></div>}</section>}
    {page === 'About' && <section className="inner-content section-pad about-layout">{siteContent.profile?.portrait?.url && <img src={siteContent.profile.portrait.url} alt="Joseph Emotions"/>}<div><p className="gold-kicker">THE STORY SO FAR</p><h2 className="editorial-heading">An artist.<br/><em>A storyteller.</em></h2><p>{siteContent.profile?.biography || 'Joseph Emotions is a creative identity built around music, feeling and the stories that connect us. This space is where the sound, the visuals and the journey come together.'}</p><p className="coming-note">{siteContent.profile?.biography ? 'OFFICIAL BIOGRAPHY' : 'OFFICIAL BIOGRAPHY · READY TO PERSONALIZE'}</p></div></section>}
    {page === 'Connect' && <section className="inner-content section-pad connect-layout"><div><p className="gold-kicker">FIND JOSEPH EMOTIONS</p><h2 className="editorial-heading">Stay in the<br/><em>conversation.</em></h2><p>Follow for new music, visuals, announcements and moments from the journey.</p></div><div className="connect-links">{[['Instagram',siteContent.socials?.instagram],['TikTok',siteContent.socials?.tiktok],['YouTube',siteContent.socials?.youtube],['Spotify',siteContent.socials?.spotify],['Apple Music',siteContent.socials?.appleMusic]].filter(([name,url])=>url).map(([name,url],i)=><a key={name} href={url} target="_blank" rel="noreferrer"><span>0{i+1} / {name}</span><ArrowUpRight size={19}/></a>)}{!Object.values(siteContent.socials || {}).some(Boolean) && <p className="coming-note">SOCIAL DESTINATIONS WILL BE CONFIGURED IN THE ARTIST STUDIO.</p>}</div></section>}
    <section className="page-end-cta"><p className="gold-kicker">THE JOURNEY CONTINUES</p><h2>Stay with the feeling<span>.</span></h2><button className="text-link" onClick={() => navigate('Home')}>BACK TO HOME <ArrowLeft size={15}/></button></section>
  </main>
}

export default App
