import { ReactNode, useState, useRef } from "react";
import { format } from "date-fns";
import { LogIn, LogOut } from "lucide-react";
import { cn } from "../lib/utils";
import { useAuth } from "../hooks/useAuth";

type LayoutProps = {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (t: string) => void;
};

export default function Layout({ children, activeTab, setActiveTab }: LayoutProps) {
  const { user, loading, signInWithGoogle, logout } = useAuth();
  const [isNavHidden, setIsNavHidden] = useState(false);
  const lastScrollY = useRef(0);
  
  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const currentScrollY = e.currentTarget.scrollTop;
    if (currentScrollY > lastScrollY.current && currentScrollY > 60) {
      if (!isNavHidden) setIsNavHidden(true);
    } else if (currentScrollY < lastScrollY.current || currentScrollY <= 60) {
      if (isNavHidden) setIsNavHidden(false);
    }
    lastScrollY.current = currentScrollY;
  };

  const tabs = [
    { id: "today", label: "Hôm Nay" },
    { id: "schedule", label: "Lịch Tập" },
    { id: "progress", label: "Tiến Độ" },
    { id: "nutrition", label: "Dinh Dưỡng" },
    { id: "exercises", label: "Từ Điển" },
    { id: "profile", label: "Hồ Sơ" },
  ];

  return (
    <div className="flex h-[100dvh] w-full bg-zinc-950 text-zinc-100 font-sans flex-col overflow-hidden selection:bg-lime-400/30">
      {/* Header Section */}
      <header className="h-16 md:h-20 border-b border-zinc-800 flex items-center justify-between px-4 md:px-8 bg-black shrink-0 relative z-20">
        <div className="flex items-center justify-between w-full lg:w-auto shrink-0 mr-4 md:mr-8 lg:mr-0 z-10">
          <div className="flex items-center gap-3 md:gap-4 shrink-0">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-lime-400 rounded-full flex items-center justify-center shrink-0">
              <div className="w-4 h-4 md:w-5 md:h-5 bg-black rotate-45"></div>
            </div>
            <h1 className="text-xl md:text-3xl font-black tracking-tighter uppercase italic block shrink-0">GYM TRACKER</h1>
          </div>
          
          {/* Mobile Auth */}
          <div className="lg:hidden flex items-center gap-3">
            {!loading && user ? (
              <div className="flex items-center gap-3">
                {user.photoURL && <img src={user.photoURL} alt="Avatar" className="w-8 h-8 rounded-full border border-zinc-800" />}
                <button onClick={logout} className="p-2 border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-lime-400 transition-colors" title="Đăng xuất">
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={signInWithGoogle}
                className="flex items-center gap-2 px-2.5 py-1.5 bg-lime-400 text-black font-bold uppercase tracking-widest text-[9px] skew-x-[-12deg]"
              >
                 <div className="skew-x-[12deg] flex items-center gap-1.5"><LogIn className="w-3 h-3"/> Đăng nhập</div>
              </button>
            )}
          </div>
        </div>
        
        <nav className="hidden lg:flex flex-1 gap-5 md:gap-8 font-bold text-[11px] md:text-sm tracking-widest uppercase overflow-x-auto no-scrollbar items-center h-full py-4 lg:justify-center">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "uppercase tracking-widest transition-colors whitespace-nowrap shrink-0",
                  isActive 
                    ? "text-lime-400 underline underline-offset-8" 
                    : "text-zinc-500 hover:text-lime-400"
                )}
              >
                {tab.label}
              </button>
            )
          })}
        </nav>

        <div className="text-right hidden lg:flex items-center justify-end gap-4 shrink-0 ml-4 lg:ml-0 lg:w-48 relative z-10">
          <div className="hidden md:block border-r border-zinc-800 pr-4">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Hôm Nay</p>
            <p className="font-mono font-bold text-sm">{format(new Date(), "dd/MM/yyyy")}</p>
          </div>
          <div className="flex items-center gap-3">
            {!loading && user ? (
              <div className="flex items-center gap-3">
                {user.photoURL && <img src={user.photoURL} alt="Avatar" className="w-8 h-8 rounded-full border border-zinc-800" />}
                <button 
                  onClick={logout}
                  className="p-2 border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-lime-400 hover:border-lime-400 transition-colors"
                  title="Đăng xuất"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={signInWithGoogle}
                className="flex items-center gap-2 px-3 py-2 bg-lime-400 text-black font-bold uppercase tracking-widest text-[10px] skew-x-[-12deg] hover:bg-lime-300 transition-colors"
              >
                 <div className="skew-x-[12deg] flex items-center gap-2"><LogIn className="w-3 h-3"/> Đăng nhập</div>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile/Tablet Nav Grid */}
      <div 
        className={cn(
          "lg:hidden shrink-0 transition-all duration-300 ease-in-out border-zinc-800 bg-zinc-950 px-2",
          isNavHidden ? "max-h-0 overflow-hidden py-0 border-b-0 opacity-0 pointer-events-none" : "max-h-32 border-b py-2 opacity-100"
        )}
      >
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "p-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-center border transition-all",
                  isActive 
                    ? "bg-lime-400 border-lime-400 text-black shadow-[0_0_15px_rgba(163,230,53,0.3)]" 
                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                )}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <main onScroll={handleScroll} className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
        {children}
      </main>
    </div>
  );
}
