import React from 'react'
import { usePWAInstall } from '../usePWAInstall'

export default function InstallPWAButton() {
  const { canInstall, install } = usePWAInstall()

  if (!canInstall) return null

  return (
    <button
      onClick={install}
      className="px-4 py-2 rounded-2xl border border-gray-300 shadow-sm hover:shadow transition"
      aria-label="Instalar app"
      style={{position:'fixed',bottom:16,right:16,background:'white'}}
    >
      Instalar app
    </button>
  )
}
