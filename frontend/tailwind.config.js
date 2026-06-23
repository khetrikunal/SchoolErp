/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          50:  '#eef6f8',
          100: '#d5eaef',
          200: '#aed6e1',
          300: '#7bbbcc',
          400: '#4a9db3',
          500: '#2e8298',
          600: '#1b6b80',  /* brand anchor – deep teal */
          700: '#175a6b',
          800: '#164a58',
          900: '#153e4a',
          950: '#0a2630',
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        /* Role-specific accents */
        admin:   { DEFAULT: '#2d6a8a', light: '#e8f2f7', dark: '#1a4a62' },
        teacher: { DEFAULT: '#2d7a5e', light: '#e8f5ef', dark: '#1a5a42' },
        student: { DEFAULT: '#6a5acd', light: '#f0edfc', dark: '#4a3a9d' },
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'soft':       '0 1px 2px rgba(20,74,88,0.04), 0 2px 8px rgba(20,74,88,0.06)',
        'soft-lg':    '0 4px 12px rgba(20,74,88,0.08), 0 8px 28px rgba(20,74,88,0.10)',
        'inset':      'inset 0 1px 2px rgba(20,74,88,0.06)',
        'card':       '0 1px 2px rgba(20,74,88,0.04), 0 2px 8px rgba(20,74,88,0.06)',
        'card-hover': '0 4px 12px rgba(20,74,88,0.08), 0 8px 28px rgba(20,74,88,0.10)',
        'btn':        '0 1px 2px rgba(20,74,88,0.08)',
      },
    },
  },
  plugins: [],
}
