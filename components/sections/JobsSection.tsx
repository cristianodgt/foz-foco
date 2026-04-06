// TODO(future): wire to jobs DB model when available.
// Currently a static placeholder per plan 01-03 (user directive #3).

import Link from 'next/link'

interface PlaceholderJob {
  title: string
  employer: string
  tag: 'URGENTE' | 'NOVA' | 'CLT'
}

const JOBS: PlaceholderJob[] = [
  { title: 'Atendente de Recepção', employer: 'Hotel Bourbon Cataratas', tag: 'URGENTE' },
  { title: 'Motorista Executivo', employer: 'Transportadora Três Fronteiras', tag: 'NOVA' },
  { title: 'Cozinheiro Chefe', employer: 'Restaurante Rafain', tag: 'CLT' },
]

/**
 * JobsSection — static placeholder mirroring Stitch desktop.html Row 8.
 *
 * 12-col split: 4 cols of headline + CTA on the left, 8 cols of job cards
 * stacked on the right. Cards are hardcoded until a real Jobs model exists.
 */
export function JobsSection() {
  return (
    <section className="py-10 bg-surface-container-low">
      <div className="max-w-[1200px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-4 space-y-6">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">
            Empregos em Foz
          </h2>
          <p className="text-on-surface-variant font-label">
            As vagas mais quentes de Foz do Iguaçu e região, publicadas toda semana.
            Encontre sua próxima oportunidade.
          </p>
          <Link
            href="/categoria/empregos"
            className="inline-block bg-primary text-white px-8 py-3 rounded-md font-bold tracking-widest text-xs uppercase font-label hover:bg-primary-container transition-colors"
          >
            Ver todas as vagas
          </Link>
        </div>

        <div className="lg:col-span-8 space-y-4">
          {JOBS.map(job => (
            <div
              key={job.title}
              className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-primary flex flex-col md:flex-row md:items-center md:justify-between gap-3"
            >
              <div>
                <h3 className="font-headline font-bold text-lg text-on-surface">
                  {job.title}
                </h3>
                <p className="text-sm text-outline font-label">{job.employer}</p>
              </div>
              <span className="text-xs font-bold bg-surface-container px-3 py-1 rounded-full text-primary uppercase tracking-wider font-label self-start md:self-center whitespace-nowrap">
                {job.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
