import { useState } from "react";
import { Search } from "lucide-react";
import { predefinedExercises } from "../data/exercises";
import { MuscleGroup } from "../types";
import { cn } from "../lib/utils";

const MUSCLES: (MuscleGroup | 'Tất cả')[] = ['Tất cả', 'Ngực', 'Lưng', 'Chân', 'Vai', 'Tay', 'Bụng', 'Cardio'];

export default function ExercisesView() {
  const [filterMode, setFilterMode] = useState<MuscleGroup | 'Tất cả'>('Tất cả');
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = predefinedExercises.filter(e => {
    if (filterMode !== 'Tất cả' && e.targetMuscle !== filterMode) return false;
    if (searchQuery.trim()) {
      return e.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 w-full flex-1">
      <header className="space-y-4 border-b border-zinc-800 pb-8">
        <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-zinc-100 flex items-end gap-3 leading-none">Từ điển bài tập</h2>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Khám phá các bài tập, phân loại theo nhóm cơ và thiết bị.</p>
        
        <div className="flex flex-col md:flex-row gap-4 pt-4">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-lime-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="TÌM KIẾM BÀI TẬP..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-black border border-zinc-700 pl-12 pr-4 py-4 text-zinc-100 font-bold uppercase tracking-wider focus:outline-none focus:border-lime-400 transition-colors placeholder:text-zinc-700"
            />
          </div>
          <div className="flex bg-zinc-900 border border-zinc-800 overflow-x-auto custom-scrollbar p-1">
            {MUSCLES.map(m => (
              <button
                key={m}
                onClick={() => setFilterMode(m)}
                className={cn(
                  "px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap",
                  filterMode === m 
                    ? "bg-lime-400 text-black shadow-sm" 
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
                )}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full py-20 text-center flex flex-col items-center justify-center border border-dashed border-zinc-800 bg-zinc-900/50 text-zinc-600">
            <Search className="w-12 h-12 mb-4 opacity-50" />
            <p className="font-bold uppercase tracking-widest text-sm">Không tìm thấy bài tập nào</p>
          </div>
        ) : (
          filtered.map(ex => (
            <div key={ex.id} className="bg-black border border-zinc-800 overflow-hidden group hover:border-lime-400 transition-colors flex flex-col h-full relative cursor-default">
              <div className="absolute top-0 left-0 w-1 h-0 bg-lime-400 transition-all duration-300 group-hover:h-full"></div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <span className="px-3 py-1 bg-lime-400/10 text-lime-400 border border-lime-400/30 text-[10px] font-black uppercase tracking-widest">
                      {ex.targetMuscle}
                    </span>
                    {ex.equipment && (
                       <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1 border border-zinc-800 px-2 py-1">
                         {ex.equipment}
                       </span>
                    )}
                  </div>
                  <h3 className="text-xl font-black italic uppercase tracking-tighter text-zinc-100 leading-tight group-hover:text-lime-400 transition-colors">{ex.name}</h3>
                </div>
                
                {ex.secondaryMuscles && ex.secondaryMuscles.length > 0 && (
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 border-t border-zinc-800 pt-4 mt-6">
                    <span className="text-zinc-700 mr-2">BỔ TRỢ:</span> {ex.secondaryMuscles.join(', ')}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
