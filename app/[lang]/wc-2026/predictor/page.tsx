import { pageMetadata } from '@/lib/seo/pageMetadata'
// v2 shell — built in Phases 1–3 of the predictor redesign. Wires
// the FIFA tiebreaker ladder, Monte Carlo ensemble engine, and
// SVG-style bracket canvas. The legacy <SimulatorShell> remains
// available at `@/components/world-cup/simulator/SimulatorShell`
// for rollback until Phases 4–5 land.
import { SimulatorShellV2 } from '@/components/world-cup/simulator-v2/SimulatorShellV2'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return pageMetadata('world-cup-2026/predictor', lang, '/wc-2026/predictor')
}

export default async function WorldCupPredictorPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return (
    <main>
      <div className="page-wrap">
        <SimulatorShellV2 lang={lang} />
      </div>
    </main>
  )
}
