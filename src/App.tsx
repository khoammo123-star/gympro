import { useState } from "react";
import Layout from "./components/Layout";
import TodayView from "./views/TodayView";
import ScheduleView from "./views/ScheduleView";
import ProgressView from "./views/ProgressView";
import ExercisesView from "./views/ExercisesView";
import ProfileView from "./views/ProfileView";
import NutritionView from "./views/NutritionView";
import { useGymStore } from "./hooks/useGymStore";

export default function App() {
  const [activeTab, setActiveTab] = useState("today");
  const store = useGymStore();

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === "today" && <TodayView state={store.state} toggleExercise={store.toggleDailyExercise} />}
      {activeTab === "schedule" && <ScheduleView state={store.state} saveWeeklyPlan={store.saveWeeklyPlan} clearPlanDay={store.clearWeeklyPlanDay} updateFullWeeklyPlan={store.updateFullWeeklyPlan} />}
      {activeTab === "progress" && <ProgressView state={store.state} addMetric={store.addMetric} removeMetric={store.removeMetric} />}
      {activeTab === "nutrition" && <NutritionView state={store.state} addLog={store.addNutritionLog} removeLog={store.removeNutritionLog} />}
      {activeTab === "exercises" && <ExercisesView />}
      {activeTab === "profile" && <ProfileView state={store.state} />}
    </Layout>
  );
}
