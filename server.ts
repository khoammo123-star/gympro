import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // GEMINI API Handler
  app.post("/api/generate-plan", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Thieu thiet lap GEMINI API KEY ở server." });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const { age, daysPerWeek, goal, weaknesses } = req.body;

      // Import predefined exercises to send valid IDs to AI
      const validExercises = [
        { id: "e-chest-1", name: "Đẩy ngực ngang với tạ đòn", muscle: "Ngực" },
        { id: "e-chest-2", name: "Đẩy ngực trên với tạ đơn", muscle: "Ngực" },
        { id: "e-chest-3", name: "Ép ngực với cáp", muscle: "Ngực" },
        { id: "e-chest-4", name: "Hít đất", muscle: "Ngực" },
        { id: "e-back-1", name: "Kéo xô", muscle: "Lưng" },
        { id: "e-back-2", name: "Gập người kéo tạ đòn", muscle: "Lưng" },
        { id: "e-back-3", name: "Hít xà đơn", muscle: "Lưng" },
        { id: "e-back-4", name: "Kéo tạ đơn một tay", muscle: "Lưng" },
        { id: "e-legs-1", name: "Gánh tạ đòn", muscle: "Chân" },
        { id: "e-legs-2", name: "Đạp đùi", muscle: "Chân" },
        { id: "e-legs-3", name: "Đá đùi trước", muscle: "Chân" },
        { id: "e-legs-4", name: "Móc đùi sau", muscle: "Chân" },
        { id: "e-legs-5", name: "Nâng bắp chân", muscle: "Chân" },
        { id: "e-shoulders-1", name: "Đẩy vai trên ghế", muscle: "Vai" },
        { id: "e-shoulders-2", name: "Nâng tạ hai bên", muscle: "Vai" },
        { id: "e-shoulders-3", name: "Nâng tạ đơn trước mặt", muscle: "Vai" },
        { id: "e-arms-1", name: "Cằm tạ đơn cuộn", muscle: "Tay" },
        { id: "e-arms-2", name: "Cằm tạ đòn cuộn", muscle: "Tay" },
        { id: "e-arms-3", name: "Nhấn tạ đơn sau tay", muscle: "Tay" },
        { id: "e-arms-4", name: "Kéo cáp nhấm tay sau", muscle: "Tay" },
        { id: "e-core-1", name: "Gập bụng", muscle: "Bụng" },
        { id: "e-core-2", name: "Plank", muscle: "Bụng" },
        { id: "e-core-3", name: "Nâng chân", muscle: "Bụng" },
        { id: "e-cardio-1", name: "Chạy bộ trên máy", muscle: "Cardio" },
        { id: "e-cardio-2", name: "Đạp xe", muscle: "Cardio" }
      ];

      const prompt = `Bạn là một huấn luyện viên cá nhân AI xuất sắc. Dựa vào thông tin sau:
- Tuổi: ${age}
- Khách hàng muốn tập: ${daysPerWeek} buổi / tuần.
- Mục tiêu: ${goal}.
- Điểm yếu/Khuyết điểm cơ bản: ${weaknesses || "Không có đặc biệt"}.

Hãy lập một lịch tập (workout plan) với chính xác số buổi tập bằng số buổi khách hàng muốn tập trong 1 tuần (1 tuần có 7 ngày, hãy chỉ sử dụng index từ 0 đến 6 đại diện cho Chủ Nhật, Thứ 2, Thứ 3, Thứ 4, Thứ 5, Thứ 6, Thứ 7). Thiết lập lịch tập hợp lý (có ngày nghỉ xen kẽ).
Đối với mỗi ngày tập, chọn 1 nhóm cơ chính (primaryMuscle) và có thể có nhóm cơ bổ trợ (secondaryMuscles).
Hãy chọn các bài tập CHỈ TỪ DANH SÁCH SAU (yêu cầu sử dụng đúng 'id'):
${JSON.stringify(validExercises, null, 2)}
Gán số hiệp (sets) và số lần (reps) cho mỗi bài tập.
Bạn hãy trả về DUY NHẤT một mảng JSON, KHÔNG KÈM BẤT KỲ TEXT NÀO KHÁC.

Mục tiêu JSON Format:
[
  {
    "dayOfWeek": 1, // Thứ 2
    "primaryMuscle": "Ngực",
    "secondaryMuscles": ["Tay"],
    "exercises": [
      { "exerciseId": "e-chest-1", "sets": 4, "reps": "8-12" },
      { "exerciseId": "e-chest-2", "sets": 3, "reps": "10-12" }
    ]
  },
  {
    "dayOfWeek": 3, // Thứ 4
    "primaryMuscle": "Lưng",
    "secondaryMuscles": ["Tay"],
    "exercises": [ ... ]
  }
]`;
        
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        },
      });

      const responseArray = JSON.parse(response.text || "[]");
      console.log("Raw Gemini:", JSON.stringify(responseArray, null, 2));
      const planMap: Record<string, any> = {};
      
      const daysArray = Array.isArray(responseArray) ? responseArray : (responseArray.planDays || []);

      daysArray.forEach((day: any) => {
        if (day && day.dayOfWeek !== undefined) {
          planMap[day.dayOfWeek.toString()] = {
            primaryMuscle: day.primaryMuscle,
            secondaryMuscles: day.secondaryMuscles || [],
            exercises: day.exercises || []
          };
        }
      });

      res.json({ plan: planMap, raw: responseArray });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Lỗi kết nối hoặc phân tích từ Gemini API" });
    }
  });

  // Nutrition AI Analysis API
  app.post("/api/analyze-nutrition", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Thieu thiet lap GEMINI API KEY ở server." });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const { weight, height, age, gender, goal, activityLevel, foodQuery, imageBase64 } = req.body;

      const textPrompt = `Bạn là chuyên gia dinh dưỡng thể hình (AI Nutritionist).
Người dùng có các chỉ số sau:
- Giới tính: ${gender}
- Nhập: ${age} tuổi, Cao: ${height} cm, Nặng: ${weight} kg
- Mức độ hoạt động: ${activityLevel}
- Mục tiêu: ${goal}

Họ vừa cung cấp danh sách thức ăn họ ăn ("${foodQuery || "Không có mô tả text"}") và/hoặc một bức ảnh chụp bữa ăn (nếu có).

Nhiệm vụ của bạn:
1. Tính TDEE của họ dựa vào chỉ số.
2. Từ mục tiêu, đưa ra Target Calories (Calo mục tiêu mỗi ngày).
3. Phân tích ước tính tổng Calo, Protein (g), Carbs (g), Fat (g) của lượng thức ăn họ vừa cung cấp qua ảnh và text. Hãy ước chừng nếu có ảnh.
4. Đưa ra lời khuyên ngắn gọn (khoảng 2-3 câu) xem lượng ăn này so với mục tiêu thì hợp lý không, cần ăn thêm gì hoặc bớt gì.

Hãy trả về dưới định dạng JSON đúng schema sau, không kèm bất kỳ markdown/text thừa nào.`;

      let contents: any = textPrompt;
      if (imageBase64) {
        // extract mime type and base64 data
        const matches = imageBase64.match(/^data:(image\/[a-zA-Z]+);base64,(.*)$/);
        let mimeType = "image/jpeg";
        let base64Data = imageBase64;
        if (matches && matches.length === 3) {
          mimeType = matches[1];
          base64Data = matches[2];
        } else {
           // fallback if it's just raw base64
           base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        }

        contents = [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            }
          },
          textPrompt
        ];
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              tdee: { type: Type.INTEGER, description: "Total Daily Energy Expenditure" },
              targetCalories: { type: Type.INTEGER, description: "Lượng calo khuyên dùng mỗi ngày" },
              foodAnalysis: {
                type: Type.OBJECT,
                properties: {
                  calories: { type: Type.INTEGER },
                  protein: { type: Type.INTEGER },
                  carbs: { type: Type.INTEGER },
                  fat: { type: Type.INTEGER }
                }
              },
              advice: { type: Type.STRING, description: "Lời khuyên dinh dưỡng bằng tiếng Việt" }
            }
          }
        },
      });

      const analysisData = JSON.parse(response.text || "{}");
      res.json(analysisData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Lỗi phân tích dinh dưỡng từ Gemini API" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
