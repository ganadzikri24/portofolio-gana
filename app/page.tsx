"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { Mail, ExternalLink, X, Download } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import data from "@/data/portfolio.json";

export default function Portfolio() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
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
    <div className="relative min-h-screen bg-dark text-white font-sans selection:bg-accent selection:text-white">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent origin-left z-50"
        style={{ scaleX }}
      />

      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-primary pointer-events-none z-[100] mix-blend-difference"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isHovering ? 2 : 1,
          backgroundColor: isHovering ? "rgba(59, 130, 246, 0.5)" : "transparent",
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
      />

      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[linear-gradient(45deg,rgba(59,130,246,0.1),rgba(139,92,246,0.1),rgba(10,10,10,1))] animate-gradient-x" />
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 bg-primary/20 rounded-full blur-[128px]"
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-[128px]"
          animate={{ x: [0, -100, 0], y: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <nav className="fixed top-0 w-full z-40 glass border-b-0 border-white/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <span className="text-xl font-bold tracking-tighter text-glow">M.G.D.</span>
          <div className="hidden md:flex gap-6">
            {["About", "Education", "Experience", "Skills", "Portfolio", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm text-gray-300 hover:text-white transition-colors relative group"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-accent transition-all duration-300 group-hover:w-full glow" />
              </a>
            ))}
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-24 space-y-40">
        <section id="about" className="min-h-[70vh] flex flex-col justify-center items-start">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h2 className="text-primary font-medium tracking-wider mb-4">HELLO, I AM</h2>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
              {data.profile.name}
            </h1>
            <h3 className="text-2xl md:text-3xl text-gray-300 mb-8">{data.profile.title}</h3>
            <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-2xl">
              {data.profile.description}
            </p>
            <div className="flex gap-4">
              <a
                href="#contact"
                className="px-8 py-3 bg-white text-dark rounded-full font-medium hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                Get In Touch
              </a>
              <button
                className="px-8 py-3 glass rounded-full flex items-center gap-2 hover:bg-white/10 transition-all hover:scale-105"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <Download size={18} />
                Download CV
              </button>
            </div>
          </motion.div>
        </section>

        <section id="education">
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-12 flex items-center gap-4"
          >
            <span className="w-12 h-[2px] bg-primary"></span> Education
          </motion.h2>
          <div className="grid gap-6">
            {data.education.map((edu, idx) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="glass p-8 rounded-2xl hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(59,130,246,0.2)] transition-all duration-300 group"
              >
                <h3 className="text-2xl font-semibold group-hover:text-primary transition-colors">{edu.degree}</h3>
                <p className="text-xl text-gray-300 mt-2">{edu.institution}</p>
                <p className="text-sm text-gray-500 mt-4">{edu.year}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="experience">
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-12 flex items-center gap-4"
          >
            <span className="w-12 h-[2px] bg-accent"></span> Experience
          </motion.h2>
          <div className="space-y-8 border-l-2 border-white/10 pl-8 ml-4 relative">
            {data.experience.map((exp, idx) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="relative"
              >
                <div className="absolute -left-[41px] top-2 w-5 h-5 rounded-full bg-dark border-2 border-accent" />
                <div className="glass p-8 rounded-2xl">
                  <h3 className="text-2xl font-semibold text-white">{exp.role}</h3>
                  <p className="text-accent mt-1">{exp.company} • {exp.year}</p>
                  <p className="text-gray-400 mt-4 leading-relaxed">{exp.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="skills">
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-12 flex items-center gap-4"
          >
            <span className="w-12 h-[2px] bg-primary"></span> Skills & Expertise
          </motion.h2>
          <div className="flex flex-wrap gap-4">
            {data.skills.map((skill, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="glass px-6 py-4 rounded-xl flex flex-col items-center justify-center cursor-pointer relative group"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <span className="text-white font-medium">{skill.name}</span>
                <span className="text-xs text-gray-500 mt-1">{skill.category}</span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity blur-md -z-10" />
              </motion.div>
            ))}
          </div>
        </section>

        <section id="portfolio">
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-12 flex items-center gap-4"
          >
            <span className="w-12 h-[2px] bg-accent"></span> Selected Works
          </motion.h2>
          
          <div className="flex flex-wrap gap-4 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-6 py-2 rounded-full transition-all ${
                  activeTab === cat ? "bg-white text-dark font-medium" : "glass text-gray-400 hover:text-white"
                }`}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                {cat}
              </button>
            ))}
          </div>

          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -10 }}
                  className="glass rounded-2xl overflow-hidden cursor-pointer group"
                  onClick={() => setSelectedProject(project)}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <div className="h-48 bg-gray-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />
                  </div>
                  <div className="p-6 relative z-20">
                    <span className="text-xs text-primary font-medium tracking-wider uppercase mb-2 block">
                      {project.category}
                    </span>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                      {project.title}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>

        <section id="contact" className="pb-32">
          <div className="glass p-12 rounded-3xl text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 animate-pulse" />
            <h2 className="text-4xl font-bold mb-6 relative z-10">Let's build something extraordinary</h2>
            <p className="text-gray-400 mb-10 max-w-2xl mx-auto relative z-10">
              Tertarik untuk berkolaborasi dalam proyek desain, jaringan, atau sistem IoT? Jangan ragu untuk menghubungi.
            </p>
            <div className="flex justify-center gap-6 relative z-10">
              {[Mail, FaGithub, FaLinkedin].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-14 h-14 rounded-full glass flex items-center justify-center hover:bg-white hover:text-dark transition-all hover:scale-110 hover:shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <Icon size={24} />
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
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-dark/80 backdrop-blur-xl"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-3xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors z-50"
              >
                <X size={20} />
              </button>
              <div className="h-64 md:h-96 bg-gray-800 w-full" />
              <div className="p-8 md:p-12">
                <span className="px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-medium mb-6 inline-block">
                  {selectedProject.category}
                </span>
                <h2 className="text-3xl md:text-5xl font-bold mb-6">{selectedProject.title}</h2>
                <p className="text-gray-300 text-lg leading-relaxed mb-8">{selectedProject.description}</p>
                
                <div>
                  <h4 className="text-sm text-gray-500 uppercase tracking-wider mb-4">Technologies & Tools</h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedProject.tools.map((tool: string, idx: number) => (
                      <span key={idx} className="px-4 py-2 border border-white/10 rounded-lg text-sm text-gray-300">
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