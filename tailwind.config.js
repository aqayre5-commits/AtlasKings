/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        red: {
          DEFAULT: '#c0000b',
          dark: '#8a0008',
          light: '#fdf0f0',
        },
        green: {
          DEFAULT: '#0a5229',
          bright: '#3ecc78',
          light: '#edf7f2',
        },
        gold: '#b8820a',
        live: '#0d9940',
        bg: '#f0eeeb',
        card: '#ffffff',
        'card-alt': '#f8f7f5',
        'card-hover': '#f3f2ef',
        border: '#e4e2df',
        'border-mid': '#ccc9c4',
        text: {
          DEFAULT: '#111111',
          sec: '#484848',
          faint: '#9a9a9a',
        },
        hdr: {
          bg: '#0d0d0d',
          border: '#1f1f1f',
          muted: '#505050',
          dim: '#2a2a2a',
        },
      },
      fontFamily: {
        head: ['Barlow Condensed', 'sans-serif'],
        body: ['Barlow', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
        logo: ['Teko', 'sans-serif'],
      },
      borderRadius: {
        sm: '3px',
        DEFAULT: '6px',
        lg: '10px',
      },
      boxShadow: {
        sm: '0 1px 4px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)',
        md: '0 3px 10px rgba(0,0,0,0.10)',
      },
      maxWidth: {
        site: '1080px',
        article: '680px',
      },
    },
  },
  plugins: [],
}
