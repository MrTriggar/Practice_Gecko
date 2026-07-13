import { Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { EditorPage } from './pages/EditorPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/editor" element={<EditorPage />} />
    </Routes>
  )
}

export default App