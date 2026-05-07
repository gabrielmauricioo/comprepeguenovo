'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

/* ─── TYPES ─── */
interface Product {
  id: number
  name: string
  desc: string
  price: number
  oldPrice: number | null
  img: string
  cat: string
  isNew: boolean
}

/* ─── DATA ─── */
const CATEGORIES = ['Todos', 'Camas', 'Eletrodomésticos', 'Construção', 'Móveis', 'Decoração', 'Poltronas']

const PRODUCTS: Product[] = [
  { id: 115, name: 'Cama Solteiro Premium',          desc: 'Referência em qualidade',            price: 550,    oldPrice: null, img: 'cama1.jpeg',        cat: 'Camas', isNew: false  },

  { id: 116, name: 'Cama Queen Completa',          desc: 'Conforto para sua casa',            price: 850,    oldPrice: 1200, img: 'camaqueen.jpeg',        cat: 'Camas', isNew: true  },
  
  { id: 117, name: 'Cama Queen Bege Completa',          desc: 'Conforto para sua casa',            price: 850,    oldPrice: 1200, img: 'queen.jpeg',        cat: 'Camas', isNew: true  },

  { id: 118, name: 'Vaso Sanitário Completo',          desc: 'Fácil instalação',            price: 299,    oldPrice: null, img: 'vaso.jpeg',        cat: 'Construção', isNew: true },

  { id: 119, name: 'Par de Poltronas Bege',          desc: 'Duas unidades',            price: 499,    oldPrice: 600, img: 'poltrona.jpeg',        cat: 'Poltronas', isNew: false },

  { id: 120, name: 'Máquina de Lavar Consul 10kg',          desc: 'Capacidade de 10kg',            price: 499,    oldPrice: null, img: 'maquina.jpeg',        cat: 'Eletrodomésticos', isNew: false },
]

const WA_NUMBER = '5545999541641' // ← TROQUE PELO SEU NÚMERO

/* ─── HELPERS ─── */
function fmt(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function imgSrc(filename: string) {
  // Busca direto da pasta /public do projeto
  return `/${filename}`
}

/* ─── ICONS ─── */
const IconSofa = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
    // pequeno delay para garantir que o DOM atualizou
    const timer = setTimeout(() => {
      const els = document.querySelectorAll('.reveal')
      const obs = new IntersectionObserver(
        entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in') }),
        { threshold: 0.05 }
      )
      els.forEach(el => {
        // se já está visível, não precisa re-observar
        if (!el.classList.contains('in')) obs.observe(el)
      })
      return () => obs.disconnect()
    }, 30)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

/* ─── COMPONENT ─── */
export default function Home() {
  const [cat, setCat]       = useState('Todos')
  const [search, setSearch] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useReveal([cat, search])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const filtered = PRODUCTS.filter(p => {
    const matchCat = cat === 'Todos' || p.cat === cat
    const q = search.toLowerCase()
    const matchQ = !q || p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q)
    return matchCat && matchQ
  })

  return (
    <>
      {/* ── NAVBAR ── */}
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="navbar-inner">
          <Link href="/" className="nav-logo">
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
            <a href="#sobre"    className="nav-link">Sobre</a>
            <a href="#contato"  className="nav-link">Contato</a>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=Olá! Vi o site e gostaria de mais informações.`}
              target="_blank" rel="noopener noreferrer"
              className="nav-wa-btn"
            >
              <IconWA /> WhatsApp
            </a>
          </div>

          <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span style={{ transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none' }} />
            <span style={{ opacity: menuOpen ? 0 : 1 }} />
            <span style={{ transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }} />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="nav-mobile-menu">
          <a href="#produtos" className="nav-link" onClick={() => setMenuOpen(false)}>Catálogo</a>
          <a href="#sobre"    className="nav-link" onClick={() => setMenuOpen(false)}>Sobre</a>
          <a href="#contato"  className="nav-link" onClick={() => setMenuOpen(false)}>Contato</a>
          <a
            href={`https://wa.me/${WA_NUMBER}`}
            target="_blank" rel="noopener noreferrer"
            className="nav-wa-btn" style={{ width: 'fit-content' }}
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
          {/* left col */}
          <div>
            <div className="hero-badge anim-fade-up">
              <span className="hero-badge-dot" />
              Foz do Iguaçu — PR
            </div>

            <h1 className="hero-title anim-fade-up d2">
              Móveis que<br />contam <em>histórias</em>
            </h1>

            <p className="hero-sub anim-fade-up d3">
              Sofás, eletrodomésticos e muito mais com preços justos e qualidade garantida. Sustentabilidade começa em casa.
            </p>

            <div className="hero-btns anim-fade-up d4">
              <a href="#produtos" className="btn-primary">
                Ver catálogo <IconArrow />
              </a>
              <a
                href={`https://wa.me/${WA_NUMBER}?text=Olá! Gostaria de ver os produtos disponíveis.`}
                target="_blank" rel="noopener noreferrer"
                className="btn-outline"
              >
                Falar no WhatsApp
              </a>
            </div>

            <div className="hero-stats anim-fade-up d5">
              <div className="hero-stat">
                <div className="hero-stat-num">500+</div>
                <div className="hero-stat-lbl">Produtos</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-num">98%</div>
                <div className="hero-stat-lbl">Satisfação</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-num">5 ★</div>
                <div className="hero-stat-lbl">Avaliação</div>
              </div>
            </div>
          </div>

          {/* right col — visual */}
          <div className="hero-visual anim-slide-l d2">
            <div className="hero-visual-box">
              <div className="hero-visual-emoji float-a">🛋️</div>
              <div className="hero-visual-title">Catálogo Online</div>
              <div className="hero-visual-sub">Novos produtos toda semana</div>

              <div className="hero-card hero-card-top float-b">
                <div className="hero-card-label">Novo hoje</div>
                <div className="hero-card-name">TV LG 32&quot; Smart</div>
                <div className="hero-card-price">R$&nbsp;450</div>
              </div>

              <div className="hero-card hero-card-bottom float-a">
                <div className="hero-card-label">Destaque</div>
                <div className="hero-card-name">Geladeira Consul</div>
                <div className="hero-card-price">R$&nbsp;1.600</div>
              </div>
            </div>
          </div>
        </div>

        <div className="scroll-indicator">
          <div className="scroll-label">Explorar</div>
          <div className="scroll-line" />
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="features-section" id="sobre">
        <div className="features-inner">
          {[
            { icon: '♻️', title: 'Sustentável',        desc: 'Dê nova vida aos móveis e ajude o planeta a respirar melhor.' },
            { icon: '💰', title: 'Economia real',       desc: 'Até 70% mais barato do que comprar um produto novo.' },
            { icon: '✅', title: 'Qualidade garantida', desc: 'Todos os itens são avaliados antes de anunciar.' },
            { icon: '📍', title: 'Foz do Iguaçu',      desc: 'Retire na loja ou consulte disponibilidade de entrega.' },
          ].map((f, i) => (
            <div key={i} className="feature-card reveal">
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATALOG ── */}
      <section className="catalog-section" id="produtos">
        <div className="catalog-inner">

          {/* top bar */}
          <div className="catalog-top">
            <div className="reveal">
              <div className="section-eyebrow">— Catálogo</div>
              <h2 className="section-title">Nossos <em>Produtos</em></h2>
            </div>
            <div className="search-wrap reveal">
              <span className="search-icon"><IconSearch /></span>
              <input
                className="search-input"
                type="text"
                placeholder="Buscar produto..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* filters */}
          <div className="filter-bar reveal">
            {CATEGORIES.map(c => (
              <button
                key={c}
                className={`filter-btn${cat === c ? ' active' : ''}`}
                onClick={() => setCat(c)}
              >
                {c}
                {c !== 'Todos' && (
                  <span style={{ marginLeft: 5, opacity: .5, fontSize: '.7rem' }}>
                    ({PRODUCTS.filter(p => p.cat === c).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* grid */}
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <p>Nenhum produto encontrado para &quot;{search}&quot;</p>
            </div>
          ) : (
            <div className="product-grid">
              {filtered.map((p, i) => (
                <Link key={`${p.id}-${i}`} href={`/produto/${p.id}`} style={{ textDecoration: 'none' }}>
                  <article className="product-card product-card-anim" style={{ animationDelay: `${(i % 6) * 0.05}s` }}>
                    <div className="product-img-wrap">
                      <img
                        src={imgSrc(p.img)}
                        alt={p.name}
                        onError={e => {
                          (e.target as HTMLImageElement).src =
                            `https://placehold.co/400x300/e8f8e8/2d7a2d?text=${encodeURIComponent(p.name)}`
                        }}
                      />
                      {p.isNew    && <span className="badge-new">Novo</span>}
                      {p.oldPrice && <span className="badge-sale">Oferta</span>}
                    </div>
                    <div className="product-body">
                      <div className="product-cat">{p.cat}</div>
                      <div className="product-name">{p.name}</div>
                      <div className="product-desc">{p.desc}</div>
                      <div className="product-price-row">
                        <span className="product-price">{fmt(p.price)}</span>
                        {p.oldPrice && <span className="product-price-old">{fmt(p.oldPrice)}</span>}
                      </div>
                      <span className="product-btn">Ver detalhes →</span>
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
        <div className="hero-grid" />
        <div className="cta-inner">
          <div className="hero-badge reveal" style={{ margin: '0 auto 24px', width: 'fit-content' }}>
            <span className="hero-badge-dot" />
            Atendimento direto
          </div>
          <h2 className="cta-title reveal">
            Encontrou algo que<br />te <em>interessa?</em>
          </h2>
          <p className="cta-sub reveal">
            Fale diretamente com a gente pelo WhatsApp. Confirmamos disponibilidade, tiramos dúvidas e combinamos a retirada.
          </p>
          <a
            className="cta-wa-btn reveal"
            href={`https://wa.me/${WA_NUMBER}?text=Olá! Vi o site da Compre Pegue e gostaria de mais informações.`}
            target="_blank" rel="noopener noreferrer"
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
                <div className="nav-logo-icon" style={{ width: 32, height: 32 }}>
                  <IconSofa />
                </div>
                <div>
                  <div className="nav-logo-text" style={{ fontSize: '.95rem' }}>COMPRE PEGUE</div>
                  <div className="nav-logo-sub">Móveis Usados</div>
                </div>
              </div>
              <p className="footer-text">
                Móveis usados de qualidade em Foz do Iguaçu. Economia, sustentabilidade e bom gosto.
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
              <div className="footer-col-title">Contato</div>
              <p className="footer-text" style={{ marginBottom: 8 }}>📍 Foz do Iguaçu, PR</p>
              <a
                href={`https://wa.me/${WA_NUMBER}`}
                target="_blank" rel="noopener noreferrer"
                className="footer-link"
              >
                📱 WhatsApp
              </a>
              <a
                href="https://www.comprepeguefoz.com.br"
                target="_blank" rel="noopener noreferrer"
                className="footer-link"
              >
                🌐 comprepeguefoz.com.br
              </a>
            </div>
          </div>

          <div className="footer-bottom">
            <span className="footer-copy">© {new Date().getFullYear()} Compre Pegue. Todos os direitos reservados.</span>
            <span className="footer-copy">Foz do Iguaçu, Paraná 🌿</span>
          </div>
        </div>
      </footer>

      {/* ── WHATSAPP FLOAT ── */}
      <a
        href={`https://wa.me/${WA_NUMBER}?text=Olá! Vi o site da Compre Pegue e gostaria de mais informações.`}
        target="_blank" rel="noopener noreferrer"
        className="wa-float"
        aria-label="Falar no WhatsApp"
      >
        <IconWA />
      </a>
    </>
  )
}
