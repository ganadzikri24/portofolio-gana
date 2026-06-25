"use client";

import { useState, useEffect } from "react";
import { Save, Image as ImageIcon, Loader2 } from "lucide-react";

export default function ProfileAdminPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    title_id: "",
    description: "",
    description_id: "",
    photo: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (data && data.name) {
        setFormData({
          name: data.name || "",
          title: data.title || "",
          title_id: data.title_id || "",
          description: data.description || "",
          description_id: data.description_id || "",
          photo: data.photo || "",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadFile = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "profile");
    
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let finalPhoto = formData.photo;
      if (photoFile) {
        finalPhoto = await uploadFile(photoFile);
      }

      const payload = { ...formData, photo: finalPhoto };

      await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      alert("Profil berhasil diperbarui!");
      await fetchProfile();
      setPhotoFile(null);
    } catch (err) {
      console.error(err);
      alert("Gagal memperbarui profil.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-gray-500" size={40} /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white">Kelola Profil</h1>
        <p className="text-gray-400 mt-1">Atur identitas utama dan foto hero Anda</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#111] border border-white/10 rounded-3xl p-8 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          <div className="md:col-span-4 flex flex-col items-center">
            <label className="block text-sm font-bold text-gray-400 mb-4 self-start">Foto Profil Utama</label>
            <div className="w-full aspect-[3/4] bg-black rounded-2xl border border-white/10 overflow-hidden relative group mb-4">
              {(formData.photo && !photoFile) ? (
                <img src={formData.photo} alt="Profile" className="w-full h-full object-cover grayscale opacity-80" />
              ) : photoFile ? (
                <img src={URL.createObjectURL(photoFile)} alt="Preview" className="w-full h-full object-cover grayscale opacity-80" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600"><ImageIcon size={48}/></div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-sm font-bold text-white uppercase tracking-widest">Ganti Foto</span>
              </div>
              <input 
                type="file" accept="image/*" 
                onChange={e => setPhotoFile(e.target.files?.[0] || null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
            </div>
            <p className="text-[10px] text-gray-500 text-center">Rekomendasi ukuran: Resolusi tinggi, portrait. Format JPG/PNG/WEBP.</p>
          </div>

          <div className="md:col-span-8 space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">Nama Lengkap</label>
              <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Misal: Muhamad Ganabitz Dzikri" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">Profesi / Judul Pahlawan (Hero Title)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="EN: Creative & Technologist" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30" />
                <input value={formData.title_id} onChange={e => setFormData({...formData, title_id: e.target.value})} placeholder="ID: Kreatif & Teknolog" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">Deskripsi Diri</label>
              <div className="space-y-4">
                <textarea required rows={5} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="EN Description..." className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 resize-none" />
                <textarea rows={5} value={formData.description_id} onChange={e => setFormData({...formData, description_id: e.target.value})} placeholder="ID Description..." className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 resize-none" />
              </div>
            </div>
            
            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button disabled={isSubmitting} type="submit" className="bg-white text-black px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors disabled:opacity-50">
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                {isSubmitting ? "Menyimpan..." : "Simpan Profil"}
              </button>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}
