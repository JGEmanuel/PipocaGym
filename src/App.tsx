import { HashRouter, Route, Routes } from 'react-router-dom'
import { AccessGate } from './features/access/AccessGate'
import { Home } from './pages/Home'
import { UploadPlanPage } from './features/plans/UploadPlanPage'
import { PlanList } from './pages/PlanList'
import { PhaseList } from './pages/PhaseList'
import { DayList } from './pages/DayList'
import { DayExecution } from './pages/DayExecution'

export function App() {
  return (
    <AccessGate>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gestao" element={<UploadPlanPage />} />
          <Route path="/planos/:profileId" element={<PlanList />} />
          <Route path="/planos/:profileId/:planId" element={<PhaseList />} />
          <Route path="/planos/:profileId/:planId/:phaseId" element={<DayList />} />
          <Route path="/planos/:profileId/:planId/:phaseId/:dayId" element={<DayExecution />} />
        </Routes>
      </HashRouter>
    </AccessGate>
  )
}
