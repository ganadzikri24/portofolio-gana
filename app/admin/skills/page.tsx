"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Image as ImageIcon, Loader2, Save, GripVertical } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableItem({ id, children }: { id: string, children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div ref={setNodeRef} style={style} className="relative group bg-[#111] border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center text-center hover:border-white/50 transition-all h-full">
      <div 
        {...attributes} 
        {...listeners} 
        className="absolute left-2 top-2 p-2 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity z-20 text-gray-500 hover:text-white"
      >
        <GripVertical size={20} />
      </div>
      {children}
    </div>
  );
}

export default function SkillsAdminPage() {
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
    name: "",
    category: "",
    category_id: "",
    logo: "",
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/skills");
      const data = await res.json();
      setItems(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadFile = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "skills");
    
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
          body: JSON.stringify({ tableName: 'skills', items: payload })
        }).catch(console.error);

        return newItems;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let finalLogo = formData.logo;
      if (logoFile) {
        finalLogo = await uploadFile(logoFile);
      }

      const payload = {
        name: formData.name,
        category: formData.category,
        category_id: formData.category_id || formData.category,
        logo: finalLogo,
        order_index: formData.id ? undefined : items.length,
      };

      if (formData.id) {
        await fetch(`/api/skills/${formData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/skills", {
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
    if (!confirm("Yakin ingin menghapus keahlian ini?")) return;
    try {
      await fetch(`/api/skills/${id}`, { method: "DELETE" });
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const openEdit = (item: any) => {
    setFormData({
      id: item.id,
      name: item.name || "",
      category: item.category || "",
      category_id: item.category_id || "",
      logo: item.logo || "",
    });
    setLogoFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ id: "", name: "", category: "", category_id: "", logo: "" });
    setLogoFile(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Kelola Keahlian (Skills)</h1>
          <p className="text-gray-400 mt-1">Tarik & Lepas (Drag & Drop) untuk mengatur urutan</p>
        </div>
        <button 
          onClick={() => { closeModal(); setIsModalOpen(true); }}
          className="bg-white text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors"
        >
          <Plus size={20} />
          Tambah Keahlian
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-gray-500" size={40} />
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            <SortableContext items={items} strategy={rectSortingStrategy}>
              {items.map((item) => (
                <SortableItem key={item.id} id={item.id}>
                  <div className="absolute inset-0 bg-black/60 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10 backdrop-blur-sm pointer-events-none">
                    <button onClick={() => openEdit(item)} className="bg-blue-500 text-white p-2 rounded-full hover:scale-110 transition-transform pointer-events-auto">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white p-2 rounded-full hover:scale-110 transition-transform pointer-events-auto">
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="w-16 h-16 mb-4">
                    {item.logo ? (
                      <img src={item.logo} alt={item.name} className="w-full h-full object-contain grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                    ) : (
                      <ImageIcon className="w-full h-full text-gray-600 opacity-50" />
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1 leading-tight">{item.name}</h3>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">{item.category}</p>
                </SortableItem>
              ))}
            </SortableContext>
            {items.length === 0 && (
              <div className="col-span-full text-center py-20 text-gray-500 border border-dashed border-white/10 rounded-3xl">
                Belum ada data keahlian.
              </div>
            )}
          </div>
        </DndContext>
      )}

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl w-full max-w-lg relative overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#111]">
              <h2 className="text-2xl font-black">{formData.id ? "Edit Keahlian" : "Tambah Keahlian"}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white text-2xl">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 bg-black rounded-3xl border border-white/10 overflow-hidden relative group mb-2 flex items-center justify-center">
                  {(formData.logo && !logoFile) ? (
                    <img src={formData.logo} className="w-20 h-20 object-contain" alt="logo" />
                  ) : logoFile ? (
                    <img src={URL.createObjectURL(logoFile)} className="w-20 h-20 object-contain" alt="preview" />
                  ) : (
                    <ImageIcon className="text-gray-600" size={40}/>
                  )}
                  <input type="file" accept="image/*" onChange={e => setLogoFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                    <span className="text-xs font-bold text-white uppercase tracking-widest">Ubah Ikon</span>
                  </div>
                </div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Ikon Software</label>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">Nama Software / Skill</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Misal: Adobe Photoshop" className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">Kategori Keahlian</label>
                <div className="space-y-4">
                  <input required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="EN: Graphic Design" className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 text-sm" />
                  <input value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} placeholder="ID: Desain Grafis" className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 text-sm" />
                </div>
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
