import { useState, useEffect } from 'react'
import { X, Scroll } from 'lucide-react'

const STORAGE_KEY = 'mnm-spoiler-dismissed'

export function SpoilerBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true)
  }, [])

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-yellow-600/40 bg-yellow-950/90 backdrop-blur-sm text-yellow-200 px-4 py-3">
      <div className="max-w-3xl mx-auto flex items-start gap-3">
        <Scroll className="w-4 h-4 mt-0.5 shrink-0 text-yellow-400" />
        <p className="text-xs leading-relaxed flex-1">
          <span className="font-semibold text-yellow-300">Adventurer's Notice: </span>
          This database contains item names, stats, and descriptions from{' '}
          <span className="italic">Monsters &amp; Memories</span>. If you prefer to
          discover the world's treasures on your own, venture no further — but for
          those who find joy in preparation and planning, may this knowledge serve
          you well.
        </p>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="shrink-0 p-0.5 rounded text-yellow-400/60 hover:text-yellow-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
