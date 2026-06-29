"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Image as ImageIcon, Loader2, Video, List, ArrowUp, ArrowDown, GripVertical } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableItem({ id, children }: { id: string, children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div ref={setNodeRef} style={style} className="relative group bg-[#111] border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 transition-colors h-full">
      <div 
        {...attributes} 
        {...listeners} 
        className="absolute left-2 top-2 p-2 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity z-20 text-gray-500 hover:text-white bg-black/50 rounded-lg backdrop-blur-sm"
      >
        <GripVertical size={20} />
      </div>
      {children}
    </div>
  );
}

const CATEGORY_OPTIONS = [
  { en: "Design", id: "Desain" },
  { en: "Photography", id: "Fotografi" },
  { en: "Video Editing", id: "Editor Video" },
  { en: "Motion Graphics & Animation", id: "Grafik Gerak & Animasi" },
  { en: "IoT Projects", id: "Proyek IoT" },
  { en: "Networking", id: "Jaringan" },
  { en: "Web Development", id: "Pengembangan Web" },
  { en: "More", id: "Lainnya" }
];

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<any[]>([]);
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
    category: "",
    category_id: "",
    type: "seamless-image",
    description: "",
    description_id: "",
    videoUrl: "",
    tools: "", // comma separated
    thumbnail: "",
    images: [] as string[],
    is_hidden: false,
    content: [] as any[], // EN Content Blocks
    content_id: [] as any[], // ID Content Blocks
  });

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data?.sort((a: any, b: any) => a.order_index - b.order_index) || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadFile = async (file: File, folder: string) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", folder);
    
    const res = await fetch("/api/upload", {
      method: "POST",
      body: fd,
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.url;
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setProjects((prev) => {
        const oldIndex = prev.findIndex(item => item.id === active.id);
        const newIndex = prev.findIndex(item => item.id === over.id);
        const newItems = arrayMove(prev, oldIndex, newIndex);
        
        const payload = newItems.map((item, index) => ({ id: item.id, order_index: index }));
        fetch('/api/reorder', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tableName: 'projects', items: payload })
        }).catch(console.error);

        return newItems;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let finalThumbnail = formData.thumbnail;
      let finalImages = [...formData.images];

      // 1. Upload Thumbnail if changed
      if (thumbnailFile) {
        finalThumbnail = await uploadFile(thumbnailFile, "thumbnails");
      }

      // 2. Upload Multiple Images if added (Only for non-article types)
      if (formData.type !== 'article' && imageFiles && imageFiles.length > 0) {
        const uploadPromises = Array.from(imageFiles).map(file => uploadFile(file, "project-details"));
        const uploadedUrls = await Promise.all(uploadPromises);
        finalImages = [...finalImages, ...uploadedUrls];
      }

      // 3. Upload Article Block Images
      let finalContent = [...formData.content];
      let finalContentId = [...formData.content_id];
      
      if (formData.type === 'article') {
         // Upload any pending image files inside blocks (if they are File objects)
         for (let i = 0; i < finalContent.length; i++) {
            if (finalContent[i].type === 'image' && finalContent[i].file instanceof File) {
               const url = await uploadFile(finalContent[i].file, "article-images");
               finalContent[i].value = url;
               delete finalContent[i].file;
            }
         }
         // Sync ID images with EN images (since images are universal)
         for (let i = 0; i < finalContentId.length; i++) {
            if (finalContentId[i].type === 'image') {
               finalContentId[i].value = finalContent[i]?.value || '';
            }
         }
      }

      // 4. Prepare payload
      const payload = {
        title: formData.title,
        title_id: formData.title_id || formData.title,
        category: formData.category,
        category_id: formData.category_id || formData.category,
        type: formData.type,
        description: formData.description,
        description_id: formData.description_id || formData.description,
        videoUrl: formData.type === 'video-top' ? formData.videoUrl : "",
        tools: formData.tools.split(",").map(t => t.trim()).filter(Boolean),
        thumbnail: finalThumbnail,
        images: formData.type === 'article' ? [] : finalImages,
        content: formData.type === 'article' ? finalContent : null,
        content_id: formData.type === 'article' ? finalContentId : null,
        is_hidden: formData.is_hidden,
        order_index: formData.id ? undefined : projects.length,
      };

      // 5. Save to DB
      if (formData.id) {
        await fetch(`/api/projects/${formData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      await fetchProjects();
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Error saving project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await fetch(`/api/projects/${id}`, { method: "DELETE" });
      await fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const openEdit = (project: any) => {
    setFormData({
      id: project.id,
      title: project.title || "",
      title_id: project.title_id || "",
      category: project.category || "",
      category_id: project.category_id || "",
      type: project.type || "seamless-image",
      description: project.description || "",
      description_id: project.description_id || "",
      videoUrl: project.videoUrl || "",
      tools: (project.tools || []).join(", "),
      thumbnail: project.thumbnail || "",
      images: project.images || [],
      is_hidden: project.is_hidden || false,
      content: project.content || [],
      content_id: project.content_id || [],
    });
    setThumbnailFile(null);
    setImageFiles(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      id: "", title: "", title_id: "", category: "", category_id: "", 
      type: "seamless-image", description: "", description_id: "", 
      videoUrl: "", tools: "", thumbnail: "", images: [], is_hidden: false,
      content: [], content_id: []
    });
    setThumbnailFile(null);
    setImageFiles(null);
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // --- ARTICLE BUILDER LOGIC ---
  const addBlock = (type: string) => {
    const newBlockEN = { type, value: type === 'list' ? [] : '' };
    const newBlockID = { type, value: type === 'list' ? [] : '' };
    setFormData(prev => ({
      ...prev,
      content: [...prev.content, newBlockEN],
      content_id: [...prev.content_id, newBlockID]
    }));
  };

  const removeBlock = (index: number) => {
    setFormData(prev => {
      const newContent = [...prev.content];
      const newContentId = [...prev.content_id];
      newContent.splice(index, 1);
      newContentId.splice(index, 1);
      return { ...prev, content: newContent, content_id: newContentId };
    });
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === formData.content.length - 1) return;

    setFormData(prev => {
      const newContent = [...prev.content];
      const newContentId = [...prev.content_id];
      const swapIndex = direction === 'up' ? index - 1 : index + 1;
      
      [newContent[index], newContent[swapIndex]] = [newContent[swapIndex], newContent[index]];
      [newContentId[index], newContentId[swapIndex]] = [newContentId[swapIndex], newContentId[index]];
      
      return { ...prev, content: newContent, content_id: newContentId };
    });
  };

  const updateBlock = (index: number, lang: 'en'|'id', field: string, value: any) => {
    setFormData(prev => {
      const target = lang === 'en' ? [...prev.content] : [...prev.content_id];
      target[index] = { ...target[index], [field]: value };
      return { ...prev, [lang === 'en' ? 'content' : 'content_id']: target };
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Kelola Proyek</h1>
          <p className="text-gray-400 mt-1">Tarik & Lepas (Drag & Drop) untuk mengatur urutan</p>
        </div>
        <button 
          onClick={() => { closeModal(); setIsModalOpen(true); }}
          className="bg-white text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors"
        >
          <Plus size={20} />
          Tambah Proyek
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-gray-500" size={40} />
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SortableContext items={projects} strategy={rectSortingStrategy}>
              {projects.map((p) => (
                <SortableItem key={p.id} id={p.id}>
                  <div className="aspect-video relative overflow-hidden bg-black/50 group-hover:opacity-80 transition-opacity">
                    {p.thumbnail ? (
                      <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><ImageIcon className="text-white/20" size={40}/></div>
                    )}
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button onClick={() => openEdit(p)} className="bg-blue-500/80 p-2 rounded-lg text-white hover:bg-blue-500 transition-colors backdrop-blur-md">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="bg-red-500/80 p-2 rounded-lg text-white hover:bg-red-500 transition-colors backdrop-blur-md">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    {p.is_hidden && (
                      <div className="absolute bottom-3 right-3 bg-yellow-500/90 text-black text-xs font-bold px-2 py-1 rounded backdrop-blur-md">
                        Disembunyikan
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="text-xs text-white/50 mb-2 flex items-center gap-2">
                      <span className="uppercase tracking-widest">{p.category}</span>
                      •
                      <span>{p.type === 'video-top' ? <Video size={12}/> : p.type === 'article' ? <List size={12}/> : <ImageIcon size={12}/>}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{p.title}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2">{p.description}</p>
                  </div>
                </SortableItem>
              ))}
            </SortableContext>
            {projects.length === 0 && (
              <div className="col-span-full text-center py-20 text-gray-500 border border-dashed border-white/10 rounded-3xl">
                Belum ada proyek yang ditambahkan.
              </div>
            )}
          </div>
        </DndContext>
      )}

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl w-full max-w-5xl my-8 relative overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#111] shrink-0">
              <h2 className="text-2xl font-black">{formData.id ? "Edit Proyek" : "Proyek Baru"}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white text-2xl font-light">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* LEFT COLUMN: Data Umum */}
                <div className="lg:col-span-4 space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Tipe Proyek (Layout)</label>
                    <select 
                      value={formData.type} 
                      onChange={e => setFormData({...formData, type: e.target.value})}
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30"
                    >
                      <option value="seamless-image">Galeri Menyambung (Desain/Foto)</option>
                      <option value="video-top">Video YouTube (Animasi/Film)</option>
                      <option value="article">Artikel Kustom (IoT/Web/Networking/More)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Kategori Utama (Bisa pilih lebih dari satu)</label>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORY_OPTIONS.map(opt => {
                        const isSelected = formData.category?.split(',').map((c: string) => c.trim()).includes(opt.en);
                        return (
                          <button
                            type="button"
                            key={opt.en}
                            onClick={() => {
                              const currentEn = formData.category ? formData.category.split(',').map((c: string) => c.trim()).filter(Boolean) : [];
                              const currentId = formData.category_id ? formData.category_id.split(',').map((c: string) => c.trim()).filter(Boolean) : [];
                              
                              if (isSelected) {
                                setFormData({
                                  ...formData,
                                  category: currentEn.filter((c: string) => c !== opt.en).join(', '),
                                  category_id: currentId.filter((c: string) => c !== opt.id).join(', ')
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  category: [...currentEn, opt.en].join(', '),
                                  category_id: [...currentId, opt.id].join(', ')
                                });
                              }
                            }}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                              isSelected 
                                ? 'bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.3)]' 
                                : 'bg-[#111] text-gray-400 border-white/10 hover:border-white/30'
                            }`}
                          >
                            {opt.id} <span className="text-[10px] opacity-50 ml-1">({opt.en})</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Judul Proyek</label>
                    <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="EN Title" className="w-full bg-[#111] border border-white/10 rounded-xl px-3 py-2 text-white text-sm mb-2" />
                    <input value={formData.title_id} onChange={e => setFormData({...formData, title_id: e.target.value})} placeholder="ID Title" className="w-full bg-[#111] border border-white/10 rounded-xl px-3 py-2 text-white text-sm" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Deskripsi Singkat</label>
                    <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="EN Description" className="w-full bg-[#111] border border-white/10 rounded-xl px-3 py-2 text-white text-sm resize-none mb-2" />
                    <textarea rows={3} value={formData.description_id} onChange={e => setFormData({...formData, description_id: e.target.value})} placeholder="ID Description" className="w-full bg-[#111] border border-white/10 rounded-xl px-3 py-2 text-white text-sm resize-none" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Tools (pisahkan koma)</label>
                    <input value={formData.tools} onChange={e => setFormData({...formData, tools: e.target.value})} placeholder="React, Node.js, dll" className="w-full bg-[#111] border border-white/10 rounded-xl px-3 py-2 text-white text-sm" />
                  </div>

                  <div className="bg-[#111] p-4 rounded-xl border border-white/5">
                    <label className="block text-sm font-bold text-gray-400 mb-2">Foto Thumbnail Utama</label>
                    {formData.thumbnail && !thumbnailFile && (
                      <div className="mb-2 relative rounded-lg overflow-hidden aspect-video">
                        <img src={formData.thumbnail} alt="thumb" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <input 
                      type="file" accept="image/*" 
                      onChange={e => setThumbnailFile(e.target.files?.[0] || null)}
                      className="text-xs text-gray-400 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-white/10 file:text-white hover:file:bg-white/20"
                    />
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                    <input type="checkbox" id="isHidden" checked={formData.is_hidden} onChange={e => setFormData({...formData, is_hidden: e.target.checked})} className="w-4 h-4 accent-yellow-500" />
                    <label htmlFor="isHidden" className="text-xs font-bold text-yellow-500 cursor-pointer">Sembunyikan proyek dari publik</label>
                  </div>
                </div>

                {/* RIGHT COLUMN: Media / Content Builder */}
                <div className="lg:col-span-8 border-l border-white/10 pl-0 lg:pl-8 mt-8 lg:mt-0">
                  
                  {formData.type === 'video-top' && (
                    <div className="bg-[#111] p-6 rounded-2xl border border-white/5 mb-6">
                      <label className="block text-sm font-bold text-white mb-2">Tautan Video YouTube</label>
                      <input value={formData.videoUrl} onChange={e => setFormData({...formData, videoUrl: e.target.value})} placeholder="https://youtu.be/..." className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white" />
                    </div>
                  )}

                  {formData.type !== 'article' ? (
                    /* NORMAL GALLERY UPLOADER */
                    <div className="bg-[#111] p-6 rounded-2xl border border-white/5">
                      <h3 className="text-lg font-bold text-white mb-4">Galeri Gambar Proyek</h3>
                      <p className="text-sm text-gray-400 mb-4">Upload seluruh gambar detail proyek Anda di sini.</p>
                      
                      {formData.images.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                          {formData.images.map((img, idx) => (
                            <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden bg-black border border-white/10">
                              <img src={img} className="w-full h-full object-cover" alt="" />
                              <button type="button" onClick={() => removeImage(idx)} className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <Trash2 size={24}/>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:bg-white/5 transition-colors">
                        <input 
                          type="file" accept="image/*" multiple
                          onChange={e => setImageFiles(e.target.files)}
                          className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-6 file:rounded-full file:border-0 file:font-bold file:bg-white file:text-black hover:file:bg-gray-200 mx-auto cursor-pointer"
                        />
                      </div>
                    </div>
                  ) : (
                    /* DYNAMIC ARTICLE BUILDER */
                    <div className="bg-[#111] p-6 rounded-2xl border border-white/5 min-h-full">
                      <h3 className="text-lg font-bold text-white mb-2">Pembuat Artikel (Article Builder)</h3>
                      <p className="text-sm text-gray-400 mb-6">Susun blok konten (Teks, Gambar, Subjudul) untuk proyek IoT/Web Anda.</p>

                      <div className="space-y-4 mb-8">
                        {formData.content.map((block, idx) => (
                          <div key={idx} className="bg-black border border-white/10 rounded-xl p-4 flex gap-4 items-start group">
                            
                            {/* Block Controls */}
                            <div className="flex flex-col gap-1 text-gray-500">
                               <button type="button" onClick={() => moveBlock(idx, 'up')} className="p-1 hover:text-white hover:bg-white/10 rounded"><ArrowUp size={14}/></button>
                               <span className="text-[10px] font-mono text-center font-bold">{idx + 1}</span>
                               <button type="button" onClick={() => moveBlock(idx, 'down')} className="p-1 hover:text-white hover:bg-white/10 rounded"><ArrowDown size={14}/></button>
                            </div>

                            {/* Block Content */}
                            <div className="flex-1 space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-400/10 px-2 py-1 rounded">Blok: {block.type}</span>
                                <button type="button" onClick={() => removeBlock(idx)} className="text-red-400 hover:text-red-300 text-xs font-bold">HAPUS</button>
                              </div>

                              {block.type === 'subtitle' && (
                                <div className="grid grid-cols-2 gap-2">
                                  <input value={block.value} onChange={e => updateBlock(idx, 'en', 'value', e.target.value)} placeholder="EN Subtitle" className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white font-bold" />
                                  <input value={formData.content_id[idx]?.value || ''} onChange={e => updateBlock(idx, 'id', 'value', e.target.value)} placeholder="ID Subtitle" className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white font-bold" />
                                </div>
                              )}

                              {block.type === 'text' && (
                                <div className="grid grid-cols-2 gap-2">
                                  <textarea rows={3} value={block.value} onChange={e => updateBlock(idx, 'en', 'value', e.target.value)} placeholder="EN Paragraph (Supports HTML <b>...</b>)" className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white text-sm resize-none" />
                                  <textarea rows={3} value={formData.content_id[idx]?.value || ''} onChange={e => updateBlock(idx, 'id', 'value', e.target.value)} placeholder="ID Paragraph" className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white text-sm resize-none" />
                                </div>
                              )}

                              {block.type === 'image' && (
                                <div>
                                  {block.value && typeof block.value === 'string' && (
                                    <img src={block.value} className="w-32 h-20 object-cover rounded mb-2 border border-white/10" alt="Preview"/>
                                  )}
                                  <input 
                                    type="file" accept="image/*"
                                    onChange={e => {
                                      if(e.target.files?.[0]) updateBlock(idx, 'en', 'file', e.target.files[0])
                                    }}
                                    className="text-xs text-gray-400 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:bg-white/10 file:text-white"
                                  />
                                </div>
                              )}
                              
                              {block.type === 'list' && (
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="text-xs text-gray-500 mb-1 block">EN Points (pisahkan dengan baris baru / enter)</label>
                                    <textarea rows={4} value={(Array.isArray(block.value) ? block.value : []).join('\n')} onChange={e => updateBlock(idx, 'en', 'value', e.target.value.split('\n'))} placeholder="Point 1&#10;Point 2&#10;Point 3" className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white text-sm resize-none" />
                                  </div>
                                  <div>
                                    <label className="text-xs text-gray-500 mb-1 block">ID Points (pisahkan dengan baris baru / enter)</label>
                                    <textarea rows={4} value={(Array.isArray(formData.content_id[idx]?.value) ? formData.content_id[idx].value : []).join('\n')} onChange={e => updateBlock(idx, 'id', 'value', e.target.value.split('\n'))} placeholder="Poin 1&#10;Poin 2&#10;Poin 3" className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white text-sm resize-none" />
                                  </div>
                                </div>
                              )}
                              
                            </div>
                          </div>
                        ))}

                        {formData.content.length === 0 && (
                          <div className="text-center py-10 border border-dashed border-white/10 rounded-xl text-gray-500 text-sm">
                            Belum ada blok konten. Klik tombol di bawah untuk mulai menyusun artikel.
                          </div>
                        )}
                      </div>

                      {/* Add Block Buttons */}
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                         <span className="text-sm text-gray-400 font-bold flex items-center mr-2">Tambah:</span>
                         <button type="button" onClick={() => addBlock('subtitle')} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-bold transition-colors">+ Subjudul</button>
                         <button type="button" onClick={() => addBlock('text')} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-bold transition-colors">+ Teks / Paragraf</button>
                         <button type="button" onClick={() => addBlock('list')} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-bold transition-colors">+ Point Text (Daftar)</button>
                         <button type="button" onClick={() => addBlock('image')} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-bold transition-colors">+ Gambar Konten</button>
                      </div>

                    </div>
                  )}

                </div>
              </div>
            </form>

            {/* FOOTER */}
            <div className="p-6 border-t border-white/10 flex justify-end gap-4 bg-[#0a0a0a] shrink-0">
              <button type="button" onClick={closeModal} className="px-6 py-3 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                Batal
              </button>
              <button onClick={handleSubmit} disabled={isSubmitting} className="bg-white text-black px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors disabled:opacity-50">
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <ImageIcon size={20} />}
                {isSubmitting ? "Menyimpan..." : "Simpan Proyek"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
