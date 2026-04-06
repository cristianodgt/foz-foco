/**
 * seed-demo.ts — Dados de demonstração para o portal Foz em Foco
 *
 * REMOVER TUDO: npx tsx prisma/seed-demo.ts --cleanup
 * CRIAR TUDO:   npx tsx prisma/seed-demo.ts
 *
 * Todas as matérias têm a tag "EXEMPLO" para identificação fácil.
 * Todos os registros têm IDs prefixados com "demo-" para remoção limpa.
 */

import { PrismaClient, PostStatus, AdType, AdPosition } from '@prisma/client'

const prisma = new PrismaClient()
const DEMO_TAG_SLUG = 'exemplo'
const DEMO_AUTHOR_EMAIL = 'luana.fachi@hotmail.com'

// ─── Imagens de capa (geradas via nano-banana, servidas pelo Next.js) ──────────
const ARTICLE_IMAGES = [
  '/seed/articles/art-1.jpeg',   // vista aérea Foz
  '/seed/articles/art-2.jpeg',   // Cataratas
  '/seed/articles/art-3.jpeg',   // Itaipu
  '/seed/articles/art-4.jpeg',   // fronteira / comércio
  '/seed/articles/art-5.jpeg',   // câmara / política
  '/seed/articles/art-6.jpeg',   // festival cultural
  '/seed/articles/art-7.jpeg',   // segurança / PF
  '/seed/articles/art-8.jpeg',   // turismo hotel
]

function img(i: number) {
  return ARTICLE_IMAGES[i % ARTICLE_IMAGES.length]
}

// ─── Posts de demonstração ────────────────────────────────────────────────────
const DEMO_POSTS = [
  // POLÍTICA
  {
    id: 'demo-post-01',
    title: 'Prefeitura anuncia pacote de R$ 12 mi para revitalização do Centro',
    slug: 'demo-prefeitura-revitalizacao-centro',
    summary: 'Projeto contempla reforma de calçadas, iluminação LED e novos espaços de convivência na área central.',
    content: `<h2>Investimento histórico para o Centro</h2><p>A Prefeitura de Foz do Iguaçu anunciou nesta semana um pacote de obras no valor de R$ 12 milhões para revitalização do Centro Histórico. O projeto prevê reforma completa das calçadas da Av. Brasil, instalação de 400 pontos de iluminação LED e criação de três novos espaços públicos.</p><p>"Vamos transformar o Centro de Foz em um cartão-postal à altura de nossas Cataratas", declarou o prefeito durante a apresentação do projeto.</p><p>As obras têm previsão de início no próximo mês e devem ser concluídas em 18 meses.</p>`,
    cat: 'politica', img: 0, featured: true,
  },
  {
    id: 'demo-post-02',
    title: 'Câmara aprova novo Plano Diretor com foco em sustentabilidade',
    slug: 'demo-camara-plano-diretor-sustentabilidade',
    summary: 'Documento norteia o desenvolvimento urbano pelos próximos 10 anos, priorizando mobilidade verde.',
    content: `<h2>Planejamento urbano para a próxima década</h2><p>A Câmara Municipal de Foz do Iguaçu aprovou por unanimidade o novo Plano Diretor, que vai nortear o desenvolvimento urbano pelos próximos 10 anos. Entre os pontos principais estão corredores BRT, expansão de ciclovias e preservação de 30% da área verde municipal.</p>`,
    cat: 'politica', img: 4, featured: false,
  },
  {
    id: 'demo-post-03',
    title: 'Governo estadual libera R$ 40 mi para duplicação da PR-495',
    slug: 'demo-governo-duplicacao-pr-495',
    summary: 'Obra vai melhorar o fluxo entre Foz do Iguaçu e Cascavel, beneficiando mais de 200 mil motoristas por mês.',
    content: `<h2>Infraestrutura viária recebe investimento milionário</h2><p>O governador do Paraná assinou nesta semana a ordem de liberação de R$ 40 milhões para as obras de duplicação da PR-495, principal corredor rodoviário entre Foz do Iguaçu e Cascavel.</p><p>A obra está prevista para durar 24 meses e deve gerar 600 empregos diretos durante a construção.</p>`,
    cat: 'politica', img: 0, featured: false,
  },
  {
    id: 'demo-post-04',
    title: 'Eleições municipais: pesquisa aponta favoritismo da situação',
    slug: 'demo-eleicoes-municipais-pesquisa',
    summary: 'Levantamento realizado com 1.200 eleitores mostra atual gestão com 58% de aprovação.',
    content: `<h2>Pesquisa eleitoral revela cenário favorável à situação</h2><p>Uma pesquisa de intenção de voto realizada pelo Instituto DataFronteira ouviu 1.200 eleitores de Foz do Iguaçu e apontou que a atual gestão municipal tem 58% de aprovação. A margem de erro é de 3 pontos percentuais.</p>`,
    cat: 'politica', img: 4, featured: false,
  },
  // TURISMO
  {
    id: 'demo-post-05',
    title: 'Cataratas batem recorde: 183 mil visitantes em julho',
    slug: 'demo-cataratas-recorde-visitantes-julho',
    summary: 'Parque Nacional registrou o maior número de turistas da história, superando recorde de 2019.',
    content: `<h2>Número histórico de visitantes</h2><p>O Parque Nacional do Iguaçu registrou em julho o maior número de visitantes da sua história: 183.427 turistas. O crescimento é atribuído à retomada do turismo internacional, especialmente de argentinos e europeus.</p><ul><li>Brasil: 45% dos visitantes</li><li>Argentina: 28%</li><li>Europa: 15%</li><li>Outros: 12%</li></ul>`,
    cat: 'turismo', img: 1, featured: true,
  },
  {
    id: 'demo-post-06',
    title: 'Hotéis de Foz registram 98% de ocupação na alta temporada',
    slug: 'demo-hoteis-foz-ocupacao-alta-temporada',
    summary: 'Turistas do Mercosul impulsionam setor hoteleiro ao maior índice de ocupação da história.',
    content: `<h2>Turismo aquecido no inverno</h2><p>Os hotéis de Foz do Iguaçu registraram em julho a maior taxa de ocupação da história da cidade: 98% dos quartos ocupados durante os fins de semana. A cidade espera fechar o semestre com receita turística 35% superior ao mesmo período do ano anterior.</p>`,
    cat: 'turismo', img: 7, featured: false,
  },
  {
    id: 'demo-post-07',
    title: 'Novo roteiro turístico integra Foz, Puerto Iguazú e Ciudad del Este',
    slug: 'demo-roteiro-turistico-trifronteira',
    summary: 'Iniciativa trilateral facilita a visita a atrações nos três países em um único pacote.',
    content: `<h2>Turismo integrado na Tríplice Fronteira</h2><p>Os governos do Brasil, Argentina e Paraguai anunciaram um novo roteiro turístico integrado que conecta as principais atrações de Foz do Iguaçu, Puerto Iguazú e Ciudad del Este em um único pacote de 3 dias.</p>`,
    cat: 'turismo', img: 1, featured: false,
  },
  {
    id: 'demo-post-08',
    title: 'Wepink inaugura 2ª unidade com cosméticos no Catuaí Palladium',
    slug: 'demo-wepink-inaugura-segunda-unidade-catuai',
    summary: 'Quiosque abre no piso L1, em frente à Havan, com foco em cosméticos e suplementos.',
    content: `<h2>Nova opção de beleza e bem-estar no Catuaí</h2><p>A marca Wepink inaugura sua segunda unidade em Foz do Iguaçu no Shopping Catuaí Palladium. O quiosque, instalado no piso L1 em frente à loja Havan, oferece cosméticos, perfumes e suplementos alimentares.</p>`,
    cat: 'turismo', img: 7, featured: false,
  },
  // ECONOMIA
  {
    id: 'demo-post-09',
    title: 'Itaipu investe R$ 800 mi em energia solar e eólica no Oeste do PR',
    slug: 'demo-itaipu-investimento-energia-renovavel',
    summary: 'Programa de expansão visa diversificar a matriz energética e gerar 2.400 empregos na região.',
    content: `<h2>Itaipu diversifica sua matriz energética</h2><p>A Itaipu Binacional anunciou um plano de expansão com investimento de R$ 800 milhões em projetos de energia solar e eólica na região Oeste do Paraná. O programa vai gerar aproximadamente 2.400 empregos diretos durante a fase de construção.</p>`,
    cat: 'economia', img: 2, featured: false,
  },
  {
    id: 'demo-post-10',
    title: 'Terminal Internacional de Foz é inaugurado com capacidade triplicada',
    slug: 'demo-terminal-internacional-inaugurado',
    summary: 'Nova estrutura de R$ 25 milhões atende mais de 15 mil passageiros por dia rumo ao Paraguai e Argentina.',
    content: `<h2>Novo terminal moderniza transporte internacional</h2><p>O novo Terminal de Ônibus Internacional de Foz do Iguaçu foi inaugurado com capacidade triplicada. Com investimento de R$ 25 milhões, a estrutura interliga Foz com Ciudad del Este (Paraguai) e Puerto Iguazú (Argentina).</p>`,
    cat: 'economia', img: 3, featured: false,
  },
  {
    id: 'demo-post-11',
    title: 'MacBook Neo chegou ao Paraguai: preços até 40% menores que no Brasil',
    slug: 'demo-macbook-neo-paraguai-precos',
    summary: 'Lojas de Ciudad del Este já têm estoque do novo modelo Apple com vantagem significativa de preço.',
    content: `<h2>Apple no Paraguai: economia garantida</h2><p>O novo MacBook Neo chegou às prateleiras das principais lojas de eletrônicos de Ciudad del Este com preços até 40% inferiores aos praticados no Brasil. Turistas de compras já fazem fila nas lojas para garantir o equipamento.</p>`,
    cat: 'economia', img: 3, featured: false,
  },
  {
    id: 'demo-post-12',
    title: 'Foz do Iguaçu tem menor taxa de desemprego do Paraná em 2026',
    slug: 'demo-foz-menor-desemprego-parana-2026',
    summary: 'Cidade registra 4,2% de desemprego, impulsionada pelos setores de turismo, comércio e construção.',
    content: `<h2>Economia aquecida gera empregos</h2><p>Foz do Iguaçu atingiu a menor taxa de desemprego do Paraná em 2026, com apenas 4,2% da população economicamente ativa sem emprego formal. Os setores de turismo, comércio fronteiriço e construção civil lideram a geração de vagas.</p>`,
    cat: 'economia', img: 2, featured: false,
  },
  // SEGURANÇA
  {
    id: 'demo-post-13',
    title: 'Operação Fronteira Segura apreende R$ 3,2 mi em mercadorias ilegais',
    slug: 'demo-operacao-fronteira-segura-apreensao',
    summary: 'PF, Receita Federal e Exército agem em conjunto na maior operação de combate ao contrabando de 2026.',
    content: `<h2>Operação integrada combate contrabando</h2><p>A Polícia Federal, em conjunto com a Receita Federal e o Exército Brasileiro, deflagrou a Operação Fronteira Segura, resultando na apreensão de R$ 3,2 milhões em mercadorias contrabandeadas. Seis pessoas foram presas em flagrante.</p>`,
    cat: 'seguranca', img: 6, featured: false,
  },
  {
    id: 'demo-post-14',
    title: 'Programa Foz Segura reduz em 40% os roubos de veículos',
    slug: 'demo-programa-foz-segura-roubos-veiculos',
    summary: 'Integração entre PM, PC e guarda municipal com câmeras de monitoramento mostra resultado expressivo.',
    content: `<h2>Segurança pública apresenta resultados</h2><p>Os índices de roubo de veículos em Foz do Iguaçu caíram 40% nos últimos três meses. O resultado é fruto do Programa Foz Segura, que integra ações da Polícia Militar, Polícia Civil e Guarda Municipal.</p>`,
    cat: 'seguranca', img: 6, featured: false,
  },
  {
    id: 'demo-post-15',
    title: 'Polícia Civil prende quadrilha especializada em estelionato digital',
    slug: 'demo-policia-civil-quadrilha-estelionato-digital',
    summary: 'Grupo aplicava golpes via PIX e WhatsApp em vítimas de todo o Brasil operando a partir de Foz.',
    content: `<h2>Golpistas digitais são desarticulados em Foz</h2><p>A Polícia Civil prendeu sete integrantes de uma quadrilha especializada em estelionato digital que operava a partir de Foz do Iguaçu. O grupo aplicava golpes via PIX e WhatsApp em vítimas de todo o Brasil, movimentando mais de R$ 1,8 milhão.</p>`,
    cat: 'seguranca', img: 6, featured: false,
  },
  // CULTURA
  {
    id: 'demo-post-16',
    title: 'Festival Folclórico das Etnias reúne 15 países em Foz',
    slug: 'demo-festival-folklorico-etnias-foz',
    summary: 'Evento celebra a diversidade cultural da cidade com dança, gastronomia e artesanato de 15 nações.',
    content: `<h2>Diversidade cultural em destaque</h2><p>Foz do Iguaçu, conhecida por reunir mais de 80 nacionalidades, recebe o Festival Folclórico das Etnias no Parque Municipal Beira Foz. O evento conta com apresentações de dança árabe, paraguaia, alemã e japonesa, além de feira gastronômica com pratos de 15 países.</p>`,
    cat: 'cultura', img: 5, featured: true,
  },
  {
    id: 'demo-post-17',
    title: 'A maior FESPOP de todos os tempos chega em maio',
    slug: 'demo-fespop-maior-todos-os-tempos-maio',
    summary: 'Festival de música popular de Foz terá 4 dias de programação com artistas nacionais e internacionais.',
    content: `<h2>FESPOP 2026: a maior edição da história</h2><p>A Festa Popular de Foz (FESPOP) 2026 promete ser a maior edição da história do evento, com quatro dias de programação intensa do dia 7 ao dia 10 de maio. Artistas nacionais e internacionais confirmados incluem nomes do forró, sertanejo e pop.</p>`,
    cat: 'cultura', img: 5, featured: false,
  },
  {
    id: 'demo-post-18',
    title: 'Unidos do Iguaçu conquista título no Carnaval do Paraná',
    slug: 'demo-unidos-iguacu-titulo-carnaval-parana',
    summary: 'Escola desfila com enredo sobre a história da Tríplice Fronteira e arranca notas máximas dos juízes.',
    content: `<h2>Glória para Foz no Carnaval paranaense</h2><p>A escola de samba Unidos do Iguaçu conquistou o título do Carnaval do Paraná com um enredo emocionante sobre a história da Tríplice Fronteira entre Brasil, Argentina e Paraguai. Com mais de 800 componentes, o desfile foi considerado o melhor da história da escola.</p>`,
    cat: 'cultura', img: 5, featured: false,
  },
  {
    id: 'demo-post-19',
    title: 'Mostra de cinema latino-americano abre inscrições para cineastas locais',
    slug: 'demo-mostra-cinema-latino-americano-inscricoes',
    summary: 'Festival aceita curtas-metragens de diretores da Tríplice Fronteira até o dia 30 de abril.',
    content: `<h2>Cinema fronteiriço ganha destaque</h2><p>A 8ª Mostra de Cinema Latino-Americano de Foz do Iguaçu abriu inscrições para cineastas da região da Tríplice Fronteira. Podem concorrer curtas-metragens de até 20 minutos produzidos por diretores residentes em Foz, Ciudad del Este ou Puerto Iguazú.</p>`,
    cat: 'cultura', img: 5, featured: false,
  },
  {
    id: 'demo-post-20',
    title: 'Corrida das Três Fronteiras reúne 3 mil atletas em Foz',
    slug: 'demo-corrida-tres-fronteiras-atletas',
    summary: 'Prova percorre pontos turísticos da cidade e termina com vista panorâmica para as Cataratas.',
    content: `<h2>Esporte e turismo juntos na fronteira</h2><p>A tradicional Corrida das Três Fronteiras reuniu 3.200 atletas de todo o Brasil e países vizinhos. O percurso de 10km passa pelos principais pontos turísticos de Foz do Iguaçu, com chegada na Orla do Lago Itaipu com vista para as Cataratas.</p>`,
    cat: 'cultura', img: 1, featured: false,
  },
  {
    id: 'demo-post-21',
    title: 'Show gratuito na Praça da Paz marca aniversário da cidade',
    slug: 'demo-show-gratuito-praca-paz-aniversario',
    summary: 'Prefeitura confirma show de artistas regionais para celebrar os aniversário de Foz do Iguaçu.',
    content: `<h2>Aniversário de Foz terá show gratuito</h2><p>A Prefeitura de Foz do Iguaçu confirmou um grande show gratuito na Praça da Paz para celebrar o aniversário da cidade. O evento contará com artistas regionais e atrações para toda a família, com entrada gratuita.</p>`,
    cat: 'cultura', img: 5, featured: false,
  },
  {
    id: 'demo-post-22',
    title: 'Atenção concurseiros: Prefeitura abre 450 vagas com salários até R$ 10,3 mi',
    slug: 'demo-concurso-prefeitura-450-vagas',
    summary: 'Edital prevê cargos em diversas áreas com provas previstas para maio e junho deste ano.',
    content: `<h2>Concurso público com centenas de vagas</h2><p>A Prefeitura de Foz do Iguaçu publicou edital de concurso público com 450 vagas para diversas áreas da administração municipal. As provas estão previstas para maio e junho, com salários que variam de R$ 2.500 a R$ 10.300.</p><p>As inscrições podem ser feitas pelo site oficial da prefeitura até o dia 20 de abril.</p>`,
    cat: 'politica', img: 4, featured: false,
  },
]

// ─── Anúncios de demonstração ─────────────────────────────────────────────────
const DEMO_ADS = [
  {
    id: 'demo-ad-top-1',
    title: 'Foz em Foco — Anuncie aqui (Topo)',
    type: AdType.BANNER,
    imageUrl: '/seed/ads/ad-top-1.jpeg',
    targetUrl: '/anunciantes',
    client: 'DEMO',
    position: AdPosition.GRID_BANNER_TOP,
  },
  {
    id: 'demo-ad-bot-1',
    title: 'Foz em Foco — Anuncie aqui (Base)',
    type: AdType.BANNER,
    imageUrl: '/seed/ads/ad-bot-1.jpeg',
    targetUrl: '/anunciantes',
    client: 'DEMO',
    position: AdPosition.GRID_BANNER_BOTTOM,
  },
  {
    id: 'demo-ad-sidebar-1',
    title: 'Foz em Foco — Sidebar 300x250',
    type: AdType.BANNER,
    imageUrl: '/seed/ads/ad-sidebar-1.jpeg',
    targetUrl: '/anunciantes',
    client: 'DEMO',
    position: AdPosition.SIDEBAR,
  },
  {
    id: 'demo-ad-inline-1',
    title: 'Foz em Foco — Inline Banner',
    type: AdType.BANNER,
    imageUrl: '/seed/ads/ad-inline-1.jpeg',
    targetUrl: '/anunciantes',
    client: 'DEMO',
    position: AdPosition.INLINE_BANNER,
  },
  {
    id: 'demo-ad-article-1',
    title: 'Foz em Foco — Topo de Matéria',
    type: AdType.BANNER,
    imageUrl: '/seed/ads/ad-article-1.jpeg',
    targetUrl: '/anunciantes',
    client: 'DEMO',
    position: AdPosition.ARTICLE_TOP,
  },
]

// ─── Cleanup ──────────────────────────────────────────────────────────────────
async function cleanup() {
  console.log('🗑️  Removendo dados de demonstração...')

  // Remove posts
  const slugs = DEMO_POSTS.map(p => p.slug)
  const deleted = await prisma.post.deleteMany({ where: { slug: { in: slugs } } })
  console.log(`✅ ${deleted.count} posts removidos`)

  // Remove ads
  const adIds = DEMO_ADS.map(a => a.id)
  const deletedAds = await prisma.ad.deleteMany({ where: { id: { in: adIds } } })
  console.log(`✅ ${deletedAds.count} anúncios removidos`)

  // Remove tag EXEMPLO se não tem mais posts
  const tag = await prisma.tag.findUnique({ where: { slug: DEMO_TAG_SLUG } })
  if (tag) {
    await prisma.tag.delete({ where: { slug: DEMO_TAG_SLUG } }).catch(() => {})
    console.log('✅ Tag EXEMPLO removida')
  }

  console.log('🏁 Cleanup concluído!')
}

// ─── Seed ─────────────────────────────────────────────────────────────────────
async function seed() {
  console.log('🌱 Criando dados de demonstração...')

  const author = await prisma.user.findUniqueOrThrow({ where: { email: DEMO_AUTHOR_EMAIL } })

  // Ensure categories exist
  const catMap: Record<string, string> = {}
  for (const catSlug of ['politica', 'economia', 'seguranca', 'turismo', 'cultura']) {
    const cat = await prisma.category.findUnique({ where: { slug: catSlug } })
    if (cat) catMap[catSlug] = cat.id
  }

  // Ensure EXEMPLO tag exists
  const exTag = await prisma.tag.upsert({
    where: { slug: DEMO_TAG_SLUG },
    update: {},
    create: { name: 'EXEMPLO', slug: DEMO_TAG_SLUG },
  })
  console.log('✅ Tag EXEMPLO garantida')

  // Create posts
  let postCount = 0
  for (let i = 0; i < DEMO_POSTS.length; i++) {
    const p = DEMO_POSTS[i]
    const catId = catMap[p.cat]
    if (!catId) { console.warn(`⚠️  Categoria ${p.cat} não encontrada, pulando ${p.slug}`); continue }

    await prisma.post.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        id: p.id,
        title: p.title,
        slug: p.slug,
        summary: p.summary,
        content: p.content,
        coverImage: img(p.img),
        status: PostStatus.PUBLISHED,
        featured: p.featured,
        categoryId: catId,
        authorId: author.id,
        publishedAt: new Date(Date.now() - i * 1000 * 60 * 60 * 3), // escalonado de 3 em 3 horas
        views: Math.floor(Math.random() * 8000) + 200,
        tags: { connect: [{ slug: DEMO_TAG_SLUG }] },
      },
    })
    postCount++
  }
  console.log(`✅ ${postCount} posts criados`)

  // Create ads
  const now = new Date()
  const endsAt = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 90) // 90 dias
  let adCount = 0
  for (const ad of DEMO_ADS) {
    await prisma.ad.upsert({
      where: { id: ad.id },
      update: {},
      create: {
        ...ad,
        frequency: 1,
        active: true,
        startsAt: now,
        endsAt,
      },
    })
    adCount++
  }
  console.log(`✅ ${adCount} anúncios criados`)

  console.log('\n🎉 Seed demo concluído!')
  console.log('ℹ️  Para remover tudo: npx tsx prisma/seed-demo.ts --cleanup')
}

// ─── Entry point ──────────────────────────────────────────────────────────────
const isCleanup = process.argv.includes('--cleanup')

;(isCleanup ? cleanup() : seed())
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
