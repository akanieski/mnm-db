import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import ItemListPage from './pages/ItemListPage'
import ItemDetailPage from './pages/ItemDetailPage'
import { ThemeProvider } from './components/ThemeProvider'

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-background text-foreground">
            <Routes>
              <Route path="/" element={<ItemListPage />} />
              <Route path="/items/:hid" element={<ItemDetailPage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </HelmetProvider>
  )
}
