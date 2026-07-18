import { HashRouter, Outlet, Route, Routes } from 'react-router-dom'
import { AccessGate } from './features/access/AccessGate'
import { AppHeader } from './components/AppHeader'
import { Home } from './pages/Home'
import { UploadPlanPage } from './features/plans/UploadPlanPage'
import { PlanList } from './pages/PlanList'
import { PhaseList } from './pages/PhaseList'
import { DayList } from './pages/DayList'
import { DayExecution } from './pages/DayExecution'
import { Progress } from './pages/Progress'

function AppLayout() {
  return (
    <>
      <AppHeader />
      <Outlet />
    </>
  )
}

export function App() {
  return (
    <AccessGate>
      <HashRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/gestao" element={<UploadPlanPage />} />
            <Route path="/progresso" element={<Progress />} />
            <Route path="/planos/:profileId" element={<PlanList />} />
            <Route path="/planos/:profileId/:planId" element={<PhaseList />} />
            <Route path="/planos/:profileId/:planId/:phaseId" element={<DayList />} />
            <Route path="/planos/:profileId/:planId/:phaseId/:dayId" element={<DayExecution />} />
          </Route>
        </Routes>
      </HashRouter>
    </AccessGate>
  )
}
