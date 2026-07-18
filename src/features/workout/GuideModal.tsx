import { useEffect, useState } from 'react'
import { MarkdownBody } from '../../components/MarkdownBody'

export interface SelectedGuide {
  dayItemName: string
  guideName: string
  bodyMd: string
}

export function GuideModal({ item, onClose }: { item: SelectedGuide | null; onClose: () => void }) {
  const [mounted, setMounted] = useState(false)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    if (item) {
      setMounted(true)
      const raf = requestAnimationFrame(() => setEntered(true))
      return () => cancelAnimationFrame(raf)
    }
    setEntered(false)
    const t = setTimeout(() => setMounted(false), 200)
    return () => clearTimeout(t)
  }, [item])

  if (!mounted || !item) return null

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-50 flex items-end justify-center transition-colors duration-200 ${
        entered ? 'bg-black/50' : 'bg-black/0'
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-md rounded-t-3xl bg-white p-5 pb-8 shadow-2xl transition-transform duration-200 ease-out dark:bg-stone-900 ${
          entered ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-stone-300 dark:bg-stone-700" />
        {item.dayItemName.trim().toLowerCase() !== item.guideName.trim().toLowerCase() && (
          <p className="text-xs font-medium uppercase tracking-wide text-amber-600 dark:text-amber-400">
            {item.dayItemName}
          </p>
        )}
        <h3 className="text-lg font-bold">{item.guideName}</h3>
        <div className="mt-3 max-h-[55vh] overflow-y-auto pr-1">
          <MarkdownBody md={item.bodyMd} />
        </div>
      </div>
    </div>
  )
}
