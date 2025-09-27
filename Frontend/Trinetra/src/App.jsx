import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Home from "./Pages/Home";
import About from "./Components/Home/About";
import Contact from "./Pages/Contact";
import EventTimeline from "./Components/Home/EventTimeline";
import Booking from "./Pages/Booking";
import BookingForm from "./Pages/Book";
import KumbhMelaMonitor from "./Pages/HeatMap_Dashboard";
import LostAndFoundPage from "./Pages/LostAndFoundPage";
import SafeZonePage from "./Pages/SafeZonePage";
import Dashboard from "./authority/dashboard";
 
import Guide from "./Pages/Guide";
 
import Ticket from "./Pages/Ticket";
import TempleAnalytics from "./Pages/TempleAnalystics";
 


function AppWrapper() {
  const location = useLocation();

  // Check if current path is /dashboard
  const hideFooterPaths = ["/admin"];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<EventTimeline />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/slots" element={<Booking />} />
          <Route path="/book" element={<BookingForm />} />
          <Route path="/dashboard" element={<KumbhMelaMonitor />} />
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/lost-found" element={<LostAndFoundPage />} />
          <Route path="/ar-navigation" element={<SafeZonePage />} />
          <Route path="/ticket" element={<Ticket />} />
           <Route path="/xyz" element={<TempleAnalytics/>} />

        </Routes>
      </main>
      {!hideFooterPaths.includes(location.pathname) && <Footer id="footer"/>}
      <Guide/>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
     
  );
}

export default App;
