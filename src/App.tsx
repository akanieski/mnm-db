import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ItemListPage from './pages/ItemListPage'
import ItemDetailPage from './pages/ItemDetailPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground">
        <Routes>
          <Route path="/" element={<ItemListPage />} />
          <Route path="/items/:hid" element={<ItemDetailPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
