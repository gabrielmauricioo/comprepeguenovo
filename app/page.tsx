'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { client, urlFor } from '../sanity/client'

/* ─── TYPES ─── */
interface Product {
  _id: string
  name: string
  desc?: string
  price: number
  oldPrice?: number | null
  imgs?: any[]
  cat?: string
  isNew?: boolean
}

const CATEGORIES = [
  'Todos',
  'Sofás',
  'Camas',
  'Geladeira e Freezer',
  'Eletrodomésticos',
  'Móveis',
  'Decoração',
  'Construção',
  'Fogão e Chapas'
]

const WA_NUMBER = '5545999541641'

/* ─── HELPERS ─── */
function fmt(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function trackWhatsAppLead(productName?: string) {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', 'Lead', {
      content_name: productName || 'Contato Geral WhatsApp',
    })
  }
}

/* ─── ICONS ─── */
const IconSofa = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/>
    <path d="M8 21v-4M16 21v-4M3 12h18"/>
  </svg>
)

const IconArrow = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M7 17L17 7M17 7H7M17 7v10"/>
  </svg>
)

const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
)

const IconWA = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.118 1.52 5.853L.057 23.43a.75.75 0 00.914.914l5.577-1.463A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.944 9.944 0 01-5.09-1.396l-.364-.217-3.773.99.99-3.773-.217-.364A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 5.477 10 10-4.477 10-10 10z"/>
  </svg>
)

/* ─── SCROLL REVEAL HOOK ─── */
function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll('.reveal')
      const obs = new IntersectionObserver(
        entries => {
          entries.forEach(e => {
            if (e.isIntersecting) e.target.classList.add('in')
          })
        },
        { threshold: 0.05 }
      )
      els.forEach(el => obs.observe(el))
      return () => obs.disconnect()
    }, 40)
    return () => clearTimeout(timer)
  }, deps)
}

function MainCatalogContent() {
  const searchParams = useSearchParams()
  const catFromUrl = searchParams.get('cat') // ← LÊ A CATEGORIA DA URL

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [cat, setCat] = useState('Todos')
  const [search, setSearch] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // Ao detectar categoria vinda pela URL (ex: /?cat=Móveis#produtos)
  useEffect(() => {
    if (catFromUrl) {
      setCat(catFromUrl)
      setTimeout(() => {
        const el = document.getElementById('produtos')
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        }
      }, 150)
    }
  }, [catFromUrl])

  useEffect(() => {
    client
      .fetch(`*[_type == "product"] | order(_createdAt desc)`)
      .then(data => {
        setProducts(data || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Erro ao carregar Sanity:', err)
        setLoading(false)
      })
  }, [])

  useReveal([cat, search, products, loading])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchCat = cat === 'Todos' || p.cat?.toLowerCase() === cat.toLowerCase()
      const q = search.trim().toLowerCase()
      const matchQ =
        !q ||
        p.name?.toLowerCase().includes(q) ||
        p.desc?.toLowerCase().includes(q) ||
        p.cat?.toLowerCase().includes(q)
      return matchCat && matchQ
    })
  }, [products, cat, search])

  const generalWhatsAppUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    'Olá! Estive no site da Compre Pegue e gostaria de saber as novidades disponíveis.'
  )}`

  return (
    <>
      {/* ── NAVBAR ── */}
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="navbar-inner">
          <Link href="/" className="nav-logo" aria-label="Página inicial">
            <div className="nav-logo-icon">
              <IconSofa />
            </div>
            <div>
              <div className="nav-logo-text">COMPRE PEGUE</div>
              <div className="nav-logo-sub">Móveis Usados</div>
            </div>
          </Link>

          <div className="nav-links">
            <a href="#produtos" className="nav-link">Catálogo</a>
            <a href="#sobre" className="nav-link">Vantagens</a>
            <a href="#contato" className="nav-link">Contato</a>
            <a
              href={generalWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-wa-btn"
              onClick={() => trackWhatsAppLead('Navbar WhatsApp')}
            >
              <IconWA /> WhatsApp
            </a>
          </div>

          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Alternar Menu"
          >
            <span style={{ transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none' }} />
            <span style={{ opacity: menuOpen ? 0 : 1 }} />
            <span style={{ transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }} />
          </button>
        </div>
      </nav>

      {/* MENU MOBILE */}
      {menuOpen && (
        <div className="nav-mobile-menu">
          <a href="#produtos" className="nav-link" onClick={() => setMenuOpen(false)}>Catálogo</a>
          <a href="#sobre" className="nav-link" onClick={() => setMenuOpen(false)}>Vantagens</a>
          <a href="#contato" className="nav-link" onClick={() => setMenuOpen(false)}>Contato</a>
          <a
            href={generalWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-wa-btn"
            style={{ width: 'fit-content' }}
            onClick={() => {
              trackWhatsAppLead('Menu Mobile WhatsApp')
              setMenuOpen(false)
            }}
          >
            <IconWA /> WhatsApp
          </a>
        </div>
      )}

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-grid" />
        <div className="hero-glow" />

        <div className="hero-inner">
          <div>
            <div className="hero-badge anim-fade-up">
              <span className="hero-badge-dot" />
              Foz do Iguaçu — PR
            </div>
            <h1 className="hero-title anim-fade-up d2">
              Móveis que<br />contam <em>histórias</em>
            </h1>
            <p className="hero-sub anim-fade-up d3">
              Sofás, eletrodomésticos e utilidades seminovas com procedência, preços acessíveis e prontos para levar.
            </p>
            <div className="hero-btns anim-fade-up d4">
              <a href="#produtos" className="btn-primary">
                Ver catálogo <IconArrow />
              </a>
              <a
                href={generalWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
                onClick={() => trackWhatsAppLead('Hero WhatsApp')}
              >
                Falar no WhatsApp
              </a>
            </div>
            <div className="hero-stats anim-fade-up d5">
              <div className="hero-stat">
                <div className="hero-stat-num">500+</div>
                <div className="hero-stat-lbl">Famílias Atendidas</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-num">Até 70%</div>
                <div className="hero-stat-lbl">De Economia</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-num">100%</div>
                <div className="hero-stat-lbl">Revisados</div>
              </div>
            </div>
          </div>

          <div className="hero-visual anim-slide-l d2">
            <div className="hero-visual-box">
              <div className="hero-visual-emoji float-a">🛋️</div>
              <div className="hero-visual-title">Estoque Renovado</div>
              <div className="hero-visual-sub">Novas oportunidades toda semana</div>

              <div className="hero-card hero-card-top float-b">
                <div className="hero-card-label">Novidade</div>
                <div className="hero-card-name">Sofá Retrátil & Reclinável</div>
                <div className="hero-card-price">Pronta entrega</div>
              </div>

              <div className="hero-card hero-card-bottom float-a">
                <div className="hero-card-label">Destaque</div>
                <div className="hero-card-name">Geladeiras e Eletros</div>
                <div className="hero-card-price">Testados e revisados</div>
              </div>
            </div>
          </div>
        </div>

        <div className="scroll-indicator">
          <div className="scroll-label">Explorar Catálogo</div>
          <div className="scroll-line" />
        </div>
      </section>

      {/* ── VANTAGENS ── */}
      <section className="features-section" id="sobre">
        <div className="features-inner">
          {[
            { icon: '♻️', title: 'Sustentabilidade', desc: 'Dê vida nova a peças em ótimo estado e diminua o descarte.' },
            { icon: '💰', title: 'Economia Real', desc: 'Preços até 70% mais baratos do que em grandes lojas de varejo.' },
            { icon: '🔍', title: 'Curadoria Cuidadosa', desc: 'Todos os móveis e eletros são higienizados e inspecionados.' },
            { icon: '📍', title: 'Fácil Retirada', desc: 'Retire no local em Foz ou combine entrega expressa.' },
          ].map((f, i) => (
            <div key={i} className="feature-card reveal">
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATÁLOGO ── */}
      <section className="catalog-section" id="produtos">
        <div className="catalog-inner">
          <div className="catalog-top">
            <div className="reveal">
              <div className="section-eyebrow">— Estoque em Tempo Real</div>
              <h2 className="section-title">Nossos <em>Móveis & Itens</em></h2>
            </div>
            <div className="search-wrap reveal">
              <span className="search-icon"><IconSearch /></span>
              <input
                className="search-input"
                type="text"
                placeholder="Buscar por sofá, mesa, cama..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#999',
                    fontSize: '0.85rem',
                  }}
                  title="Limpar busca"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Filtro por categoria */}
          <div className="filter-bar reveal">
            {CATEGORIES.map(c => {
              const count =
                c === 'Todos'
                  ? products.length
                  : products.filter(p => p.cat?.toLowerCase() === c.toLowerCase()).length

              return (
                <button
                  key={c}
                  className={`filter-btn${cat.toLowerCase() === c.toLowerCase() ? ' active' : ''}`}
                  onClick={() => setCat(c)}
                >
                  {c}
                  {!loading && (
                    <span style={{ marginLeft: 6, opacity: 0.65, fontSize: '.72rem' }}>
                      ({count})
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Grade de Produtos */}
          {loading ? (
            <div className="product-grid">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="product-skeleton" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state reveal in">
              <div className="empty-state-icon">🔎</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: 8 }}>Nenhum item encontrado</h3>
              <p>Tente ajustar a busca ou escolher outra categoria acima.</p>
              <button
                onClick={() => {
                  setCat('Todos')
                  setSearch('')
                }}
                className="btn-outline"
                style={{ marginTop: 18, color: 'var(--ink)', borderColor: 'var(--ink-4)' }}
              >
                Limpar todos os filtros
              </button>
            </div>
          ) : (
            <div className="product-grid">
              {filtered.map((p, i) => (
                <Link
                  key={p._id}
                  href={`/produto/${p._id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <article className="product-card product-card-anim" style={{ animationDelay: `${(i % 8) * 0.05}s` }}>
                    <div className="product-img-wrap">
                      <img
                        src={
                          p.imgs && p.imgs[0]
                            ? urlFor(p.imgs[0]).width(640).height(480).url()
                            : `https://placehold.co/640x480/e8f8e8/1a5c1a?text=${encodeURIComponent(p.name || 'Sem Foto')}`
                        }
                        alt={p.name}
                        loading="lazy"
                      />
                      {p.isNew && <span className="badge-new">Seminovo Top</span>}
                      {p.oldPrice && p.oldPrice > p.price && (
                        <span className="badge-sale">Promoção</span>
                      )}
                    </div>
                    <div className="product-body">
                      <div className="product-cat">{p.cat || 'Geral'}</div>
                      <div className="product-name">{p.name}</div>
                      <div className="product-desc">{p.desc || 'Consulte mais especificações no WhatsApp.'}</div>
                      <div className="product-price-row">
                        <span className="product-price">{fmt(p.price)}</span>
                        {p.oldPrice && p.oldPrice > p.price && (
                          <span className="product-price-old">{fmt(p.oldPrice)}</span>
                        )}
                      </div>
                      <span className="product-btn">Ver Fotos & Detalhes →</span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section" id="contato">
        <div className="cta-inner">
          <div className="hero-badge reveal" style={{ margin: '0 auto 24px', width: 'fit-content' }}>
            <span className="hero-badge-dot" />
            Atendimento Rápido
          </div>
          <h2 className="cta-title reveal">
            Quer negociar ou tem<br />dúvidas sobre <em>alguma peça?</em>
          </h2>
          <p className="cta-sub reveal">
            Nosso estoque gira diariamente! Fale conosco no WhatsApp para reservar a peça ou agendar sua visita.
          </p>
          <a
            className="cta-wa-btn reveal"
            href={generalWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppLead('CTA Principal Fim de Página')}
          >
            <IconWA /> Chamar no WhatsApp
          </a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-grid">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div className="nav-logo-icon" style={{ width: 34, height: 34 }}>
                  <IconSofa />
                </div>
                <div>
                  <div className="nav-logo-text" style={{ fontSize: '.95rem' }}>COMPRE PEGUE</div>
                  <div className="nav-logo-sub">Móveis Usados</div>
                </div>
              </div>
              <p className="footer-text">
                O seu ponto de encontro para mobiliar a casa com inteligência e bom gosto em Foz do Iguaçu.
              </p>
            </div>

            <div>
              <div className="footer-col-title">Categorias</div>
              {CATEGORIES.filter(c => c !== 'Todos').map(c => (
                <button
                  key={c}
                  className="footer-link"
                  onClick={() => {
                    setCat(c)
                    document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  {c}
                </button>
              ))}
            </div>

            <div>
              <div className="footer-col-title">Localização & Contato</div>
              <p className="footer-text" style={{ marginBottom: 8 }}>📍 Foz do Iguaçu — Paraná</p>
              <a
                href={generalWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
                onClick={() => trackWhatsAppLead('Footer WhatsApp')}
              >
                📱 WhatsApp: (45) 99954-1641
              </a>
            </div>
          </div>

          <div className="footer-bottom">
            <span className="footer-copy">© {new Date().getFullYear()} Compre Pegue. Todos os direitos reservados.</span>
            <span className="footer-copy">Foz do Iguaçu, PR 🌿</span>
          </div>
        </div>
      </footer>

      {/* FLOAT WHATSAPP */}
      <a
        href={generalWhatsAppUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="wa-float"
        aria-label="Falar no WhatsApp"
        onClick={() => trackWhatsAppLead('Botão Flutuante Home')}
      >
        <IconWA />
      </a>
    </>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--cream)' }} />}>
      <MainCatalogContent />
    </Suspense>
  )
}