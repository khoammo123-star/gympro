import { Exercise, MuscleGroup } from "../types";

export const predefinedExercises: Exercise[] = [
  // Ngực
  { id: "e-chest-1", name: "Đẩy ngực ngang với tạ đòn (Barbell Bench Press)", targetMuscle: "Ngực", secondaryMuscles: ["Vai", "Tay"], equipment: "Barbell" },
  { id: "e-chest-2", name: "Đẩy ngực trên với tạ đơn (Incline Dumbbell Press)", targetMuscle: "Ngực", secondaryMuscles: ["Vai", "Tay"], equipment: "Dumbbell" },
  { id: "e-chest-3", name: "Ép ngực với cáp (Cable Crossover)", targetMuscle: "Ngực", equipment: "Cable" },
  { id: "e-chest-4", name: "Hít đất (Push up)", targetMuscle: "Ngực", secondaryMuscles: ["Vai", "Tay", "Bụng"], equipment: "Bodyweight" },

  // Lưng
  { id: "e-back-1", name: "Kéo xô (Lat Pulldown)", targetMuscle: "Lưng", secondaryMuscles: ["Tay"], equipment: "Cable" },
  { id: "e-back-2", name: "Gập người kéo tạ đòn (Barbell Row)", targetMuscle: "Lưng", secondaryMuscles: ["Tay"], equipment: "Barbell" },
  { id: "e-back-3", name: "Hít xà đơn (Pull Up)", targetMuscle: "Lưng", secondaryMuscles: ["Tay", "Bụng"], equipment: "Bodyweight" },
  { id: "e-back-4", name: "Kéo tạ đơn một tay (Single Arm Dumbbell Row)", targetMuscle: "Lưng", secondaryMuscles: ["Tay"], equipment: "Dumbbell" },

  // Chân
  { id: "e-legs-1", name: "Gánh tạ đòn (Squat)", targetMuscle: "Chân", secondaryMuscles: ["Bụng"], equipment: "Barbell" },
  { id: "e-legs-2", name: "Đạp đùi (Leg Press)", targetMuscle: "Chân", equipment: "Machine" },
  { id: "e-legs-3", name: "Đá đùi trước (Leg Extension)", targetMuscle: "Chân", equipment: "Machine" },
  { id: "e-legs-4", name: "Móc đùi sau (Leg Curl)", targetMuscle: "Chân", equipment: "Machine" },
  { id: "e-legs-5", name: "Nâng bắp chân (Calf Raise)", targetMuscle: "Chân", equipment: "Machine" },

  // Vai
  { id: "e-shoulders-1", name: "Đẩy vai trên ghế (Seated Dumbbell Press)", targetMuscle: "Vai", secondaryMuscles: ["Tay"], equipment: "Dumbbell" },
  { id: "e-shoulders-2", name: "Nâng tạ hai bên (Lateral Raise)", targetMuscle: "Vai", equipment: "Dumbbell" },
  { id: "e-shoulders-3", name: "Nâng tạ đơn trước mặt (Front Raise)", targetMuscle: "Vai", equipment: "Dumbbell" },

  // Tay
  { id: "e-arms-1", name: "Cằm tạ đơn cuộn (Dumbbell Bicep Curl)", targetMuscle: "Tay", equipment: "Dumbbell" },
  { id: "e-arms-2", name: "Cằm tạ đòn cuộn (Barbell Curl)", targetMuscle: "Tay", equipment: "Barbell" },
  { id: "e-arms-3", name: "Nhấn tạ đơn sau tay (Tricep Extension)", targetMuscle: "Tay", equipment: "Dumbbell" },
  { id: "e-arms-4", name: "Kéo cáp nhấm tay sau (Tricep Pushdown)", targetMuscle: "Tay", equipment: "Cable" },

  // Bụng
  { id: "e-core-1", name: "Gập bụng (Crunch)", targetMuscle: "Bụng", equipment: "Bodyweight" },
  { id: "e-core-2", name: "Plank", targetMuscle: "Bụng", equipment: "Bodyweight" },
  { id: "e-core-3", name: "Nâng chân (Leg Raise)", targetMuscle: "Bụng", equipment: "Bodyweight" },

  // Cardio
  { id: "e-cardio-1", name: "Chạy bộ trên máy (Treadmill)", targetMuscle: "Cardio", secondaryMuscles: ["Chân"], equipment: "Machine" },
  { id: "e-cardio-2", name: "Đạp xe (Cycling)", targetMuscle: "Cardio", secondaryMuscles: ["Chân"], equipment: "Machine" }
];
