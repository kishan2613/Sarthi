import React, { useState, useEffect, useRef } from 'react';

const LivePalmDetectionComponent = () => {
  const [ipAddress, setIpAddress] = useState("http://192.168.0.111:4747/video");
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [lastDetection, setLastDetection] = useState(null);
  const [detectionHistory, setDetectionHistory] = useState([]);
  const [status, setStatus] = useState("Ready to monitor");
  const [error, setError] = useState(null);
  const [debugLog, setDebugLog] = useState([]);
  
  const API_BASE_URL = "http://127.0.0.1:8000";
  const timeout = 5;
  const detectionSensitivity = 0.7;
  const monitoringInterval = 5000; // Increased to 5 seconds
  
  const intervalRef = useRef(null);

  // Add debug logging
  const addDebugLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugLog(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
    console.log(`[${timestamp}] ${message}`);
  };

  // Test API connection
  const testConnection = async () => {
    try {
      addDebugLog("Testing API connection...");
      const response = await fetch(`${API_BASE_URL}/health`);
      const data = await response.json();
      addDebugLog(`API connection successful: ${data.message}`);
      alert(`✅ API Connection Test Passed: ${data.message}`);
      setError(null);
      return true;
    } catch (error) {
      addDebugLog(`API connection failed: ${error.message}`);
      setError(`API Connection Failed: ${error.message}`);
      alert(`❌ API Connection Failed: ${error.message}`);
      return false;
    }
  };

  // Single detection function
  const detectPalmOnce = async () => {
    try {
      addDebugLog("Starting palm detection...");
      setStatus("Analyzing frame...");
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/detect-palm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ip_address: ipAddress,
          timeout: timeout,
          detection_sensitivity: detectionSensitivity
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      addDebugLog(`Detection response: palm_detected=${data.palm_detected}, count=${data.detection_count}`);
      
      if (data.palm_detected && data.processed_frame) {
        const detectionData = {
          id: Date.now(),
          timestamp: data.timestamp,
          message: data.message,
          detectionCount: data.detection_count,
          image: `data:image/jpeg;base64,${data.processed_frame}`
        };
        
        setLastDetection(detectionData);
        setDetectionHistory(prev => [detectionData, ...prev.slice(0, 4)]);
        setStatus(`🚨 PALM DETECTED! (${new Date().toLocaleTimeString()})`);
        addDebugLog("Palm detected! Added to history.");
        
        // Alert for detection
        alert(`🚨 PALM DETECTED!\n${data.message}`);
        
      } else {
        setStatus(`No palm detected (${new Date().toLocaleTimeString()})`);
        addDebugLog("No palm detected in this frame");
      }
      
    } catch (error) {
      addDebugLog(`Detection error: ${error.message}`);
      setError(`Detection Error: ${error.message}`);
      setStatus("Detection failed");
    }
  };

  // Continuous monitoring function
  const detectPalmContinuous = async () => {
    if (!isMonitoring) {
      addDebugLog("Monitoring stopped, skipping detection");
      return;
    }
    
    addDebugLog("Running continuous detection cycle");
    await detectPalmOnce();
  };

  // Start monitoring
  const startMonitoring = async () => {
    if (!ipAddress.trim()) {
      alert('Please enter a valid IP address');
      return;
    }
    
    addDebugLog("Starting live monitoring...");
    
    // Test connection first
    const isConnected = await testConnection();
    if (!isConnected) {
      return;
    }
    
    setIsMonitoring(true);
    setError(null);
    setStatus("Starting live monitoring...");
    
    // Run initial detection
    await detectPalmOnce();
    
    // Set up interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(detectPalmContinuous, monitoringInterval);
    addDebugLog(`Monitoring started with ${monitoringInterval/1000}s interval`);
  };

  // Stop monitoring
  const stopMonitoring = () => {
    addDebugLog("Stopping monitoring...");
    setIsMonitoring(false);
    setStatus("Monitoring stopped");
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Clear detection history
  const clearHistory = () => {
    setDetectionHistory([]);
    setLastDetection(null);
    addDebugLog("Detection history cleared");
  };

  // Clear debug log
  const clearDebugLog = () => {
    setDebugLog([]);
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-blue-400 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-300 mb-2">
            🎥 Live Palm Detection Monitor
          </h1>
          <p className="text-blue-500">
            Continuous monitoring of IP camera feed for palm detection
          </p>
        </div>

        {/* Configuration Panel */}
        <div className="bg-gray-900 border border-blue-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-300 mb-4">📡 Configuration</h2>
          
          <div className="mb-4">
            <label className="block text-blue-400 font-medium mb-2">
              📹 IP Camera Address:
            </label>
            <input
              type="text"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              placeholder="http://192.168.0.111:4747/video"
              className="w-full px-4 py-3 bg-gray-800 border border-blue-700 rounded-lg text-blue-300 placeholder-blue-600 focus:outline-none focus:border-blue-500"
              disabled={isMonitoring}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-800 p-3 rounded">
              <div className="text-blue-500">API Server</div>
              <div className="text-blue-300 font-semibold">{API_BASE_URL}</div>
            </div>
            <div className="bg-gray-800 p-3 rounded">
              <div className="text-blue-500">Check Interval</div>
              <div className="text-blue-300 font-semibold">{monitoringInterval/1000}s</div>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="bg-gray-900 border border-blue-800 rounded-lg p-6 mb-6">
          <div className="flex flex-wrap gap-3 mb-4">
            <button
              onClick={testConnection}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg font-semibold"
            >
              🔗 Test Connection
            </button>
            
            <button
              onClick={detectPalmOnce}
              className="px-4 py-2 bg-yellow-700 hover:bg-yellow-600 text-white rounded-lg font-semibold"
              disabled={isMonitoring}
            >
              📸 Single Detection
            </button>
            
            {!isMonitoring ? (
              <button
                onClick={startMonitoring}
                className="px-6 py-2 bg-green-700 hover:bg-green-600 text-white rounded-lg font-semibold"
              >
                ▶️ Start Live Monitor
              </button>
            ) : (
              <button
                onClick={stopMonitoring}
                className="px-6 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg font-semibold"
              >
                ⏹️ Stop Monitor
              </button>
            )}
            
            <button
              onClick={clearHistory}
              className="px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-lg font-semibold"
            >
              🗑️ Clear History
            </button>
          </div>

          {/* Status */}
          <div className="bg-gray-800 border border-blue-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-blue-500">Status:</span>
                <span className={`ml-2 font-semibold ${
                  isMonitoring ? 'text-green-400' : 'text-blue-400'
                }`}>
                  {isMonitoring && (
                    <span className="inline-block w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  )}
                  {status}
                </span>
              </div>
              <div className="text-blue-500 text-sm">
                Detections: {detectionHistory.length}
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-6">
            <h3 className="text-red-300 font-semibold mb-2">❌ Error:</h3>
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Debug Log */}
        <div className="bg-gray-900 border border-blue-800 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-blue-300">🐛 Debug Log</h2>
            <button
              onClick={clearDebugLog}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-blue-300 rounded text-sm"
            >
              Clear Log
            </button>
          </div>
          <div className="bg-gray-800 rounded p-4 max-h-40 overflow-y-auto">
            {debugLog.length === 0 ? (
              <p className="text-gray-500 text-sm">No debug messages yet...</p>
            ) : (
              debugLog.map((log, index) => (
                <div key={index} className="text-green-400 text-xs font-mono mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Latest Detection */}
        {lastDetection && (
          <div className="bg-red-900 border border-red-700 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-red-300 mb-4 flex items-center">
              🚨 Latest Detection
              <span className="ml-3 px-3 py-1 bg-red-700 text-white text-sm rounded-full">
                LIVE
              </span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <img
                  src={lastDetection.image}
                  alt="Latest Palm Detection"
                  className="w-full h-auto rounded-lg border border-red-600 shadow-lg"
                />
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-red-400">Message:</span>
                  <p className="text-red-300 font-medium">{lastDetection.message}</p>
                </div>
                <div>
                  <span className="text-red-400">Timestamp:</span>
                  <p className="text-red-300">{lastDetection.timestamp}</p>
                </div>
                <div>
                  <span className="text-red-400">Detection Count:</span>
                  <p className="text-red-300 font-bold">{lastDetection.detectionCount}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Detection History */}
        {detectionHistory.length > 0 && (
          <div className="bg-gray-900 border border-blue-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-300 mb-4">
              📊 Detection History ({detectionHistory.length})
            </h2>
            
            <div className="grid gap-4">
              {detectionHistory.map((detection, index) => (
                <div
                  key={detection.id}
                  className="bg-gray-800 border border-blue-700 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-blue-400 font-medium">
                      Detection #{detectionHistory.length - index}
                    </span>
                    <span className="text-blue-500 text-sm">
                      {detection.timestamp}
                    </span>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 items-center">
                    <img
                      src={detection.image}
                      alt={`Detection ${index + 1}`}
                      className="w-full h-24 object-cover rounded border border-blue-600"
                    />
                    <div className="md:col-span-2">
                      <p className="text-blue-300 text-sm mb-1">{detection.message}</p>
                      <p className="text-blue-500 text-xs">
                        Count: {detection.detectionCount}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LivePalmDetectionComponent;
