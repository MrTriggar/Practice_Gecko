import type { ReactNode } from 'react'
import { ThemeToggle } from './ThemeToggle'
import './AppLayout.css'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="app-layout">
      <header className="app-layout__header">
        <div className="app-layout__brand">SANDER</div>
        <ThemeToggle />
      </header>
      <main className="app-layout__main">{children}</main>
    </div>
  )
}