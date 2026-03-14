import { PrismaClient, PostStatus, AdType, AdPosition } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  // Admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@fozfoco.com.br' },
    update: {},
    create: {
      name: 'Admin Foz.Foco',
      email: 'admin@fozfoco.com.br',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })
  console.log('✅ Admin criado:', admin.email)

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'politica' },
      update: {},
      create: { name: 'Política', slug: 'politica', color: '#EF4444', icon: '🏛️', order: 1 },
    }),
    prisma.category.upsert({
      where: { slug: 'economia' },
      update: {},
      create: { name: 'Economia', slug: 'economia', color: '#10B981', icon: '💰', order: 2 },
    }),
    prisma.category.upsert({
      where: { slug: 'seguranca' },
      update: {},
      create: { name: 'Segurança', slug: 'seguranca', color: '#F59E0B', icon: '🚔', order: 3 },
    }),
    prisma.category.upsert({
      where: { slug: 'turismo' },
      update: {},
      create: { name: 'Turismo', slug: 'turismo', color: '#3B82F6', icon: '🌊', order: 4 },
    }),
    prisma.category.upsert({
      where: { slug: 'cultura' },
      update: {},
      create: { name: 'Cultura', slug: 'cultura', color: '#8B5CF6', icon: '🎭', order: 5 },
    }),
  ])
  console.log('✅ Categorias criadas:', categories.length)

  const [politica, economia, seguranca, turismo, cultura] = categories

  // Posts
  const postsData = [
    {
      title: 'Prefeitura anuncia novo pacote de obras para o Centro de Foz do Iguaçu',
      slug: 'prefeitura-anuncia-novo-pacote-obras-centro-foz',
      summary: 'A administração municipal revelou investimento de R$ 12 milhões para revitalização do centro histórico da cidade.',
      content: `<h2>Investimento histórico para o centro da cidade</h2><p>A Prefeitura de Foz do Iguaçu anunciou nesta semana um pacote de obras no valor de R$ 12 milhões destinado à revitalização do centro histórico da cidade. O projeto contempla reforma de calçadas, iluminação LED, sinalização turística e paisagismo.</p><p>Segundo o prefeito, as obras devem começar no próximo mês e têm previsão de conclusão em 18 meses. "Vamos transformar o centro de Foz em um cartão postal à altura da grandiosidade das nossas cataratas", declarou.</p><h3>O que está previsto</h3><ul><li>Reforma completa das calçadas da Av. Brasil</li><li>Instalação de 400 pontos de iluminação LED</li><li>Criação de 3 novos espaços públicos de convivência</li><li>Sinalização turística bilíngue (português/espanhol)</li></ul><p>O projeto foi desenvolvido em parceria com o Itaipu Binacional e conta com recursos do governo federal.</p>`,
      categoryId: politica.id,
      featured: true,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(),
    },
    {
      title: 'Cataratas do Iguaçu batem recorde de visitantes em julho',
      slug: 'cataratas-iguacu-recorde-visitantes-julho',
      summary: 'Parque Nacional registrou mais de 180 mil turistas no mês, superando recorde histórico anterior de 2019.',
      content: `<h2>Número histórico de visitantes</h2><p>O Parque Nacional do Iguaçu registrou em julho o maior número de visitantes da sua história: 183.427 turistas, superando o recorde anterior de 176.000 em julho de 2019.</p><p>O crescimento é atribuído à retomada do turismo internacional, especialmente de argentinos e europeus, além do forte movimento do mercado doméstico.</p><h3>Principais mercados emissores</h3><ul><li>Brasil: 45% dos visitantes</li><li>Argentina: 28%</li><li>Europa (principalmente Alemanha e França): 15%</li><li>Outros: 12%</li></ul><p>O diretor do parque destaca que a capacidade de visitação diária está sendo gerenciada para garantir a preservação ambiental.</p>`,
      categoryId: turismo.id,
      featured: true,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    {
      title: 'Itaipu Binacional anuncia expansão do programa de energia renovável',
      slug: 'itaipu-binacional-expansao-energia-renovavel',
      summary: 'Usina vai investir R$ 800 milhões em projetos de energia solar e eólica na região Oeste do Paraná.',
      content: `<h2>Itaipu investe em diversificação energética</h2><p>A Itaipu Binacional anunciou um plano de expansão do seu portfólio de energia renovável, com investimento de R$ 800 milhões em projetos de energia solar e eólica na região Oeste do Paraná.</p><p>O programa visa complementar a geração hidrelétrica durante períodos de seca e fortalecer a segurança energética da região.</p><p>Serão criados aproximadamente 2.400 empregos diretos durante a fase de construção dos novos complexos energéticos.</p>`,
      categoryId: economia.id,
      featured: false,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    },
    {
      title: 'Polícia Federal deflagra operação contra contrabando na fronteira',
      slug: 'policia-federal-operacao-contrabando-fronteira',
      summary: 'Operação Fronteira Segura apreende mais de R$ 3 milhões em mercadorias ilegais na região da tríplice fronteira.',
      content: `<h2>Operação integrada combate contrabando</h2><p>A Polícia Federal, em conjunto com a Receita Federal e o Exército Brasileiro, deflagrou nesta quinta-feira a Operação Fronteira Segura, resultando na apreensão de R$ 3,2 milhões em mercadorias contrabandeadas.</p><p>Foram apreendidos eletrônicos, cigarros e peças automotivas que seriam distribuídos em diversas cidades do interior do Paraná.</p><p>Seis pessoas foram presas em flagrante durante a operação.</p>`,
      categoryId: seguranca.id,
      featured: false,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
    },
    {
      title: 'Festival Folclórico das Etnias reúne 15 países em Foz do Iguaçu',
      slug: 'festival-folklorico-etnias-foz-iguacu',
      summary: 'Evento cultural celebra a diversidade étnica da cidade com apresentações, gastronomia e artesanato de 15 nações.',
      content: `<h2>Diversidade cultural em destaque</h2><p>Foz do Iguaçu, conhecida por ser uma das cidades mais plurais do Brasil com mais de 80 nacionalidades, recebe neste fim de semana o Festival Folclórico das Etnias, reunindo representantes de 15 países.</p><p>O evento acontece no Parque Municipal Beira Foz e conta com apresentações de dança típica, culinária internacional e exposição de artesanato.</p><h3>Programação destaque</h3><ul><li>Apresentações de dança árabe, paraguaia, alemã e japonesa</li><li>Feira gastronômica com pratos de 15 países</li><li>Oficinas culturais para crianças</li><li>Show de encerramento com artistas locais</li></ul>`,
      categoryId: cultura.id,
      featured: true,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    },
    {
      title: 'Novo terminal de ônibus internacional é inaugurado em Foz',
      slug: 'novo-terminal-onibus-internacional-foz',
      summary: 'Estrutura modernizada amplia capacidade de atendimento e melhora conexão com Paraguai e Argentina.',
      content: `<h2>Nova estrutura para o transporte internacional</h2><p>O novo Terminal de Ônibus Internacional de Foz do Iguaçu foi inaugurado pelo governador do Paraná e pelo prefeito municipal. Com investimento de R$ 25 milhões, a estrutura triplicou a capacidade de atendimento.</p><p>O terminal interliga Foz do Iguaçu com Ciudad del Este (Paraguai) e Puerto Iguazú (Argentina), servindo mais de 15 mil passageiros por dia.</p>`,
      categoryId: economia.id,
      featured: false,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
    {
      title: 'Câmara Municipal aprova plano diretor com foco em sustentabilidade',
      slug: 'camara-municipal-plano-diretor-sustentabilidade',
      summary: 'Novo plano diretor prioriza mobilidade urbana sustentável, preservação ambiental e expansão habitacional planejada.',
      content: `<h2>Planejamento urbano para os próximos 10 anos</h2><p>A Câmara Municipal de Foz do Iguaçu aprovou por unanimidade o novo Plano Diretor da cidade, documento que vai nortear o desenvolvimento urbano pelos próximos 10 anos.</p><p>Entre os pontos principais estão a criação de corredores de ônibus BRT, expansão de ciclovias e preservação de 30% da área verde municipal.</p>`,
      categoryId: politica.id,
      featured: false,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 36),
    },
    {
      title: 'Escola de samba de Foz conquista título no Carnaval do Paraná',
      slug: 'escola-samba-foz-titulo-carnaval-parana',
      summary: 'Unidos do Iguaçu vence campeonato estadual com enredo sobre a história da tríplice fronteira.',
      content: `<h2>Glória para Foz no Carnaval paranaense</h2><p>A escola de samba Unidos do Iguaçu conquistou o título do Carnaval do Paraná com um enredo emocionante sobre a história da tríplice fronteira entre Brasil, Argentina e Paraguai.</p><p>Com mais de 800 componentes, a escola apresentou fantasias luxuosas e um desfile impecável que arrancou notas máximas dos jurados.</p>`,
      categoryId: cultura.id,
      featured: false,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    },
    {
      title: 'Operação policial reduz em 40% roubos de veículos em Foz',
      slug: 'operacao-policial-reduz-roubos-veiculos-foz',
      summary: 'Programa integrado entre PM, PC e guarda municipal resultou em queda significativa de crimes contra o patrimônio.',
      content: `<h2>Segurança pública mostra resultados</h2><p>Os índices de roubo de veículos em Foz do Iguaçu caíram 40% nos últimos três meses, segundo dados da Secretaria de Segurança Pública do Paraná.</p><p>O resultado é fruto do Programa Foz Segura, que integra ações da Polícia Militar, Polícia Civil e Guarda Municipal, com uso de câmeras de monitoramento e patrulhamento ostensivo.</p>`,
      categoryId: seguranca.id,
      featured: false,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 60),
    },
    {
      title: 'Hotéis de Foz registram ocupação recorde com turistas do Mercosul',
      slug: 'hoteis-foz-ocupacao-recorde-turistas-mercosul',
      summary: 'Alta temporada de inverno bate recordes com 98% de ocupação, impulsionada por visitantes argentinos e paraguaios.',
      content: `<h2>Turismo aquecido no inverno</h2><p>Os hotéis de Foz do Iguaçu registraram em julho a maior taxa de ocupação da história da cidade: 98% dos quartos ocupados durante os fins de semana.</p><p>O fenômeno é explicado pela valorização do real frente ao peso argentino e ao guarani paraguaio, tornando Foz um destino muito mais acessível para os vizinhos do Mercosul.</p><p>A cidade espera fechar o semestre com receita turística 35% superior ao mesmo período do ano anterior.</p>`,
      categoryId: turismo.id,
      featured: false,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
    },
  ]

  for (const postData of postsData) {
    await prisma.post.upsert({
      where: { slug: postData.slug },
      update: {},
      create: {
        ...postData,
        authorId: admin.id,
        views: Math.floor(Math.random() * 5000) + 100,
      },
    })
  }
  console.log('✅ Posts criados:', postsData.length)

  // Ads
  await prisma.ad.upsert({
    where: { id: 'ad-demo-1' },
    update: {},
    create: {
      id: 'ad-demo-1',
      title: 'Cataratas Park Hotel - Sua melhor estadia em Foz',
      type: AdType.NATIVE,
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      targetUrl: 'https://example.com',
      client: 'Cataratas Park Hotel',
      position: AdPosition.FEED_BETWEEN,
      frequency: 5,
      active: true,
      startsAt: new Date(),
      endsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    },
  })

  await prisma.ad.upsert({
    where: { id: 'ad-demo-2' },
    update: {},
    create: {
      id: 'ad-demo-2',
      title: 'Shopping JL - As melhores marcas em Foz do Iguaçu',
      type: AdType.BANNER,
      imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
      targetUrl: 'https://example.com',
      client: 'Shopping JL',
      position: AdPosition.POST_DETAIL,
      frequency: 3,
      active: true,
      startsAt: new Date(),
      endsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60),
    },
  })
  console.log('✅ Anúncios criados')

  // Site config
  await prisma.siteConfig.upsert({
    where: { id: 'main' },
    update: {},
    create: {
      id: 'main',
      siteName: 'Foz.Foco',
      tagline: 'Notícias de Foz do Iguaçu',
      social: {
        instagram: 'https://instagram.com/fozfoco',
        facebook: 'https://facebook.com/fozfoco',
        twitter: 'https://twitter.com/fozfoco',
      },
    },
  })
  console.log('✅ Configurações do site criadas')

  console.log('🎉 Seed concluído!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
