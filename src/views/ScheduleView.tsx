import { useState } from "react";
import { Plus, X, ArrowRight, Save, Dumbbell, Zap } from "lucide-react";
import { cn } from "../lib/utils";
import { AppState, MuscleGroup, MuscleSynergy, WorkoutPlanItem } from "../types";
import { predefinedExercises } from "../data/exercises";

type Props = {
  state: AppState;
  saveWeeklyPlan: (d: number, m: MuscleGroup, s: MuscleGroup[], ex: WorkoutPlanItem['exercises']) => void;
  clearPlanDay: (d: number) => void;
};

const DAYS = ['CHỦ NHẬT', 'THỨ 2', 'THỨ 3', 'THỨ 4', 'THỨ 5', 'THỨ 6', 'THỨ 7'];
const SHORT_DAYS = ['CN', 'TH2', 'TH3', 'TH4', 'TH5', 'TH6', 'TH7'];
const MUSCLES: MuscleGroup[] = ['Ngực', 'Lưng', 'Chân', 'Vai', 'Tay', 'Bụng', 'Cardio'];

export default function ScheduleView({ state, saveWeeklyPlan, clearPlanDay }: Props) {
  const [editingDay, setEditingDay] = useState<number | null>(null);
  
  // Edit State
  const [primary, setPrimary] = useState<MuscleGroup | null>(null);
  const [secondary, setSecondary] = useState<MuscleGroup[]>([]);
  const [exercises, setExercises] = useState<{id:string, exerciseId: string; sets: number; reps: string}[]>([]);

  const handleEdit = (dayIndex: number) => {
    const existing = state.weeklyPlan.find(p => p.dayOfWeek === dayIndex);
    if (existing) {
      setPrimary(existing.primaryMuscle);
      setSecondary(existing.secondaryMuscles);
      setExercises(existing.exercises);
    } else {
      setPrimary(null);
      setSecondary([]);
      setExercises([]);
    }
    setEditingDay(dayIndex);
  };

  const handleSave = () => {
    if (editingDay !== null && primary) {
      saveWeeklyPlan(editingDay, primary, secondary, exercises);
      setEditingDay(null);
    }
  };

  const toggleSecondary = (m: MuscleGroup) => {
    setSecondary(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);
  };

  const addExercise = (exId: string) => {
    setExercises([...exercises, { id: Date.now().toString() + Math.random(), exerciseId: exId, sets: 3, reps: '8-12' }]);
  };

  const updateExercise = (id: string, sets: number, reps: string) => {
    setExercises(exercises.map(e => e.id === id ? { ...e, sets, reps } : e));
  };

  const removeExercise = (id: string) => {
    setExercises(exercises.filter(e => e.id !== id));
  };

  const getDayOverview = (dayIndex: number) => {
    return state.weeklyPlan.find(p => p.dayOfWeek === dayIndex);
  };

  const suggestedMuscles = primary ? MuscleSynergy[primary] : [];
  
  const relevantExercises = primary 
    ? predefinedExercises.filter(e => e.targetMuscle === primary || secondary.includes(e.targetMuscle))
    : predefinedExercises;

  // Render weekly overview blocks (7 blocks)
  const renderWeeklyBlocks = () => {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-7 gap-1">
        {DAYS.map((dayName, idx) => {
          const plan = getDayOverview(idx);
          const isToday = new Date().getDay() === idx;
          const isEditing = editingDay === idx;

          return (
            <div 
              key={idx}
              onClick={() => handleEdit(idx)}
              className={cn(
                "h-24 sm:h-20 flex flex-col items-center justify-center font-black transition-colors cursor-pointer border border-transparent",
                isEditing 
                  ? "border-lime-400 bg-lime-400/10 text-lime-400"
                  : (isToday ? "bg-lime-400 text-black delay-75" : (plan ? "bg-zinc-800 text-zinc-300" : "bg-zinc-900 text-zinc-600 hover:bg-zinc-800"))
              )}
            >
              <span className="text-[10px] sm:text-xs tracking-widest">{SHORT_DAYS[idx]}</span>
              <span className={cn("text-xl sm:text-2xl mt-1 uppercase italic tracking-tighter", isToday && !isEditing ? "text-black" : (plan ? "text-lime-400" : "text-zinc-700"))}>
                {plan ? plan.primaryMuscle.substring(0,2) : "OFF"}
              </span>
            </div>
          )
        })}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row lg:overflow-hidden animate-in fade-in duration-500 max-w-[1400px] mx-auto w-full">
      {/* Sidebar: Selection Area (only when editing) */}
      {editingDay !== null && (
        <section className="w-full lg:w-80 border-r border-zinc-800 p-6 flex flex-col gap-6 bg-zinc-900/50 shrink-0 lg:overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-start">
            <h2 className="text-4xl md:text-5xl font-black uppercase italic leading-none tracking-tighter text-zinc-100">Cập nhật<br/>{SHORT_DAYS[editingDay]}</h2>
            <button onClick={() => setEditingDay(null)} className="p-2 text-zinc-500 hover:text-zinc-100"><X className="w-6 h-6" /></button>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">1. Nhóm cơ chính</h3>
            <div className="grid grid-cols-2 gap-2">
              {MUSCLES.map(m => (
                <button
                  key={m}
                  onClick={() => {
                      setPrimary(m);
                      setSecondary([]);
                      setExercises([]);
                  }}
                  className={cn(
                    "p-3 font-bold text-xs uppercase text-center border transition-colors",
                    primary === m 
                      ? "bg-lime-400 text-black border-lime-400" 
                      : "bg-zinc-800 text-zinc-400 border-transparent hover:bg-zinc-700"
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {primary && (
            <div>
               <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">2. Nhóm cơ bổ trợ</h3>
               <div className="flex flex-wrap gap-2">
                  {MUSCLES.filter(m => m !== primary).map(m => {
                    const isSuggested = suggestedMuscles.includes(m);
                    const isSelected = secondary.includes(m);
                    return (
                      <button
                        key={m}
                        onClick={() => toggleSecondary(m)}
                        className={cn(
                          "px-3 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors border",
                          isSelected 
                            ? "bg-zinc-100 text-black border-zinc-100" 
                            : (isSuggested ? "bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20" : "bg-zinc-950 text-zinc-600 border-zinc-800 hover:bg-zinc-800")
                        )}
                      >
                        {m} {isSuggested && !isSelected && "★"}
                      </button>
                    )
                  })}
               </div>
            </div>
          )}

          {primary && (
            <div className="flex-1 flex flex-col">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">3. Bài tập đề xuất</h3>
              <div className="flex flex-col gap-2 overflow-y-auto custom-scrollbar flex-1">
                {relevantExercises.map((ex) => (
                  <div key={ex.id} 
                    onClick={() => addExercise(ex.id)}
                    className="p-3 border border-zinc-800 bg-black hover:border-lime-400 cursor-pointer group"
                  >
                    <p className="font-bold text-sm text-zinc-200 group-hover:text-lime-400">{ex.name}</p>
                    <p className="text-[10px] text-zinc-500 italic mt-1 font-bold">{ex.targetMuscle} {ex.equipment && `· ${ex.equipment}`}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Main Content Area */}
      <section className="flex-1 p-6 md:p-8 flex flex-col gap-8 lg:overflow-y-auto">
        <div className="space-y-4">
           <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3 block">Lịch Tập Tuần</h3>
           {renderWeeklyBlocks()}
        </div>

        {editingDay !== null && primary ? (
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-black uppercase italic tracking-tighter">Chi tiết {DAYS[editingDay]}</h2>
              <button
                onClick={() => { clearPlanDay(editingDay); setEditingDay(null); }}
                className="text-[10px] font-bold text-red-500 uppercase tracking-widest hover:text-red-400 border border-red-500/30 px-3 py-1 bg-red-500/10"
              >
                Xóa Ngày Tập
              </button>
            </div>

            <div className="flex-1 bg-zinc-900 border border-zinc-800 p-4 shrink-0 h-auto">
               <div className="flex justify-between items-center border-b border-zinc-800 pb-3 mb-4">
                 <span className="font-bold text-lime-400 text-sm uppercase tracking-widest">
                   {primary} DAY
                 </span>
                 <span className="text-[10px] font-mono text-zinc-500">{exercises.length} Exercises</span>
               </div>
               
               <div className="space-y-4">
                 {exercises.length === 0 ? (
                   <div className="py-12 flex flex-col items-center justify-center text-zinc-600 border border-dashed border-zinc-800">
                     <Dumbbell className="w-8 h-8 mb-2 opacity-50" />
                     <p className="text-sm font-bold uppercase tracking-widest">Chưa chọn bài tập</p>
                   </div>
                 ) : (
                   exercises.map((item, idx) => {
                     const exDetails = predefinedExercises.find(e => e.id === item.exerciseId);
                     return (
                        <div key={item.id} className="group relative flex flex-col sm:flex-row sm:items-center gap-4 bg-black border border-zinc-800 p-4">
                          <span className="text-2xl font-black text-zinc-700 w-6 tabular-nums">{String(idx + 1).padStart(2, '0')}</span>
                          <div className="flex-1">
                            <p className="font-bold text-zinc-100">{exDetails?.name}</p>
                            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">{exDetails?.targetMuscle}</p>
                          </div>
                          <div className="flex items-center gap-2 mt-2 sm:mt-0">
                            <div className="flex items-center">
                              <input type="number" value={item.sets} onChange={e => updateExercise(item.id, Number(e.target.value), item.reps)} className="w-10 bg-transparent text-lime-400 text-right font-black font-mono focus:outline-none" />
                              <span className="text-xs text-zinc-500 ml-1 font-bold">SETS</span>
                            </div>
                            <span className="text-zinc-800">×</span>
                            <div className="flex items-center">
                              <input type="text" value={item.reps} onChange={e => updateExercise(item.id, item.sets, e.target.value)} className="w-12 bg-transparent text-lime-400 text-right font-black font-mono focus:outline-none" />
                              <span className="text-xs text-zinc-500 ml-1 font-bold">REPS</span>
                            </div>
                          </div>
                          <button onClick={() => removeExercise(item.id)} className="absolute top-2 right-2 text-zinc-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                     )
                   })
                 )}
               </div>
            </div>

            <div className="mt-8 flex justify-end">
               <button 
                 onClick={handleSave}
                 disabled={!primary || exercises.length === 0}
                 className="bg-lime-400 text-black px-10 py-4 font-black uppercase italic tracking-tighter text-lg skew-x-[-12deg] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-lime-300 transition-colors"
               >
                 <div className="skew-x-[12deg]">Lưu Kế Hoạch</div>
               </button>
            </div>
          </div>
        ) : (
          editingDay === null && (
            <div className="flex-1 flex flex-col justify-center gap-6 max-w-xl">
               <h2 className="text-5xl font-black uppercase italic tracking-tighter text-zinc-200 leading-none">Chế độ<br/>Lập kế hoạch</h2>
               <p className="text-zinc-500 font-bold max-w-md">Chọn một ngày trong Lịch Tập Tuần ở trên để bắt đầu thêm hoặc chỉnh sửa chi tiết các bài tập, nhóm cơ chính và bổ trợ của bạn.</p>
            </div>
          )
        )}
      </section>
    </div>
  );
}
