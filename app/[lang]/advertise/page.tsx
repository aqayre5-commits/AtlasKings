import { pageMetadata } from '@/lib/seo/pageMetadata'
import { StaticPage, Section, P, InfoCard } from '@/components/layout/StaticPage'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return pageMetadata('advertise', lang, '/advertise')
}

export default async function AdvertisePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return (
    <StaticPage title="Advertise With Us" subtitle="Reach the most passionate football audience in Morocco and the MENA region." accent="var(--gold)" lang={lang}>

      <Section>
        <P>Atlas Kings connects your brand with a highly engaged audience of football fans across Morocco, North Africa, the Middle East, and the Moroccan diaspora in Europe. Our readers are passionate, loyal, and digitally active — exactly the audience modern brands need to reach.</P>
      </Section>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 1, background: 'var(--border)',
        border: '1px solid var(--border)', borderRadius: 'var(--radius)',
        overflow: 'hidden', marginBottom: 40,
        boxShadow: 'var(--shadow-sm)',
      }}>
        {[
          { stat: '500K+', label: 'Monthly visitors' },
          { stat: '3M+', label: 'Page views / month' },
          { stat: '70%', label: 'Mobile audience' },
          { stat: '3', label: 'Languages: EN / AR / FR' },
          { stat: '22', label: 'Countries reached' },
          { stat: '8 min', label: 'Avg. session duration' },
        ].map(({ stat, label }) => (
          <div key={label} style={{
            background: 'var(--card)', padding: '24px 20px', textAlign: 'center',
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: 'var(--green)', lineHeight: 1, marginBottom: 8 }}>{stat}</div>
            <div style={{ fontFamily: 'var(--font-head)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-faint)' }}>{label}</div>
          </div>
        ))}
      </div>

      <Section title="Our Audience">
        <P>Our core audience is Moroccan football fans aged 18–45, with strong concentrations in Morocco, France, Spain, the Netherlands, Belgium, and the UK. They follow the Atlas Lions, the Botola Pro, the Champions League, and the Premier League — and they follow Atlas Kings to stay ahead of the news.</P>
        <P>With the 2030 FIFA World Cup coming to Morocco, our audience is growing faster than ever. Now is the time to build brand affinity with the fans who will define Moroccan football for the next decade.</P>
      </Section>

      <Section title="Advertising Formats">
        {[
          ['Display Advertising', 'Standard IAB units across all pages — leaderboard (728×90), MPU (300×250), and mobile banner (320×50). High viewability, premium placements above and alongside editorial content.'],
          ['Sponsored Content', 'Native articles written by our editorial team in partnership with your brand. Clearly labelled as sponsored. Distributed to our full audience across all three language editions.'],
          ['Newsletter Sponsorship', 'Exclusive sponsorship of our weekly football digest, sent to subscribers across Morocco and Europe.'],
          ['Competition Sponsorship', 'Title sponsorship of our Botola Pro, Atlas Lions, or Champions League coverage hubs.'],
          ['Social Media', 'Sponsored posts across our X, Instagram, and Facebook accounts, targeting our highly engaged social following.'],
        ].map(([title, desc]) => (
          <div key={title as string} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
            <strong style={{ fontFamily: 'var(--font-head)', fontSize: 15, fontWeight: 700, color: 'var(--text)', display: 'block', marginBottom: 6 }}>{title}</strong>
            <span>{desc}</span>
          </div>
        ))}
      </Section>

      <Section title="Contact Our Advertising Team">
        <P>For media packs, rate cards, and campaign planning, contact us directly. We respond to all advertising enquiries within one business day.</P>
      </Section>

      <InfoCard items={[
        { label: 'Email', value: <a href="mailto:advertising@atlaskings.com" style={{ color: 'var(--red)', textDecoration: 'underline', fontWeight: 600 }}>advertising@atlaskings.com</a> },
        { label: 'Subject line', value: 'Advertising Enquiry — [Your Company Name]' },
        { label: 'Response time', value: 'Within 1 business day' },
      ]} />

    </StaticPage>
  )
}
