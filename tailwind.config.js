/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        command: {
          bg: '#070a0f',
          surface: '#0d121d',
          card: '#121826',
          cardHover: '#182135',
          border: 'rgba(255, 255, 255, 0.08)',
          borderSubtle: 'rgba(255, 255, 255, 0.04)',
          text: '#f1f5f9',
          muted: '#94a3b8',
          dim: '#64748b'
        },
        rider: {
          r1: '#f43f5e', // Red / Rose
          r2: '#06b6d4', // Cyan / Blue
          r3: '#10b981', // Emerald / Green
          r4: '#f59e0b', // Amber / Yellow
          r5: '#8b5cf6', // Violet / Purple
          r6: '#f97316', // Orange / Coral
          r7: '#ec4899', // Pink
          r8: '#3b82f6', // Cobalt
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -3px rgba(6, 182, 212, 0.35)',
        'glow-emerald': '0 0 20px -3px rgba(16, 185, 129, 0.35)',
        'glow-rose': '0 0 20px -3px rgba(244, 63, 94, 0.35)',
        'glow-violet': '0 0 20px -3px rgba(139, 92, 246, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
      }
    },
  },
  plugins: [],
}
