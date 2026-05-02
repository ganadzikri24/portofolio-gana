"use client";

import { useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Mail, Download, X, ExternalLink, MapPin, Award, BookOpen, Briefcase, Code, FolderGit2 } from "lucide-react";
import { FaGithub, FaLinkedin, FaWhatsapp, FaInstagram, FaYoutube, FaBehance } from "react-icons/fa";

import dataEN from "@/data/portfolio.json";
import dataID from "@/data/portfolio-id.json";

export default function AestheticPortfolio() {
  const [activeTab, setActiveTab] = useState("All");
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  
  const [lang, setLang] = useState<"en" | "id">("en");
  const data = lang === "en" ? dataEN : dataID;

  const t = {
    en: {
      nav: [
        { id: "about", label: "About" }, { id: "education", label: "Education" }, 
        { id: "experience", label: "Experience" }, { id: "skills", label: "Skills" }, 
        { id: "portofolio", label: "Portfolio" }, { id: "more", label: "More" }, 
        { id: "contacts", label: "Contacts" }
      ],
      explore: "Explore Work",
      eduTitle: "Education",
      expTitle: "Experience",
      skillTitle: "Skills",
      portTitle: "Portofolio Project",
      moreTitle: "Certifications & Achievements",
      contactTitle: "Let's Connect",
      based: "Based in",
      desc: "Description",
      tools: "Tech Stack / Tools"
    },
    id: {
      nav: [
        { id: "about", label: "Tentang" }, { id: "education", label: "Pendidikan" }, 
        { id: "experience", label: "Pengalaman" }, { id: "skills", label: "Keahlian" }, 
        { id: "portofolio", label: "Portofolio" }, { id: "more", label: "Lainnya" }, 
        { id: "contacts", label: "Kontak" }
      ],
      explore: "Jelajahi Karya",
      eduTitle: "Riwayat Pendidikan",
      expTitle: "Pengalaman",
      skillTitle: "Keahlian",
      portTitle: "Portofolio Project",
      moreTitle: "Sertifikat & Prestasi",
      contactTitle: "Mari Berkolaborasi",
      based: "Berbasis di",
      desc: "Deskripsi",
      tools: "Teknologi & Tools"
    }
  };

  const { scrollYProgress } = useScroll();
  
  const bgGradientY1 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const bgGradientY2 = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const blobRotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const blobScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.5, 1]);

  const filteredProjects = activeTab === "All" 
    ? data.projects 
    : data.projects.filter((p: any) => p.category === activeTab);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const renderProjectContent = (project: any) => {
    if (project.type === "seamless-image") {
      return (
        <div className="flex flex-col w-full">
          {project.images?.map((img: string, i: number) => (
            <img key={i} src={img} className="w-full h-auto block m-0 p-0" alt={`Portfolio ${i}`} />
          ))}
        </div>
      );
    }

    if (project.type === "video-top") {
      const url = project.videoUrl || "";
      
      if (url.includes("youtube.com") || url.includes("youtu.be")) {
        const videoId = url.split('v=')[1] || url.split('youtu.be/')[1];
        const embedUrl = `https://www.youtube.com/embed/${videoId?.split('&')[0]}`;
        return (
          <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/5">
            <iframe className="w-full h-full" src={embedUrl} allowFullScreen />
          </div>
        );
      }

      if (url.includes("instagram.com")) {
        const cleanUrl = url.split('?')[0]; 
        const embedUrl = `${cleanUrl.endsWith('/') ? cleanUrl : cleanUrl + '/'}embed`;
        return (
          <div className="w-full flex justify-center bg-[#0a0a0a] rounded-2xl py-8 border border-white/5 shadow-2xl">
            <div className="w-full max-w-[540px] aspect-[9/16] md:aspect-square overflow-hidden">
              <iframe 
                className="w-full h-full" 
                src={embedUrl} 
                frameBorder="0" 
                scrolling="no" 
                allowTransparency={true}
              />
            </div>
          </div>
        );
      }
      
      return (
        <div className="w-full">
          <video controls className="w-full aspect-video bg-black rounded-2xl shadow-2xl border border-white/5" src={url} />
        </div>
      );
    }

    if (project.type === "article") {
      return (
        <div className="w-full space-y-6 p-6 md:p-10">
          {project.content?.map((item: any, i: number) => {
            if (item.type === "subtitle") {
              return <h3 key={i} className="text-2xl font-black text-white mt-10 mb-2 border-b border-white/10 pb-3">{item.value}</h3>;
            }
            if (item.type === "text") {
              return <p key={i} className="text-lg md:text-xl text-gray-300 leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: item.value }} />;
            }
            if (item.type === "list") {
              return (
                <ul key={i} className="list-disc list-outside ml-6 space-y-3">
                  {item.value?.map((point: string, idx: number) => (
                    <li key={idx} className="text-lg md:text-xl text-gray-300 leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: point }} />
                  ))}
                </ul>
              );
            }
            if (item.type === "image") {
              return <img key={i} src={item.value} className="w-full rounded-2xl shadow-2xl my-8 border border-white/5" alt="Article Content" />;
            }
            if (item.type === "video") {
              return <video key={i} controls src={item.value} className="w-full rounded-2xl shadow-2xl my-8 border border-white/5" />;
            }
            return null;
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative min-h-screen selection:bg-primary selection:text-white bg-[#050505] overflow-x-hidden w-full">
      
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-10">
        <motion.div 
          style={{ y: bgGradientY1, rotate: blobRotate, scale: blobScale }}
          className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-primary/20 rounded-full blur-[150px] transform-gpu will-change-transform"
        />
        <motion.div 
          style={{ y: bgGradientY2, rotate: blobRotate, scale: blobScale }}
          className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-secondary/15 rounded-full blur-[150px] transform-gpu will-change-transform"
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[30vw] bg-fuchsia-500/10 rounded-full blur-[200px] transform-gpu will-change-transform"
        />
      </div>

      <nav className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 glass-nav rounded-full px-4 md:px-6 py-3 flex items-center justify-between w-[95%] max-w-5xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] border-white/10">
        <motion.div whileHover={{ scale: 1.05 }} className="flex-shrink-0 flex items-center gap-3 cursor-pointer" onClick={() => scrollTo("about")}>
          <img src="/logo-navbar.png" alt="Logo" className="w-8 h-8 object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
          <span className="font-extrabold tracking-widest text-white text-lg drop-shadow-[0_0_10px_rgba(139,92,246,0.8)]"></span>
        </motion.div>
        
        <div className="flex items-center flex-nowrap gap-5 md:gap-6 overflow-x-auto w-full ml-4 md:ml-0 justify-start md:justify-end pr-4 md:pr-0 pb-1 md:pb-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {t[lang].nav.map((item) => (
            <button key={item.id} onClick={() => scrollTo(item.id)} className="flex-shrink-0 relative group text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-gray-300 hover:text-white transition-colors">
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
            </button>
          ))}
          <button 
            onClick={() => setLang(lang === "en" ? "id" : "en")} 
            className="flex-shrink-0 ml-1 md:ml-2 px-3 md:px-4 py-1.5 rounded-full bg-white/10 hover:bg-primary border border-white/20 text-xs font-black text-white transition-all duration-300 flex items-center gap-1 md:gap-2"
          >
            <span>{lang === "en" ? "ID" : "EN"}</span>
          </button>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 space-y-20 md:space-y-32 pb-24">
        
        <section id="about" className="min-h-screen flex flex-col md:flex-row justify-between items-center pt-28 md:pt-32 pb-16 relative gap-10 md:gap-8">
          
          <div className="w-full md:w-[55%] text-center md:text-left z-20 flex flex-col items-center md:items-start order-2 md:order-1 mt-8 md:mt-0">
            <motion.h1 
              initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-[5.5rem] leading-[1.1] font-black tracking-tight text-white mb-4 md:mb-6 drop-shadow-2xl cursor-default"
            >
              {data.profile.name.split(" ").map((word: string, i: number) => {
                const hoverColors = ["hover:text-primary", "hover:text-fuchsia-500", "hover:text-secondary"];
                return (
                  <span key={i} className={`transition-colors duration-300 ease-in-out inline-block ${hoverColors[i % hoverColors.length]}`}>
                    {word}&nbsp;
                  </span>
                );
              })}
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="text-lg md:text-3xl font-bold mb-6 md:mb-8 text-transparent bg-clip-text bg-gradient-to-r from-primary via-fuchsia-400 to-secondary animate-pulse"
            >
              {data.profile.title}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="text-sm md:text-lg text-gray-300 leading-relaxed font-medium mb-8 md:mb-10 max-w-2xl glass-card p-5 md:p-6 rounded-3xl bg-[#0a0a0a]/50 text-left"
            >
              {data.profile.description}
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center md:justify-start gap-6"
            >
              <button onClick={() => scrollTo("portofolio")} className="relative group px-8 md:px-10 py-3 md:py-4 bg-white text-black rounded-full font-bold uppercase tracking-widest text-xs transition-all duration-300">
                <span className="relative z-10 group-hover:text-white transition-colors">{t[lang].explore}</span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="w-full md:w-[45%] relative flex justify-center md:justify-end items-center group cursor-pointer order-1 md:order-2"
          >
            <div className="absolute inset-[-15px] rounded-[3rem] md:rounded-[4rem] bg-gradient-to-r from-primary via-secondary to-fuchsia-500 opacity-20 group-hover:opacity-60 blur-2xl transition-opacity duration-500 animate-[spin_6s_linear_infinite]" />
            <div className="absolute inset-[-4px] rounded-[3rem] md:rounded-[4rem] bg-gradient-to-r from-primary to-secondary animate-[spin_4s_linear_infinite]" />
            
            <motion.div whileHover={{ scale: 1.03 }} className="w-[240px] h-[300px] sm:w-[280px] sm:h-[340px] md:w-[380px] md:h-[480px] rounded-[3rem] md:rounded-[4rem] relative overflow-hidden bg-[#0a0a0a] z-10 flex items-center justify-center p-1 border-4 border-transparent shadow-[0_0_50px_rgba(139,92,246,0.3)]">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
              <img 
                src={data.profile.photo} 
                alt="Ganabitz" 
                className="w-full h-full object-cover rounded-[2.8rem] md:rounded-[3.8rem] grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100 relative z-20" 
                onError={(e) => e.currentTarget.src = 'https://ui-avatars.com/api/?name=MG&background=8b5cf6&color=fff&size=512'}
              />
            </motion.div>
          </motion.div>

        </section>

        <section id="education" className="scroll-mt-20">
          <motion.h2 initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} className="text-3xl md:text-5xl font-black mb-10 md:mb-16 flex items-center gap-4 drop-shadow-lg">
            <BookOpen className="text-primary w-8 h-8 md:w-10 md:h-10" /> {t[lang].eduTitle}
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {data.education.map((edu: any, i: number) => (
              <motion.div key={i} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative group rounded-[2rem] p-[2px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-[spin_4s_linear_infinite]" />
                <div className="relative h-full glass-card p-6 md:p-8 rounded-[2rem] flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 bg-[#0a0a0a]/90 backdrop-blur-xl z-10">
                  <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 bg-white/5 rounded-2xl p-2 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <img src={edu.logo} alt="Logo" className="max-w-full max-h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" onError={(e) => e.currentTarget.style.display = 'none'} />
                  </div>
                  <div>
                    <span className="text-primary font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1 block drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]">{edu.year}</span>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{edu.degree}</h3>
                    <p className="text-sm md:text-base text-gray-300 font-medium">{edu.institution}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="experience" className="scroll-mt-20">
          <motion.h2 initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-black mb-10 md:mb-16 flex items-center gap-4">
            <Briefcase className="text-secondary w-8 h-8 md:w-10 md:h-10" /> {t[lang].expTitle}
          </motion.h2>
          <div className="space-y-6 md:space-y-8">
            {data.experience.map((exp: any, i: number) => (
              <motion.div key={i} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative group rounded-[2rem] md:rounded-[2.5rem] p-[2px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-secondary via-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-[spin_4s_linear_infinite]" />
                <div className="relative glass-card p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] flex flex-col md:flex-row gap-4 md:gap-8 bg-[#0a0a0a]/90 backdrop-blur-xl z-10">
                  <div className="md:w-1/4 shrink-0">
                    <span className="text-secondary font-bold text-xs md:text-sm mb-1 md:mb-2 block drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]">{exp.year}</span>
                    <span className="text-white font-bold text-base md:text-lg">{exp.company}</span>
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-black text-white mb-2 md:mb-4 group-hover:text-secondary transition-colors">{exp.role}</h3>
                    <p className="text-sm md:text-base text-gray-300 leading-relaxed font-medium">{exp.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="skills" className="scroll-mt-20">
          <motion.h2 initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-black mb-10 md:mb-16 flex items-center gap-4">
            <Code className="text-primary w-8 h-8 md:w-10 md:h-10" /> {t[lang].skillTitle}
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {data.skills.map((skill: any, i: number) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} whileHover={{ scale: 1.05, y: -10 }} className="relative group rounded-3xl p-[2px] overflow-hidden cursor-pointer opacity-80 hover:opacity-100 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative glass-card p-5 md:p-6 rounded-3xl flex flex-col items-center text-center bg-[#0a0a0a]/90 backdrop-blur-md h-full z-10">
                  <div className="w-12 h-12 md:w-16 md:h-16 mb-4 md:mb-6 group-hover:scale-125 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                    <img src={skill.logo} alt={skill.name} className="w-full h-full object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-white mb-1 md:mb-2 group-hover:text-primary transition-colors">{skill.name}</h3>
                  <p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">{skill.category}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="portofolio" className="scroll-mt-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8 mb-10 md:mb-16">
            <motion.h2 initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-black flex items-center gap-4">
              <FolderGit2 className="text-secondary w-8 h-8 md:w-10 md:h-10" /> {t[lang].portTitle}
            </motion.h2>
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex flex-wrap gap-2">
              {data.categories.map((cat: string) => (
                <button key={cat} onClick={() => setActiveTab(cat)} className={`px-4 md:px-5 py-1.5 md:py-2 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === cat ? "bg-primary text-white shadow-[0_0_15px_rgba(139,92,246,0.6)]" : "glass-card text-gray-400 hover:text-white hover:border-white/30"}`}>
                  {cat}
                </button>
              ))}
            </motion.div>
          </div>

          <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project: any) => (
                <motion.div key={project.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} whileHover={{ y: -10 }} onClick={() => setSelectedProject(project)} className="relative group rounded-[2rem] md:rounded-[2.5rem] p-[2px] overflow-hidden cursor-pointer transition-all duration-300 shadow-xl hover:shadow-[0_20px_50px_rgba(139,92,246,0.3)]">
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative glass-card rounded-[2rem] md:rounded-[2.5rem] overflow-hidden bg-[#0a0a0a] z-10 h-full flex flex-col">
                    <div className="aspect-square bg-[#111] relative overflow-hidden">
                      <img src={project.thumbnail} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" onError={(e) => e.currentTarget.style.display = 'none'} />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-90" />
                      <div className="absolute top-4 md:top-6 left-4 md:left-6 px-3 md:px-4 py-1.5 md:py-2 glass-nav rounded-full text-[8px] md:text-[10px] font-bold text-white uppercase tracking-widest shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                        {project.category}
                      </div>
                    </div>
                    <div className="p-6 md:p-8 flex-grow">
                      <h3 className="text-xl md:text-2xl font-black text-white group-hover:text-primary transition-colors">{project.title}</h3>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>

        <section id="more" className="scroll-mt-20">
          <motion.h2 initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-black mb-10 md:mb-16 flex items-center gap-4">
            <Award className="text-primary w-8 h-8 md:w-10 md:h-10" /> {t[lang].moreTitle}
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
             {data.more.map((item: any, i: number) => (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative group rounded-[1.5rem] md:rounded-[2rem] p-[2px] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative glass-card p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-[#0a0a0a]/90 z-10 h-full">
                    <span className="text-primary font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1 md:mb-2 block drop-shadow-[0_0_5px_rgba(139,92,246,0.8)]">{item.year}</span>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-sm md:text-base text-gray-400 font-medium">{item.issuer}</p>
                  </div>
                </motion.div>
             ))}
          </div>
        </section>

        <section id="contacts" className="py-20 md:py-32 scroll-mt-20 border-t border-white/10">
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative group rounded-[3rem] md:rounded-[4rem] p-[2px] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-fuchsia-500 animate-[spin_6s_linear_infinite]" />
            <div className="relative glass-card p-8 sm:p-12 md:p-24 rounded-[3rem] md:rounded-[4rem] text-center bg-[#0a0a0a]/95 backdrop-blur-2xl z-10">
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-4 md:mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">{t[lang].contactTitle}</h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-gray-300 text-sm md:text-base font-medium mb-8 md:mb-12">
                <MapPin size={18} className="text-secondary" /> {t[lang].based} Bogor, West Java, Indonesia
              </div>
              <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                {[
                  { isLocal: true, imgSrc: "/icon-cv.png", url: "https://drive.google.com/drive/folders/1RKlbgk_HDLakO0m1zsU_JJ88LgZ3Xdmq?usp=sharing", color: "hover:bg-amber-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.6)]" },
                  { icon: Mail, url: "mailto:ganadzikri@gmail.com", color: "hover:bg-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.6)]" },
                  { icon: FaWhatsapp, url: "https://wa.me/6281380731465", color: "hover:bg-green-500 hover:shadow-[0_0_20px_rgba(34,197,94,0.6)]" },
                  { icon: FaLinkedin, url: "https://www.linkedin.com/in/muhamadgana/", color: "hover:bg-blue-600 hover:shadow-[0_0_20px_rgba(37,99,235,0.6)]" },
                  { icon: FaGithub, url: "https://github.com/ganadzikri24", color: "hover:bg-gray-800 hover:shadow-[0_0_20px_rgba(31,41,55,0.6)]" },
                  { icon: FaInstagram, url: "https://www.instagram.com/ganadzkriii/", color: "hover:bg-pink-600 hover:shadow-[0_0_20px_rgba(219,39,119,0.6)]" },
                  { icon: FaYoutube, url: "https://www.youtube.com/@ganadzikri7788", color: "hover:bg-red-600 hover:shadow-[0_0_20px_rgba(220,38,38,0.6)]" },
                  { icon: FaBehance, url: "https://www.behance.net/ganadzikri", color: "hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.6)]" }
                ].map((item: any, i: number) => (
                  <motion.a key={i} href={item.url} target="_blank" rel="noopener noreferrer" whileHover={{ y: -10, scale: 1.15 }} className={`w-12 h-12 md:w-16 md:h-16 rounded-full glass-card flex items-center justify-center text-white transition-all duration-300 ${item.color}`}>
                    {item.isLocal ? (
                      <img src={item.imgSrc} alt="CV" className="w-[20px] h-[20px] md:w-[26px] md:h-[26px] object-contain drop-shadow-md" />
                    ) : (
                      item.icon && <item.icon className="w-5 h-5 md:w-[26px] md:h-[26px]" />
                    )}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <AnimatePresence>
        {selectedProject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-[#050505]/95 backdrop-blur-3xl overflow-y-auto">
            <div className="max-w-4xl mx-auto w-full relative min-h-screen flex flex-col">
              <div className="sticky top-0 w-full p-4 md:p-6 flex justify-end z-[210]">
                 <motion.button whileHover={{ scale: 1.1, rotate: 90 }} onClick={() => setSelectedProject(null)} className="w-12 h-12 md:w-14 md:h-14 glass-nav rounded-full flex items-center justify-center text-white hover:bg-primary shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-colors">
                    <X size={24} className="md:w-7 md:h-7" />
                 </motion.button>
              </div>
              
              <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="px-4 md:px-6 pb-24 md:pb-32 flex-grow">
                <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px] md:text-xs mb-3 md:mb-4 block drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]">{selectedProject.category}</span>
                <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-8 md:mb-12">{selectedProject.title}</h2>
                
                <div className="mb-8 md:mb-12 w-full rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-[#0a0a0a] shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/5">
                   {renderProjectContent(selectedProject)}
                </div>

                <div className="relative rounded-[1.5rem] md:rounded-[2rem] p-[2px] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-30" />
                  <div className="relative glass-card p-6 md:p-10 rounded-[1.5rem] md:rounded-[2rem] bg-[#0a0a0a]/90 z-10">
                    <h3 className="text-lg md:text-xl font-black mb-3 md:mb-4 text-white uppercase tracking-widest">{t[lang].desc}</h3>
                    <p className="text-sm md:text-lg text-gray-300 leading-relaxed font-medium mb-8 md:mb-10">{selectedProject.description}</p>
                    
                    <h3 className="text-xs md:text-sm font-black mb-3 md:mb-4 text-white uppercase tracking-widest">{t[lang].tools}</h3>
                    <div className="flex flex-wrap gap-2 md:gap-3">
                      {selectedProject.tools?.map((t: string, i: number) => (
                        <span key={i} className="px-3 md:px-5 py-1.5 md:py-2 glass-card rounded-lg text-[10px] md:text-xs font-bold text-white hover:bg-primary transition-colors cursor-default border border-white/10 shadow-lg">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}