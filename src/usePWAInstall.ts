import { useEffect, useState, useCallback } from 'react'

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function usePWAInstall() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null)
  const [supported, setSupported] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BIPEvent)
      setSupported(true)
    }
    window.addEventListener('beforeinstallprompt', handler as EventListener)
    return () => window.removeEventListener('beforeinstallprompt', handler as EventListener)
  }, [])

  const install = useCallback(async () => {
    if (!deferred) return
    await deferred.prompt()
    try {
      await deferred.userChoice
    } finally {
      setDeferred(null)
    }
  }, [deferred])

  return { canInstall: supported && !!deferred, install }
}
