"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Image as ImageIcon, Loader2, Save, GripVertical, Eye, EyeOff } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableItem({ id, children }: { id: string, children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div ref={setNodeRef} style={style} className="relative group bg-[#111] border border-white/10 rounded-3xl p-6 flex items-center gap-6 hover:border-white/30 transition-colors">
      <div 
        {...attributes} 
        {...listeners} 
        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity z-20 text-gray-500 hover:text-white"
      >
        <GripVertical size={20} />
      </div>
      {children}
    </div>
  );
}

export default function ContactsAdminPage() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const [formData, setFormData] = useState({
    id: "",
    label: "",
    url: "",
    icon: "",
  });

  const [iconFile, setIconFile] = useState<File | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/contacts");
      const data = await res.json();
      setItems(data?.sort((a: any, b: any) => a.order_index - b.order_index) || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadFile = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "contacts");
    
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.url;
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setItems((prev) => {
        const oldIndex = prev.findIndex(item => item.id === active.id);
        const newIndex = prev.findIndex(item => item.id === over.id);
        const newItems = arrayMove(prev, oldIndex, newIndex);
        
        const payload = newItems.map((item, index) => ({ id: item.id, order_index: index }));
        fetch('/api/reorder', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tableName: 'contacts', items: payload })
        }).catch(console.error);

        return newItems;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let finalIcon = formData.icon;
      if (iconFile) {
        finalIcon = await uploadFile(iconFile);
      }

      const payload = {
        label: formData.label,
        url: formData.url,
        icon: finalIcon,
        order_index: formData.id ? undefined : items.length,
      };

      if (formData.id) {
        await fetch(`/api/contacts/${formData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/contacts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      await fetchData();
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Error saving data");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus kontak ini?")) return;
    try {
      await fetch(`/api/contacts/${id}`, { method: "DELETE" });
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleHidden = async (item: any) => {
    try {
      await fetch(`/api/contacts/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_hidden: !item.is_hidden }),
      });
      setItems(prev => prev.map(c => c.id === item.id ? { ...c, is_hidden: !c.is_hidden } : c));
    } catch (err) {
      console.error(err);
    }
  };

  const openEdit = (item: any) => {
    setFormData({
      id: item.id,
      label: item.label || "",
      url: item.url || "",
      icon: item.icon || "",
    });
    setIconFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ id: "", label: "", url: "", icon: "" });
    setIconFile(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Kelola Kontak</h1>
          <p className="text-gray-400 mt-1">Tarik & Lepas (Drag & Drop) untuk mengatur urutan</p>
        </div>
        <button 
          onClick={() => { closeModal(); setIsModalOpen(true); }}
          className="bg-white text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors"
        >
          <Plus size={20} />
          Tambah Kontak
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-gray-500" size={40} />
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SortableContext items={items} strategy={rectSortingStrategy}>
              {items.map((item) => (
                <SortableItem key={item.id} id={item.id}>
                  <div className={`pl-6 flex-shrink-0 ${item.is_hidden ? 'opacity-40' : ''}`}>
                    <div className="w-16 h-16 bg-white/5 rounded-2xl p-3 flex items-center justify-center">
                      {item.icon ? (
                        <img src={item.icon} alt="icon" className="w-full h-full object-contain filter invert" />
                      ) : (
                        <ImageIcon className="text-gray-500" />
                      )}
                    </div>
                  </div>
                  <div className={`flex-1 overflow-hidden ${item.is_hidden ? 'opacity-40' : ''}`}>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black text-white mt-1 uppercase tracking-widest">{item.label}</h3>
                      {item.is_hidden && (
                        <span className="bg-yellow-500/90 text-black text-[10px] font-bold px-2 py-0.5 rounded">Tersembunyi</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">{item.url}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => toggleHidden(item)} 
                      className={`${item.is_hidden ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500' : 'bg-green-500/20 text-green-400 hover:bg-green-500'} hover:text-white p-2 rounded-lg transition-colors`}
                      title={item.is_hidden ? 'Tampilkan' : 'Sembunyikan'}
                    >
                      {item.is_hidden ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button onClick={() => openEdit(item)} className="bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white p-2 rounded-lg transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white p-2 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </SortableItem>
              ))}
            </SortableContext>
            {items.length === 0 && (
              <div className="col-span-full text-center py-20 text-gray-500 border border-dashed border-white/10 rounded-3xl">
                Belum ada data kontak.
              </div>
            )}
          </div>
        </DndContext>
      )}

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl w-full max-w-2xl relative overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#111]">
              <h2 className="text-2xl font-black">{formData.id ? "Edit Kontak" : "Tambah Kontak"}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white text-2xl">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-black rounded-3xl border border-white/10 overflow-hidden relative group shrink-0 flex items-center justify-center">
                  {(formData.icon && !iconFile) ? (
                    <img src={formData.icon} className="w-16 h-16 object-contain filter invert" alt="icon" />
                  ) : iconFile ? (
                    <img src={URL.createObjectURL(iconFile)} className="w-16 h-16 object-contain filter invert" alt="preview" />
                  ) : (
                    <ImageIcon className="text-gray-600" size={32}/>
                  )}
                  <input type="file" accept="image/*" onChange={e => setIconFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                    <span className="text-xs font-bold text-white uppercase">Ubah</span>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Label / Nama Kontak</label>
                    <input required value={formData.label} onChange={e => setFormData({...formData, label: e.target.value})} placeholder="Misal: WhatsApp / LinkedIn / Email" className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">URL / Tautan (Link)</label>
                <input required type="url" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} placeholder="https://..." className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30" />
              </div>

              <div className="pt-4 flex justify-end gap-4 mt-6 border-t border-white/10">
                <button type="button" onClick={closeModal} className="px-6 py-3 rounded-xl font-bold text-gray-400 hover:text-white">Batal</button>
                <button disabled={isSubmitting} type="submit" className="bg-white text-black px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors disabled:opacity-50">
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
