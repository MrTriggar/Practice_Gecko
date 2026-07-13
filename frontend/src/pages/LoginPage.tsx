import { useState } from 'react'
import { Headphones, UserCircle2 } from 'lucide-react'
import { login } from '../api/auth'
import { PasswordInput } from '../components/PasswordInput'
import { ThemeToggle } from '../components/ThemeToggle'
import './LoginPage.css'

export function LoginPage() {
  const [mode, setMode] = useState<'welcome' | 'login'>('welcome')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const result = await login({ email, password })
      localStorage.setItem('token', result.token)
      window.location.href = '/projects'
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Неизвестная ошибка входа'
      setError(message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-screen">
      <div className="login-theme-toggle">
        <ThemeToggle />
      </div>

      <div className="login-panel login-panel--brand">
        <div className="login-brand">
          <Headphones size={64} strokeWidth={2} />
          <h1 className="login-brand__name">SANDER</h1>
          <p className="login-brand__tagline">a long journey ahead</p>
        </div>
      </div>

      <div className="login-panel login-panel--form">
        <div className="login-form-box">
          <div className="login-avatar">
            <UserCircle2 size={56} strokeWidth={1.5} />
          </div>

          {error && <div className="login-error">{error}</div>}

          {mode === 'welcome' && (
            <div className="login-actions">
              <button className="btn btn--primary" onClick={() => setMode('login')}>
                Войти
              </button>
              <div className="login-links">
                <a href="#">Помощь</a>
                <span>•</span>
                <a href="#">FAQ</a>
              </div>
            </div>
          )}

          {mode === 'login' && (
            <form className="login-form" onSubmit={handleLogin}>
              <h2>Вход</h2>
              <label>
                Email
                <input type="email" name="email" placeholder="you@example.com" required />
              </label>
              <label>
                Пароль
                <PasswordInput name="password" placeholder="••••••••" required />
              </label>
              <button className="btn btn--primary" type="submit" disabled={loading}>
                {loading ? 'Входим...' : 'Войти'}
              </button>
              <button className="btn btn--link" type="button" onClick={() => setMode('welcome')}>
                Назад
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}