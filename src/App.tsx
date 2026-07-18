import { HashRouter, Route, Routes } from 'react-router-dom'
import { AccessGate } from './features/access/AccessGate'
import { Home } from './pages/Home'
import { UploadPlanPage } from './features/plans/UploadPlanPage'

export function App() {
  return (
    <AccessGate>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gestao" element={<UploadPlanPage />} />
        </Routes>
      </HashRouter>
    </AccessGate>
  )
}
