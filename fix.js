const fs = require('fs');
let code = fs.readFileSync('src/views/NutritionView.tsx', 'utf-8');
const searchRegExp = /<option value="Gi[\s\S]*?<label className="text-\[10px\] uppercase font-bold text-zinc-500 tracking-widest mb-1 block">Hôm nay bạn ăn gì\?<\/label>/;
const replacement = `<option value="Giữ cân">Giữ cân</option>
             <option value="Tăng cơ/Tăng cân">Tăng cơ/Tăng cân</option>
           </select>
        </div>

        <div>
           <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1 block">Hôm nay bạn ăn gì?</label>`;
code = code.replace(searchRegExp, replacement);
fs.writeFileSync('src/views/NutritionView.tsx', code);
console.log("Fixed!");
