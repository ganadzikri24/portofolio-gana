"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  User, 
  GraduationCap, 
  Briefcase, 
  Code2, 
  FolderGit2, 
  Award,
  LogOut,
  Phone
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // Hide sidebar on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  };

  const navItems = [
    { name: "Projects", path: "/admin/projects", icon: <FolderGit2 size={20} /> },
    { name: "Profile", path: "/admin/profile", icon: <User size={20} /> },
    { name: "Education", path: "/admin/education", icon: <GraduationCap size={20} /> },
    { name: "Experience", path: "/admin/experience", icon: <Briefcase size={20} /> },
    { name: "Skills", path: "/admin/skills", icon: <Code2 size={20} /> },
    { name: "Certifications", path: "/admin/certifications", icon: <Award size={20} /> },
    { name: "Contacts", path: "/admin/contacts", icon: <Phone size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0a0a0a] border-r border-white/10 flex flex-col hidden md:flex">
        <div className="p-8 border-b border-white/10">
          <h1 className="text-2xl font-black tracking-tighter uppercase">Admin<span className="text-gray-500">Panel</span></h1>
        </div>
        
        <nav className="flex-1 py-6 px-4 flex flex-col gap-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive 
                    ? "bg-white text-black" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl font-medium text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <LogOut size={20} />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Mobile Header */}
        <header className="md:hidden bg-[#0a0a0a] border-b border-white/10 p-4 flex justify-between items-center sticky top-0 z-50">
           <h1 className="text-xl font-black tracking-tighter uppercase">Admin<span className="text-gray-500">Panel</span></h1>
           <button onClick={handleLogout} className="text-red-400 p-2"><LogOut size={20}/></button>
        </header>

        {/* Mobile Nav Scroller */}
        <div className="md:hidden bg-[#0a0a0a] border-b border-white/10 overflow-x-auto whitespace-nowrap sticky top-[69px] z-40 hide-scrollbar">
          <div className="flex p-2">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`inline-flex items-center gap-2 px-4 py-2 mx-1 rounded-lg text-sm font-medium transition-all ${
                    isActive 
                      ? "bg-white text-black" 
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="p-6 md:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
