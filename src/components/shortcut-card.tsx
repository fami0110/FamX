import { X, Edit2 } from "lucide-react"
import { useState, useContext } from "react"
import AppContext from "@/AppContext"

interface Shortcut {
  id: string
  title: string
  url: string
  icon: string
}

// Add the new drag-related props to the interface
interface ShortcutCardProps {
  shortcut: Shortcut
  onDelete: (id: string) => void
  onEdit: (id: string) => void
  draggable?: boolean
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void
  onDragEnd?: () => void
}

// Add the new props to the component's destructuring
export default function ShortcutCard({ 
  shortcut, 
  onDelete, 
  onEdit, 
  draggable = false,
  onDragStart,
  onDragEnd 
}: ShortcutCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const { isPanelOpen } = useContext(AppContext);

  // Fungsi handleClick tidak lagi diperlukan karena kita menggunakan tag <a>
  const isFaviconUrl = shortcut.icon.startsWith("http");

  return (
    <div 
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onMouseEnter={() => setIsHovering(true)} 
      onMouseLeave={() => setIsHovering(false)} 
      className="group relative"
    >
      {/* Mengganti button dengan tag a untuk navigasi */}
      <a
        href={shortcut.url}
        target="_self"
        rel="noopener noreferrer"
        className="w-20 h-20 rounded-full border bg-card hover:bg-card/80 hover:border-accent/50 hover:cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 relative overflow-hidden"
      >
        {isFaviconUrl ? (
          <img src={shortcut.icon} className="max-w-[60%] rounded-xl" alt="favicon" />
        ) : (
          <span className="text-2xl">{shortcut.icon}</span>
        )}
      </a>

      {/* Title below the circle */}
      <p className="text-center text-sm font-medium text-foreground truncate max-w-20 mt-2 relative z-[-1]">
        {shortcut.title}
      </p>

      {/* Action buttons on hover */}
      {(isHovering && !isPanelOpen) && (
        <div className="absolute -top-2.5 -right-1.5 flex gap-0">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit(shortcut.id)
            }}
            className="p-2 rounded-full bg-background/80 hover:bg-accent/20 text-muted-foreground hover:text-accent cursor-pointer transition-colors"
            title="Edit"
          >
            <Edit2 className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(shortcut.id)
            }}
            className="p-2 rounded-full bg-background/80 hover:bg-destructive/20 text-muted-foreground hover:text-destructive cursor-pointer transition-colors"
            title="Delete"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  )
}