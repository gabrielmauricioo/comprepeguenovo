'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'

/* ─── TYPES ─── */
interface Product {
  name: string
  desc: string
  price: number
  oldPrice: number | null
  imgs: string[]        // ← array de fotos!
  cat: string
  details?: string[]
}

/* ─────────────────────────────────────────────────────────────────
   PRODUTOS
   Para adicionar mais fotos a um produto, basta incluir mais
   nomes de arquivo no array "imgs":
   imgs: ['foto1.png', 'foto2.png', 'foto3.png']
───────────────────────────────────────────────────────────────── */
const PRODUCTS: Record<number, Product> = {
  

121: {
    name: 'Cama Solteirão Completa',
    desc: 'Dormir bem não é luxo — é necessidade. Solteirão completo, colchão firme e conservado, box com rodinhas. Conforto real por R$ 599.',
    price: 599, oldPrice: null, cat: 'Camas',
    imgs: ['solteirão.jpeg','solteirão2.jpeg', 'solteirão3.jpeg', 'solteirão4.jpeg'],
    details: ['Conjunto completo: box + colchão'
              ,'Colchão em excelente estado de conservação'
              ,'Pronto para retirada'
            ]
  },
122: {
    name: 'Banco de Madeira Rústico',
    desc: 'Aquele toque natural que transforma qualquer ambiente. Banco rústico em madeira maciça — perfeito para varanda, jardim ou entrada de casa.',
    price: 199, oldPrice: 299, cat: 'Móveis',
    imgs: ['banco.jpeg','banco2.jpeg', 'banco3.jpeg'],
    details: ['Ideal para varanda, jardim ou corredor'
              ,'Resistente e bem construído'
              ,'Peça artesanal — design exclusivo'
            ]
  },
  
130: {
    name: 'TV Philips 32 Polegadas',
    desc: 'Ligada, funcionando, imagem perfeita — a foto já prova. TV Philips 32" com controle original incluso. Resolve a sala, o quarto ou a cozinha.',
    price: 350, oldPrice: 450, cat: 'Eletrodomésticos',
    imgs: ['tv.jpeg','tv2.jpeg', 'tv3.jpeg', 'tv4.jpeg'],
    details: ['Marca Philips — referência em qualidade'
              ,'Controle remoto original incluso'
              ,'Entrada HDMI'
            ]
  },

134: {
  name: 'Pia de Cozinha Inox com Escorredor',
  desc: 'Reforma a cozinha sem obra e sem gastar muito. Pia em aço inox com cuba simples e escorredor dos dois lados — fácil de limpar, resistente e pronta para instalar.',
  price: 150, oldPrice: null, cat: 'Construção',
  imgs: ['inox.jpeg', 'inox2.jpeg', 'inox3.jpeg', 'inox4.jpeg'],
  details: [
    'Aço inox — resistente e fácil de limpar',
    'Cuba simples com escorredor dos dois lados',
    'Ideal para cozinha, área de serviço ou kitnet',
    'Instalação padrão — encanador resolve rápido',
    'Parcelo em até 3x sem juros',
    'Retirada: Rua Centenário, 538 – Parque Morumbi 2',
  ]
},


143: {
  name: 'Kit Banheiro — Vaso Sanitário + Pia com Coluna',
  desc: 'Cada peça separada numa loja de materiais sai por R$ 300, R$ 400+. Aqui você leva o kit completo — vaso com tampa cinza moderna e pia com coluna e torneira — por R$ 399. Louça branca impecável, reforma hoje.',
  price: 399, oldPrice: null, cat: 'Eletrodomésticos',
  imgs: ['kitbanheiro.jpeg', 'kitbanheiro2.jpeg', 'kitbanheiro3.jpeg', 'kitbanheiro4.jpeg'],
  details: [
    'Kit completo: vaso sanitário + pia com coluna',
    'Vaso sanitário com tampa cinza moderna',
    'Pia com coluna e torneira inclusas',
    'Louça branca em ótimo estado — sem trincas',
    'Economia de mais de R$ 300 vs comprar separado',
    'Ideal para reforma de banheiro completa',
    'Parcelo em até 3x sem juros',
    'Retirada: Rua Centenário, 538 – Parque Morumbi 2',
  ]
},

147: {
  name: 'Espelho de Banheiro com Moldura Cromada',
  desc: 'Aqui você renova o banheiro por R$ 99 — moldura em metal prateado elegante, resistente à umidade e conservado. É só chegar e pendurar.',
  price: 99, oldPrice: null, cat: 'Decoração',
  imgs: ['espelhocromado.jpeg', 'espelhocromado2.jpeg', 'espelhocromado3.jpeg', 'espelhocromado4.jpeg' ],
  details: [
    'Espelho retangular com moldura cromada',
    'Moldura em metal prateado — elegante e resistente à umidade',
    'Tamanho ideal para banheiro ou lavabo',
    'Combina com qualquer estilo de decoração',
    'Conservado e pronto para uso — só pendurar',
    'Economia de mais de R$ 100 vs loja de materiais',
    'Parcelo em até 3x sem juros',
    'Retirada: Rua Centenário, 538 – Parque Morumbi 2',
  ]
},

148: {
  name: 'Maca Profissional de Madeira',
  desc: 'Maca nova dessa qualidade custa R$ 1.200+ — aqui você equipa seu espaço pela metade do preço e atende hoje!',
  price: 550, oldPrice: null, cat: 'Móveis',
  imgs: ['maca.jpeg', 'maca2.jpeg', 'maca3.jpeg', 'maca4.jpeg' ],
  details: [
    'Ideal pra massagem, estética, fisioterapia ou pilates',
    'Estrutura robusta e super resistente',
    'Tampo em madeira — fácil de limpar e higienizar',
    'Parcelo em até 3x sem juros',
  ]
},


154: {
  name: 'Vaso Sanitário Azul com Caixa Acoplada',
  desc: 'Quem disse que banheiro tem que ser branco? Vaso com caixa acoplada em louça azul resistente — conjunto completo, cor diferenciada que chama atenção. Ideal para projetos criativos, áreas externas ou reposição econômica. R$ 250.',
  price: 250, oldPrice: null, cat: 'Construção',
  imgs: ['vasoazul.jpeg', 'vasoazul2.jpeg', 'vasoazul3.jpeg', 'vasoazul4.jpeg'],
  details: [
    'Conjunto completo: vaso + caixa acoplada',
    'Louça resistente e de ótima qualidade',
    'Cor azul — ideal para projetos diferenciados',
    'Perfeito para banheiros, áreas externas ou reformas',
    'Instalação padrão — encanador resolve rápido',
    'Retirada: Rua Centenário, 538 – Parque Morumbi 2',
  ]
},


157: {
  name: 'Frigobar 60 Litros',
  desc: 'Aquela cerveja gelada no quarto, o lanche no escritório, as bebidas na área gourmet — o frigobar de 60 litros resolve tudo isso sem ocupar espaço. Compacto, econômico e pronto para uso por R$ 499.',
  price: 499, oldPrice: null, cat: 'Eletrodomésticos',
  imgs: ['frigobar.jpeg', 'frigobar2.jpeg', 'frigobar3.jpeg'],
  details: [
    'Capacidade de 60 litros — compacto e prático',
    'Ideal para quartos, escritórios, kitnets e áreas gourmet',
    'Econômico no consumo de energia',
    'Mantém bebidas, lanches e alimentos sempre gelados',
    'Ocupa pouco espaço — cabe em qualquer canto',
    'Funcionando perfeitamente — testado antes de anunciar',
    'Retirada: Rua Centenário, 538 – Parque Morumbi 2',
  ]
},

160: {
  name: 'Colchão de Solteiro Conservado',
  desc: 'Colchão de solteiro novo passa de R$ 800. Este, bem conservado e limpo, sai por R$ 350 — mesmo conforto, economia real. Pronto para uso imediato, é só chegar e dormir bem.',
  price: 350, oldPrice: null, cat: 'Móveis',
  imgs: ['colchaosolteiro4.jpeg', 'colchaosolteiro2.jpeg', 'colchaosolteiro3.jpeg'],
  details: [
    'Tamanho solteiro',
    'Bem conservado e limpo',
    'Pronto para uso imediato',
    'Ideal para quarto de solteiro',
    'Parcelo em até 3x sem juros',
    'Retirada: Rua Centenário, 538 – Parque Morumbi 2',
  ]
},

161: {
  name: 'Cama Solteirão Completa',
  desc: 'O solteirão certo para quem quer mais espaço sem virar uma casal. Conjunto completo — colchão confortável + box firme e resistente, prontos para uso imediato. Ideal para quartos, apartamentos ou área de hóspedes. R$ 550.',
  price: 550, oldPrice: null, cat: 'Camas',
  imgs: ['solteirao.jpeg', 'solteirao2.jpeg', 'solteirao3.jpeg', 'solteirao4.jpeg'],
  details: [
    'Conjunto completo: colchão + box inclusos',
    'Medida solteirão — mais espaço e conforto',
    'Colchão confortável e pronto para uso',
    'Estrutura firme e resistente para o dia a dia',
    'Ideal para quartos, apartamentos ou área de hóspedes',
    'Retirada: Rua Centenário, 538 – Parque Morumbi 2',
  ]
},

162: {
  name: 'Mesa de Madeira Rústica',
  desc: 'Aquela mesa que aguenta o dia a dia e ainda fica bonita. Tampo em madeira de excelente aparência, estrutura resistente e estável — design rústico que combina com diversos estilos de decoração. Ideal para refeições, reuniões ou home office. R$ 299.',
  price: 299, oldPrice: null, cat: 'Móveis',
  imgs: ['mesamadeira.jpeg', 'mesamadeira2.jpeg', 'mesamadeira3.jpeg', 'mesamadeira4.jpeg', 'mesamadeira5.jpeg'],
  details: [
    'Tampo em madeira de excelente aparência',
    'Estrutura resistente e estável',
    'Design rústico que combina com diversos estilos',
    'Ideal para refeições, reuniões ou uso no dia a dia',
    'Ótimo custo-benefício',
    'Retirada: Rua Centenário, 538 – Parque Morumbi 2',
  ]
},

165: {
  name: 'Tanque de Lavanderia Duplo',
  desc: 'Lavanderia organizada e funcional por R$ 350. Dois compartimentos para separar a lavagem, área lateral com frisos para esfregar roupas — estrutura resistente e durável pronta para instalar. Ideal para reformas ou novas instalações.',
  price: 350, oldPrice: null, cat: 'Construção',
  imgs: ['tanque.jpeg', 'tanque2.jpeg', 'tanque3.jpeg','tanque4.jpeg'],
  details: [
    'Estrutura resistente e durável',
    'Dois compartimentos para maior praticidade',
    'Área lateral com frisos para esfregar roupas',
    'Ideal para casas, áreas de serviço e lavanderias',
    'Ótima opção para reformas ou novas instalações',
    'Retirada: Rua Centenário, 538 – Parque Morumbi 2',
  ]
},

166: {
  name: 'Porta de Ferro com Vidro',
  desc: 'Segurança do ferro sem abrir mão da luz natural. Estrutura resistente com vidro que ilumina o ambiente e detalhes decorativos clássicos — 80cm x 2,10m pronta para instalação. Ideal para entradas, áreas externas ou edículas. R$ 180.',
  price: 180, oldPrice: null, cat: 'Decoração',
  imgs: ['portaferro.jpeg', 'portaferro2.jpeg', 'portaferro3.jpeg'],
  details: [
    'Estrutura de ferro resistente e durável',
    'Vidro que proporciona claridade ao ambiente',
    'Design clássico com detalhes decorativos',
    'Medidas: 80cm x 2,10m',
    'Pronta para instalação imediata',
    'Ideal para entradas, áreas externas ou edículas',
    'Retirada: Rua Centenário, 538 – Parque Morumbi 2',
  ]
},

167: {
  name: 'Guarda-Sol Gigante para Área Externa',
  desc: 'Guarda-sol gigante com estrutura resistente e cobertura ampla — ideal para mesas, piscinas, jardins e áreas de lazer. Usado em bom estado e pronto para uso por R$ 450.',
  price: 450, oldPrice: null, cat: 'Decoração',
  imgs: ['guardasol.jpeg', 'guardasol2.jpeg', 'guardasol3.jpeg', 'guardasol4.jpeg'],
  details: [
    'Estrutura resistente e estável',
    'Cobertura ampla — sombra generosa',
    'Ideal para piscinas, jardins, mesas e áreas de lazer',
    'Perfeito para residências, comércios, bares e eventos',
    'Fácil de posicionar e utilizar',
    'Usado em bom estado — pronto para uso imediato',
    'Retirada: Rua Centenário, 538 – Parque Morumbi 2',
  ]
},

168: {
  name: 'Bancade de Banheiro Completa',
  desc: 'Quem disse que banheiro tem que ser sem graça? Cuba de sobrepor com acabamento brilhante em vermelho e branco — design diferenciado que transforma lavabo ou banheiro num ambiente com personalidade. Combina com mármore, granito ou madeira. R$ 150.',
  price: 300, oldPrice: 570, cat: 'Construção',
  imgs: ['cubav.jpeg', 'cubav2.jpeg', 'cubav3.jpeg', 'cubav4.jpeg'],
  details: [
    'Cuba de sobrepor — fácil instalação sobre a bancada',
    'Acabamento brilhante nas cores vermelho e branco',
    'Design elegante e diferenciado',
    'Combina com bancadas de mármore, granito ou madeira',
    'Ideal para banheiros, lavabos e áreas gourmet',
    'Peça que valoriza instantaneamente o ambiente',
    'Retirada: Rua Centenário, 538 – Parque Morumbi 2',
  ]
},

169: {
  name: 'Cuba de Banheiro de Sobrepor Verde',
  desc: 'Um detalhe que muda tudo. Cuba de sobrepor com acabamento verde diferenciado e design contemporâneo — transforma banheiro, lavabo ou área gourmet em um ambiente com identidade própria. Fácil instalação e excelente estado de conservação. R$ 150.',
  price: 150, oldPrice: null, cat: 'Decoração',
  imgs: ['cubaverde.jpeg', 'cubaverde2.jpeg', 'cubaverde3.jpeg'],
  details: [
    'Cuba de sobrepor — fácil instalação sobre a bancada',
    'Design moderno com acabamento diferenciado em verde',
    'Visual elegante e contemporâneo',
    'Ideal para banheiros, lavabos e áreas gourmet',
    'Excelente estado de conservação',
    'Perfeita para projetos residenciais ou comerciais',
    'Retirada: Rua Centenário, 538 – Parque Morumbi 2',
  ]
},

170: {
  name: 'Cuba de Banheiro Negra',
  desc: 'Quem disse que banheiro tem que ser sem graça? Cuba de sobrepor com acabamento brilhante em negro e branco — design diferenciado que transforma lavabo ou banheiro num ambiente com personalidade. Combina com mármore, granito ou madeira. R$ 150.',
  price: 150, oldPrice: 270, cat: 'Construção',
  imgs: ['cubanegro.jpeg', 'cubanegro2.jpeg', 'cubanegro3.jpeg'],
  details: [
    'Cuba de sobrepor — fácil instalação sobre a bancada',
    'Acabamento brilhante nas cores negro e branco',
    'Design elegante e diferenciado',
    'Combina com bancadas de mármore, granito ou madeira',
    'Ideal para banheiros, lavabos e áreas gourmet',
    'Peça que valoriza instantaneamente o ambiente',
    'Retirada: Rua Centenário, 538 – Parque Morumbi 2',
  ]
},

171: {
  name: 'Cuba de Banheiro Verde',
  desc: 'Quem disse que banheiro tem que ser sem graça? Cuba de sobrepor com acabamento brilhante em verde e branco — design diferenciado que transforma lavabo ou banheiro num ambiente com personalidade. Combina com mármore, granito ou madeira. R$ 150.',
  price: 150, oldPrice: 270, cat: 'Construção',
  imgs: ['cubave.jpeg', 'cubave2.jpeg', 'cubave3.jpeg'],
  details: [
    'Cuba de sobrepor — fácil instalação sobre a bancada',
    'Acabamento brilhante nas cores verde e branco',
    'Design elegante e diferenciado',
    'Combina com bancadas de mármore, granito ou madeira',
    'Ideal para banheiros, lavabos e áreas gourmet',
    'Peça que valoriza instantaneamente o ambiente',
    'Retirada: Rua Centenário, 538 – Parque Morumbi 2',
  ]
},

172: {
  name: 'Cuba de Banheiro Amarela',
  desc: 'Quem disse que banheiro tem que ser sem graça? Cuba de sobrepor com acabamento brilhante em amarelo e branco — design diferenciado que transforma lavabo ou banheiro num ambiente com personalidade. Combina com mármore, granito ou madeira. R$ 150.',
  price: 150, oldPrice: 270, cat: 'Construção',
  imgs: ['cubaamarela.jpeg', 'cubaamarela2.jpeg', 'cubaamarela3.jpeg'],
  details: [
    'Cuba de sobrepor — fácil instalação sobre a bancada',
    'Acabamento brilhante nas cores amarelo e branco',
    'Design elegante e diferenciado',
    'Combina com bancadas de mármore, granito ou madeira',
    'Ideal para banheiros, lavabos e áreas gourmet',
    'Peça que valoriza instantaneamente o ambiente',
    'Retirada: Rua Centenário, 538 – Parque Morumbi 2',
  ]
},

173: {
  name: 'Cuba de Banheiro Branca Retangular ',
  desc: 'Clean, moderna e atemporal — a cuba branca retangular nunca erra. Modelo Setga em cerâmica branca de qualidade, formato retangular que combina com qualquer estilo de banheiro, lavabo ou suíte. R$ 150 abaixo do mercado.',
  price: 150, oldPrice: null, cat: 'Decoração',
  imgs: ['cubabranca.jpeg', 'cubabranca2.jpeg', 'cubabranca3.jpeg'],
  details: [
    'Marca Setga — qualidade reconhecida',
    'Formato retangular moderno e atemporal',
    'Cerâmica branca — combina com qualquer decoração',
    'Ideal para banheiro, lavabo ou suíte',
    'Preço abaixo do mercado — oportunidade real',
    'Parcelo em até 3x sem juros',
    'Retirada: Rua Centenário, 538 – Parque Morumbi 2',
  ]
},

175: {
  name: 'Par de Cadeiras Acapulco',
  desc: 'A cadeira Acapulco é um ícone do design moderno — e esse par sai por R$ 199. Estrutura metálica resistente, visual que eleva qualquer ambiente e em ótimo estado de conservação. Sala, varanda, área gourmet ou recepção — combina com tudo.',
  price: 199, oldPrice: null, cat: 'Móveis',
  imgs: ['cadeirasacapulco.jpg', 'cadeirasacapulco2.jpg', 'cadeirasacapulco3.jpg'],
  details: [
    'Par de cadeiras Acapulco — 2 unidades inclusas',
    'Design icônico moderno e sofisticado',
    'Estrutura metálica resistente',
    'Em ótimo estado de conservação',
    'Ideal para sala, varanda, área gourmet ou recepção',
  ]
},

176: {
  name: 'Forno Industrial Metalmaq 3 Câmaras',
  desc: 'Forno industrial Metalmaq novo passa de R$ 8.000. Este, com 3 câmaras independentes em aço inox e capacidade para alta produção, sai por R$ 2.500. Ideal para quem quer montar ou expandir padaria, pizzaria, lanchonete ou cozinha industrial gastando pouco.',
  price: 2500, oldPrice: null, cat: 'Eletrodomésticos',
  imgs: ['fornoindustrial.jpeg', 'fornoindustrial2.jpeg', 'fornoindustrial3.jpeg', 'fornoindustrial4.jpeg'],
  details: [
    'Marca Metalmaq — referência em equipamentos industriais',
    '3 câmaras independentes — asse diferentes produtos ao mesmo tempo',
    'Estrutura em aço inox — resistente e fácil de limpar',
    'Excelente capacidade para alta produção',
    'Ideal para padarias, pizzarias, lanchonetes e cozinhas industriais',
    'Retirada: Rua Centenário, 538 – Parque Morumbi 2',
  ]
},

177: {
  name: 'Pia de Mármore com Cuba Embutida',
  desc: 'Mármore em banheiro é luxo que todo mundo quer e poucos pagam. Pia 90 cm x 55cm com cuba embutida inclusa — resistente, elegante e pronta para instalar. Transforma qualquer banheiro ou lavabo na hora. R$ 270.',
  price: 270, oldPrice: null, cat: 'Decoração',
  imgs: ['piamarmore.jpeg', 'piamarmore2.jpeg', 'piamarmore3.jpeg'],
  details: [
    'Mármore resistente e durável',
    'Medidas: 90cm x 55cm',
    'Cuba embutida inclusa',
    'Ideal para banheiro ou lavabo',
    'Pronta para instalação imediata',
    'Retirada: Rua Centenário, 538 – Parque Morumbi 2',
  ]
},

178: {
  name: 'Fogão Brastemp 4 Bocas',
  desc: 'Brastemp não precisa de apresentação — é a marca que todo mundo conhece e confia. Fogão 4 bocas com forno espaçoso e mesa em vidro temperado, funcionando perfeitamente por R$ 399. Ideal para casa, apartamento, kitnet ou imóvel de aluguel.',
  price: 399, oldPrice: null, cat: 'Eletrodomésticos',
  imgs: ['fogao.jpeg', 'fogao2.jpeg', 'fogao3.jpeg'],
  details: [
    'Marca Brastemp — referência em qualidade',
    '4 bocas — ideal para o dia a dia',
    'Forno espaçoso incluso',
    'Mesa em vidro temperado — moderna e fácil de limpar',
    'Funcionando perfeitamente — pronto para usar',
    'Ideal para casa, apartamento, kitnet ou aluguel',
    'Retirada: Rua Centenário, 538 – Parque Morumbi 2',
  ]
},

179: {
  name: 'Conjunto Porta de Correr em Vidro Fumê',
  desc: 'Conjunto completo de porta de correr em vidro fumê — o tipo de acabamento que transforma qualquer ambiente em algo sofisticado. 4 painéis no total, medidas generosas e pronto para instalar. Sala, varanda gourmet, escritório ou fachada. R$ 1.000.',
  price: 1000, oldPrice: null, cat: 'Decoração',
  imgs: ['cportacorrer.jpeg', 'cportacorrer2.jpeg', 'cportacorrer3.jpeg'],
  details: [
    'Conjunto completo: 2 folhas fixas + 2 folhas de correr',
    'Vidro fumê — elegante, moderno e com privacidade',
    'Folhas fixas: 94cm x 2,04m cada',
    'Folhas de correr: 98cm x 2,08m cada',
    'Ideal para sala, varanda gourmet, escritório ou fachada',
    'Pronto para instalação imediata',
    'Retirada: Rua Centenário, 538 – Parque Morumbi 2',
  ]
},

180: {
  name: 'Mesa de Madeira com Tampo de Vidro',
  desc: 'A combinação de madeira maciça com tampo de vidro é um clássico do design que nunca sai de moda — e por R$ 200 você leva hoje. Resistente, fácil de limpar e pronta para uso em sala de jantar, cozinha ou área gourmet.',
  price: 200, oldPrice: null, cat: 'Móveis',
  imgs: ['mesavidro.jpeg', 'mesavidro2.jpeg', 'mesavidro3.jpeg'],
  details: [
    'Estrutura em madeira maciça — resistente e durável',
    'Tampo de vidro — fácil de limpar e elegante',
    'Design clássico que combina com qualquer decoração',
    'Ideal para sala de jantar, cozinha ou área gourmet',
    'Pronta para uso imediato',
    'Retirada: Rua Centenário, 538 – Parque Morumbi 2',
  ]
},

181: {
  name: 'Cama King Completa com Colchão High Support',
  desc: 'Dormir bem faz diferença, e essa cama King entrega espaço, conforto e excelente suporte. Conjunto completo com colchão High Support e box duplo robusto, pronto para uso por apenas R$ 800.',
  price: 800, oldPrice: 1400, cat: 'Camas',
  imgs: ['camaking.jpeg', 'camaking2.jpeg', 'camaking3.jpeg'],
  details: [
    'Conjunto completo: colchão + box inclusos',
    'Colchão High Support — tecnologia de suporte superior',
    'Box duplo robusto — firme e bem conservado',
    'Tamanho King — máximo conforto para casal',
    'Pronta para uso — é só montar e dormir',
    'Parcelo em até 2x sem juros',
    'Retirada: Rua Centenário, 538 – Parque Morumbi 2',
  ]
}









  

}

const WA_NUMBER = '+5545999541641' // ← TROQUE PELO SEU NÚMERO

/* ─── HELPERS ─── */
function fmt(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
function imgSrc(filename: string) {
  // Busca direto da pasta /public do projeto
  return `/${filename}`
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
  imgs: string[], current: number
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
      {/* counter */}
      <div style={{ position: 'absolute', top: 22, left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,.45)', fontSize: '.8rem', letterSpacing: '.12em' }}>
        {current + 1} / {imgs.length}
      </div>

      {/* close */}
      <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,.1)', border: 'none', color: '#fff', width: 46, height: 46, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}>
        <IconClose />
      </button>

      {/* prev */}
      {imgs.length > 1 && (
        <button onClick={e => { e.stopPropagation(); onPrev() }} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,.12)', border: 'none', color: '#fff', width: 52, height: 52, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <IconChevL />
        </button>
      )}

      {/* main image */}
      <div onClick={e => e.stopPropagation()} style={{ maxWidth: '88vw', maxHeight: '82vh' }}>
        <img
          src={imgSrc(imgs[current])}
          alt={`Foto ${current + 1}`}
          onError={e => { (e.target as HTMLImageElement).src = imgFallback('Foto') }}
          style={{ maxWidth: '88vw', maxHeight: '82vh', objectFit: 'contain', borderRadius: 8, userSelect: 'none', display: 'block' }}
        />
      </div>

      {/* next */}
      {imgs.length > 1 && (
        <button onClick={e => { e.stopPropagation(); onNext() }} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,.12)', border: 'none', color: '#fff', width: 52, height: 52, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <IconChevR />
        </button>
      )}

      {/* thumbs strip */}
      {imgs.length > 1 && (
        <div style={{ position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8 }}>
          {imgs.map((img, i) => (
            <button key={i} onClick={e => { e.stopPropagation() }} style={{ width: 54, height: 42, borderRadius: 6, overflow: 'hidden', border: `2px solid ${i === current ? '#5cc45c' : 'rgba(255,255,255,.2)'}`, cursor: 'default', padding: 0, opacity: i === current ? 1 : 0.45, transition: 'all .2s' }}>
              <img src={imgSrc(img)} alt="" onError={e => { (e.target as HTMLImageElement).src = imgFallback('') }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── GALLERY ─── */
function Gallery({ imgs, productName }: { imgs: string[], productName: string }) {
  const [active, setActive]         = useState(0)
  const [lightbox, setLightbox]     = useState(false)
  const [lbIdx, setLbIdx]           = useState(0)

  const openLb  = (i: number) => { setLbIdx(i); setLightbox(true) }
  const closeLb = useCallback(() => setLightbox(false), [])
  const prevLb  = useCallback(() => setLbIdx(i => (i - 1 + imgs.length) % imgs.length), [imgs.length])
  const nextLb  = useCallback(() => setLbIdx(i => (i + 1) % imgs.length), [imgs.length])

  const prevActive = () => setActive(i => (i - 1 + imgs.length) % imgs.length)
  const nextActive = () => setActive(i => (i + 1) % imgs.length)

  return (
    <>
      {/* ── MAIN IMAGE ── */}
      <div style={{ position: 'relative', marginBottom: 10 }}>
        <div
          onClick={() => openLb(active)}
          style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', aspectRatio: '4/3', cursor: 'zoom-in', position: 'relative' }}
        >
          <img
            key={active}
            src={imgSrc(imgs[active])}
            alt={productName}
            onError={e => { (e.target as HTMLImageElement).src = imgFallback(productName) }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', animation: 'imgFade .25s ease' }}
          />

          {/* expand pill */}
          <div style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(0,0,0,.48)', color: '#fff', padding: '6px 11px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 6, fontSize: '.72rem', fontWeight: 500, backdropFilter: 'blur(4px)' }}>
            <IconExpand /> Ampliar foto
          </div>

          {/* photo count */}
          {imgs.length > 1 && (
            <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(0,0,0,.48)', color: '#fff', padding: '4px 11px', borderRadius: 20, fontSize: '.68rem', fontWeight: 600, backdropFilter: 'blur(4px)', letterSpacing: '.05em' }}>
              📷 {active + 1} / {imgs.length}
            </div>
          )}

          {/* side arrows */}
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

      {/* ── THUMBNAILS ── */}
      {imgs.length > 1 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          {imgs.map((img, i) => (
            <button key={i} onClick={() => setActive(i)} style={{ width: 72, height: 56, borderRadius: 7, overflow: 'hidden', border: `2px solid ${i === active ? '#2d7a2d' : 'rgba(0,0,0,.08)'}`, cursor: 'pointer', padding: 0, background: 'none', opacity: i === active ? 1 : 0.55, transition: 'all .2s', boxShadow: i === active ? '0 0 0 3px rgba(45,122,45,.2)' : 'none', flexShrink: 0 }}>
              <img src={imgSrc(img)} alt={`Foto ${i + 1}`} onError={e => { (e.target as HTMLImageElement).src = imgFallback('') }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>
          ))}
          {/* tela cheia btn */}
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
  const id = Number(params.id)
  const p = PRODUCTS[id]

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
          <Gallery imgs={p.imgs} productName={p.name} />
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

          {p.details && (
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

          {p.imgs.length > 1 && (
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
