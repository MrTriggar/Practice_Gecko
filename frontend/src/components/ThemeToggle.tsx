import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../app/ThemeContext'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255,255,255,0.1)',
        border: '1px solid #3d2758',
        color: '#f2f1f4',
        borderRadius: '8px',
        padding: '6px',
        cursor: 'pointer',
      }}
    >
      {theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}