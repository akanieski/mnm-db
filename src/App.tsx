import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import ItemListPage from './pages/ItemListPage'
import ItemDetailPage from './pages/ItemDetailPage'
import SpellListPage from './pages/SpellListPage'
import SpellDetailPage from './pages/SpellDetailPage'
import { ThemeProvider } from './components/ThemeProvider'
import { SpoilerBanner } from './components/SpoilerBanner'

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-background text-foreground">
            <Routes>
              <Route path="/" element={<ItemListPage />} />
              <Route path="/items/:hid" element={<ItemDetailPage />} />
              <Route path="/spells" element={<SpellListPage />} />
              <Route path="/spells/:hid" element={<SpellDetailPage />} />
            </Routes>
            <SpoilerBanner />
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </HelmetProvider>
  )
}
