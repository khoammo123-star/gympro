import { format } from "date-fns";
import { CheckCircle2, Circle, Flame, Timer, Play, Square, Zap, X } from "lucide-react";
import { cn } from "../lib/utils";
import { AppState, Exercise, WorkoutPlanItem } from "../types";
import { predefinedExercises } from "../data/exercises";
import React, { useState, useEffect } from "react";

type Props = {
  state: AppState;
  toggleExercise: (date: string, exercisePlanId: string) => void;
  isAdvanced?: boolean;
  updateFullWeeklyPlan?: (plan: WorkoutPlanItem[]) => void;
};

export default function TodayView({ state, toggleExercise, isAdvanced, updateFullWeeklyPlan }: Props) {
  const [restTimer, setRestTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const [selectedExerciseName, setSelectedExerciseName] = useState<string>("");

  const generateAiPlan = async () => {
    if (!updateFullWeeklyPlan) return;
    setAiLoading(true);
    try {
      const resp = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: 25,
          daysPerWeek,
          goal: 'Sức khỏe tổng quát',
          weaknesses: 'Người mới bắt đầu tập luyện'
        })
      });
      const data = await resp.json();
      if (data.plan) {
        const newWeeklyPlan: WorkoutPlanItem[] = [];
        Object.entries(data.plan).forEach(([day, planObject]) => {
          const po = planObject as any;
          newWeeklyPlan.push({
            id: Date.now().toString() + Math.random(),
            dayOfWeek: Number(day),
            primaryMuscle: po.primaryMuscle,
            secondaryMuscles: po.secondaryMuscles || [],
            exercises: (po.exercises || []).map((ex: any) => ({
              id: Date.now().toString() + Math.random(),
              exerciseId: ex.exerciseId,
              sets: typeof ex.sets === 'number' ? ex.sets : parseInt(ex.sets || "3", 10),
              reps: ex.reps || "8-12"
            }))
          });
        });
        updateFullWeeklyPlan(newWeeklyPlan);
      } else {
        alert(data.error || "Có lỗi xảy ra khi tạo kế hoạch");
      }
    } catch (e) {
      alert("Lỗi kết nối AI");
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => prev - 1);
      }, 1000);
    } else if (restTimer === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, restTimer]);

  const toggleTimer = (seconds: number) => {
    setRestTimer(seconds);
    setIsTimerActive(true);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd");
  const dayOfWeek = today.getDay();
  
  const todaysPlan = state.weeklyPlan.find(p => p.dayOfWeek === dayOfWeek);
  const todaysLog = state.dailyLogs[todayStr] || { completedExercises: [] };

  const getExerciseDetails = (id: string): Exercise | undefined => 
    predefinedExercises.find(e => e.id === id);

  const openVideo = (e: React.MouseEvent, exId: string) => {
    e.stopPropagation();
    const details = getExerciseDetails(exId);
    if (details?.youtubeId) {
      setSelectedVideoUrl(`https://www.youtube.com/embed/${details.youtubeId}?autoplay=1`);
      setSelectedExerciseName(details.name);
    }
  };

  const completedCount = todaysPlan 
    ? todaysPlan.exercises.filter(e => todaysLog.completedExercises.includes(e.id)).length 
    : 0;
  
  const totalCount = todaysPlan?.exercises.length || 0;
  const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 flex-1 w-full">
      <header className="space-y-2">
        <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-zinc-100 flex items-end gap-3 leading-none">
          Hôm nay
        </h2>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Xem và hoàn thành lịch tập của bạn</p>
      </header>

      {!todaysPlan && state.weeklyPlan.length === 0 && !isAdvanced ? (
        <div className="bg-zinc-900 border border-zinc-800 p-8 flex flex-col items-center justify-center space-y-6 max-w-lg mx-auto mt-10">
          <div className="w-16 h-16 bg-lime-400/10 rounded-full flex items-center justify-center text-lime-400 border border-lime-400/20">
            <Zap className="w-8 h-8" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-black uppercase text-zinc-100 tracking-tighter italic">Bắt đầu hành trình</h3>
            <p className="text-zinc-500 text-sm font-bold">Bạn chưa có lịch tập. Hãy để AI thiết kế cho bạn một lộ trình phù hợp cho người mới bắt đầu.</p>
          </div>
          <div className="w-full space-y-3">
            <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest block text-center">Số buổi tập / tuần</label>
            <div className="flex justify-center gap-4">
              {[3, 4, 5].map(num => (
                <button 
                  key={num}
                  onClick={() => setDaysPerWeek(num)}
                  className={cn(
                    "w-12 h-12 flex items-center justify-center font-black text-xl border transition-colors",
                    daysPerWeek === num ? "bg-lime-400 text-black border-lime-400" : "bg-zinc-950 text-zinc-500 border-zinc-800 hover:border-zinc-700"
                  )}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
          <button 
            onClick={generateAiPlan}
            disabled={aiLoading}
            className="w-full mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black uppercase tracking-widest py-4 skew-x-[-12deg] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed group flex justify-center items-center gap-2"
          >
            <div className="skew-x-[12deg] flex items-center gap-2">
              {aiLoading ? <Zap className="w-4 h-4 animate-pulse" /> : <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />}
              {aiLoading ? "ĐANG TẠO LỊCH..." : "TẠO LỊCH TẬP NGAY"}
            </div>
          </button>
          <p className="text-[10px] text-zinc-600 text-center px-4">Sau khi tạo, bạn có thể chuyển sang chế độ Nâng Cao (góc trên bên phải) để tuỳ chỉnh chi tiết.</p>
        </div>
      ) : !todaysPlan ? (
        <div className="bg-zinc-900 border border-zinc-800 p-10 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-500">
            <Flame className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black uppercase text-zinc-200 tracking-tighter italic">Hôm nay là ngày nghỉ</h3>
          <p className="text-zinc-500 text-sm max-w-xs font-bold">Không có lịch tập nào được lên cho hôm nay. Bắt đầu phục hồi hoặc cập nhật mới.</p>
        </div>
      ) : (
        <div className="space-y-8 flex-1">
          <div className="bg-zinc-900 border border-zinc-800 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 flex-1">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                <span className="font-bold text-lime-400 text-sm uppercase tracking-widest">{todaysPlan.primaryMuscle} DAY</span>
                <span className="text-[10px] font-mono text-zinc-500">Tiến độ: {progressPercent}%</span>
              </div>
              <h3 className="text-4xl font-black text-zinc-100 uppercase italic tracking-tighter pt-2">
                Kế hoạch buổi tập
              </h3>
              {todaysPlan.secondaryMuscles.length > 0 && (
                <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest flex items-center gap-2">
                  Bổ trợ: {todaysPlan.secondaryMuscles.join(' / ')}
                </p>
              )}
            </div>
            
            {/* Minimal Stat Box instead of Circular Progress */}
            <div className="flex flex-col items-end gap-1 bg-black p-4 border border-zinc-800 w-full md:w-auto">
               <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Tiến độ bài tập</p>
               <p className="text-4xl font-black italic">{completedCount}<span className="text-xl text-zinc-600">/{totalCount}</span></p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">
              Danh sách bài tập
            </h4>
            <div className="grid gap-2">
              {todaysPlan.exercises.map((item, idx) => {
                const details = getExerciseDetails(item.exerciseId);
                const isDone = todaysLog.completedExercises.includes(item.id);
                return (
                  <div 
                    key={item.id}
                    onClick={() => toggleExercise(todayStr, item.id)}
                    className={cn(
                      "group flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border text-left transition-all duration-200 cursor-pointer",
                      isDone 
                        ? "bg-black border-lime-400 opacity-70" 
                        : "bg-zinc-900 border-zinc-800 hover:border-lime-400"
                    )}
                  >
                    <div className="flex flex-col gap-3 w-full sm:w-auto flex-1">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl font-black text-zinc-700 italic flex-shrink-0 w-8 text-center">
                          {String(idx + 1).padStart(2, '0')}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-baseline gap-2">
                            <p className={cn("font-bold text-lg", isDone ? "text-zinc-500 line-through" : "text-zinc-100")}>
                              {details?.name || "Unknown exercise"}
                            </p>
                            <span className="text-[10px] text-zinc-500 italic hidden sm:inline-block">
                              {details?.targetMuscle}
                            </span>
                          </div>
                          <p className={cn("text-xs font-bold mt-1", isDone ? "text-zinc-600" : "text-zinc-500")}>
                            {item.sets} Sets x {item.reps} Reps
                          </p>
                        </div>
                      </div>
                      
                      {details?.youtubeId && (
                        <div className="pl-12">
                          <button
                            onClick={(e) => openVideo(e, item.exerciseId)}
                            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-lime-400 hover:text-lime-300 transition-colors border border-lime-400/30 px-3 py-1 bg-lime-400/5 hover:bg-lime-400/10"
                          >
                            <Play className="w-3 h-3" /> Hướng dẫn
                          </button>
                        </div>
                      )}
                    </div>
                    {isDone && (
                      <div className="self-end sm:self-auto text-lime-400 font-black text-[10px] uppercase tracking-widest px-2 py-1 bg-lime-400/10 border border-lime-400/20">
                        Hoàn thành
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            
            {/* Rest Timer Widget */}
            <div className="fixed bottom-24 right-6 md:bottom-8 md:right-8 bg-zinc-900 border border-zinc-800 p-4 shadow-2xl flex items-center gap-4 z-50">
               <div className="flex flex-col">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1 flex items-center gap-1"><Timer className="w-3 h-3"/> Thời gian nghỉ</span>
                 <span className={cn("text-3xl font-black font-mono leading-none", restTimer > 0 ? "text-lime-400" : "text-zinc-600")}>
                   {formatTime(restTimer)}
                 </span>
               </div>
               
               <div className="flex flex-col gap-1 border-l border-zinc-800 pl-4">
                 <div className="flex gap-1">
                   <button onClick={() => toggleTimer(60)} className="px-2 py-1 bg-black text-[10px] font-bold uppercase text-zinc-400 hover:text-lime-400 border border-zinc-800 hover:border-lime-400 transition-colors">60s</button>
                   <button onClick={() => toggleTimer(90)} className="px-2 py-1 bg-black text-[10px] font-bold uppercase text-zinc-400 hover:text-lime-400 border border-zinc-800 hover:border-lime-400 transition-colors">90s</button>
                 </div>
                 <button 
                    onClick={() => setIsTimerActive(!isTimerActive)} 
                    disabled={restTimer === 0}
                    className="w-full py-1 bg-zinc-800 text-zinc-300 flex items-center justify-center disabled:opacity-50 hover:bg-zinc-700 transition-colors"
                 >
                   {isTimerActive ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Video Modal */}
      {selectedVideoUrl && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          onClick={() => setSelectedVideoUrl(null)}
        >
          <div 
            className="relative w-full max-w-4xl overflow-hidden shadow-2xl bg-zinc-950 border border-zinc-800 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <h3 className="text-xl font-black italic uppercase tracking-tighter text-zinc-100">
                {selectedExerciseName}
              </h3>
              <button 
                onClick={() => setSelectedVideoUrl(null)}
                className="p-2 transition-colors group hover:bg-zinc-900"
                title="Đóng video"
              >
                <X className="w-6 h-6 text-zinc-500 group-hover:text-lime-400" />
              </button>
            </div>
            <div className="relative w-full bg-black aspect-video">
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
