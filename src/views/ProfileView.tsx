import { AppState } from "../types";
import { parseISO, format, differenceInDays, subDays } from "date-fns";
import { Flame, Dumbbell, CalendarDays, Trophy, User } from "lucide-react";

type Props = {
  state: AppState;
};

export default function ProfileView({ state }: Props) {
  // Stats Calculation
  const logs = Object.values(state.dailyLogs).filter(log => log.completedExercises.length > 0);
  
  const totalDays = logs.length;
  const totalExercises = logs.reduce((acc, log) => acc + log.completedExercises.length, 0);
  
  // Streak
  let currentStreak = 0;
  let d = new Date();
  const todayStr = format(d, 'yyyy-MM-dd');
  const yesterdayStr = format(subDays(d, 1), 'yyyy-MM-dd');
  
  let dateToCheck = d;
  const hasToday = state.dailyLogs[todayStr]?.completedExercises.length > 0;
  const hasYesterday = state.dailyLogs[yesterdayStr]?.completedExercises.length > 0;

  if (!hasToday && !hasYesterday) {
    currentStreak = 0;
  } else {
    // start from yesterday if today is missing
    if (!hasToday) {
      dateToCheck = subDays(d, 1);
    }
    
    let curr = dateToCheck;
    while (state.dailyLogs[format(curr, 'yyyy-MM-dd')]?.completedExercises.length > 0) {
      currentStreak++;
      curr = subDays(curr, 1);
    }
  }

  // Generate last 14 days activity
  const recentDays = Array.from({ length: 14 }).map((_, i) => {
    const date = subDays(new Date(), 13 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const workoutCount = state.dailyLogs[dateStr]?.completedExercises.length || 0;
    return { date, dateStr, workoutCount };
  });

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 w-full flex-1">
      <header className="space-y-4 border-b border-zinc-800 pb-8">
        <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-zinc-100 flex items-end gap-3 leading-none">
          Hồ Sơ
        </h2>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Thống kê hoạt động và quá trình tập luyện của bạn.</p>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        {/* User Card */}
        <div className="md:col-span-1 bg-black border border-zinc-800 p-8 flex flex-col items-center text-center space-y-4">
          <div className="w-24 h-24 bg-zinc-900 border border-zinc-700 rounded-full flex items-center justify-center text-zinc-500">
            <User className="w-12 h-12" />
          </div>
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tighter italic text-zinc-100">Titan Athlete</h3>
            <p className="text-xs font-bold text-lime-400 uppercase tracking-widest mt-1">Cấp độ: Sơ Cấp</p>
          </div>
          <div className="w-full h-px bg-zinc-800 my-4"></div>
          <div className="w-full flex justify-between items-center text-sm">
            <span className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">THÀNH VIÊN TỪ</span>
            <span className="text-zinc-300 font-mono font-bold">{format(new Date(), 'MM/yyyy')}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">CHUỖI NGÀY</span>
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <div className="mt-4">
              <p className="text-5xl font-black italic text-zinc-100 tracking-tighter">{currentStreak}</p>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Ngày liên tiếp</p>
            </div>
          </div>
          
          <div className="bg-zinc-900 border border-zinc-800 p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">TỔNG BUỔI TẬP</span>
              <CalendarDays className="w-5 h-5 text-lime-400" />
            </div>
            <div className="mt-4">
              <p className="text-5xl font-black italic text-zinc-100 tracking-tighter">{totalDays}</p>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Ngày tập luyện</p>
            </div>
          </div>
          
          <div className="bg-zinc-900 border border-zinc-800 p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">BÀI TẬP</span>
              <Dumbbell className="w-5 h-5 text-zinc-400" />
            </div>
            <div className="mt-4">
              <p className="text-5xl font-black italic text-zinc-100 tracking-tighter">{totalExercises}</p>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Đã hoàn thành</p>
            </div>
          </div>
          
          <div className="bg-zinc-900 border border-zinc-800 p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">DANH HIỆU</span>
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
            <div className="mt-4">
              <p className="text-5xl font-black italic text-zinc-100 tracking-tighter">0</p>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Huy hiệu đạt được</p>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Map */}
      <div className="bg-black border border-zinc-800 p-6">
        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6">HOẠT ĐỘNG 14 NGÀY QUA</h3>
        <div className="flex items-end gap-2 h-32">
          {recentDays.map((day, i) => {
            const height = day.workoutCount > 0 ? `${Math.min(100, Math.max(20, day.workoutCount * 15))}%` : '10%';
            const isToday = day.dateStr === todayStr;
            return (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-2 group relative">
                <div 
                  className={`w-full transition-all duration-300 ${day.workoutCount > 0 ? 'bg-lime-400 group-hover:bg-lime-300' : 'bg-zinc-800 group-hover:bg-zinc-700'}`}
                  style={{ height }}
                ></div>
                <span className={`text-[9px] font-mono font-bold ${isToday ? 'text-lime-400' : 'text-zinc-600'}`}>
                  {format(day.date, 'dd')}
                </span>
                
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity bg-zinc-800 text-zinc-200 text-[10px] font-bold uppercase px-2 py-1 whitespace-nowrap z-10 border border-zinc-700 shadow-xl">
                  {format(day.date, 'dd/MM')}: {day.workoutCount} BÀI TẬP
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}
