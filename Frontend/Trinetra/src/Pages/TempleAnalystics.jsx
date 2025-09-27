import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Calendar, Users, UserCheck, Clock, TrendingUp, X, FileText } from 'lucide-react';

const TempleAnalytics = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [showPrediction, setShowPrediction] = useState(false);

  // Simulated prediction data for special days
  const predictionData = {
    7: {
      day: "Day 7",
      date: "October 3, 2025",
      event: "Navratri Special Day",
      totalFootfall: 8500,
      elders: 2100,
      adults: 4800,
      children: 1600,
      male: 4250,
      female: 4250,
      peakTime: "6:00 AM - 9:00 AM",
      recommendations: [
        "Deploy 15 additional security personnel",
        "Arrange 8 extra prasadam counters",
        "Set up 6 additional donation boxes",
        "Prepare 10,000 prasadam packets"
      ]
    },
    15: {
      day: "Day 15",
      date: "October 11, 2025",
      event: "Ekadashi & Full Moon",
      totalFootfall: 12000,
      elders: 3200,
      adults: 6400,
      children: 2400,
      male: 6000,
      female: 6000,
      peakTime: "4:00 AM - 8:00 AM",
      recommendations: [
        "Deploy 25 additional security personnel",
        "Arrange 12 extra prasadam counters",
        "Set up 10 additional donation boxes",
        "Prepare 15,000 prasadam packets",
        "Coordinate with traffic police"
      ]
    },
    20: {
      day: "Day 20",
      date: "October 16, 2025",
      event: "Karwa Chauth",
      totalFootfall: 6200,
      elders: 1400,
      adults: 3800,
      children: 1000,
      male: 1800,
      female: 4400,
      peakTime: "5:00 PM - 8:00 PM",
      recommendations: [
        "Deploy 8 additional security personnel",
        "Arrange special evening aarti setup",
        "Set up 4 additional donation boxes",
        "Prepare 7,500 prasadam packets"
      ]
    }
  };

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.type === 'text/csv') {
      setFile(uploadedFile);
      setLoading(true);
      
      // Simulate file processing
      setTimeout(() => {
        setLoading(false);
        setShowCalendar(true);
      }, 5000);
    }
  };

  const handleDayClick = (day) => {
    if ([7, 15, 20].includes(day)) {
      setSelectedDay(day);
      setShowPrediction(true);
    }
  };

  const generateCalendarDays = () => {
    const days = [];
    for (let i = 1; i <= 30; i++) {
      const isSpecialDay = [7, 15, 20].includes(i);
      days.push(
        <motion.div
          key={i}
          className={`
            relative flex flex-col items-center justify-center p-2 rounded-lg cursor-pointer
            transition-all duration-200 border-2 text-white
            ${isSpecialDay 
              ? 'border-blue-400 shadow-lg hover:shadow-xl' 
              : 'bg-black border-gray-600 hover:border-blue-400'
            }
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleDayClick(i)}
          style={isSpecialDay ? { backgroundColor: 'rgba(47, 128, 237, 0.7)' } : { backgroundColor: 'black' }}
        >
          <div className="text-lg font-bold">{i}</div>
          {isSpecialDay && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
          )}
          {isSpecialDay && (
            <div className="text-xs mt-1 text-center">
              {i === 7 && "Navratri"}
              {i === 15 && "Ekadashi"}
              {i === 20 && "Karwa"}
            </div>
          )}
        </motion.div>
      );
    }
    return days;
  };

  const currentPrediction = selectedDay ? predictionData[selectedDay] : null;

  return (
    <div className="min-h-screen  bg-black p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-white mb-2">Temple Analytics Dashboard</h1>
          <p className="text-blue-300">Predictive insights for better temple management</p>
        </motion.div>

        {/* File Upload Section */}
        {!showCalendar && (
          <motion.div 
            className="max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="bg-gray-900 rounded-2xl shadow-xl p-8 border-2 border-gray-700">
              <div className="text-center mb-6">
                <FileText className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Upload CSV Data</h2>
                <p className="text-gray-300">Upload your temple visitor data to generate predictions</p>
              </div>
              
              <div className="relative">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={loading}
                />
                <div className={`
                  border-2 border-dashed rounded-xl p-8 text-center transition-all
                  ${loading 
                    ? 'border-blue-400 bg-gray-800' 
                    : 'border-gray-600 hover:border-blue-400 hover:bg-gray-800'
                  }
                `}>
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-white font-medium">
                    {file ? file.name : 'Click to upload CSV file'}
                  </p>
                </div>
              </div>

              {file && !loading && (
                <motion.div 
                  className="mt-4 p-3 bg-green-900 border border-green-600 rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="text-green-300 text-sm">✓ File uploaded successfully</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Loading Animation */}
        <AnimatePresence>
          {loading && (
            <motion.div 
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="bg-gray-900 rounded-2xl p-8 text-center shadow-2xl">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h3 className="text-xl font-bold text-white mb-2">Processing Data</h3>
                <p className="text-gray-300">Analyzing patterns and generating predictions...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Calendar Modal */}
        <AnimatePresence>
          {showCalendar && (
            <motion.div 
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] overflow-hidden"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <div className="p-6 border-b border-gray-700 bg-gray-800">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Calendar className="w-6 h-6" />
                        October 2025 - Prediction Calendar
                      </h2>
                      <p className="text-gray-300">Click on highlighted days for detailed predictions</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowCalendar(false);
                        setFile(null);
                      }}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-white"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="p-6 h-full overflow-hidden">
                  <div className="grid grid-cols-6 gap-4 h-full">
                    {generateCalendarDays()}
                  </div>
                  
                  <div className="mt-6 text-center">
                    <div className="flex justify-center items-center gap-4 text-sm text-gray-300">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(47, 128, 237, 0.7)' }}></div>
                        <span>Prediction Available</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-800 border-2 border-gray-600 rounded"></div>
                        <span>Regular Day</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Prediction Modal */}
        <AnimatePresence>
          {showPrediction && currentPrediction && (
            <motion.div 
              className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
              >
                <div className="p-6 border-b border-gray-700 bg-gray-800">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-white">{currentPrediction.event}</h2>
                      <p className="text-gray-300">{currentPrediction.date} - Detailed Predictions</p>
                    </div>
                    <button
                      onClick={() => setShowPrediction(false)}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-white"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {/* Main Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-xl">
                      <Users className="w-8 h-8 mb-2" />
                      <div className="text-2xl font-bold">{currentPrediction.totalFootfall.toLocaleString()}</div>
                      <div className="text-sm opacity-90">Total Footfall</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-xl">
                      <UserCheck className="w-8 h-8 mb-2" />
                      <div className="text-2xl font-bold">{currentPrediction.elders.toLocaleString()}</div>
                      <div className="text-sm opacity-90">Elders (60+)</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-xl">
                      <Clock className="w-8 h-8 mb-2" />
                      <div className="text-sm font-bold">{currentPrediction.peakTime}</div>
                      <div className="text-sm opacity-90">Peak Hours</div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-xl">
                      <TrendingUp className="w-8 h-8 mb-2" />
                      <div className="text-2xl font-bold">High</div>
                      <div className="text-sm opacity-90">Crowd Level</div>
                    </div>
                  </div>

                  {/* Demographics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-800 p-4 rounded-xl">
                      <h3 className="font-bold text-white mb-3">Age Demographics</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Elders (60+)</span>
                          <span className="font-semibold text-white">{currentPrediction.elders.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Adults (18-60)</span>
                          <span className="font-semibold text-white">{currentPrediction.adults.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Children (0-18)</span>
                          <span className="font-semibold text-white">{currentPrediction.children.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-800 p-4 rounded-xl">
                      <h3 className="font-bold text-white mb-3">Gender Distribution</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Male</span>
                          <span className="font-semibold text-white">{currentPrediction.male.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Female</span>
                          <span className="font-semibold text-white">{currentPrediction.female.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Ratio</span>
                          <span className="font-semibold text-white">50:50</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-gray-800 border border-gray-600 p-4 rounded-xl">
                    <h3 className="font-bold text-white mb-3">📋 Preparation Recommendations</h3>
                    <ul className="space-y-2">
                      {currentPrediction.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-400 font-bold">•</span>
                          <span className="text-gray-300">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TempleAnalytics;