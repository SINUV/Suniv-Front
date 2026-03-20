import { Routes, Route } from 'react-router-dom'
import Layout from './app/Layout'
import InicioPage from './flows/inicio/pages/InicioPage'
import AdmisionesPage from './flows/admision/pages/AdmisionesPage'
import ProgramasPage from './flows/programas/pages/ProgramasPage'
import SobreNosotrosPage from './flows/nosotros/pages/SobreNosotrosPage'
import ContactoPage from './flows/contacto/pages/ContactoPage'
import './App.css'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<InicioPage />} />
        <Route path="admisiones" element={<AdmisionesPage />} />
        <Route path="programas" element={<ProgramasPage />} />
        <Route path="nosotros" element={<SobreNosotrosPage />} />
        <Route path="contacto" element={<ContactoPage />} />
      </Route>
    </Routes>
  )
}
