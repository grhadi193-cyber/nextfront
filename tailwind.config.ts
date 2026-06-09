import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy:  { DEFAULT: '#1A56DB', dark: '#1E3A8A', deeper: '#0F2460' },
        teal:  { DEFAULT: '#0891B2', dark: '#0E7490' },
        amber: { DEFAULT: '#D97706', dark: '#B45309' },
        'bg-primary':   '#FAFAF7',
        'bg-secondary': '#F0EDE6',
        'bg-tertiary':  '#E5E1D8',
        'text-primary':   '#1C1C2E',
        'text-secondary': '#4A4A6A',
        'text-tertiary':  '#8A8AA8',
        'border-default': '#D8D4CA',
        success: '#059669',
        warning: '#D97706',
        error:   '#DC2626',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input:  'hsl(var(--input))',
        ring:   'hsl(var(--ring))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
      },
      fontFamily: {
        sans: ['Vazirmatn', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xs:   '6px',
        sm:   '10px',
        md:   '12px',
        lg:   '16px',
        xl:   '20px',
        '2xl':'28px',
        '3xl':'40px',
        full: '9999px',
      },
      height: {
        navbar: 'var(--navbar-height)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config
