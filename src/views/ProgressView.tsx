import { useState, FormEvent } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format, parseISO } from "date-fns";
import { Trash2, Activity } from "lucide-react";
import { AppState, BodyMetric } from "../types";

type Props = {
  state: AppState;
  addMetric: (m: Omit<BodyMetric, 'id'>) => void;
  removeMetric: (id: string) => void;
};

export default function ProgressView({ state, addMetric, removeMetric }: Props) {
  const [weight, setWeight] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!weight) return;
    
    addMetric({
      date,
      weight: parseFloat(weight),
      bodyFat: bodyFat ? parseFloat(bodyFat) : undefined
    });
    
    setWeight("");
    setBodyFat("");
  };

  const chartData = [...state.metrics]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(m => ({
      ...m,
      displayDate: format(parseISO(m.date), 'dd/MM')
    }));

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 flex-1 w-full">
      <header className="space-y-2">
        <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-zinc-100 flex items-end gap-3 leading-none">Tiến trình</h2>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Ghi nhận chỉ số cơ thể để thấy sự thay đổi.</p>
      </header>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        {/* Form */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 md:col-span-1">
          <h3 className="text-sm font-bold uppercase tracking-widest text-lime-400 mb-6 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Cập nhật chỉ số
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4 text-sm font-bold">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Ngày</label>
              <input 
                type="date" 
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-black border border-zinc-700 px-4 py-3 text-zinc-100 hover:border-lime-400 focus:outline-none focus:border-lime-400 transition-colors"
                required
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Cân nặng (kg) <span className="text-lime-400">*</span></label>
              <input 
                type="number" 
                step="0.1"
                value={weight}
                onChange={e => setWeight(e.target.value)}
                placeholder="VD: 70.5"
                className="w-full bg-black border border-zinc-700 px-4 py-3 text-zinc-100 hover:border-lime-400 focus:outline-none focus:border-lime-400 transition-colors font-mono"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Tỉ lệ mỡ body fat (%)</label>
              <input 
                type="number" 
                step="0.1"
                value={bodyFat}
                onChange={e => setBodyFat(e.target.value)}
                placeholder="Tùy chọn. VD: 15.2"
                className="w-full bg-black border border-zinc-700 px-4 py-3 text-zinc-100 hover:border-lime-400 focus:outline-none focus:border-lime-400 transition-colors font-mono"
              />
            </div>

            <button type="submit" className="w-full bg-lime-400 text-black font-black uppercase italic tracking-tighter text-lg py-3 skew-x-[12deg] mt-6 transition-colors hover:bg-lime-300">
              <div className="skew-x-[-12deg]">Ghi nhận</div>
            </button>
          </form>
        </div>

        {/* Charts & History */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-zinc-900 border border-zinc-800 p-6 h-[350px]">
             {chartData.length >= 2 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis dataKey="displayDate" stroke="#71717a" fontSize={12} fontWeight={700} tickLine={false} axisLine={false} dy={10} />
                    <YAxis 
                      yAxisId="left" 
                      stroke="#71717a" 
                      fontSize={12} 
                      fontWeight={700}
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => `${value}kg`} 
                      domain={['dataMin - 2', 'dataMax + 2']}
                    />
                    <Tooltip 
                       contentStyle={{ backgroundColor: '#000000', border: '1px solid #a3e635', borderRadius: '0', boxShadow: 'none' }}
                       itemStyle={{ color: '#a3e635', fontSize: '14px', fontWeight: 900, fontFamily: 'var(--font-display)', fontStyle: 'italic', textTransform: 'uppercase' }}
                       labelStyle={{ color: '#71717a', fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '4px' }}
                    />
                    <Line yAxisId="left" type="monotone" dataKey="weight" name="Cân nặng" stroke="#a3e635" strokeWidth={4} dot={{ r: 4, strokeWidth: 2, stroke: '#a3e635', fill: '#000000' }} activeDot={{ r: 6, fill: '#a3e635' }} />
                  </LineChart>
                </ResponsiveContainer>
             ) : (
                <div className="h-full flex flex-col items-center justify-center text-zinc-600">
                  <Activity className="w-12 h-12 mb-4 opacity-20" />
                  <p className="font-bold text-sm uppercase tracking-widest">Thiếu dữ liệu</p>
                </div>
             )}
          </div>

          <div className="bg-zinc-900 border border-zinc-800 overflow-hidden">
            <div className="p-4 border-b border-zinc-800 bg-black">
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Lịch sử ghi nhận</h4>
            </div>
            {state.metrics.length === 0 ? (
               <div className="p-8 text-center text-zinc-500 text-sm font-bold uppercase">Chưa có dữ liệu.</div>
            ) : (
               <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                 <table className="w-full text-left text-sm">
                   <thead className="bg-zinc-900 text-zinc-500 uppercase tracking-widest text-[10px] sticky top-0 font-bold border-b border-zinc-800">
                     <tr>
                       <th className="px-6 py-4">Ngày</th>
                       <th className="px-6 py-4">Cân nặng</th>
                       <th className="px-6 py-4">Body Fat</th>
                       <th className="px-6 py-4 text-right">Thao tác</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-zinc-800 font-mono">
                     {[...state.metrics].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((m, idx) => (
                       <tr key={m.id} className="hover:bg-zinc-800 transition-colors group">
                         <td className="px-6 py-4 font-bold text-zinc-300">{format(parseISO(m.date), 'dd/MM/yyyy')}</td>
                         <td className="px-6 py-4 text-lime-400 font-black italic text-lg">{m.weight} <span className="text-xs text-zinc-500 not-italic">KG</span></td>
                         <td className="px-6 py-4 text-zinc-400 font-bold">{m.bodyFat ? `${m.bodyFat}%` : '-'}</td>
                         <td className="px-6 py-4 text-right">
                           <button onClick={() => removeMetric(m.id)} className="text-zinc-600 hover:text-red-500 p-2 border border-transparent hover:border-red-500/30 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100">
                             <Trash2 className="w-4 h-4" />
                           </button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
