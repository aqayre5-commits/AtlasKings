import 'react'

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'api-sports-widget': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          'data-type'?: string
          'data-sport'?: string
          'data-key'?: string
          'data-lang'?: string
          'data-theme'?: string
          'data-refresh'?: string
          'data-show-logos'?: string
          'data-show-errors'?: string
          'data-league-id'?: string
          'data-team-id'?: string
          'data-game-id'?: string
          'data-player-id'?: string
          'data-season'?: string
          'data-target-game'?: string
          'data-target-standings'?: string
          'data-target-team'?: string
          'data-target-player'?: string
          'data-target-league'?: string
          'data-favorite'?: string
        },
        HTMLElement
      >
    }
  }
}
