'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { client, urlFor } from '../../../sanity/client'

interface Product {
  _id: string
  name: string
  desc?: string
  price: number
  oldPrice?: number | null
  imgs?: any[]
  cat?: string
  details?: string[]
}

const WA_NUMBER = '5545999541641'

function fmt(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function imgFallback(name: string) {
  return `https://placehold.co/800x600/e8f8e8/1a5c1a?text=${encodeURIComponent(name || 'Sem Foto')}`
}

/* ─── ÍCONES ─── */
const IconBackArrow = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
)

const IconSofa = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><path d="M8 21v-4M16 21v-4M3 12h18"/>
  </svg>
)

const IconWA = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.118 1.52 5.853L.057 23.43a.75.75 0 00.914.914l5.577-1.463A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.944 9.944 0 01-5.09-1.396l-.364-.217-3.773.99.99-3.773-.217-.364A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 5.477 10 10-4.477 10-10 10z"/>
  </svg>
)

const IconShare = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
)
const IconChevL = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M15 18l-6-6 6-6"/></svg>
)
const IconChevR = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M9 18l6-6-6-6"/></svg>
)
const IconClose = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
)

/* ─── LIGHTBOX (AMPLIAÇÃO) ─── */
function Lightbox({ imgs, current, onClose, onPrev, onNext }: {
  imgs: any[]; current: number; onClose: () => void; onPrev: () => void; onNext: () => void
}) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', fn)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', fn)
      document.body.style.overflow = ''
    }
  }, [onClose, onPrev, onNext])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(0,0,0,.94)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ position: 'absolute', top: 20, color: 'rgba(255,255,255,.7)', fontSize: '.85rem' }}>
        {current + 1} de {imgs.length}
      </div>

      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          background: 'rgba(255,255,255,.15)',
          color: '#fff',
          borderRadius: '50%',
          width: 44,
          height: 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <IconClose />
      </button>

      {imgs.length > 1 && (
        <button
          onClick={e => { e.stopPropagation(); onPrev() }}
          style={{
            position: 'absolute',
            left: 16,
            background: 'rgba(255,255,255,.2)',
            color: '#fff',
            width: 48,
            height: 48,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <IconChevL />
        </button>
      )}

      <img
        src={urlFor(imgs[current]).url()}
        alt="Foto detalhada"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '90vw', maxHeight: '82vh', objectFit: 'contain', borderRadius: 8 }}
      />

      {imgs.length > 1 && (
        <button
          onClick={e => { e.stopPropagation(); onNext() }}
          style={{
            position: 'absolute',
            right: 16,
            background: 'rgba(255,255,255,.2)',
            color: '#fff',
            width: 48,
            height: 48,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <IconChevR />
        </button>
      )}
    </div>
  )
}

/* ─── GALERIA ─── */
function Gallery({ imgs = [], productName }: { imgs: any[]; productName: string }) {
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  const openLb = (i: number) => { setActive(i); setLightbox(true) }
  const closeLb = useCallback(() => setLightbox(false), [])
  const prev = useCallback(() => setActive(i => (i - 1 + imgs.length) % imgs.length), [imgs.length])
  const next = useCallback(() => setActive(i => (i + 1) % imgs.length), [imgs.length])

  return (
    <>
      <div style={{ position: 'relative', marginBottom: 12 }}>
        <div
          onClick={() => imgs.length > 0 && openLb(active)}
          style={{
            background: '#fff',
            borderRadius: 12,
            overflow: 'hidden',
            aspectRatio: '4/3',
            cursor: imgs.length ? 'zoom-in' : 'default',
            position: 'relative',
          }}
        >
          <img
            src={
              imgs.length && imgs[active]
                ? urlFor(imgs[active]).width(800).height(600).url()
                : imgFallback(productName)
            }
            alt={productName}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {imgs.length > 0 && (
            <div
              style={{
                position: 'absolute',
                bottom: 12,
                right: 12,
                background: 'rgba(0,0,0,.65)',
                color: '#fff',
                padding: '6px 12px',
                borderRadius: 20,
                fontSize: '.75rem',
                backdropFilter: 'blur(4px)',
              }}
            >
              🔍 Ampliar foto
            </div>
          )}

          {imgs.length > 1 && (
            <>
              <button
                type="button"
                onClick={e => { e.stopPropagation(); prev() }}
                style={{
                  position: 'absolute',
                  left: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,.9)',
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,.15)',
                  cursor: 'pointer',
                }}
              >
                <IconChevL />
              </button>
              <button
                type="button"
                onClick={e => { e.stopPropagation(); next() }}
                style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,.9)',
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,.15)',
                  cursor: 'pointer',
                }}
              >
                <IconChevR />
              </button>
            </>
          )}
        </div>
      </div>

      {imgs.length > 1 && (
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 6 }}>
          {imgs.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              style={{
                width: 72,
                height: 56,
                borderRadius: 8,
                overflow: 'hidden',
                border: `2px solid ${i === active ? 'var(--g400)' : 'transparent'}`,
                padding: 0,
                flexShrink: 0,
                opacity: i === active ? 1 : 0.6,
                cursor: 'pointer',
              }}
            >
              <img
                src={urlFor(img).width(140).height(100).url()}
                alt={`Miniatura ${i + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <Lightbox
          imgs={imgs}
          current={active}
          onClose={closeLb}
          onPrev={prev}
          onNext={next}
        />
      )}
    </>
  )
}


/* ─── PÁGINA PRINCIPAL DO PRODUTO ─── */
export default function ProductPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const [p, setP] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (id) {
      client
        .fetch(`*[_type == "product" && _id == $id][0]`, { id })
        .then(data => {
          setP(data)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [id])

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: p?.name,
          text: `Confira ${p?.name} na Compre Pegue!`,
          url: window.location.href,
        })
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const trackWhatsApp = () => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      ;(window as any).fbq('track', 'Lead', {
        content_name: p?.name,
        value: p?.price,
        currency: 'BRL',
      })
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)' }}>
        <p style={{ color: 'var(--ink-3)', fontSize: '1.1rem' }}>Carregando produto...</p>
      </div>
    )
  }

  if (!p) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, background: 'var(--cream)', padding: 20, textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem' }}>Produto não encontrado</h2>
        <p style={{ color: 'var(--ink-3)' }}>Este item pode já ter sido vendido ou removido do catálogo.</p>
        <Link href="/" className="btn-primary" style={{ marginTop: 12 }}>
          <IconBackArrow /> Voltar para o Catálogo
        </Link>
      </div>
    )
  }

  const discount = p.oldPrice && p.oldPrice > p.price ? Math.round((1 - p.price / p.oldPrice) * 100) : null
  const waMsg = `Olá! Vi o produto "${p.name}" (${fmt(p.price)}) no site da Compre Pegue e gostaria de saber se ainda está disponível.`
  const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waMsg)}`

  return (
    <div className="detail-page">
      {/* ── BARRA SUPERIOR COM BOTÃO DE VOLTAR BEM VISÍVEL ── */}
      <header className="detail-top-nav">
        <button
          type="button"
          onClick={() => router.push('/')}
          className="btn-back-header"
          aria-label="Voltar para a página inicial"
        >
          <IconBackArrow />
          <span>Voltar ao Catálogo</span>
        </button>

        <Link href="/" className="nav-logo" title="Ir para a página inicial">
          <div className="nav-logo-icon" style={{ width: 34, height: 34 }}>
            <IconSofa />
          </div>
          <div>
            <div className="nav-logo-text">COMPRE PEGUE</div>
            <div className="nav-logo-sub">Móveis Usados</div>
          </div>
        </Link>
      </header>

      {/* ── BREADCRUMB (TRILHA DE NAVEGAÇÃO CLICÁVEL) ── */}
      <nav className="detail-breadcrumb" aria-label="Trilha de navegação">
        <Link href="/">Início</Link>
        <span>/</span>
        <Link 
          href={`/?cat=${encodeURIComponent(p.cat || 'Todos')}#produtos`}
          className="breadcrumb-cat"
          title={`Ver todos os produtos de ${p.cat}`}
        >
          {p.cat || 'Móveis'}
        </Link>
        <span>/</span>
        <span className="current">{p.name}</span>
      </nav>

      {/* ── CORPO DO PRODUTO ── */}
      <main className="detail-body">
        <div>
          <Gallery imgs={p.imgs || []} productName={p.name} />

          {discount && (
            <div
              style={{
                marginTop: 16,
                padding: '10px 14px',
                background: '#fef0ef',
                border: '1px solid #f5c6c2',
                color: '#c0392b',
                borderRadius: 8,
                fontSize: '.85rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              🏷️ Economia de {discount}% em relação ao valor original!
            </div>
          )}
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span className="detail-cat">{p.cat || 'Móveis'}</span>
            <button
              type="button"
              onClick={handleShare}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '.8rem',
                color: 'var(--ink-3)',
                padding: '6px 12px',
                borderRadius: 6,
                background: 'var(--cream-2)',
                border: '1px solid rgba(0,0,0,.08)',
                cursor: 'pointer',
              }}
            >
              <IconShare /> {copied ? 'Copiado!' : 'Compartilhar'}
            </button>
          </div>

          <h1 className="detail-title">{p.name}</h1>
          <p className="detail-desc">{p.desc || 'Peça única com ótimo estado de conservação.'}</p>

          {p.details && p.details.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: '.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--ink-4)', marginBottom: 8 }}>
                Informações e Medidas:
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {p.details.map((item, idx) => (
                  <li key={idx} style={{ fontSize: '.88rem', color: 'var(--ink-2)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--g400)' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ margin: '24px 0' }}>
            <div className="detail-price">{fmt(p.price)}</div>
            {p.oldPrice && p.oldPrice > p.price && (
              <div className="detail-price-old">De: {fmt(p.oldPrice)}</div>
            )}
          </div>

          <div className="detail-actions">
            {/* BOTÃO PRINCIPAL WHATSAPP */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="detail-wa-btn"
              onClick={trackWhatsApp}
            >
              <IconWA /> Quero Este! Falar no WhatsApp
            </a>

            {/* BOTÃO DE VOLTAR GRANDE E DESTACADO ABAIXO DO WHATSAPP */}
            <Link href="/" className="detail-back-main-btn">
              <IconBackArrow /> Voltar para o Catálogo de Produtos
            </Link>
          </div>

          <div className="detail-info-box">
            <p>📍 <strong>Retirada facilitada:</strong> Foz do Iguaçu — PR</p>
            <p>🚚 Consulte com nosso atendente opção de frete/entrega.</p>
          </div>
        </div>
      </main>

      {/* WHATSAPP FLUTUANTE */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="wa-float"
        aria-label="WhatsApp"
        onClick={trackWhatsApp}
      >
        <IconWA />
      </a>
    </div>
  )
}