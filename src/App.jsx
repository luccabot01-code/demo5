import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CoupleProvider } from './contexts/CoupleContext'
import CoupleApp from './CoupleApp'

export default function App() {
  return (
    <BrowserRouter>
      <CoupleProvider coupleId="maryjohn">
        <Routes>
          <Route path="/*" element={<CoupleApp />} />
        </Routes>
      </CoupleProvider>
    </BrowserRouter>
  )
}
