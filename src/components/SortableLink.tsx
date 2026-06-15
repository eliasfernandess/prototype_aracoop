'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Pencil, Trash2 } from 'lucide-react'
import { ICON_MAP } from '@/lib/icons'
import type { Link } from '@/app/admin/page'

interface Props {
  link: Link
  index: number
  showDrag: boolean
  onEdit: () => void
  onDelete: () => void
  onToggleStatus: () => void
  isLast: boolean
}

export default function SortableLink({ link, index, showDrag, onEdit, onDelete, onToggleStatus, isLast }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: link.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 10 : undefined,
    position: isDragging ? 'relative' as const : undefined,
  }

  const IconComponent = ICON_MAP[link.icone ?? 'link'] ?? ICON_MAP['link']
  const iconColor = link.corIcone ?? '#00B4A0'

  // Mock click count
  const mockClicks = [1842, 1207, 968, 745, 531, 412, 389, 312, 156]
  const clicks = mockClicks[(index - 1) % mockClicks.length]

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors ${!isLast ? 'border-b border-gray-100' : ''}`}
    >
      {/* Drag handle */}
      {showDrag ? (
        <button
          {...attributes}
          {...listeners}
          className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing flex-shrink-0"
        >
          <GripVertical size={18} />
        </button>
      ) : (
        <span className="text-gray-300 text-xs w-5 flex-shrink-0 text-center font-medium">
          {String(index).padStart(2, '0')}
        </span>
      )}

      {/* Icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: iconColor }}
      >
        <IconComponent size={18} className="text-white" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-gray-800 text-sm truncate">{link.titulo}</div>
        {link.descricao && (
          <div className="text-gray-400 text-xs truncate mt-0.5">{link.descricao}</div>
        )}
        <div className="text-gray-400 text-xs truncate mt-0.5" style={{ color: '#00A896' }}>{link.urlDestino}</div>
      </div>

      {/* Category */}
      {link.categoria && (
        <span className="text-xs px-2.5 py-1 rounded-full border border-gray-200 text-gray-500 whitespace-nowrap flex-shrink-0">
          {link.categoria}
        </span>
      )}

      {/* Clicks */}
      <div className="text-center flex-shrink-0 w-16">
        <div className="text-gray-800 font-bold text-sm">{clicks.toLocaleString('pt-BR')}</div>
        <div className="text-gray-400 text-[10px] uppercase tracking-wide">Cliques</div>
      </div>

      {/* Toggle */}
      <button
        onClick={onToggleStatus}
        className="relative w-10 h-5 rounded-full transition-colors flex-shrink-0"
        style={{ background: link.ativo ? '#00B4A0' : '#E5E7EB' }}
      >
        <span
          className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform"
          style={{ transform: link.ativo ? 'translateX(20px)' : 'translateX(0)' }}
        />
      </button>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button onClick={onEdit} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
          <Pencil size={14} />
        </button>
        <button onClick={onDelete} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}
