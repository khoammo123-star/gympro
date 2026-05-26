import { useState } from "react";
import { Search, X, Play } from "lucide-react";
import { predefinedExercises } from "../data/exercises";
import { MuscleGroup, Exercise } from "../types";
import { cn } from "../lib/utils";

const MUSCLES: (MuscleGroup | 'Tất cả')[] = ['Tất cả', 'Ngực', 'Lưng', 'Chân', 'Vai', 'Tay', 'Bụng', 'Cardio'];

export default function ExercisesView() {
  const [filterMode, setFilterMode] = useState<MuscleGroup | 'Tất cả'>('Tất cả');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const [selectedExerciseName, setSelectedExerciseName] = useState<string>("");

  const filtered = predefinedExercises.filter(e => {
    if (filterMode !== 'Tất cả' && e.targetMuscle !== filterMode) return false;
    if (searchQuery.trim()) {
      return e.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const openVideo = (ex: Exercise) => {
    if (ex.youtubeId) {
      setSelectedVideoUrl(`https://www.youtube.com/embed/${ex.youtubeId}?autoplay=1`);
      setSelectedExerciseName(ex.name);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 w-full flex-1 relative">
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
            <div 
              key={ex.id} 
              className={cn(
                "bg-black border border-zinc-800 overflow-hidden group hover:border-lime-400 transition-colors flex flex-col h-full relative cursor-default",
                ex.youtubeId ? "cursor-pointer" : ""
              )}
              onClick={() => openVideo(ex)}
            >
              <div className="absolute top-0 left-0 w-1 h-0 bg-lime-400 transition-all duration-300 group-hover:h-full z-10"></div>
              
              <div className="p-6 flex-1 flex flex-col justify-between relative z-10">
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
                
                <div className="mt-6 border-t border-zinc-800 pt-4 flex flex-col gap-3">
                  {ex.secondaryMuscles && ex.secondaryMuscles.length > 0 && (
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                      <span className="text-zinc-700 mr-2">BỔ TRỢ:</span> {ex.secondaryMuscles.join(', ')}
                    </p>
                  )}
                  {ex.youtubeId && (
                    <div className="flex items-center gap-2 text-lime-400 text-[10px] font-black uppercase tracking-widest">
                      <Play className="w-3 h-3" /> Xem hướng dẫn
                    </div>
                  )}
                </div>
              </div>
              
              {/* Optional background overlay effect if video exists */}
              {ex.youtubeId && (
                <div className="absolute inset-0 bg-lime-400/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Video Modal */}
      {selectedVideoUrl && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="w-full max-w-4xl bg-zinc-950 border border-zinc-800 overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <h3 className="font-black italic uppercase tracking-tighter text-xl text-zinc-100">
                {selectedExerciseName}
              </h3>
              <button 
                onClick={() => setSelectedVideoUrl(null)}
                className="p-2 hover:bg-zinc-900 group transition-colors"
                title="Đóng video"
              >
                <X className="w-6 h-6 text-zinc-500 group-hover:text-lime-400" />
              </button>
            </div>
            <div className="relative w-full aspect-video bg-black">
              <iframe
                src={selectedVideoUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
