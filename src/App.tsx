import React from 'react'
import InstallPWAButton from './components/InstallPWAButton'

export default function App() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Paleoclima Data v2</h1>
      <p className="mt-2">Explorador de datos paleoclimáticos</p>
      <InstallPWAButton />
    </div>
  )
}
