import './App.css'
import { Routes, Route } from 'react-router-dom'
import VovPage from './pages/VovPage'
import HeroPage from './pages/HeroPage'
import SvoPage from './pages/SvoPage'
import AddHeroPage from './pages/AddHeroPage'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'

import Header from './components/common/Header/Header'

function App() {
    return (
        <div className="app">
            <Header />
            <Routes>
                <Route path='/' element={<HomePage />}></Route>
                <Route path='/about' element={<AboutPage />}></Route>
                <Route path="/svo" element={<SvoPage />}></Route>
                <Route path="/vov" element={<VovPage />} />
                <Route path="/heroes/:id" element={<HeroPage />} />
                <Route path="/admin" element={<AddHeroPage />} />
            </Routes>
        </div>
    )
}

export default App
