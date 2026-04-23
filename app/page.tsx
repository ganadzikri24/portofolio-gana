"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { Mail, Download, ExternalLink, X, ChevronRight } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import data from "@/data/portfolio.json";

export default function Portfolio() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState("All");
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  const categories = ["All", ...Array.from(new Set(data.projects.map((p) => p.category)))];
  const filteredProjects = activeTab === "All" ? data.projects : data.projects.filter((p) => p.category === activeTab);

  return (
    <div className="relative min-h-screen bg-[#050505] text-gray-200 selection:bg-primary selection:text-white">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary origin-left z-50"
        style={{ scaleX }}
      />

      <motion.div
        className="fixed top-0 left-0 w-6 h-6 rounded-full border border-white/30 pointer-events-none z-[100] mix-blend-difference"
        animate={{
          x: mousePosition.x - 12,
          y: mousePosition.y - 12,
        }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      />

      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-accent/10 rounded-full blur-[150px]" />
      </div>

      <nav className="fixed top-0 w-full z-40 bg-black/40 backdrop-blur-md border-b border-white/5 px-6 py-5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="text-2xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
            M.G.D
          </span>
          <div className="hidden md:flex gap-8">
            {["About", "Experience", "Works", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-40 pb-32 space-y-40">
        <section id="about" className="min-h-[60vh] flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium tracking-wide uppercase">Available for work</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight leading-tight text-white">
              Creative <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Technologist</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl leading-relaxed">
              {data.profile.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#works"
                className="px-8 py-4 bg-white text-black rounded-full font-semibold hover:scale-105 transition-transform duration-300 flex items-center gap-2"
              >
                View Projects <ChevronRight size={18} />
              </a>
              <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-full font-semibold hover:bg-white/10 transition-all duration-300 flex items-center gap-2">
                <Download size={18} />
                Download CV
              </button>
            </div>
          </motion.div>
        </section>

        <section id="experience" className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-4xl font-bold mb-12 text-white">Experience & Education</h2>
            <div className="space-y-8">
              {data.experience.map((exp, idx) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors"
                >
                  <span className="text-primary text-sm font-bold tracking-wider uppercase mb-2 block">{exp.year}</span>
                  <h3 className="text-2xl font-bold text-white mb-1">{exp.role}</h3>
                  <p className="text-gray-400 mb-4">{exp.company}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{exp.description}</p>
                </motion.div>
              ))}
              {data.education.map((edu, idx) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-8 rounded-3xl bg-transparent border border-white/10"
                >
                  <span className="text-accent text-sm font-bold tracking-wider uppercase mb-2 block">{edu.year}</span>
                  <h3 className="text-2xl font-bold text-white mb-1">{edu.degree}</h3>
                  <p className="text-gray-400">{edu.institution}</p>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="sticky top-32">
            <h2 className="text-4xl font-bold mb-12 text-white">Tech Arsenal</h2>
            <div className="flex flex-wrap gap-3">
              {data.skills.map((skill, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:-translate-y-1 transition-all"
                >
                  <span className="text-sm text-gray-300 font-medium">{skill.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="works">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <h2 className="text-4xl md:text-5xl font-bold text-white">Selected Works</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    activeTab === cat ? "bg-white text-black" : "bg-white/5 text-gray-400 hover:text-white border border-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSelectedProject(project)}
                  className="group cursor-pointer rounded-3xl bg-white/5 border border-white/10 overflow-hidden hover:border-white/30 transition-colors"
                >
                  <div className="aspect-video bg-[#111] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent z-10 opacity-80" />
                    <div className="absolute bottom-6 left-6 z-20">
                      <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-medium text-white mb-3 inline-block">
                        {project.category}
                      </span>
                      <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>

        <section id="contact" className="py-20">
          <div className="p-12 md:p-20 rounded-[3rem] bg-gradient-to-br from-white/10 to-transparent border border-white/10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.2),transparent_50%)] pointer-events-none" />
            <h2 className="text-5xl md:text-7xl font-bold mb-8 text-white relative z-10">Let's collaborate.</h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto relative z-10">
              Open for freelance opportunities, networking topology design, and creative motion projects.
            </p>
            <div className="flex justify-center gap-6 relative z-10">
              {[
                { Icon: Mail, href: "mailto:your@email.com" },
                { Icon: FaGithub, href: "#" },
                { Icon: FaLinkedin, href: "#" }
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 hover:scale-110"
                >
                  <item.Icon size={24} />
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10 bg-black/90 backdrop-blur-xl"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#0a0a0a] border border-white/10 max-w-5xl w-full max-h-[90vh] overflow-y-auto rounded-3xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white text-white hover:text-black transition-all z-50"
              >
                <X size={24} />
              </button>
              <div className="aspect-[21/9] bg-[#111] w-full" />
              <div className="p-10 md:p-16">
                <div className="flex items-center gap-4 mb-6">
                  <span className="px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-bold tracking-wider uppercase">
                    {selectedProject.category}
                  </span>
                </div>
                <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white">{selectedProject.title}</h2>
                <p className="text-gray-400 text-xl leading-relaxed mb-12 max-w-3xl">{selectedProject.description}</p>
                
                <div className="pt-8 border-t border-white/10">
                  <h4 className="text-sm text-gray-500 uppercase tracking-widest font-bold mb-6">Technologies & Core Tools</h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedProject.tools.map((tool: string, idx: number) => (
                      <span key={idx} className="px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-gray-200">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}