# 🛋️ Compre Pegue — Site Catálogo

Site moderno de catálogo de móveis usados, feito com **Next.js 14** + **TypeScript** + **CSS puro**.

---

## 🚀 Como rodar do zero

### 1. Instale o Node.js (se ainda não tiver)

Baixe em: https://nodejs.org  
Versão recomendada: **18 ou superior**

### 2. Abra esta pasta no terminal

```bash
cd comprepegue-novo
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Rode em modo desenvolvimento

```bash
npm run dev
```

Acesse: **http://localhost:3000** ✅

---

## ✏️ Personalizações importantes

### 🔁 Trocar o número do WhatsApp

Abra os arquivos abaixo e substitua `5545999999999` pelo número real:

- `app/page.tsx` → linha com `const WA_NUMBER`
- `app/produto/[id]/page.tsx` → linha com `const WA_NUMBER`

Formato: `55` (Brasil) + DDD + número — apenas dígitos, sem espaço ou traço.  
Exemplo: `5545999990000`

### ➕ Adicionar novos produtos

Em `app/page.tsx`, adicione um item no array `PRODUCTS`:

```ts
{
  id: 200,           // ID único
  name: 'Armário 3 Portass',
  desc: 'Excelente estado, madeira maciça',
  price: 450,
  oldPrice: null,    // ou coloque o preço antigo ex: 700
  img: 'armario.png', // nome da imagem no seu site
  cat: 'Móveis',     // Sofás | Eletrodomésticos | Eletrônicos | Móveis | Decoração
  isNew: true,
}
```

Faça o mesmo em `app/produto/[id]/page.tsx` para que a página de detalhe funcione.

### 🖼️ Imagens

As imagens são buscadas automaticamente do site atual (comprepeguefoz.com.br).  
Se quiser usar imagens locais, coloque-as na pasta `public/` e atualize o campo `img`.

---

## 📦 Fazer o deploy (publicar online)

### Opção 1 — Vercel (recomendado, gratuito)

1. Crie conta em https://vercel.com
2. Instale o CLI: `npm i -g vercel`
3. Rode: `vercel`
4. Siga as instruções — em minutos o site estará no ar!

### Opção 2 — Subir para o GitHub e conectar na Vercel

1. `git init`
2. `git add .`
3. `git commit -m "feat: novo site catálogo"`
4. Crie um repositório no GitHub e faça o push
5. Na Vercel, importe o repositório — deploy automático a cada push ✅

---

## 📁 Estrutura do projeto

```
comprepegue-novo/
├── app/
│   ├── globals.css          ← Todo o design (cores, tipografia, animações)
│   ├── layout.tsx           ← Layout global (fontes, metadados SEO)
│   ├── page.tsx             ← Página principal (hero + catálogo)
│   └── produto/
│       └── [id]/
│           └── page.tsx     ← Página de detalhe do produto
├── public/                  ← Coloque suas imagens aqui (opcional)
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── package.json
```

---

## 🎨 Design

- **Cormorant Garamond** — fonte dos títulos (elegante, editorial)
- **DM Sans** — fonte do corpo (moderna, legível)
- **Verde escuro** `#0a1f0a` como cor principal da marca
- Animações suaves de entrada ao rolar a página
- 100% responsivo para mobile e desktop
