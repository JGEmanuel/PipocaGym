import { HashRouter, Route, Routes } from 'react-router-dom'
import { AccessGate } from './features/access/AccessGate'
import { Home } from './pages/Home'

export function App() {
  return (
    <AccessGate>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </HashRouter>
    </AccessGate>
  )
}
