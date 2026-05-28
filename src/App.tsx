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

  const [isAdvanced, setIsAdvanced] = useState(() => {
    return localStorage.getItem("gym-tracker-advanced") === "true";
  });

  const handleToggleAdvanced = () => {
    setIsAdvanced((prev) => {
      const next = !prev;
      localStorage.setItem("gym-tracker-advanced", String(next));
      if (!next && ["schedule", "progress", "nutrition", "profile"].includes(activeTab)) {
        setActiveTab("today");
      }
      return next;
    });
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      isAdvanced={isAdvanced}
      onToggleAdvanced={handleToggleAdvanced}
    >
      {activeTab === "today" && <TodayView state={store.state} toggleExercise={store.toggleDailyExercise} isAdvanced={isAdvanced} updateFullWeeklyPlan={store.updateFullWeeklyPlan} />}
      {activeTab === "schedule" && isAdvanced && <ScheduleView state={store.state} saveWeeklyPlan={store.saveWeeklyPlan} clearPlanDay={store.clearWeeklyPlanDay} updateFullWeeklyPlan={store.updateFullWeeklyPlan} />}
      {activeTab === "progress" && isAdvanced && <ProgressView state={store.state} addMetric={store.addMetric} removeMetric={store.removeMetric} />}
      {activeTab === "nutrition" && isAdvanced && <NutritionView state={store.state} addLog={store.addNutritionLog} removeLog={store.removeNutritionLog} />}
      {activeTab === "exercises" && <ExercisesView />}
      {activeTab === "profile" && isAdvanced && <ProfileView state={store.state} />}
    </Layout>
  );
}
