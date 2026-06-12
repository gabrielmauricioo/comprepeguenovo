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
const CATEGORIES = ['Todos', 'Camas', 'Eletrodomésticos', 'Construção', 'Móveis', 'Decoração', 'Poltronas', 'Enxoval', 'Outros']

const PRODUCTS: Product[] = [
{ id: 150, name: 'Lustre Rattan Artesanal Formato Sino', desc: 'Lustre rattan artesanal, grande e decorativo.', price: 300, oldPrice: 899, img: 'lustrerattansino.jpeg', cat: 'Decoração', isNew: true },

{ id: 134, name: 'Pia de Cozinha Inox', desc: 'Inox resistente com escorredor dos dois lados.', price: 150, oldPrice: null, img: 'inox.jpeg', cat: 'Construção', isNew: false },

{ id: 161, name: 'Cama Solteirão Completa', desc: 'Solteirão completo, colchão e box inclusos.', price: 550, oldPrice: null, img: 'solteirao.jpeg', cat: 'Camas', isNew: false },

{ id: 119, name: 'Par de Poltronas Bege', desc: 'Conforto e charme em duas unidades.', price: 499, oldPrice: 600, img: 'poltrona.jpeg', cat: 'Poltronas', isNew: false },

{ id: 143, name: 'Kit Banheiro — Vaso Sanitário + Pia com Coluna', desc: 'Vaso com tampa + pia com coluna e torneira.', price: 399, oldPrice: null, img: 'kitbanheiro.jpeg', cat: 'Construção', isNew: false },

{ id: 127, name: 'Par de Cadeiras Estiloso', desc: 'Estrutura em madeira maciça escura.', price: 380, oldPrice: null, img: 'cadeirabranca.jpeg', cat: 'Poltronas', isNew: true },

{ id: 156, name: 'Batedeira Elétrica', desc: 'Compacta e fácil de limpar, pronta para uso.', price: 80, oldPrice: 120, img: 'batedeira.jpeg', cat: 'Eletrodomésticos', isNew: false },

{ id: 137, name: 'Mesa Redonda de Pinus', desc: 'Rústica, estável e cheia de charme.', price: 450, oldPrice: null, img: 'pinus.jpeg', cat: 'Móveis', isNew: false },

{ id: 146, name: 'Lustre Rattan Redondo Boho', desc: 'Rattan trançado natural, clima boho instantâneo.', price: 250, oldPrice: 600, img: 'lustrerattan.jpeg', cat: 'Decoração', isNew: true },

{ id: 158, name: 'Balança Digital de Vidro', desc: 'Base em vidro, display digital automático.', price: 60, oldPrice: null, img: 'balanca.jpeg', cat: 'Outros', isNew: false },

{ id: 122, name: 'Banco de Madeira Rústico', desc: 'Madeira maciça com acabamento rústico.', price: 199, oldPrice: 299, img: 'banco.jpeg', cat: 'Móveis', isNew: true },

{ id: 140, name: 'Conjunto Mesa Industrial + Banco de Madeira', desc: 'Estilo loft com mesa e banco combinando.', price: 599, oldPrice: null, img: 'banco+ap.jpeg', cat: 'Móveis', isNew: true },

{ id: 162, name: 'Mesa de Madeira Rústica', desc: 'Elegância e resistência por R$ 299.', price: 299, oldPrice: null, img: 'mesamadeira.jpeg', cat: 'Móveis', isNew: false },

{ id: 132, name: 'Cobreleito Queen', desc: 'Tecido floral bordado para cama Queen.', price: 50, oldPrice: null, img: 'cobreleito4.jpeg', cat: 'Enxoval', isNew: true },

{ id: 144, name: 'Conjunto Mesa Redonda + 2 Cadeiras', desc: 'Mesa redonda e 2 cadeiras estofadas.', price: 550, oldPrice: 999, img: 'conjuntomesa.jpeg', cat: 'Móveis', isNew: false },

{ id: 128, name: 'Espreguiçadeiras de Madeira', desc: 'Relaxe com estilo, vendida por unidade.', price: 350, oldPrice: null, img: 'espreguiçadeira.jpeg', cat: 'Poltronas', isNew: false },

{ id: 154, name: 'Vaso Sanitário Azul com Caixa Acoplada', desc: 'Vaso sanitário azul com caixa acoplada completa.', price: 250, oldPrice: null, img: 'vasoazul2.jpeg', cat: 'Construção', isNew: false },

{ id: 121, name: 'Cama Solteirão Completa', desc: 'Tamanho Solteirão, 96 x 203 cm.', price: 599, oldPrice: null, img: 'solteirão.jpeg', cat: 'Camas', isNew: false },

{ id: 159, name: 'Ferro de Passar a Vapor', desc: 'Função vapor, controle de temperatura ideal.', price: 50, oldPrice: 80, img: 'ferro.jpeg', cat: 'Eletrodomésticos', isNew: false },

{ id: 136, name: 'Arara de Madeira com Prateleiras', desc: 'Organização com estilo para seu espaço.', price: 250, oldPrice: null, img: 'arara3.jpeg', cat: 'Móveis', isNew: true },

{ id: 147, name: 'Espelho de Banheiro com Moldura Cromada', desc: 'Moldura prateada, resistente à umidade.', price: 99, oldPrice: null, img: 'espelhocromado.jpeg', cat: 'Decoração', isNew: false },

{ id: 124, name: 'Par de Cadeiras Estofadas Cinza', desc: 'Vendidas em par, 2 unidades estofadas.', price: 340, oldPrice: null, img: 'cadeiracinza.jpeg', cat: 'Poltronas', isNew: false },

{ id: 151, name: 'Balcão Expositor de Vidro', desc: 'Balcão expositor com estrutura e vidro.', price: 450, oldPrice: null, img: 'balcaoexpositor.jpeg', cat: 'Móveis', isNew: false },

{ id: 133, name: 'Ar Condicionado Consul', desc: 'Consul Inverter 12.000 BTUs eficiente.', price: 700, oldPrice: 900, img: 'ar.jpeg', cat: 'Eletrodomésticos', isNew: false },

{ id: 130, name: 'TV Philips 32 Polegadas', desc: 'Imagem nítida e boa qualidade sonora.', price: 350, oldPrice: 450, img: 'tv.jpeg', cat: 'Eletrodomésticos', isNew: false },

{ id: 157, name: 'Frigobar 60 Litros', desc: 'Frigobar compacto e econômico, 60 litros.', price: 499, oldPrice: null, img: 'frigobar.jpeg', cat: 'Eletrodomésticos', isNew: false },

{ id: 145, name: 'Conjunto Mesa Redonda + 2 Cadeiras Buenos Aires', desc: 'Mesa maciça com pé em cruz e 2 cadeiras.', price: 850, oldPrice: 1500, img: 'conjuntobuenos.jpeg', cat: 'Móveis', isNew: false },

{ id: 118, name: 'Vaso Sanitário Completo', desc: 'Fácil instalação, louça branca impecável.', price: 299, oldPrice: null, img: 'vaso.jpeg', cat: 'Construção', isNew: true },

{ id: 153, name: 'Janela de Ferro Decorativa com Vidro Canelado', desc: 'Janela de ferro com vidro canelado, 1,24x1,50m.', price: 199, oldPrice: null, img: 'janelaferro.jpeg', cat: 'Construção', isNew: false },

{ id: 142, name: 'Kit 3 Luminárias de Chão Industrial', desc: 'Kit com 3 luminárias em metal preto.', price: 550, oldPrice: 600, img: 'luminaria.jpeg', cat: 'Decoração', isNew: false },

{ id: 139, name: 'Espelho Redondo com Moldura', desc: 'Tendência em decoração para sua casa.', price: 169, oldPrice: 250, img: 'espelho.jpeg', cat: 'Decoração', isNew: true },

{ id: 155, name: 'Janela de Ferro Trabalhada com Vidro Canelado', desc: 'Janela de ferro com vidro canelado, 2,00x1,50m.', price: 199, oldPrice: null, img: 'janelaforro.jpeg', cat: 'Construção', isNew: false },

{ id: 126, name: 'Cama Casal Completa', desc: 'Tamanho Casal, 138 x 188 cm.', price: 650, oldPrice: 800, img: 'camacasal2.jpeg', cat: 'Camas', isNew: false },

{ id: 141, name: 'Espelho Retangular', desc: 'Moldura fina preta, estilo corpo inteiro.', price: 199, oldPrice: null, img: 'espelhor.jpeg', cat: 'Decoração', isNew: false },

{ id: 148, name: 'Maca Profissional de Madeira', desc: 'Estrutura robusta e super resistente.', price: 550, oldPrice: null, img: 'maca.jpeg', cat: 'Móveis', isNew: false },

{ id: 149, name: 'Bicicleta Milano Action Lady Aro 26', desc: 'Pedale com estilo e economize no dia a dia.', price: 299, oldPrice: 400, img: 'bicicletamilano.jpeg', cat: 'Outros', isNew: false },

{ id: 160, name: 'Colchão de Solteiro Conservado', desc: 'Colchão conservado, limpo e pronto pra uso.', price: 350, oldPrice: 400, img: 'colchaosolteiro2.jpeg', cat: 'Camas', isNew: false },

]

const WA_NUMBER = '+5545999541641' // ← TROQUE PELO SEU NÚMERO

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
                <div className="hero-card-name">Cama de Solteiro</div>
                <div className="hero-card-price">R$&nbsp;550</div>
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
