import { ReactNode } from "react";
import { format } from "date-fns";
import { cn } from "../lib/utils";

type LayoutProps = {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (t: string) => void;
};

export default function Layout({ children, activeTab, setActiveTab }: LayoutProps) {
  const tabs = [
    { id: "today", label: "Hôm Nay" },
    { id: "schedule", label: "Lịch Tập" },
    { id: "progress", label: "Tiến Độ" },
    { id: "exercises", label: "Từ Điển" },
    { id: "profile", label: "Hồ Sơ" },
  ];

  return (
    <div className="flex h-[100dvh] w-full bg-zinc-950 text-zinc-100 font-sans flex-col overflow-hidden selection:bg-lime-400/30">
      {/* Header Section */}
      <header className="h-20 border-b border-zinc-800 flex items-center justify-between px-4 md:px-8 bg-black shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-lime-400 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 md:w-5 md:h-5 bg-black rotate-45"></div>
          </div>
          <h1 className="text-xl md:text-3xl font-black tracking-tighter uppercase italic hidden sm:block">GYM TRACKER</h1>
        </div>
        
        <nav className="flex gap-4 md:gap-8 font-bold text-xs md:text-sm tracking-widest uppercase overflow-x-auto custom-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "uppercase tracking-widest transition-colors whitespace-nowrap",
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

        <div className="text-right hidden md:block">
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Hôm Nay</p>
          <p className="font-mono font-bold text-sm">{format(new Date(), "dd/MM/yyyy")}</p>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative flex flex-col">
        {children}
      </main>
    </div>
  );
}
