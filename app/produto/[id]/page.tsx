'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { client, urlFor } from '../../../sanity/client' // ← Importando o Sanity

/* ─── TYPES ─── */
interface Product {
  _id: string
  name: string
  desc: string
  price: number
  oldPrice: number | null
  imgs: any[] // array de imagens do Sanity
  cat: string
  details?: string[]
}

const WA_NUMBER = '+5545999541641' // ← TROQUE PELO SEU NÚMERO

/* ─── HELPERS ─── */
function fmt(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
function imgFallback(name: string) {
  return `https://placehold.co/600x450/e8f8e8/1a5c1a?text=${encodeURIComponent(name || 'Foto')}`
}

/* ─── ICONS ─── */
const IconSofa = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><path d="M8 21v-4M16 21v-4M3 12h18"/>
  </svg>
)
const IconWA = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.118 1.52 5.853L.057 23.43a.75.75 0 00.914.914l5.577-1.463A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.944 9.944 0 01-5.09-1.396l-.364-.217-3.773.99.99-3.773-.217-.364A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 5.477 10 10-4.477 10-10 10z"/>
  </svg>
)
const IconChevL = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
)
const IconChevR = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
)
const IconClose = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
)
const IconExpand = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 3h6m0 0v6m0-6l-7 7M9 21H3m0 0v-6m0 6l7-7"/></svg>
)

/* ─── LIGHTBOX ─── */
function Lightbox({ imgs, current, onClose, onPrev, onNext }: {
  imgs: any[], current: number
  onClose: () => void, onPrev: () => void, onNext: () => void
}) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape')      onClose()
      if (e.key === 'ArrowLeft')  onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', fn)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', fn); document.body.style.overflow = '' }
  }, [onClose, onPrev, onNext])

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,.93)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'lbFadeIn .18s ease',
    }}>
      <div style={{ position: 'absolute', top: 22, left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,.45)', fontSize: '.8rem', letterSpacing: '.12em' }}>
        {current + 1} / {imgs.length}
      </div>

      <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,.1)', border: 'none', color: '#fff', width: 46, height: 46, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}>
        <IconClose />
      </button>

      {imgs.length > 1 && (
        <button onClick={e => { e.stopPropagation(); onPrev() }} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,.12)', border: 'none', color: '#fff', width: 52, height: 52, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <IconChevL />
        </button>
      )}

      <div onClick={e => e.stopPropagation()} style={{ maxWidth: '88vw', maxHeight: '82vh' }}>
        <img
          src={urlFor(imgs[current]).url()}
          alt={`Foto ${current + 1}`}
          onError={e => { (e.target as HTMLImageElement).src = imgFallback('Foto') }}
          style={{ maxWidth: '88vw', maxHeight: '82vh', objectFit: 'contain', borderRadius: 8, userSelect: 'none', display: 'block' }}
        />
      </div>

      {imgs.length > 1 && (
        <button onClick={e => { e.stopPropagation(); onNext() }} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,.12)', border: 'none', color: '#fff', width: 52, height: 52, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <IconChevR />
        </button>
      )}

      {imgs.length > 1 && (
        <div style={{ position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8 }}>
          {imgs.map((img, i) => (
            <button key={i} onClick={e => { e.stopPropagation(); onClose(); /* To jump to photo inside gallery maybe? We skip logic here for simplicity */ }} style={{ width: 54, height: 42, borderRadius: 6, overflow: 'hidden', border: `2px solid ${i === current ? '#5cc45c' : 'rgba(255,255,255,.2)'}`, cursor: 'default', padding: 0, opacity: i === current ? 1 : 0.45, transition: 'all .2s' }}>
              <img src={urlFor(img).width(100).url()} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── GALLERY ─── */
function Gallery({ imgs = [], productName }: { imgs: any[], productName: string }) {
  const [active, setActive]         = useState(0)
  const [lightbox, setLightbox]     = useState(false)
  const [lbIdx, setLbIdx]           = useState(0)

  const openLb  = (i: number) => { setLbIdx(i); setLightbox(true) }
  const closeLb = useCallback(() => setLightbox(false), [])
  const prevLb  = useCallback(() => setLbIdx(i => (i - 1 + imgs.length) % imgs.length), [imgs.length])
  const nextLb  = useCallback(() => setLbIdx(i => (i + 1) % imgs.length), [imgs.length])

  const prevActive = () => setActive(i => (i - 1 + imgs.length) % imgs.length)
  const nextActive = () => setActive(i => (i + 1) % imgs.length)

  if (!imgs.length) return <div style={{ background: '#ddd', aspectRatio: '4/3', borderRadius: 12 }}>Sem Foto</div>

  return (
    <>
      <div style={{ position: 'relative', marginBottom: 10 }}>
        <div
          onClick={() => openLb(active)}
          style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', aspectRatio: '4/3', cursor: 'zoom-in', position: 'relative' }}
        >
          <img
            key={active}
            src={urlFor(imgs[active]).width(800).url()}
            alt={productName}
            onError={e => { (e.target as HTMLImageElement).src = imgFallback(productName) }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', animation: 'imgFade .25s ease' }}
          />
          <div style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(0,0,0,.48)', color: '#fff', padding: '6px 11px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 6, fontSize: '.72rem', fontWeight: 500, backdropFilter: 'blur(4px)' }}>
            <IconExpand /> Ampliar foto
          </div>
          {imgs.length > 1 && (
            <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(0,0,0,.48)', color: '#fff', padding: '4px 11px', borderRadius: 20, fontSize: '.68rem', fontWeight: 600, backdropFilter: 'blur(4px)', letterSpacing: '.05em' }}>
              📷 {active + 1} / {imgs.length}
            </div>
          )}
          {imgs.length > 1 && (<>
            <button onClick={e => { e.stopPropagation(); prevActive() }} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,.88)', border: 'none', color: '#0d1a0d', width: 38, height: 38, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,.15)' }}>
              <IconChevL />
            </button>
            <button onClick={e => { e.stopPropagation(); nextActive() }} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,.88)', border: 'none', color: '#0d1a0d', width: 38, height: 38, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,.15)' }}>
              <IconChevR />
            </button>
          </>)}
        </div>
      </div>

      {imgs.length > 1 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          {imgs.map((img, i) => (
            <button key={i} onClick={() => setActive(i)} style={{ width: 72, height: 56, borderRadius: 7, overflow: 'hidden', border: `2px solid ${i === active ? '#2d7a2d' : 'rgba(0,0,0,.08)'}`, cursor: 'pointer', padding: 0, background: 'none', opacity: i === active ? 1 : 0.55, transition: 'all .2s', boxShadow: i === active ? '0 0 0 3px rgba(45,122,45,.2)' : 'none', flexShrink: 0 }}>
              <img src={urlFor(img).width(150).url()} alt={`Foto ${i + 1}`} onError={e => { (e.target as HTMLImageElement).src = imgFallback('') }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>
          ))}
          <button onClick={() => openLb(active)} style={{ width: 72, height: 56, borderRadius: 7, border: '2px dashed rgba(45,122,45,.35)', background: 'rgba(45,122,45,.06)', color: '#2d7a2d', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, fontSize: '.58rem', fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase', flexShrink: 0 }}>
            <IconExpand />
            Ampliar
          </button>
        </div>
      )}
      {lightbox && <Lightbox imgs={imgs} current={lbIdx} onClose={closeLb} onPrev={prevLb} onNext={nextLb} />}
    </>
  )
}

/* ─── PAGE ─── */
export default function ProductPage() {
  const params = useParams()
  const id = params.id as string // ID agora é a string que vem do Sanity
  
  const [p, setP] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  // Busca apenas O produto clicado
  useEffect(() => {
    if (id) {
      client.fetch(`*[_type == "product" && _id == $id][0]`, { id }).then(data => {
        setP(data)
        setLoading(false)
      })
    }
  }, [id])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)' }}>
        <p>Carregando detalhes do produto...</p>
      </div>
    )
  }

  if (!p) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20, background: 'var(--cream)' }}>
        <div style={{ fontSize: '4rem' }}>😕</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', color: 'var(--ink)' }}>Produto não encontrado</h2>
        <p style={{ color: 'var(--ink-3)', fontSize: '.95rem' }}>Este produto pode ter sido vendido ou removido.</p>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--g800)', color: '#fff', padding: '12px 24px', borderRadius: 6, fontWeight: 500, marginTop: 8 }}>
          ← Voltar ao catálogo
        </Link>
      </div>
    )
  }

  const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : null
  const waMsg = `Olá! Tenho interesse no produto: *${p.name}* (${fmt(p.price)}). Vi no site da Compre Pegue!`

  return (
    <div className="detail-page">

      {/* NAV */}
      <div className="detail-nav">
        <Link href="/" className="nav-logo" style={{ textDecoration: 'none' }}>
          <div className="nav-logo-icon" style={{ width: 32, height: 32 }}><IconSofa /></div>
          <div>
            <div className="nav-logo-text" style={{ fontSize: '.95rem' }}>COMPRE PEGUE</div>
            <div className="nav-logo-sub">Móveis Usados</div>
          </div>
        </Link>
        <Link href="/" className="detail-back">← Voltar ao catálogo</Link>
      </div>

      {/* BREADCRUMB */}
      <div style={{ background: 'var(--white)', borderBottom: '1px solid rgba(0,0,0,.06)', padding: '12px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 8, fontSize: '.78rem', color: 'var(--ink-4)' }}>
          <Link href="/" style={{ color: 'var(--ink-4)', textDecoration: 'none' }}>Início</Link>
          <span>/</span><span style={{ color: 'var(--g400)' }}>{p.cat}</span>
          <span>/</span><span style={{ color: 'var(--ink-2)' }}>{p.name}</span>
        </div>
      </div>

      {/* BODY */}
      <div className="detail-body">
        {/* LEFT — GALLERY */}
        <div>
          <Gallery imgs={p.imgs || []} productName={p.name} />
          {discount && (
            <div style={{ marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 7, background: '#fef0ef', border: '1px solid #f5c6c2', color: '#c0392b', padding: '8px 16px', borderRadius: 6, fontSize: '.82rem', fontWeight: 600 }}>
              🏷️ {discount}% de desconto — economize {fmt(p.oldPrice! - p.price)}
            </div>
          )}
        </div>

        {/* RIGHT — INFO */}
        <div>
          <div className="detail-cat">{p.cat}</div>
          <h1 className="detail-title">{p.name}</h1>
          <p className="detail-desc">{p.desc}</p>

          {p.details && p.details.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: '.72rem', textTransform: 'uppercase', letterSpacing: '.14em', color: 'var(--ink-4)', fontWeight: 600, marginBottom: 10 }}>Detalhes do produto</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {p.details.map((d, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: '.88rem', color: 'var(--ink-2)' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--g300)', flexShrink: 0 }} />{d}
                  </div>
                ))}
              </div>
            </div>
          )}

          {p.imgs && p.imgs.length > 1 && (
            <div style={{ marginBottom: 20, padding: '10px 14px', background: 'rgba(45,122,45,.06)', borderRadius: 7, border: '1px solid rgba(45,122,45,.15)', fontSize: '.8rem', color: 'var(--g500)', display: 'flex', alignItems: 'center', gap: 7 }}>
              📷 <strong>{p.imgs.length} fotos</strong> disponíveis — clique para ampliar
            </div>
          )}

          <div style={{ marginBottom: 4 }}>
            <div className="detail-price">{fmt(p.price)}</div>
            {p.oldPrice && <div className="detail-price-old">De: {fmt(p.oldPrice)}</div>}
          </div>

          <div className="detail-actions">
            <a href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waMsg)}`} target="_blank" rel="noopener noreferrer" className="detail-wa-btn">
              <IconWA /> Tenho interesse! Chamar no WhatsApp
            </a>
            <Link href="/" className="detail-back-btn">← Ver mais produtos</Link>
          </div>

          <div className="detail-info-box">
            <p>📍 Retirada em Foz do Iguaçu — PR</p>
            <p>Consulte disponibilidade de entrega pelo WhatsApp</p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ background: 'var(--g900)', padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <span style={{ fontSize: '.72rem', color: 'rgba(255,255,255,.25)' }}>© {new Date().getFullYear()} Compre Pegue. Todos os direitos reservados.</span>
        <Link href="/" style={{ fontSize: '.72rem', color: 'var(--g200)' }}>← Voltar ao catálogo</Link>
      </div>

      {/* FLOAT WA */}
      <a href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waMsg)}`} target="_blank" rel="noopener noreferrer" className="wa-float" aria-label="WhatsApp">
        <IconWA />
      </a>

      <style>{`
        @keyframes lbFadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes imgFade  { from { opacity:0 } to { opacity:1 } }
        @media (max-width: 768px) {
          .detail-body { padding: 32px 20px !important; gap: 28px !important; }
          .detail-nav  { padding: 0 20px !important; }
        }
      `}</style>
    </div>
  )
}