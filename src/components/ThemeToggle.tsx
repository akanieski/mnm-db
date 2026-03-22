import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from './ThemeProvider'

const OPTIONS = [
  { value: 'light' as const, icon: <Sun className="w-3.5 h-3.5" />, label: 'Light' },
  { value: 'system' as const, icon: <Monitor className="w-3.5 h-3.5" />, label: 'System' },
  { value: 'dark' as const, icon: <Moon className="w-3.5 h-3.5" />, label: 'Dark' },
]

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center gap-0.5 rounded-md border bg-muted/40 p-0.5">
      {OPTIONS.map(opt => (
        <button
          key={opt.value}
          onClick={() => setTheme(opt.value)}
          title={opt.label}
          className={`flex items-center justify-center w-6 h-6 rounded transition-colors
            ${theme === opt.value
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
            }`}
        >
          {opt.icon}
        </button>
      ))}
    </div>
  )
}
