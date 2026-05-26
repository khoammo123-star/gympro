import { useState } from "react";
import { Search, Flame, Beef, Droplets, Wheat } from "lucide-react";
import { AppState } from "../types";

type Props = {
  state: AppState;
};

export default function NutritionView({ state }: Props) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    weight: 70,
    height: 170,
    age: 25,
    gender: "Nam",
    goal: "Giữ cân",
    activityLevel: "Vừa phải (tập 3-5 ngày/tuần)",
    foodQuery: ""
  });
  const [result, setResult] = useState<any>(null);

  const analyzeNutrition = async () => {
    if (!form.foodQuery.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/analyze-nutrition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.tdee) {
        setResult(data);
      } else {
        alert("Có lỗi: " + data.error);
      }
    } catch(err) {
       alert("Lỗi kết nối");
    } finally {
       setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
      <div className="w-full md:w-1/2 p-6 md:p-8 space-y-6 overflow-y-auto border-r border-zinc-800">
        <div>
           <h2 className="text-2xl font-black uppercase italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 flex items-center gap-2">
             <Flame className="w-6 h-6 text-orange-500" /> AI Dinh Dưỡng
           </h2>
           <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">Tính toán calo và nhận lời khuyên</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div>
             <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1 block">Tuổi</label>
             <input type="number" value={form.age} onChange={e => setForm({...form, age: Number(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white focus:border-orange-500 focus:outline-none transition-colors" />
           </div>
           <div>
             <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1 block">Giới Tính</label>
             <select value={form.gender} onChange={e => setForm({...form, gender: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white appearance-none focus:border-orange-500 focus:outline-none transition-colors font-bold">
               <option value="Nam">Nam</option>
               <option value="Nữ">Nữ</option>
             </select>
           </div>
           <div>
             <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1 block">Chiều Cao (cm)</label>
             <input type="number" value={form.height} onChange={e => setForm({...form, height: Number(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white focus:border-orange-500 focus:outline-none transition-colors" />
           </div>
           <div>
             <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1 block">Cân Nặng (kg)</label>
             <input type="number" value={form.weight} onChange={e => setForm({...form, weight: Number(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white focus:border-orange-500 focus:outline-none transition-colors" />
           </div>
        </div>

        <div>
           <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1 block">Mức Độ Hoạt Động</label>
           <select value={form.activityLevel} onChange={e => setForm({...form, activityLevel: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white appearance-none focus:border-orange-500 focus:outline-none transition-colors font-bold">
             <option value="Ít vận động (làm việc văn phòng)">Ít vận động (làm việc văn phòng)</option>
             <option value="Nhẹ (1-2 ngày/tuần)">Nhẹ (1-2 ngày/tuần)</option>
             <option value="Vừa phải (tập 3-5 ngày/tuần)">Vừa phải (tập 3-5 ngày/tuần)</option>
             <option value="Nhiều (tập 6-7 ngày/tuần)">Nhiều (tập 6-7 ngày/tuần)</option>
           </select>
        </div>

        <div>
           <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1 block">Mục Tiêu</label>
           <select value={form.goal} onChange={e => setForm({...form, goal: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white appearance-none focus:border-orange-500 focus:outline-none transition-colors font-bold">
             <option value="Giảm mỡ">Giảm mỡ</option>
             <option value="Giữ cân">Giữ cân</option>
             <option value="Tăng cơ/Tăng cân">Tăng cơ/Tăng cân</option>
           </select>
        </div>

        <div>
           <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1 block">Hôm nay bạn ăn gì?</label>
           <textarea 
             rows={4} 
             value={form.foodQuery}
             onChange={e => setForm({...form, foodQuery: e.target.value})}
             placeholder="Vd: Sáng ăn 1 bát phở bò, trưa 2 bát cơm với 200g ức gà và rau luộc..." 
             className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white focus:border-orange-500 focus:outline-none transition-colors"
           />
        </div>

        <button 
          onClick={analyzeNutrition}
          disabled={loading || !form.foodQuery.trim()}
          className="w-full bg-gradient-to-r from-orange-500 to-red-600 font-black uppercase text-white py-4 tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <Flame className="w-5 h-5 animate-pulse" /> : <Search className="w-5 h-5" />}
          {loading ? "ĐANG PHÂN TÍCH..." : "PHÂN TÍCH DINH DƯỠNG"}
        </button>
      </div>

      <div className="w-full md:w-1/2 p-6 md:p-8 bg-zinc-950 overflow-y-auto">
        {result ? (
           <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
             {/* Main Stats */}
             <div className="grid grid-cols-2 gap-4">
               <div className="bg-zinc-900 border border-zinc-800 p-4">
                 <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">TDEE Khuyến Chí</p>
                 <p className="text-2xl font-black text-white">{result.tdee} <span className="text-sm font-bold text-zinc-500">kcal</span></p>
               </div>
               <div className="bg-zinc-900 border border-zinc-800 p-4 border-l-4 border-l-orange-500">
                 <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Mục Tiêu</p>
                 <p className="text-2xl font-black text-orange-400">{result.targetCalories} <span className="text-sm font-bold text-zinc-500">kcal</span></p>
               </div>
             </div>

             {/* Food Analysis Summary */}
             <div>
               <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 border-b border-zinc-800 pb-2">Ước tính từ thức ăn</h3>
               
               <div className="space-y-4">
                 <div className="flex justify-between items-end">
                   <div>
                     <p className="text-3xl font-black">{result.foodAnalysis?.calories || 0}</p>
                     <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Calo đã nạp</p>
                   </div>
                   <div className="text-right">
                     <p className="text-sm font-bold text-zinc-400">Còn lại</p>
                     <p className="font-mono text-orange-400">{(result.targetCalories || 0) - (result.foodAnalysis?.calories || 0)} kcal</p>
                   </div>
                 </div>
                 
                 <div className="h-2 w-full bg-zinc-900 flex overflow-hidden">
                   <div className="bg-orange-500 h-full" style={{ width: `${Math.min(100, (result.foodAnalysis?.calories / result.targetCalories) * 100)}%`}}></div>
                 </div>
               </div>

               <div className="grid grid-cols-3 gap-2 mt-6">
                 <div className="bg-zinc-900 p-3 flex flex-col items-center justify-center text-center">
                   <Beef className="w-5 h-5 text-rose-400 mb-1" />
                   <p className="font-black text-lg">{result.foodAnalysis?.protein || 0}g</p>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Protein</p>
                 </div>
                 <div className="bg-zinc-900 p-3 flex flex-col items-center justify-center text-center">
                   <Wheat className="w-5 h-5 text-amber-400 mb-1" />
                   <p className="font-black text-lg">{result.foodAnalysis?.carbs || 0}g</p>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Carbs</p>
                 </div>
                 <div className="bg-zinc-900 p-3 flex flex-col items-center justify-center text-center">
                   <Droplets className="w-5 h-5 text-yellow-400 mb-1" />
                   <p className="font-black text-lg">{result.foodAnalysis?.fat || 0}g</p>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Fat</p>
                 </div>
               </div>
             </div>

             {/* AI Advice */}
             <div className="bg-orange-950/20 border border-orange-500/20 p-5 relative overflow-hidden">
               <Flame className="w-24 h-24 text-orange-500/10 absolute -right-4 -bottom-4" />
               <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-3 block">Lời Khuyên Của Chuyên Gia</p>
               <p className="relative z-10 text-zinc-300 leading-relaxed text-sm">{result.advice}</p>
             </div>
           </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-zinc-600">
            <Flame className="w-16 h-16 mb-4 opacity-50" />
            <p className="font-bold uppercase tracking-widest text-sm">Chưa có dữ liệu phân tích</p>
            <p className="text-xs text-zinc-500 max-w-xs text-center mt-2">Nhập thông tin cơ thể và các bữa ăn của bạn để AI đưa ra tư vấn dinh dưỡng chuẩn xác.</p>
          </div>
        )}
      </div>
    </div>
  )
}
