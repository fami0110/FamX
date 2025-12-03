import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import type { ShortcutStruct } from "@/lib/utils";
import { storage, defaultShortcuts } from "@/lib/utils";
import ShortcutCard from "./shortcut-card";
import ShortcutModal from "./shortcut-modal";

let savedShortcuts = await storage.get("shortcuts");
savedShortcuts = (savedShortcuts) ? JSON.parse(savedShortcuts) : defaultShortcuts;

export default function ShortcutGrid() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // State for drag and drop
  const [draggedItem, setDraggedItem] = useState<ShortcutStruct | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const [shortcuts, setShortcuts] = useState<ShortcutStruct[]>(savedShortcuts);

  useEffect(() => {
    storage.set("shortcuts", JSON.stringify(shortcuts));
  }, [shortcuts]);

  // --- Drag and Drop Handlers ---

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, shortcut: ShortcutStruct) => {
    setDraggedItem(shortcut);
    // Using a text/plain dataTransfer is a good practice for compatibility
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.outerHTML);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    // Reset the drag over index when leaving the element
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null); // Clear the visual indicator

    if (!draggedItem) return;

    const draggedIndex = shortcuts.findIndex(s => s.id === draggedItem.id);

    // If dropping on the same item or an invalid position, do nothing
    if (draggedIndex === dropIndex) return;

    // Reorder the shortcuts array
    const newShortcuts = [...shortcuts];
    newShortcuts.splice(draggedIndex, 1); // Remove the dragged item
    newShortcuts.splice(dropIndex, 0, draggedItem); // Insert it at the new position

    setShortcuts(newShortcuts);
    setDraggedItem(null); // Clear the dragged item state
  };
  
  const handleDragEnd = () => {
    // Clean up any remaining state
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  // --- Existing CRUD Handlers ---

  const handleAddShortcut = (shortcut: Omit<ShortcutStruct, "id">) => {
    if (editingId) {
      setShortcuts(
        shortcuts.map((s) => {
          return (s.id === editingId) ? { ...shortcut, id: editingId } : s;
        })
      );
      setEditingId(null);
    } else {
      setShortcuts([...shortcuts, { ...shortcut, id: Date.now().toString() }]);
    }
    setIsModalOpen(false);
  }

  const handleDeleteShortcut = (id: string) => {
    setShortcuts(shortcuts.filter((s) => s.id !== id));
  }

  const handleEditShortcut = (id: string) => {
    setEditingId(id);
    setIsModalOpen(true);
  }

  const editingShortcut = editingId ? shortcuts.find((s) => s.id === editingId) : null

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-8 justify-center">
        {shortcuts.map((shortcut, index) => (
          <div
            key={shortcut.id}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            className={`relative ${dragOverIndex === index ? 'scale-110' : ''} transition-transform duration-200`}
          >
            <ShortcutCard
              shortcut={shortcut}
              onDelete={handleDeleteShortcut}
              onEdit={handleEditShortcut}
              draggable
              onDragStart={(e) => handleDragStart(e, shortcut)}
              onDragEnd={handleDragEnd}
            />
          </div>
        ))}

        {/* Add New Shortcut Button */}
        {
          shortcuts.length < 9 ? (
            <button
              onClick={() => {
                setEditingId(null)
                setIsModalOpen(true)
              }}
              className="group relative w-20 h-20 rounded-full border-2 border-dashed border-current/25 hover:border-accent/50 hover:cursor-pointer bg-card/50 hover:bg-card transition-all duration-200 flex items-center justify-center"
            >
              <Plus className="w-6 h-6 text-muted-foreground group-hover:text-accent transition-colors" />
            </button>
          ) : (
            <></>
          )
        }
      </div>

      {/* Modal */}
      <ShortcutModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingId(null)
        }}
        onSubmit={handleAddShortcut}
        initialData={editingShortcut}
      />
    </div>
  )
}