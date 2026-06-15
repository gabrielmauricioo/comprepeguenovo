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
  
  118: {
    name: 'Vaso Sanitário Completo',
    desc: 'Reforma no banheiro sem pesar no bolso. Vaso seminovo, conservado, pronto para instalar. Economize agora e resolva hoje.',
    price: 299, oldPrice: null, cat: 'Construção',
    imgs: ['vaso.jpeg','vaso2.jpeg','vaso3.jpeg','vaso4.jpeg', ],
    details: ['Avaliado antes de anunciar'
              ,'Funcionamento perfeito'
              ,'Sem trincas ou lascas'
            ],
  },
  119: {
    name: 'Par de Poltronas Bege',
    desc: 'Aquele cantinho aconchegante que falta na sua sala — por R$ 499 o par. Design arredondado, tecido claro, elegância imediata.',
    price: 499, oldPrice: 600, cat: 'Poltronas',
    imgs: ['poltrona.jpeg','poltrona2.jpeg','poltrona3.jpeg','poltrona4.jpeg' ],
    details: ['Vendidas em par (2 unidades)'
              ,'Tecido na cor off-white conservado'
              ,'Design barrel chair — moderno e atemporal'
            ],
  },
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

  124: {
    name: 'Par de Cadeiras Estofadas Cinza',
    desc: 'Design de hotel, preço de oportunidade. Par de cadeiras estofadas com tecido cinza mesclado e pés em madeira escura.',
    price: 340, oldPrice: null, cat: 'Poltronas',
    imgs: ['cadeiracinza.jpeg','cadeiracinza2.jpeg', 'cadeiracinza3.jpeg', 'cadeiracinza4.jpeg'],
    details: ['Tecido cinza mesclado em ótimo estado'
              ,'Ideais para sala de jantar, escritório ou quarto'
              ,'Vendidas em par (2 unidades)'
            ]
  },

   126: {
    name: 'Cama Casal Completa',
    desc: 'Precisa de uma cama de casal sem gastar muito? Colchão em bom estado, box funcional',
    price: 650, oldPrice: 800, cat: 'Camas',
    imgs: ['camacasal.jpeg','camacasal2.jpeg', 'camacasal3.jpeg', 'camacasal4.jpeg'],
    details: ['Ideal para quarto de hóspedes ou uso imediato'
              ,'Tamanho Casal (138 x 188 cm)'
              ,'Conjunto completo: box + colchão'
            ]
  },

  127: {
    name: 'Par de Cadeiras Estiloso',
    desc: 'Design atemporal que nunca sai de moda. Madeira maciça, encosto ripado e assento estofado branco — o tipo de cadeira que eleva qualquer sala de jantar.',
    price: 380, oldPrice: null, cat: 'Poltronas',
    imgs: ['cadeirabranca.jpeg','cadeirabranca2.jpeg', 'cadeirabranca3.jpeg', 'cadeirabranca4.jpeg'],
    details: ['Estilo escandinavo — combina com tudo'
              ,'Assento estofado confortável'
              ,'Conservadas e prontas para uso'
            ]
  },

  128: {
    name: 'Espreguiçadeiras de Madeira',
    desc: 'Estrutura sólida de madeira maciça.  Ótima oportunidade',
    price: 350, oldPrice: null, cat: 'Poltronas',
    imgs: ['espreguiçadeira.jpeg','espreguiçadeira2.jpeg', 'espreguiçadeira3.jpeg', 'espreguiçadeira4.jpeg'],
    details: ['Madeira maciça em ripas — estrutura firme'
              ,'Ideais para piscina, quintal ou varanda'
              ,'Pronta para retirada'
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


   132: {
    name: 'Cobreleito Queen',
    desc: 'Ideal para quem precisa de uma opção funcional sem gastar.',
    price: 50, oldPrice: null, cat: 'Enxoval',
    imgs: ['cobreleito.jpeg','cobreleito2.jpeg', 'cobreleito3.jpeg', 'cobreleito4.jpeg'],
    details: ['Tamanho Queen'
              ,'Funcional e lavável'
              ,'Pronto para retirada em Foz do Iguaçu'
            ]
  },

  133: {
  name: 'Ar Condicionado Consul Inverter 12.000 BTUs',
  desc: 'Consul Inverter — tecnologia que resfria rápido e economiza energia. 12.000 BTUs, conjunto completo com evaporadora e condensadora. Controle remoto original incluso. Oportunidade real por R$ 700.',
  price: 700, oldPrice: null, cat: 'Eletrodomésticos',
  imgs: ['ar.jpeg', 'ar2.jpeg', 'ar3.jpeg', 'ar4.jpeg', 'ar5.jpeg'],
  details: [
    'Marca Consul — referência em climatização',
    'Tecnologia Inverter — economia de energia',
    '12.000 BTUs — ideal para ambientes médios',
    'Conjunto completo: evaporadora + condensadora',
    'Controle remoto original incluso',
    'Parcelo em até 3x sem juros',
    'Retirada: Rua Centenário, 538 – Parque Morumbi 2',
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

136: {
  name: 'Arara de Madeira com Prateleiras',
  desc: 'Chega de quarto bagunçado. Arara em madeira resistente com barra de metal para roupas e 2 prateleiras para sapatos e acessórios — organização completa por R$ 250.',
  price: 250, oldPrice: null, cat: 'Móveis',
  imgs: ['arara.jpeg', 'arara2.jpeg', 'arara3.jpeg', 'arara4.jpeg' ],
  details: [
    'Estrutura em madeira resistente',
    'Barra de metal para pendurar roupas',
    '2 prateleiras — ideal para sapatos e acessórios',
    'Perfeita para quarto, closet ou loja',
    'Funcional e bem conservada',
    'Parcelo em até 3x sem juros',
    'Retirada: Rua Centenário, 538 – Parque Morumbi 2',
  ]
},

137: {
  name: 'Mesa Redonda de Pinus',
  desc: 'Charme rústico com muita estabilidade. Tampo em madeira de pinus envernizada e pé central em cruz — o tipo de peça que todo mundo pergunta de onde veio. Sala de jantar, varanda ou cozinha. R$ 450.',
  price: 450, oldPrice: null, cat: 'Móveis',
  imgs: ['pinus.jpeg', 'pinus2.jpeg', 'pinus3.jpeg', 'pinus5.jpeg'],
  details: [
    'Madeira de pinus maciça envernizada',
    'Pé central em cruz — super estável',
    'Formato redondo — perfeito para espaços menores',
    'Estilo rústico — combina com qualquer decoração',
    'Ideal para sala de jantar, varanda ou cozinha',
    'Parcelo em até 3x sem juros',
    'Retirada: Rua Centenário, 538 – Parque Morumbi 2',
  ]
},

139: {
  name: 'Espelho Redondo com Moldura',
  desc: 'Um espelho que decora antes mesmo de refletir. Moldura fina preta, formato redondo, 69cm de diâmetro — tendência que você vê em lojas de decoração por muito mais. R$ 150.',
  price: 169, oldPrice: 250, cat: 'Decoração',
  imgs: ['espelho.jpeg', 'espelho2.jpeg', 'espelho3.jpeg', 'espelho4.jpeg'],
  details: [
    'Moldura fina preta — design moderno e atemporal',
    '69cm de diâmetro — tamanho ideal para qualquer cômodo',
    'Perfeito para sala, quarto, hall ou banheiro',
    'Tendência em decoração — muito procurado',
    'Leve e fácil de instalar',
    'Parcelo em até 3x sem juros',
    'Retirada: Rua Centenário, 538 – Parque Morumbi 2',
  ]
},

140: {
  name: 'Mesa Industrial + Banco de Madeira',
  desc: 'Só a mesa industrial assim numa loja de design custa R$ 1.200+. Aqui você leva o conjunto completo — mesa com estrutura em ferro preto e tampo em madeira + banco ripado rústico — por R$ 599. Decora hoje, gasta pouco.',
  price: 599, oldPrice: null, cat: 'Móveis',
  imgs: ['banco+ap.jpeg', 'banco+ap2.jpeg', 'banco+ap3.jpeg', 'banco+ap4.jpeg'],
  details: [
    'Conjunto completo: mesa + banco inclusos',
    'Mesa estilo industrial — tampo em madeira com estrutura em ferro preto',
    'Banco de madeira ripado — rústico e charmoso',
    'Design industrial — tendência que não sai de moda',
    'Ideal para sala de jantar, escritório, varanda ou home office',
    'Economia de mais de R$ 600 vs loja de design',
    'Parcelo em até 3x sem juros',
    'Retirada: Rua Centenário, 538 – Parque Morumbi 2',
  ]
},

141: {
  name: 'Espelho Retangular',
  desc: 'Moldura fina preta e sem nenhuma trinca, sai por R$ 199. É só levar e apoiar — seu look nunca mais vai errar.',
  price: 199, oldPrice: null, cat: 'Decoração',
  imgs: ['espelhor.jpeg', 'espelhor2.jpeg', 'espelhor3.jpeg', 'espelhor4.jpeg' ],
  details: [
    'Espelho corpo inteiro — veja o look completo',
    'Moldura fina preta — minimalista e sofisticado',
    'Sem trincas ou defeitos — conservado',
    'Amplia o ambiente e dá sensação de espaço',
    'Ideal para quarto, closet, hall ou sala',
    'Fácil de apoiar ou pendurar',
    'Parcelo em até 3x sem juros',
    'Retirada: Rua Centenário, 538 – Parque Morumbi 2',
  ]
},

142: {
  name: 'Kit 3 Luminárias de Chão Industrial',
  desc: 'Cada luminária dessa em loja de decoração sai por R$ 300+. Aqui você leva as 3 por R$ 550 — menos do que custaria uma única nova. Base e haste em metal preto, cúpula direcional. O ambiente que você sempre quis por muito menos.',
  price: 550, oldPrice: 600, cat: 'Decoração',
  imgs: ['luminaria.jpeg', 'luminaria2.jpeg', 'luminaria3.jpeg', 'luminaria4.jpeg'],
  details: [
    'Kit completo com 3 luminárias inclusas',
    'Base e haste em metal preto — estilo industrial moderno',
    'Cúpula direcional — ilumina onde você quiser',
    'Ideal para sala, quarto, escritório ou varanda',
    'Economia de mais de R$ 350 vs comprar novas',
    'Ambiente sofisticado na hora',
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
145: {
  name: 'Conjunto Mesa Redonda + 2 Cadeiras Buenos Aires',
  desc: 'Só a mesa de madeira maciça numa loja custa R$ 800+. Aqui você leva o conjunto completo — mesa com tampo em madeira e pé central em cruz + 2 cadeiras estofadas em tecido cinza com base em metal preto — por R$ 850. Monta o espaço hoje.',
  price: 850, oldPrice: 1500, cat: 'Móveis',
  imgs: ['conjuntobuenos.jpeg', 'conjuntobuenos2.jpeg', 'conjuntobuenos3.jpeg', 'conjuntobuenos4.jpeg', 'conjuntobuenos5.jpeg'],
  details: [
    'Conjunto completo: mesa redonda + 2 cadeiras',
    'Mesa em madeira maciça — tampo com pé central em cruz',
    '2 cadeiras estofadas em tecido cinza',
    'Base das cadeiras em metal preto — estilo contemporâneo',
    'Combinação harmoniosa e pronta pra uso',
    'Ideal para sala de jantar, cozinha ou varanda',
    'Parcelo em até 3x sem juros',
    'Retirada: Rua Centenário, 538 – Parque Morumbi 2',
  ]
},

146: {
  name: 'Lustre Rattan Redondo Boho',
  desc: 'Lustres rattan assim em loja de decoração custam R$ 600, R$ 800+. Aqui você transforma sua casa por R$ 250 — rattan trançado natural escuro, luz que atravessa o trançado criando sombras incríveis nas paredes. É só levar e pendurar.',
  price: 250, oldPrice: 600, cat: 'Decoração',
  imgs: ['lustrerattan.jpeg', 'lustrerattan2.jpeg', 'lustrerattan3.jpeg','lustrerattan4.jpeg'],
  details: [
    'Rattan artesanal trançado natural escuro',
    'Formato redondo — design boho atemporal',
    'Luz que cria sombras incríveis nas paredes',
    'Já instalado e funcionando — só levar e pendurar',
    'Ideal para sala de jantar, cozinha, varanda ou quarto',
    'Economia de mais de R$ 350 vs loja de decoração',
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

149: {
  name: 'Bicicleta Milano Action Lady Aro 26',
  desc: 'Chega de trânsito, combustível caro e ônibus lotado. Essa Milano Action Lady aro 26 entrega conforto, estilo e economia por apenas R$ 299.',
  price: 299,
  oldPrice: 400,
  cat: 'Outros',
  imgs: [
    'bicicletamilano.jpeg',
    'bicicletamilano3.jpeg',
    'bicicletamilano4.jpeg',
    'bicicletamilano5.jpeg',
    'bicicletamilano6.jpeg',
  ],
  details: [
    'Bicicleta feminina Milano Action Lady',
    'Quadro feminino rosa — moderno e estiloso',
    'Aro 26 resistente com pneus todo-terreno',
    'Câmbio traseiro ideal para diferentes terrenos',
    'Freios dianteiro e traseiro para mais segurança',
    'Bike revisada e pronta pra uso'
  ]
},

150: {
  name: 'Lustre Rattan Artesanal Formato Sino',
  desc: 'Lustres rattan grandes como esse passam fácil dos R$ 700 nas lojas de decoração. Aqui você leva uma peça artesanal sofisticada, com iluminação aconchegante e visual de revista por apenas R$ 300.',
  price: 300,
  oldPrice: 899,
  cat: 'Decoração',
  imgs: [
    'lustrerattansino.jpeg',
    'lustrerattansino2.jpeg',
    'lustrerattansino3.jpeg',
    'lustrerattansino4.jpeg',
  ],
  details: [
    'Lustre artesanal em rattan formato sino',
    'Tamanho grande e visual imponente',
    'Trançado natural dourado sofisticado',
    'Iluminação aconchegante com efeito decorativo incrível',
    'Ideal para sala de jantar, cozinha, varanda ou quarto',
    'Estilo boho chic moderno e elegante',
    'Já instalado e funcionando — pronto pra uso',
    'Economia de mais de R$ 500 comparado às lojas',
    'Parcelamento em até 3x sem juros',
  ]
},

151: {
  name: 'Balcão Expositor de Vidro',
  desc: 'Sua loja merece uma apresentação profissional. Balcão expositor com estrutura resistente e prateleiras em vidro — visual moderno que valoriza qualquer produto. Ideal para lojas, conveniências e vitrines por R$ 450.',
  price: 450, oldPrice: null, cat: 'Móveis',
  imgs: ['balcaoexpositor.jpeg', 'balcaoexpositor2.jpeg', 'balcaoexpositor3.jpeg', 'balcaoexpositor4.jpeg'],
  details: [
    'Estrutura resistente e bem conservada',
    'Prateleiras em vidro — valoriza a exposição dos produtos',
    'Visual moderno e profissional',
    'Ideal para lojas, conveniências e vitrines',
    'Fácil de limpar e organizar',
    'Parcelo em até 3x sem juros',
    'Retirada: Rua Centenário, 538 – Parque Morumbi 2',
  ]
},

153: {
  name: 'Janela de Ferro Decorativa com Vidro Canelado',
  desc: 'Detalhes ornamentais em ferro que ninguém mais fabrica assim por esse preço. Vidro canelado que garante privacidade sem abrir mão da luz natural — 1,24m x 1,50m, pronta para instalar. R$ 199.',
  price: 199, oldPrice: null, cat: 'Decoração',
  imgs: ['janelaforro.jpeg', 'janelaforro2.jpeg', 'janelaforro3.jpeg'],
  details: [
    'Estrutura resistente em ferro',
    'Design trabalhado com detalhes ornamentais',
    'Vidro canelado — privacidade sem perder luminosidade',
    'Medidas: 1,24m x 1,50m',
    'Ideal para casas, áreas gourmet e edículas',
    'Pronta para instalação imediata',
    'Retirada: Rua Centenário, 538 – Parque Morumbi 2',
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

155: {
  name: 'Janela de Ferro Trabalhada com Vidro Canelado',
  desc: 'Maior e mais trabalhada que o modelo anterior — 2,00m x 1,50m de ferro ornamental com vidro canelado.',
  price: 199, oldPrice: null, cat: 'Construção',
  imgs: ['janelaforro.jpeg', 'janelaforro2.jpeg', 'janelaforro3.jpeg'],
  details: [
    'Estrutura reforçada em ferro',
    'Detalhes ornamentais que valorizam o ambiente',
    'Vidro canelado — privacidade sem perder luminosidade',
    'Medidas: 2,00m x 1,50m — tamanho generoso',
    'Ideal para salas, áreas gourmet, varandas e fachadas',
    'Pronta para instalação imediata',
    'Retirada: Rua Centenário, 538 – Parque Morumbi 2',
  ]
},

156: {
  name: 'Batedeira Elétrica',
  desc: 'Aquela receita que você adia por não ter batedeira — resolve por R$ 80. Compacta, prática e fácil de limpar, acompanha tigela e batedor. Ideal para bolos, massas e muito mais.',
  price: 80, oldPrice: 120, cat: 'Eletrodomésticos',
  imgs: ['batedeira.jpeg', 'batedeira2.jpeg', 'batedeira3.jpeg'],
  details: [
    'Ideal para bolos, massas e receitas diversas',
    'Acompanha tigela e batedor',
    'Compacta — cabe em qualquer cozinha',
    'Fácil de usar e limpar',
    'Funcionando perfeitamente — testada antes de anunciar',
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

158: {
  name: 'Balança Digital de Vidro',
  desc: 'Sem desculpas para não acompanhar o peso. Balança digital com base em vidro temperado, display de fácil leitura e acionamento automático — é só subir e ver o resultado. Praticidade e estilo por R$ 60.',
  price: 60, oldPrice: null, cat: 'Outros',
  imgs: ['balanca.jpeg', 'balanca2.jpeg', 'balanca3.jpeg'],
  details: [
    'Balança digital eletrônica',
    'Base em vidro temperado — moderna e resistente',
    'Display digital de fácil leitura',
    'Acionamento automático ao subir na balança',
    'Perfeita para uso diário em casa',
    'Parcelo em até 3x sem juros',
    'Retirada: Rua Centenário, 538 – Parque Morumbi 2',
  ]
},

159: {
  name: 'Ferro de Passar a Vapor',
  desc: 'Tecido delicado, jeans grosso, camisa social — esse ferro resolve tudo com o controle de temperatura certo. Função vapor que elimina amassados difíceis sem esforço. De R$ 80 por R$ 50.',
  price: 50, oldPrice: 80, cat: 'Eletrodomésticos',
  imgs: ['ferro.jpeg', 'ferro2.jpeg', 'ferro3.jpeg'],
  details: [
    'Função vapor — remove amassados com facilidade',
    'Controle de temperatura para diferentes tipos de tecido',
    'Design ergonômico e fácil de manusear',
    'Ideal para uso doméstico diário',
    'De R$ 80 por R$ 50 — aproveite o desconto',
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
