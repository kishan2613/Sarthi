 
import Header from "../Components/Dashboard/Header";
import MainDashboard from "../Components/Dashboard/MainDashboard";

// Complete App Component combining header and main dashboard
const KumbhMelaMonitor = () => (
  <div className="font-sans min-h-screen bg-gradient-to-b from-[#FFFBF7] via-[#fff5ed] to-[#ffe9e2]">
    <Header />
    <MainDashboard />
  </div>
);

export default KumbhMelaMonitor;
