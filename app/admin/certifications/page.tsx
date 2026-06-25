"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Loader2, Save, Award, GripVertical } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableItem({ id, children }: { id: string, children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div ref={setNodeRef} style={style} className="relative group bg-[#111] border border-white/10 rounded-3xl p-6 flex flex-col gap-3 hover:border-white/30 transition-colors h-full">
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

export default function CertificationsAdminPage() {
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
    title: "",
    title_id: "",
    issuer: "",
    year: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/certifications");
      const data = await res.json();
      setItems(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
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
          body: JSON.stringify({ tableName: 'certifications', items: payload })
        }).catch(console.error);

        return newItems;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        title: formData.title,
        title_id: formData.title_id || formData.title,
        issuer: formData.issuer,
        year: formData.year,
        order_index: formData.id ? undefined : items.length,
      };

      if (formData.id) {
        await fetch(`/api/certifications/${formData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/certifications", {
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
    if (!confirm("Yakin ingin menghapus sertifikat ini?")) return;
    try {
      await fetch(`/api/certifications/${id}`, { method: "DELETE" });
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const openEdit = (item: any) => {
    setFormData({
      id: item.id,
      title: item.title || "",
      title_id: item.title_id || "",
      issuer: item.issuer || "",
      year: item.year || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ id: "", title: "", title_id: "", issuer: "", year: "" });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Kelola Sertifikasi & Prestasi</h1>
          <p className="text-gray-400 mt-1">Tarik & Lepas (Drag & Drop) untuk mengatur urutan</p>
        </div>
        <button 
          onClick={() => { closeModal(); setIsModalOpen(true); }}
          className="bg-white text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors"
        >
          <Plus size={20} />
          Tambah Data
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
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button onClick={() => openEdit(item)} className="bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white p-2 rounded-lg transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white p-2 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="pl-6">
                    <Award className="text-gray-600 mb-2" size={32} />
                    <span className="text-xs font-mono font-bold text-gray-500 tracking-widest">{item.year}</span>
                    <h3 className="text-xl font-black text-white leading-tight">{item.title}</h3>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{item.issuer}</p>
                  </div>
                </SortableItem>
              ))}
            </SortableContext>
            {items.length === 0 && (
              <div className="col-span-full text-center py-20 text-gray-500 border border-dashed border-white/10 rounded-3xl">
                Belum ada riwayat sertifikasi / prestasi.
              </div>
            )}
          </div>
        </DndContext>
      )}

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl w-full max-w-xl relative overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#111]">
              <h2 className="text-2xl font-black">{formData.id ? "Edit Sertifikat" : "Tambah Sertifikat"}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white text-2xl">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">Penerbit (Issuer) / Penyelenggara</label>
                <input required value={formData.issuer} onChange={e => setFormData({...formData, issuer: e.target.value})} placeholder="Misal: Dicoding Indonesia" className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">Tahun Diperoleh</label>
                <input required value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} placeholder="Misal: 2023" className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">Nama Sertifikat / Prestasi</label>
                <div className="space-y-4">
                  <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="EN: Front-End Web Developer Expert" className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 text-sm" />
                  <input value={formData.title_id} onChange={e => setFormData({...formData, title_id: e.target.value})} placeholder="ID: Ahli Pengembang Web Front-End" className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 text-sm" />
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
