import './App.css'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import HeroPage from './pages/HeroPage'
import AdminPage from './pages/AdminPage'

function App() {
    return (
        <div className="app">
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/heroes/:id" element={<HeroPage />} />
                <Route path="/admin" element={<AdminPage />} />
            </Routes>
        </div>
    )
}

export default App
