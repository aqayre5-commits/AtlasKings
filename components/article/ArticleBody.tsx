interface ArticleBodyProps {
  html: string
}

export function ArticleBody({ html }: ArticleBodyProps) {
  // Split HTML at paragraph boundaries to inject mid-article ad
  const parts = html.split('</p>')
  const adPosition = 3 // inject after paragraph 3

  const beforeAd = parts.slice(0, adPosition).join('</p>') + (parts.length > adPosition ? '</p>' : '')
  const afterAd = parts.length > adPosition
    ? parts.slice(adPosition).join('</p>')
    : ''

  return (
    <div>
      {/* Article text — before mid-article ad */}
      <div
        className="article-body"
        dangerouslySetInnerHTML={{ __html: beforeAd }}
      />

      {/* Mid-article ad (mobile visible, desktop hidden in sidebar) */}
      {afterAd && (
        <>
          <div
            className="mid-article-ad"
            style={{
              margin: '28px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 100,
              background: 'var(--card-alt)',
              border: '1px dashed var(--border-mid)',
              borderRadius: 'var(--radius)',
            }}
          >
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 600,
              letterSpacing: '0.18em', color: '#ccc', textTransform: 'uppercase',
            }}>
              Advertisement · 320×100
            </span>
          </div>

          {/* Article text — after mid-article ad */}
          <div
            className="article-body"
            dangerouslySetInnerHTML={{ __html: afterAd }}
          />
        </>
      )}
    </div>
  )
}
