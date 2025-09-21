import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SafeZonePage = () => {
  const tabsData = {
    "2 Ghats": [
      {
        title: "Ram Ghat",
        description:
          "Beautiful morning view with peaceful atmosphere. Perfect for meditation and early morning activities.",
        logo: "🌅",
        tourLink: (
          <iframe
            width="90%"
            height="500px"
            allowFullScreen={true}
            allow="accelerometer; magnetometer; gyroscope; xr-spatial-tracking"
            style={{
              display: "block",
              margin: "20px auto",
              border: "none",
              maxWidth: "880px",
              borderRadius: "8px",
              boxShadow:
                "0 1px 1px rgba(0,0,0,0.11), 0 2px 2px rgba(0,0,0,0.11), 0 4px 4px rgba(0,0,0,0.11), 0 6px 8px rgba(0,0,0,0.11), 0 8px 16px rgba(0,0,0,0.11)"
            }}
            src="https://panoraven.com/en/embed/mqOOcimUQH"
          />
        ),
        btnText: "Ram Ghat"
      },
      {
        title: "Ghat 2 - Main Ghat",
        description:
          "Central location with all amenities. Most visited spot with cultural activities.",
        logo: "🏛",
        tourLink: (
          <iframe
            width="90%"
            height="500px"
            allowFullScreen={true}
            allow="accelerometer; magnetometer; gyroscope; xr-spatial-tracking"
            style={{
              display: "block",
              margin: "20px auto",
              border: "none",
              maxWidth: "880px",
              borderRadius: "8px",
              boxShadow:
                "0 1px 1px rgba(0,0,0,0.11), 0 2px 2px rgba(0,0,0,0.11), 0 4px 4px rgba(0,0,0,0.11), 0 6px 8px rgba(0,0,0,0.11), 0 8px 16px rgba(0,0,0,0.11)"
            }}
            src="https://panoraven.com/en/embed/EQHno0cuw7"
          />
        ),
        btnText: "Shyam Ghat"
      }
    ],
    Medical: [
      {
        title: "First Aid Station",
        description:
          "Emergency medical assistance available 24/7. Trained professionals on duty.",
        logo: "🏥",
        tourLink: (
          <iframe
            width="90%"
            height="500px"
            allowFullScreen={true}
            allow="accelerometer; magnetometer; gyroscope; xr-spatial-tracking"
            style={{
              display: "block",
              margin: "20px auto",
              border: "none",
              maxWidth: "880px",
              borderRadius: "8px",
              boxShadow:
                "0 1px 1px rgba(0,0,0,0.11), 0 2px 2px rgba(0,0,0,0.11), 0 4px 4px rgba(0,0,0,0.11), 0 6px 8px rgba(0,0,0,0.11), 0 8px 16px rgba(0,0,0,0.11)"
            }}
            src="https://panoraven.com/en/embed/EQHno0cuw7"
          />
        ),
        btnText: "First Aid Station"
      }
    ],
    Washroom: [
      {
        title: "First Aid Station",
        description:
          "Emergency medical assistance available 24/7. Trained professionals on duty.",
        logo: "🏥",
        tourLink: (
          <iframe
            width="90%"
            height="500px"
            allowFullScreen={true}
            allow="accelerometer; magnetometer; gyroscope; xr-spatial-tracking"
            style={{
              display: "block",
              margin: "20px auto",
              border: "none",
              maxWidth: "880px",
              borderRadius: "8px",
              boxShadow:
                "0 1px 1px rgba(0,0,0,0.11), 0 2px 2px rgba(0,0,0,0.11), 0 4px 4px rgba(0,0,0,0.11), 0 6px 8px rgba(0,0,0,0.11), 0 8px 16px rgba(0,0,0,0.11)"
            }}
            src="https://panoraven.com/en/embed/EQHno0cuw7"
          />
        ),
        btnText: "Washroom"
      }
    ]
  };

  const gateData = [
    {
      name: "Gate 1",
      location: "East side",
      traffic: "low",
      googleMapsLink: "https://maps.app.goo.gl/abcdefg"
    },
    {
      name: "Gate 2",
      location: "North side",
      traffic: "high",
      googleMapsLink: "https://maps.app.goo.gl/hijklmn"
    },
    {
      name: "Gate 3",
      location: "West side",
      traffic: "medium",
      googleMapsLink: "https://maps.app.goo.gl/opqrstu"
    },
    {
      name: "Gate 4",
      location: "South side",
      traffic: "low",
      googleMapsLink: "https://maps.app.goo.gl/vwxyz12"
    }
  ];

  // Default tab and tour
  const [activeTab, setActiveTab] = useState("2 Ghats");
  const [activeTour, setActiveTour] = useState(
    tabsData["2 Ghats"][0].tourLink
  ); // Ram Ghat as default

  const [isMapHovered, setIsMapHovered] = useState(false);
  const [userLocation, setUserLocation] = useState("");
  const [bestGate, setBestGate] = useState(null);
  const [showGates, setShowGates] = useState(false);

  const handleDownloadPDF = () => {
    const link = document.createElement("a");
    link.href = "MahaKumbhMap.pdf";
    link.download = "MahaKumbhMap.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log("Downloading PDF...");
  };

  const findBestGate = () => {
    // Mock logic for finding the best gate
    const lowTrafficGates = gateData.filter((gate) => gate.traffic === "low");
    if (lowTrafficGates.length > 0) {
      setBestGate(lowTrafficGates[0]);
    } else {
      const mediumTrafficGates = gateData.filter(
        (gate) => gate.traffic === "medium"
      );
      if (mediumTrafficGates.length > 0) {
        setBestGate(mediumTrafficGates[0]);
      } else {
        setBestGate(null); // All gates have high traffic
      }
    }
    setShowGates(true);
  };

  return (
    <div
      className="min-h-screen w-full"
      style={{
        background: "linear-gradient(to right, #F4A391, #E0B9C2, #EACDC6)"
      }}
    >
      {/* Header Section */}
      <motion.header
        className="h-[30vh] flex items-center justify-center px-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-center mt-24">
          <motion.h1
            className="text-5xl font-bold text-black mb-4"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          >
            Virtual Experience Center
          </motion.h1>
          <motion.p
            className="text-xl text-black opacity-80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.5 }}
          >
            Immerse yourself in our comprehensive virtual tour discover
            locations, services, and amenities before your visit
          </motion.p>
        </div>
      </motion.header>

      {/* Map and Gate Suggestions Section */}
      <motion.section
        className="relative mt-16 p-4 md:p-8 flex flex-col md:flex-row items-start justify-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {/* Map Section */}
        <motion.div
          className="w-full md:w-1/2 cursor-pointer overflow-hidden rounded-lg shadow-lg relative mb-8 md:mb-0"
          style={{
            height: "300px",
            backgroundImage: "url('mapimg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}
          onMouseEnter={() => setIsMapHovered(true)}
          onMouseLeave={() => setIsMapHovered(false)}
          onClick={handleDownloadPDF}
        >
          <AnimatePresence>
            {isMapHovered && (
              <motion.div
                className="absolute inset-0 bg-white bg-opacity-30 backdrop-blur-[1px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </AnimatePresence>
          <motion.div
            className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg font-medium"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
          >
            Click to download map PDF
          </motion.div>
          <motion.div
            className="absolute top-4 left-4 bg-white bg-opacity-90 text-black px-4 py-2 rounded-lg font-bold text-lg"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            Interactive Zone Map
          </motion.div>
        </motion.div>

        {/* Gate Suggestions Section */}
        <motion.div
          className="w-full md:w-1/2 p-4 md:ml-8 bg-white bg-opacity-40 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-black text-center">
            Find Your Best Entry Gate
          </h2>
          <div className="mb-4">
            <label className="block text-black font-semibold mb-2">
              Enter your current location:
            </label>
            <input
              type="text"
              value={userLocation}
              onChange={(e) => setUserLocation(e.target.value)}
              placeholder="e.g., New Delhi Railway Station"
              className="w-full p-2 rounded-lg bg-white bg-opacity-60 text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              onClick={findBestGate}
              className="mt-4 w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200"
            >
              Get Best Gate
            </button>
          </div>

          <AnimatePresence>
            {showGates && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
              >
                {bestGate && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="p-4 bg-white bg-opacity-70 rounded-lg border-2 border-green-500 mb-4"
                  >
                    <div className="flex items-center mb-2">
                      <span className="text-green-600 font-bold text-lg">✅ Best Gate:</span>
                      <span className="ml-2 text-xl font-bold text-green-600">{bestGate.name}</span>
                    </div>
                    <p className="text-gray-800">
                      This gate has the lowest traffic right now, making it the best option for a quick entry.
                    </p>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {gateData.map((gate) => (
                    <motion.div
                      key={gate.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                      className="bg-white bg-opacity-50 p-4 rounded-lg shadow-md flex flex-col items-center text-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <h3 className="text-xl font-semibold mb-2">{gate.name}</h3>
                      <p className={`font-bold uppercase ${
                        gate.traffic === 'low' ? 'text-green-600' :
                        gate.traffic === 'medium' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        Traffic: {gate.traffic}
                      </p>
                      <p className="text-sm text-gray-700 mb-2">{gate.location}</p>
                      <a
                        href={gate.googleMapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-black text-white text-sm px-4 py-2 rounded-full mt-auto hover:bg-gray-800 transition-colors duration-200"
                      >
                        View on Map
                      </a>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.section>

      {/* Tabs Section */}
      <motion.section
        className="bg-white mt-16 bg-opacity-20 backdrop-blur-sm border-t-2 border-white border-opacity-30"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <div className="p-6">
          {/* Tab Headers */}
          <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
            {Object.keys(tabsData).map((tab) => (
              <motion.button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  // reset to first card of the selected tab
                  setActiveTour(tabsData[tab][0]?.tourLink || null);
                }}
                className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-black text-white shadow-lg"
                    : "bg-white bg-opacity-50 text-black hover:bg-opacity-70"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab}
              </motion.button>
            ))}
          </div>

          {/* Tab Content - Buttons only */}
          <motion.div
            key={activeTab}
            className="flex space-x-4 overflow-x-auto pb-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {tabsData[activeTab].map((card, index) => (
              <motion.button
                key={index}
                className="min-w-[180px] bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200 shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTour(card.tourLink || null)}
              >
                {card.btnText}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Virtual Tour Section */}
      {activeTour && (
        <motion.div
          className="pb-2 bg-opacity-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {activeTour}
        </motion.div>
      )}
    </div>
  );
};

export default SafeZonePage;