"use client";

import React, { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, X, MapPin, ArrowUpRight, Menu } from "lucide-react";
import { FaGithub, FaLinkedin, FaWhatsapp, FaInstagram, FaYoutube, FaBehance } from "react-icons/fa";

import dataEN from "@/data/portfolio.json";
import dataID from "@/data/portfolio-id.json";

// --- Pure CSS Keyframes for 0-Lag Ambient Animations ---
const ambientStyles = `
  @keyframes spin-slow { 100% { transform: rotate(360deg); } }
  @keyframes spin-slow-reverse { 100% { transform: rotate(-360deg); } }
  @keyframes float-1 { 0%, 100% { transform: translate(0, 0); opacity: 0.1; } 50% { transform: translate(30px, -60px); opacity: 0.5; } }
  @keyframes float-2 { 0%, 100% { transform: translate(0, 0); opacity: 0.1; } 50% { transform: translate(-40px, 80px); opacity: 0.4; } }
  @keyframes beam { 0% { transform: translateY(-100vh); } 100% { transform: translateY(100vh); } }
`;

// --- Ambient Animations (Optimized to Pure CSS for 0 JS Load) ---
const AmbientGeometry = memo(() => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
    <style dangerouslySetInnerHTML={{ __html: ambientStyles }} />
    <div className="absolute top-[-30vw] left-[-20vw] w-[100vw] h-[100vw] border-[2px] border-white/20 rounded-full border-solid" style={{ animation: "spin-slow 90s linear infinite" }} />
    <div className="absolute bottom-[-40vw] right-[-20vw] w-[120vw] h-[120vw] border-[1px] border-white/15 rounded-full border-solid" style={{ animation: "spin-slow-reverse 120s linear infinite" }} />
    <div className="absolute top-[-10vw] right-[-10vw] w-[70vw] h-[70vw] border-[2px] border-white/10 rounded-full border-solid" style={{ animation: "spin-slow 150s linear infinite" }} />
    <div className="absolute bottom-[-20vw] left-[-10vw] w-[60vw] h-[60vw] border-[1px] border-white/15 rounded-full border-solid" style={{ animation: "spin-slow-reverse 100s linear infinite" }} />
    <div className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" style={{ animation: "beam 15s linear infinite" }} />
  </div>
));
AmbientGeometry.displayName = "AmbientGeometry";

const AmbientParticles = memo(() => (
  <div className="absolute inset-0 pointer-events-none z-0">
    <div className="absolute top-[20%] left-[10%] w-4 h-4 bg-white rounded-full shadow-[0_0_15px_white]" style={{ animation: "float-1 8s ease-in-out infinite" }} />
    <div className="absolute bottom-[30%] right-[15%] w-5 h-5 bg-gray-300 rounded-full shadow-[0_0_20px_gray]" style={{ animation: "float-2 12s ease-in-out infinite 1s" }} />
    <div className="absolute top-[60%] right-[20%] w-3 h-3 bg-white/50 rounded-full shadow-[0_0_10px_white]" style={{ animation: "float-1 10s ease-in-out infinite 2s" }} />
  </div>
));
AmbientParticles.displayName = "AmbientParticles";

// --- Isolated Highlight Widget (Prevents full page re-renders every 4s) ---
const ProjectHighlightWidget = memo(({ projects, setSelectedProject }: { projects: any[], setSelectedProject: (p: any) => void }) => {
  const [currentHighlight, setCurrentHighlight] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHighlight((prev) => (prev + 1) % projects.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [projects.length]);

  if (projects.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, rotate: 10 }} animate={{ opacity: 1, x: 0, rotate: 0 }} transition={{ delay: 1.5, type: "spring", bounce: 0.5 }}
      whileHover={{ scale: 1.05, rotate: -2, y: -10 }}
      className="absolute bottom-10 right-6 md:right-10 z-30 w-64 md:w-80 h-40 md:h-48 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl cursor-pointer group hidden md:block bg-black"
      onClick={() => setSelectedProject(projects[currentHighlight])}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={currentHighlight}
          initial={{ opacity: 0, scale: 1.2 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}
          src={projects[currentHighlight]?.thumbnail}
          loading="lazy" decoding="async"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000"
          alt="Highlight"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-60 transition-opacity" />
      <div className="absolute bottom-5 left-5 right-5 z-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <p className="text-[9px] text-white/90 uppercase tracking-widest font-black bg-white/20 px-2 py-0.5 rounded-sm backdrop-blur-sm">
            {projects[currentHighlight]?.category}
          </p>
        </div>
        <p className="text-white font-black text-sm md:text-base leading-tight drop-shadow-md">{projects[currentHighlight]?.title}</p>
      </div>
    </motion.div>
  );
});
ProjectHighlightWidget.displayName = "ProjectHighlightWidget";

const areTextsEqual = (prev: { text: string }, next: { text: string }) => {
  const p = prev.text?.replace(/\s+/g, " ").trim() || "";
  const n = next.text?.replace(/\s+/g, " ").trim() || "";
  return p === n;
};

const AnimatedTitle = memo(({ text }: { text: string }) => {
  if (!text) return null;
  return (
    <>
      {text.split(" ").map((word: string, i: number) => (
        <motion.span
          key={`${text}-${i}`}
          initial={{ opacity: 0, y: 100, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", bounce: 0.3, duration: 1.2, delay: i * 0.15 }}
          whileHover={{ color: "#ffffff", scale: 1.05, y: -10, textShadow: "0px 0px 25px rgba(255,255,255,0.8)" }}
          className="inline-block mr-[2vw] last:mr-0 text-white cursor-default"
        >
          {word}
        </motion.span>
      ))}
    </>
  );
}, areTextsEqual);
AnimatedTitle.displayName = "AnimatedTitle";

const AnimatedDescription = memo(({ text }: { text: string }) => {
  if (!text) return null;
  return (
    <>
      {text.split(" ").map((word: string, i: number) => (
        <motion.span key={`${text}-${i}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + (i * 0.05) }} className="inline-block mr-1">
          {word}
        </motion.span>
      ))}
    </>
  );
}, areTextsEqual);
AnimatedDescription.displayName = "AnimatedDescription";

export default function AestheticPortfolio() {
  const [activeTab, setActiveTab] = useState("All");
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [lang, setLang] = useState<"en" | "id">("en");
  const data = lang === "en" ? dataEN : dataID;

  const [dbProjects, setDbProjects] = useState<any[]>([]);
  const [dbProfile, setDbProfile] = useState<any>(null);
  const [dbEducation, setDbEducation] = useState<any[]>([]);
  const [dbExperience, setDbExperience] = useState<any[]>([]);
  const [dbSkills, setDbSkills] = useState<any[]>([]);
  const [dbCertifications, setDbCertifications] = useState<any[]>([]);
  const [dbContacts, setDbContacts] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/projects').then(res => res.json()),
      fetch('/api/profile').then(res => res.json()),
      fetch('/api/education').then(res => res.json()),
      fetch('/api/experience').then(res => res.json()),
      fetch('/api/skills').then(res => res.json()),
      fetch('/api/certifications').then(res => res.json()),
      fetch('/api/contacts').then(res => res.json())
    ]).then(([projects, profile, education, experience, skills, certifications, contacts]) => {
      setDbProjects(projects.filter((p: any) => !p.is_hidden));
      setDbProfile(profile);
      setDbEducation(education);
      setDbExperience(experience);
      setDbSkills(skills);
      setDbCertifications(certifications);
      setDbContacts(contacts || []);
    }).catch(err => console.error(err));
  }, []);

  const t = {
    en: {
      nav: [
        { id: "about", label: "About" }, { id: "experience", label: "Experience" },
        { id: "education", label: "Education" }, { id: "skills", label: "Skills" },
        { id: "portofolio", label: "Portfolio" }, { id: "more", label: "More" },
        { id: "contacts", label: "Contacts" }
      ],
      explore: "Explore Work",
      eduTitle: "Education",
      expTitle: "Experience",
      skillTitle: "Skills",
      portTitle: "Selected Works",
      moreTitle: "Certifications & Achievements",
      contactTitle: "LET'S CONNECT",
      based: "Based in",
      desc: "Description",
      tools: "Tech Stack",
      viewProject: "View Project"
    },
    id: {
      nav: [
        { id: "about", label: "Tentang" }, { id: "experience", label: "Pengalaman" },
        { id: "education", label: "Pendidikan" }, { id: "skills", label: "Keahlian" },
        { id: "portofolio", label: "Portofolio" }, { id: "more", label: "Lainnya" },
        { id: "contacts", label: "Kontak" }
      ],
      explore: "Jelajahi Karya",
      eduTitle: "Pendidikan",
      expTitle: "Pengalaman",
      skillTitle: "Keahlian",
      portTitle: "Karya Pilihan",
      moreTitle: "Sertifikat & Prestasi",
      contactTitle: "MARI TERHUBUNG",
      based: "Berbasis di",
      desc: "Deskripsi",
      tools: "Teknologi",
      viewProject: "Lihat Proyek"
    }
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const localizedProjects = dbProjects.length > 0 ? dbProjects.map(p => ({
    ...p,
    title: lang === "en" ? p.title : p.title_id || p.title,
    description: lang === "en" ? p.description : p.description_id || p.description,
    category: lang === "en" ? p.category : p.category_id || p.category,
    content: lang === "en" ? p.content : p.content_id || p.content
  })) : data.projects;

  const filteredProjects = (activeTab === "All" || activeTab === "Semua")
    ? localizedProjects
    : localizedProjects.filter((p: any) => p.category === activeTab);

  const pData = dbProfile && dbProfile.name ? {
    name: dbProfile.name,
    title: lang === "en" ? dbProfile.title : dbProfile.title_id || dbProfile.title,
    description: lang === "en" ? dbProfile.description : dbProfile.description_id || dbProfile.description,
    photo: dbProfile.photo
  } : data.profile;

  const eduData = dbEducation.length > 0 ? dbEducation.map(e => ({
    ...e,
    degree: lang === "en" ? e.degree : e.degree_id || e.degree
  })) : data.education;

  const expData = dbExperience.length > 0 ? dbExperience.map(e => ({
    ...e,
    role: lang === "en" ? e.role : e.role_id || e.role,
    description: lang === "en" ? e.description : e.description_id || e.description
  })) : data.experience;

  const skillData = dbSkills.length > 0 ? dbSkills.map(s => ({
    ...s,
    category: lang === "en" ? s.category : s.category_id || s.category
  })) : data.skills;

  const moreData = dbCertifications.length > 0 ? dbCertifications.map(c => ({
    ...c,
    title: lang === "en" ? c.title : c.title_id || c.title
  })) : data.more;

  const iconMap: Record<string, any> = {
    "Email": Mail,
    "WhatsApp": FaWhatsapp,
    "LinkedIn": FaLinkedin,
    "GitHub": FaGithub,
    "Instagram": FaInstagram,
    "YouTube": FaYoutube,
    "Behance": FaBehance,
  };

  const contactsData = dbContacts.length > 0 ? dbContacts.map(c => ({
    isLocal: !iconMap[c.label],
    imgSrc: c.icon,
    icon: iconMap[c.label],
    url: c.url,
    label: c.label
  })) : [
    { isLocal: true, imgSrc: "/icon-cv.png", url: "https://drive.google.com/drive/folders/1RKlbgk_HDLakO0m1zsU_JJ88LgZ3Xdmq?usp=sharing", label: "CV" },
    { icon: Mail, url: "mailto:ganadzikri@gmail.com", label: "Email" },
    { icon: FaWhatsapp, url: "https://wa.me/6281380731465", label: "WhatsApp" },
    { icon: FaLinkedin, url: "https://www.linkedin.com/in/muhamadgana/", label: "LinkedIn" },
    { icon: FaGithub, url: "https://github.com/ganadzikri24", label: "GitHub" },
    { icon: FaInstagram, url: "https://www.instagram.com/ganadzkriii/", label: "Instagram" },
    { icon: FaYoutube, url: "https://www.youtube.com/@ganadzikri7788", label: "YouTube" },
    { icon: FaBehance, url: "https://www.behance.net/ganadzikri", label: "Behance" }
  ];

  const renderProjectContent = (project: any) => {
    if (project.type === "seamless-image") {
      return (
        <div className="flex flex-col w-full">
          {project.images?.map((img: string, i: number) => (
            <img
              key={i}
              src={img}
              loading="lazy" decoding="async"
              className="w-full h-auto block m-0 p-0" alt={`Portfolio ${i}`}
            />
          ))}
        </div>
      );
    }
    if (project.type === "video-top") {
      const url = project.videoUrl || "";
      if (url.includes("instagram.com")) {
        const embedUrl = url.split('?')[0].replace(/\/$/, '') + '/embed';
        return (
          <div className="w-full aspect-[4/5] md:aspect-video bg-[#050505] overflow-hidden border border-white/5 flex justify-center">
            <iframe className="w-full max-w-lg h-full min-h-[400px] md:min-h-[500px]" src={embedUrl} allowFullScreen loading="lazy" />
          </div>
        );
      }
      if (url.includes("youtube.com") || url.includes("youtu.be")) {
        const videoId = url.split('v=')[1] || url.split('youtu.be/')[1];
        const embedUrl = `https://www.youtube.com/embed/${videoId?.split('&')[0]}`;
        return (
          <div className="w-full aspect-video overflow-hidden border border-white/5">
            <iframe className="w-full h-full" src={embedUrl} allowFullScreen loading="lazy" />
          </div>
        );
      }
      return (
        <div className="w-full border border-white/5">
          <video controls className="w-full aspect-video bg-black" src={url} preload="none" />
        </div>
      );
    }
    if (project.type === "article") {
      return (
        <div className="w-full space-y-8 p-6 md:p-16 bg-[#0a0a0a]">
          {project.content?.map((item: any, i: number) => {
            if (item.type === "subtitle") return <motion.h3 initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} key={i} className="text-3xl font-bold text-white mt-12 mb-4 tracking-tight">{item.value}</motion.h3>;
            if (item.type === "text") return <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.5 }} key={i} className="text-lg md:text-xl text-gray-400 leading-relaxed font-light" dangerouslySetInnerHTML={{ __html: item.value }} />;
            if (item.type === "list") return (
              <ul key={i} className="list-disc list-outside ml-6 space-y-4">
                {item.value?.map((point: string, idx: number) => (
                  <motion.li initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: idx * 0.1 }} key={idx} className="text-lg md:text-xl text-gray-400 leading-relaxed font-light" dangerouslySetInnerHTML={{ __html: point }} />
                ))}
              </ul>
            );
            if (item.type === "image") return <motion.img initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }} key={i} src={item.value} loading="lazy" decoding="async" className="w-full rounded-2xl my-10 border border-white/5 shadow-2xl" alt="Article Content" />;
            return null;
          })}
        </div>
      );
    }
    return null;
  };

  const cinematicReveal: any = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { type: "tween", ease: "easeOut", duration: 0.8 } }
  };

  return (
    <div className="relative min-h-screen selection:bg-white selection:text-black bg-[#050505] text-white overflow-x-hidden w-full font-sans">

      {/* GLOBAL NAVBAR */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
        className="fixed top-0 left-0 w-full z-50 px-6 py-5 flex items-center justify-between bg-[#030303]/95 border-b border-white/5"
      >
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => scrollTo("about")}>
          <motion.img whileHover={{ rotate: 180, scale: 1.2 }} transition={{ duration: 0.6 }} src="/logo-navbar.png" alt="Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden xl:flex items-center gap-6">
            {t[lang].nav.map((item) => (
              <button key={item.id} onClick={() => scrollTo(item.id)} className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors relative group">
                {item.label}
                <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }}
            onClick={() => setLang(lang === "en" ? "id" : "en")}
            className="px-4 py-2 border border-white/20 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 shadow-lg"
          >
            {lang === "en" ? "ID" : "EN"}
          </motion.button>
          <button onClick={() => setIsMobileMenuOpen(true)} className="xl:hidden text-white p-1 hover:text-gray-300 transition-colors">
            <Menu size={28} />
          </button>
        </div>
      </motion.nav>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }} transition={{ type: "tween", duration: 0.4 }} className="fixed inset-0 bg-[#030303] z-[200] flex flex-col p-6 overflow-hidden">
            <div className="flex justify-end mt-2">
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-gray-400 transition-colors p-2"><X size={32} /></button>
            </div>
            <div className="flex flex-col items-center justify-center flex-grow gap-8">
              {t[lang].nav.map(item => (
                <button key={item.id} onClick={() => { setIsMobileMenuOpen(false); setTimeout(() => scrollTo(item.id), 300); }} className="text-3xl font-black uppercase tracking-widest text-white hover:text-gray-400 transition-colors">
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 w-full">

        {/* 1. HERO SECTION */}
        <section id="about" className="min-h-screen flex flex-col justify-between px-4 relative overflow-hidden pt-32 pb-0">
          <AmbientGeometry />
          <AmbientParticles />

          <div className="w-full max-w-7xl mx-auto text-center relative z-20 mt-10">
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5 }} className="text-gray-400 font-bold uppercase text-xs md:text-sm mb-6 tracking-[0.5em]">
              {pData.title}
            </motion.p>

            <h1 className="text-[15vw] sm:text-[13vw] md:text-[11vw] leading-[0.85] font-black tracking-tighter uppercase mb-8 flex flex-wrap justify-center drop-shadow-xl">
              <AnimatedTitle text={pData.name} />
            </h1>

            <div className="max-w-2xl mx-auto text-sm md:text-lg text-gray-400 font-light leading-relaxed mb-10 overflow-hidden flex flex-wrap justify-center">
              <AnimatedDescription text={pData.description} />
            </div>
          </div>

          <motion.div
            animate={{ y: [0, -20, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-10 md:left-20 top-[60%] -translate-y-1/2 z-20 hidden lg:flex flex-col items-center gap-3"
          >
            <motion.div whileHover={{ scale: 1.3, rotate: 180 }} className="w-16 h-16 border border-white/20 rounded-full flex items-center justify-center bg-white/5 shadow-xl cursor-pointer">
              <span className="text-white text-2xl">✦</span>
            </motion.div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-bold">Creative</span>
          </motion.div>

          <motion.div
            animate={{ y: [0, 20, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute right-10 md:right-20 top-[40%] -translate-y-1/2 z-20 hidden lg:flex flex-col items-center gap-3"
          >
            <motion.div whileHover={{ scale: 1.3, rotate: -180 }} className="w-16 h-16 border border-white/20 rounded-full flex items-center justify-center bg-white/5 shadow-xl cursor-pointer">
              <span className="text-white text-2xl">⚡</span>
            </motion.div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-bold">Technologist</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 150, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.8, duration: 1.5, type: "spring", bounce: 0.2 }}
            className="w-full max-w-3xl md:max-w-4xl mt-[-5vh] relative z-10 mx-auto flex justify-center items-end flex-grow"
          >
            <div className="absolute inset-x-0 bottom-0 h-[40vh] bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent z-20 pointer-events-none" />
            <motion.img
              whileHover={{ scale: 1.05, y: -20, filter: "brightness(1.2)" }} transition={{ duration: 0.8, type: "spring" }}
              src={pData.photo} alt="Profile"
              className="w-full h-auto max-h-[75vh] object-contain object-bottom relative z-10 grayscale-[30%] hover:grayscale-0 shadow-2xl"
              onError={(e) => e.currentTarget.style.display = 'none'}
            />
          </motion.div>

          {/* Isolate the Highlight Widget to prevent full page re-renders */}
          <ProjectHighlightWidget projects={data.projects} setSelectedProject={setSelectedProject} />

        </section>

        {/* 2. EXPERIENCE SECTION */}
        <section id="experience" className="min-h-screen py-20 md:py-32 px-4 md:px-10 relative overflow-hidden flex flex-col justify-center bg-[#070707] border-y border-white/5">
          <AmbientParticles />
          <div className="max-w-7xl mx-auto w-full relative z-10">

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }} variants={cinematicReveal} className="mb-20 md:mb-32 text-center">
              <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-white mb-6">{t[lang].expTitle}</h2>
              <motion.div initial={{ width: 0 }} whileInView={{ width: 64 }} transition={{ duration: 1, delay: 0.5 }} className="h-1.5 bg-white mx-auto shadow-[0_0_15px_white]" />
            </motion.div>

            <div className="relative w-full">
              <motion.div initial={{ height: 0 }} whileInView={{ height: "100%" }} transition={{ duration: 2, ease: "easeInOut" }} className="hidden md:block absolute left-1/2 top-4 w-px bg-gradient-to-b from-white via-white/20 to-transparent -translate-x-1/2" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-16 w-full">
                {expData.map((exp: any, i: number) => {
                  const isLeft = i % 2 === 0;
                  return (
                    <motion.div
                      key={i}
                      initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }}
                      variants={{
                        hidden: { opacity: 0, y: 80 },
                        visible: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.3, duration: 1.2, delay: (i % 2) * 0.2 } }
                      } as any}
                      className={`relative flex w-full group ${isLeft ? "md:col-start-1 md:justify-end md:pr-20" : "md:col-start-2 md:justify-start md:pl-20 mt-10 md:mt-32"}`}
                    >
                      <motion.div whileHover={{ scale: 2 }} className={`hidden md:flex absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#070707] border-[3px] border-white/50 group-hover:border-white transition-all duration-500 z-20 shadow-lg ${isLeft ? "right-[-10px]" : "left-[-10px]"}`} />

                      <motion.div whileHover={{ scale: 1.05, y: -15, rotate: isLeft ? -2 : 2 }} transition={{ type: "spring", bounce: 0.4 }} className={`max-w-xl w-full bg-[#111] hover:bg-[#1a1a1a] p-10 rounded-[2.5rem] border border-white/10 hover:border-white/50 transition-colors duration-500 shadow-xl ${isLeft ? "md:text-right" : "md:text-left"}`}>
                        <span className="text-sm font-mono font-bold text-gray-500 mb-4 block tracking-[0.2em]">{exp.year}</span>
                        <h3 className="text-3xl font-black text-white mb-3 tracking-tight">{exp.role}</h3>
                        <p className="text-lg font-bold text-gray-400 mb-6 uppercase tracking-wider">{exp.company}</p>
                        <p className="text-base text-gray-500 leading-relaxed font-light">{exp.description}</p>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* 3. EDUCATION SECTION */}
        <section id="education" className="min-h-screen py-20 md:py-32 px-6 relative overflow-hidden flex flex-col justify-center bg-[#0a0a0a]">
          <AmbientGeometry />
          <div className="max-w-7xl mx-auto w-full relative z-10">

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }} variants={cinematicReveal} className="mb-20 md:mb-32 text-center">
              <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-white mb-6">{t[lang].eduTitle}</h2>
              <motion.div initial={{ width: 0 }} whileInView={{ width: 64 }} transition={{ duration: 1, delay: 0.5 }} className="h-1.5 bg-white mx-auto shadow-[0_0_15px_white]" />
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 md:gap-16">
              {eduData.map((edu: any, i: number) => (
                <motion.div
                  key={i}
                  initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }}
                  variants={{
                    hidden: { opacity: 0, y: 80 },
                    visible: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.3, duration: 1.2, delay: i * 0.2 } }
                  } as any}
                  whileHover={{ scale: 1.05, rotateX: 10, rotateY: -10, y: -20 }} transition={{ type: "spring", bounce: 0.4 }}
                  className="group bg-gradient-to-br from-[#111] to-[#050505] p-12 md:p-16 rounded-[3rem] border border-white/10 hover:border-white/50 transition-colors duration-700 flex flex-col h-full relative overflow-hidden shadow-xl"
                >
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-[0.05] transition-opacity duration-700" />
                  <motion.div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-40 group-hover:scale-150 group-hover:-rotate-12 transition-all duration-1000 pointer-events-none z-0">
                    {edu.logo && <img src={edu.logo} loading="lazy" decoding="async" className="w-48 h-48 object-contain grayscale" onError={(e) => e.currentTarget.style.display = 'none'} />}
                  </motion.div>
                  <div className="relative z-10">
                    <span className="text-sm font-mono font-bold text-gray-400 mb-6 block tracking-widest">{edu.year}</span>
                    <h3 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight tracking-tighter">{edu.degree}</h3>
                    <p className="text-xl text-gray-500 font-bold uppercase tracking-wider">{edu.institution}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. SKILLS SECTION */}
        <section id="skills" className="min-h-screen py-20 md:py-32 relative overflow-hidden flex flex-col justify-center border-y border-white/5 bg-[#070707]">
          <AmbientParticles />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }} variants={cinematicReveal} className="mb-16 md:mb-24 text-center relative z-10">
            <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-white mb-6">{t[lang].skillTitle}</h2>
            <motion.div initial={{ width: 0 }} whileInView={{ width: 64 }} transition={{ duration: 1, delay: 0.5 }} className="h-1.5 bg-white mx-auto shadow-[0_0_15px_white]" />
          </motion.div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1.5 }} viewport={{ once: true, amount: 0.05 }} className="w-full flex animate-marquee gap-8 items-center mb-10 hover:!animation-play-state-paused py-4">
            {[...skillData, ...skillData].map((skill: any, i: number) => (
              <div key={i} className="w-64 h-72 shrink-0 border border-white/10 hover:border-white/50 rounded-[2.5rem] bg-[#0a0a0a] hover:bg-[#1a1a1a] flex flex-col items-center justify-center p-8 group transition-all duration-500 relative overflow-hidden cursor-default shadow-lg hover:scale-110 hover:-translate-y-5 hover:rotate-2">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-20 h-20 mb-6 z-10">
                  <img src={skill.logo} alt={skill.name} loading="lazy" decoding="async" className="w-full h-full object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700" onError={(e) => e.currentTarget.style.display = 'none'} />
                </div>
                <h3 className="text-xl font-black mb-2 text-white transition-colors z-10 tracking-tight">{skill.name}</h3>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 group-hover:text-gray-300 transition-colors z-10">{skill.category}</p>
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1.5 }} viewport={{ once: true, amount: 0.05 }} className="w-full flex animate-marquee gap-8 items-center flex-row-reverse hover:!animation-play-state-paused py-4" style={{ animationDirection: 'reverse' }}>
            {[...skillData].reverse().concat([...skillData].reverse()).map((skill: any, i: number) => (
              <div key={i} className="w-64 h-72 shrink-0 border border-white/10 hover:border-white/50 rounded-[2.5rem] bg-[#0a0a0a] hover:bg-[#1a1a1a] flex flex-col items-center justify-center p-8 group transition-all duration-500 relative overflow-hidden cursor-default shadow-lg hover:scale-110 hover:-translate-y-5 hover:-rotate-2">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-20 h-20 mb-6 z-10">
                  <img src={skill.logo} alt={skill.name} loading="lazy" decoding="async" className="w-full h-full object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-125 group-hover:-rotate-12 transition-all duration-700" onError={(e) => e.currentTarget.style.display = 'none'} />
                </div>
                <h3 className="text-xl font-black mb-2 text-white transition-colors z-10 tracking-tight">{skill.name}</h3>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 group-hover:text-gray-300 transition-colors z-10">{skill.category}</p>
              </div>
            ))}
          </motion.div>
        </section>

        {/* 5. PORTFOLIO SECTION */}
        <section id="portofolio" className="min-h-screen py-20 md:py-32 px-6 md:px-10 relative overflow-hidden bg-[#050505]">
          <AmbientParticles />
          <div className="max-w-[1600px] mx-auto w-full relative z-10">

            <div className="flex flex-col xl:flex-row justify-between items-end mb-16 md:mb-24 gap-10">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }} variants={cinematicReveal}>
                <h2 className="text-4xl md:text-8xl font-black uppercase tracking-tighter text-white mb-6 drop-shadow-2xl">{t[lang].portTitle}</h2>
                <motion.div initial={{ width: 0 }} whileInView={{ width: 80 }} transition={{ duration: 1, delay: 0.5 }} className="h-1.5 bg-white shadow-[0_0_15px_white]" />
              </motion.div>

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }} variants={cinematicReveal} className="flex flex-wrap gap-4">
                {data.categories.map((cat: string) => (
                  <motion.button whileHover={{ scale: 1.1, y: -5 }} whileTap={{ scale: 0.9 }} key={cat} onClick={() => setActiveTab(cat)} className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 ${activeTab === cat ? "bg-white text-black shadow-lg" : "bg-transparent text-gray-500 hover:text-white border border-white/20 hover:border-white/50"}`}>
                    {cat}
                  </motion.button>
                ))}
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
              <AnimatePresence>
                {filteredProjects.map((project: any, i: number) => (
                  <motion.div
                    key={project.id}
                    layout="position"
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    viewport={{ once: true, margin: "200px" }}
                    transition={{ type: "tween", ease: "easeOut", duration: 0.7, delay: (i % 3) * 0.1 }}
                    whileHover={{ scale: 1.05, y: -10, rotate: 1 }}
                    onClick={() => setSelectedProject(project)}
                    className="relative group overflow-hidden cursor-pointer bg-black border border-white/10 break-inside-avoid rounded-[2.5rem] hover:border-white/50 transition-colors shadow-lg"
                  >
                    <div className="w-full relative overflow-hidden aspect-[4/5] sm:aspect-auto bg-[#111]">
                      <img
                        src={project.thumbnail} loading="lazy" decoding="async"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:-rotate-2 opacity-90 group-hover:opacity-100"
                        onError={(e) => e.currentTarget.style.display = 'none'}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-50 transition-opacity duration-700 pointer-events-none" />
                    </div>

                    <div className="absolute bottom-0 left-0 w-full p-8 md:p-10 translate-y-8 group-hover:translate-y-0 transition-transform duration-700 ease-out pointer-events-none flex flex-col justify-end bg-gradient-to-t from-black via-black/80 to-transparent">
                      <span className="text-xs font-black text-white/50 uppercase tracking-[0.2em] mb-4 block drop-shadow-md group-hover:text-white transition-colors">{project.category}</span>
                      <h3 className="text-xl md:text-2xl font-black text-white leading-tight mb-5 drop-shadow-xl">{project.title}</h3>
                      <div className="flex items-center gap-3 text-sm font-black text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 uppercase tracking-widest bg-white/10 w-fit px-6 py-2 rounded-full border border-white/20">
                        {t[lang].viewProject} <ArrowUpRight size={18} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* 6. CERTIFICATIONS LIST SECTION */}
        <section id="more" className="min-h-screen py-20 md:py-32 px-6 relative flex flex-col justify-center items-center overflow-hidden bg-[#0a0a0a] border-t border-white/5">
          <AmbientParticles />
          <div className="w-full max-w-6xl relative z-10">

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }} variants={cinematicReveal} className="mb-20 md:mb-32 text-center">
              <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-white mb-6">{t[lang].moreTitle}</h2>
              <motion.div initial={{ width: 0 }} whileInView={{ width: 64 }} transition={{ duration: 1, delay: 0.5 }} className="h-1.5 bg-white mx-auto shadow-[0_0_15px_white]" />
            </motion.div>

            <div className="flex flex-col border-t border-white/10">
              {moreData.map((item: any, i: number) => (
                <motion.div
                  key={i}
                  initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }}
                  variants={{
                    hidden: { opacity: 0, y: 50 },
                    visible: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.3, duration: 1, delay: i * 0.1 } }
                  } as any}
                  whileHover={{ scale: 1.02, x: 20, backgroundColor: "rgba(255,255,255,0.05)" }} transition={{ type: "spring", bounce: 0.6 }}
                  className="group border-b border-white/10 py-10 flex flex-col md:flex-row md:items-start justify-between gap-6 transition-colors duration-500 cursor-default rounded-lg relative overflow-hidden px-6"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/[0.05] to-transparent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 z-0" />

                  <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8 w-full md:w-3/4 relative z-10">
                    <span className="text-white/40 font-mono font-bold text-lg shrink-0 tracking-widest pt-1 group-hover:text-white transition-colors">{item.year}</span>
                    <h3 className="text-xl md:text-2xl font-black text-gray-300 group-hover:text-white transition-colors tracking-tighter leading-snug">{item.title}</h3>
                  </div>
                  <p className="text-xs md:text-sm text-gray-500 font-bold shrink-0 md:w-1/4 text-left md:text-right uppercase tracking-widest pt-2 md:pt-1 leading-relaxed relative z-10 group-hover:text-gray-300 transition-colors">{item.issuer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. MASSIVE FOOTER / CONTACT SECTION */}
        <section id="contacts" className="min-h-screen pt-24 md:pt-32 pb-16 px-6 border-t border-white/10 overflow-hidden relative flex flex-col justify-center items-center bg-[#050505]">
          <AmbientGeometry />
          <div className="w-full flex flex-col items-center relative z-10">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }} variants={cinematicReveal} className="text-[18vw] font-black uppercase leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white/80 to-[#111] hover:to-white transition-colors duration-1000 cursor-default mb-16 md:mb-20 text-center w-full">
              {t[lang].contactTitle}
            </motion.h2>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }} variants={cinematicReveal} whileHover={{ scale: 1.1, y: -10, rotate: 2 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 text-white text-sm md:text-lg font-black mb-24 md:mb-32 uppercase tracking-[0.2em] border border-white/20 px-8 py-4 md:px-10 md:py-5 rounded-full bg-white/5 backdrop-blur-md shadow-2xl text-center">
              <MapPin size={20} className="text-white animate-bounce shrink-0" /> {t[lang].based} Bogor, Indonesia
            </motion.div>

            <div className="flex flex-wrap justify-center gap-8 md:gap-12">
              {contactsData.map((item: any, i: number) => (
                <motion.a
                  initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }}
                  variants={{
                    hidden: { opacity: 0, y: 50 },
                    visible: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.4, duration: 1, delay: i * 0.1 } }
                  } as any}
                  key={i} href={item.url} target="_blank" rel="noopener noreferrer"
                  whileHover={{ y: -25, scale: 1.2, rotate: i % 2 === 0 ? 5 : -5 }}
                  className="group flex flex-col items-center gap-5"
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-[2px] border-white/20 flex items-center justify-center text-gray-400 group-hover:text-black group-hover:bg-white group-hover:border-white transition-all duration-500 shadow-xl bg-[#0a0a0a]">
                    {item.isLocal ? (
                      <img src={item.imgSrc} alt={item.label} loading="lazy" decoding="async" className="w-8 h-8 md:w-10 md:h-10 object-contain filter invert-0 group-hover:invert transition-all duration-300" onError={(e) => e.currentTarget.style.display = 'none'} />
                    ) : (
                      item.icon && <item.icon className="w-8 h-8 md:w-10 md:h-10" />
                    )}
                  </div>
                  <span className="text-[11px] md:text-xs font-black uppercase tracking-[0.2em] text-gray-500 group-hover:text-white transition-colors">{item.label}</span>
                </motion.a>
              ))}
            </div>

            <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={cinematicReveal} className="text-gray-600 text-xs md:text-sm mt-48 uppercase tracking-[0.3em] text-center font-bold">
              © {new Date().getFullYear()} Ganabitz. All Rights Reserved.
            </motion.p>
          </div>
        </section>
      </main>

      {/* PROJECT MODAL POPUP */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-3xl overflow-y-auto overflow-x-hidden">
            <div className="max-w-7xl mx-auto w-full relative min-h-screen flex flex-col pt-10">
              <div className="sticky top-6 w-full px-6 flex justify-end z-[210]">
                <motion.button whileHover={{ scale: 1.2, rotate: 180 }} onClick={() => setSelectedProject(null)} className="w-16 h-16 rounded-full flex items-center justify-center text-white border-2 border-white/20 hover:bg-white hover:text-black transition-all duration-500 shadow-2xl">
                  <X size={28} />
                </motion.button>
              </div>

              <motion.div initial={{ y: 80, opacity: 0, scale: 0.9 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ delay: 0.2, type: "spring", bounce: 0.3, duration: 1 }} className="px-6 md:px-12 pb-32 flex-grow mt-10">
                <div className="max-w-5xl">
                  <span className="text-white/50 font-black uppercase tracking-[0.3em] text-sm mb-6 block">{selectedProject.category}</span>
                  <h2 className="text-5xl md:text-7xl lg:text-[7rem] font-black text-white mb-16 leading-none uppercase tracking-tighter drop-shadow-2xl">{selectedProject.title}</h2>
                </div>

                <div className="mb-24 w-full overflow-hidden bg-[#050505] rounded-[3rem] border border-white/10 shadow-2xl">
                  {renderProjectContent(selectedProject)}
                </div>

                <div className="grid md:grid-cols-3 gap-20 border-t border-white/10 pt-24">
                  <div className="md:col-span-2">
                    <h3 className="text-base font-black mb-10 text-white/50 uppercase tracking-[0.2em]">{t[lang].desc}</h3>
                    <p className="text-xl md:text-3xl text-gray-300 leading-relaxed font-light">{selectedProject.description}</p>
                  </div>
                  <div>
                    <h3 className="text-base font-black mb-10 text-white/50 uppercase tracking-[0.2em]">{t[lang].tools}</h3>
                    <div className="flex flex-col gap-5">
                      {selectedProject.tools?.map((tool: string, i: number) => (
                        <span key={i} className="text-lg font-bold text-white border-b border-white/10 pb-4">{tool}</span>
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