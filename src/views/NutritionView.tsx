import React, { useState, useRef } from "react";
import { Search, Flame, Beef, Droplets, Wheat, Target, ImagePlus, X, Save } from "lucide-react";
import { AppState, NutritionLog } from "../types";
import { format } from "date-fns";

type Props = {
  state: AppState;
  addLog: (log: Omit<NutritionLog, 'id'>) => void;
  removeLog: (id: string) => void;
};

export default function NutritionView({ state, addLog, removeLog }: Props) {
  const [loading, setLoading] = useState(false);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeNutrition = async () => {
    if (!form.foodQuery.trim() && !imageBase64) return;
    setLoading(true);
    setResult(null);
    try {
      const payload = { ...form, imageBase64 };
      const res = await fetch("/api/analyze-nutrition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.tdee) {
        setResult(data);
        
        // Auto Save Log
        addLog({
          date: format(new Date(), "yyyy-MM-dd"),
          foodQuery: form.foodQuery,
          tdee: data.tdee,
          targetCalories: data.targetCalories,
          foodAnalysis: data.foodAnalysis,
          advice: data.advice,
          imageBase64: imageBase64 || undefined
        });

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

        <div>
           <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1 block">Hoặc tải lên ảnh chụp món ăn</label>
           {imageBase64 ? (
             <div className="relative inline-block mt-2">
               <img src={imageBase64} alt="Food Upload" className="max-h-48 rounded-md border border-zinc-700 block" />
               <button onClick={() => setImageBase64(null)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:scale-110 transition-transform">
                 <X className="w-4 h-4" />
               </button>
             </div>
           ) : (
             <div 
               onClick={() => fileInputRef.current?.click()}
               className="w-full border-2 border-dashed border-zinc-800 bg-zinc-900/50 p-6 flex flex-col items-center justify-center text-zinc-500 hover:border-orange-500 hover:text-orange-500 cursor-pointer transition-colors mt-2"
             >
               <ImagePlus className="w-8 h-8 mb-2" />
               <p className="text-sm font-bold uppercase tracking-widest">Tải ảnh lên</p>
               <p className="text-[10px] mt-1 text-zinc-600">Hỗ trợ JPG, PNG</p>
             </div>
           )}
           <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleImageChange} />
        </div>

        <button 
          onClick={analyzeNutrition}
          disabled={loading || (!form.foodQuery.trim() && !imageBase64)}
          className="w-full bg-gradient-to-r from-orange-500 to-red-600 font-black uppercase text-white py-4 tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <Flame className="w-5 h-5 animate-pulse" /> : <Search className="w-5 h-5" />}
          {loading ? "ĐANG PHÂN TÍCH..." : "PHÂN TÍCH & LƯU"}
        </button>
      </div>

      <div className="w-full md:w-1/2 p-6 md:p-8 bg-zinc-950 overflow-y-auto flex flex-col">
          {/* History Section Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
             <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Nhật Ký Dinh Dưỡng Hôm Nay</h3>
             <div className="text-[10px] bg-zinc-900 text-zinc-400 px-3 py-1 rounded-full font-mono font-bold">
               {format(new Date(), "dd/MM/yyyy")}
             </div>
          </div>

        {loading ? (
          <div className="my-auto h-64 flex flex-col items-center justify-center text-orange-500">
            <Flame className="w-16 h-16 animate-bounce" />
            <p className="font-bold uppercase tracking-widest text-sm mt-4 animate-pulse">AI Đang phân tích món ăn...</p>
          </div>
        ) : result ? (
           <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 mb-8">
             {/* Main Stats */}
             <div className="grid grid-cols-2 gap-4">
               <div className="bg-zinc-900 border border-zinc-800 p-4">
                 <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">TDEE Khuyến Chỉ</p>
                 <p className="text-2xl font-black text-white">{result.tdee} <span className="text-sm font-bold text-zinc-500">kcal</span></p>
               </div>
               <div className="bg-zinc-900 border border-zinc-800 p-4 border-l-4 border-l-orange-500">
                 <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Mục Tiêu</p>
                 <p className="text-2xl font-black text-orange-400">{result.targetCalories} <span className="text-sm font-bold text-zinc-500">kcal</span></p>
               </div>
             </div>

             {/* Food Analysis Summary */}
             <div className="bg-zinc-900 border border-zinc-800 p-5">
               <div className="space-y-4">
                 <div className="flex justify-between items-end">
                   <div>
                     <p className="text-4xl font-black text-orange-500">{result.foodAnalysis?.calories || 0}</p>
                     <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Calo từ bữa ăn</p>
                   </div>
                   <div className="text-right">
                     <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Mục tiêu hằng ngày</p>
                     <p className="font-mono text-zinc-300">{result.targetCalories || 0} kcal</p>
                   </div>
                 </div>
                 
                 <div className="h-2 w-full bg-black flex overflow-hidden rounded-full">
                   <div className="bg-gradient-to-r from-orange-500 to-red-500 h-full" style={{ width: `${Math.min(100, ((result.foodAnalysis?.calories || 0) / (result.targetCalories || 1)) * 100)}%`}}></div>
                 </div>
               </div>

               <div className="grid grid-cols-3 gap-2 mt-6">
                 <div className="bg-black p-3 flex flex-col items-center justify-center text-center">
                   <Beef className="w-5 h-5 text-rose-400 mb-1" />
                   <p className="font-black text-lg">{result.foodAnalysis?.protein || 0}g</p>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Protein</p>
                 </div>
                 <div className="bg-black p-3 flex flex-col items-center justify-center text-center">
                   <Wheat className="w-5 h-5 text-amber-400 mb-1" />
                   <p className="font-black text-lg">{result.foodAnalysis?.carbs || 0}g</p>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Carbs</p>
                 </div>
                 <div className="bg-black p-3 flex flex-col items-center justify-center text-center">
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
        ) : null}

        {/* History List */}
        <div className="space-y-4">
          {(state.nutritionLogs || []).filter(l => l.date === format(new Date(), "yyyy-MM-dd")).length === 0 ? (
            !result && <div className="h-64 flex flex-col items-center justify-center text-zinc-600">
               <Flame className="w-16 h-16 mb-4 opacity-30" />
               <p className="font-bold uppercase tracking-widest text-sm">Chưa có dữ liệu</p>
               <p className="text-xs text-zinc-500 max-w-xs text-center mt-2">Nhập mô tả hoặc tải ảnh bữa ăn để phân tích và lưu nhật ký.</p>
             </div>
          ) : (
            (state.nutritionLogs || [])
              .filter(l => l.date === format(new Date(), "yyyy-MM-dd"))
              .reverse()
              .map(log => (
              <div key={log.id} className="border border-zinc-800 bg-zinc-900/50 p-4 relative group">
                <button onClick={() => removeLog(log.id)} className="absolute top-2 right-2 text-zinc-600 hover:text-red-500 hidden group-hover:block transition-colors">
                  <X className="w-4 h-4" />
                </button>
                <div className="flex gap-4">
                  {log.imageBase64 && (
                    <img src={log.imageBase64} alt="Food" className="w-20 h-20 object-cover rounded-md border border-zinc-800" />
                  )}
                  <div className="flex-1">
                    <p className="font-bold text-orange-400">{log.foodAnalysis?.calories || 0} kcal</p>
                    <p className="text-xs text-zinc-400 italic line-clamp-1 mt-1">"{log.foodQuery || 'Phân tích từ ảnh'}"</p>
                    <div className="flex gap-3 mt-2">
                       <span className="text-[10px] font-bold text-rose-400">P: {log.foodAnalysis?.protein}g</span>
                       <span className="text-[10px] font-bold text-amber-400">C: {log.foodAnalysis?.carbs}g</span>
                       <span className="text-[10px] font-bold text-yellow-400">F: {log.foodAnalysis?.fat}g</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
