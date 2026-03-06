import './App.css'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage/HomePage'
import HeroPage from './pages/HeroPage/HeroPage'

function App() {
  return (
    <div className="app">
      {/* Основное приложение с маршрутизацией */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/heroes/:id" element={<HeroPage />} />
      </Routes>
    </div>
  )
}

export default App
