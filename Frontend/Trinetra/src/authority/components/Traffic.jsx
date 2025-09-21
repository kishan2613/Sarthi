import React, { useState } from "react";
// Import your map image (convert PDF to PNG/JPEG as needed)
import MahaKumbhMap from "/MahaKumbhMap.png"; // Update path if needed

// Sample coordinates for overlay (update as needed for real locations)
const routePositions = [
  { id: 1, x: 40, y: 85 }, // Entry Route 1
  { id: 2, x: 75, y: 78 }, // Entry Route 2
  { id: 3, x: 60, y: 65 }, // Entry Route 3
  { id: 4, x: 25, y: 75 }, // Entry Route 4
  { id: 5, x: 60, y: 50 }, // Ghat Route 1
  { id: 6, x: 70, y: 40 }, // Ghat Route 2
  { id: 7, x: 30, y: 50 }, // Ghat Route 3
  { id: 8, x: 47, y: 38 }, // Ghat Route 4
];

// Business logic data stays same
const routeData = [
  {
    id: 1,
    name: "Entry Route 1",
    type: "Entry",
    density: "High",
    status: "Open",
  },
  {
    id: 2,
    name: "Entry Route 2",
    type: "Entry",
    density: "Medium",
    status: "Open",
  },
  {
    id: 3,
    name: "Ghat Route 5",
    type: "Entry",
    density: "Low",
    status: "Open",
  },
  {
    id: 4,
    name: "Entry Route 4",
    type: "Entry",
    density: "Critical",
    status: "Open",
  },
  {
    id: 5,
    name: "Ghat Route 1",
    type: "Ghat",
    density: "Medium",
    status: "Open",
  },
  {
    id: 6,
    name: "Ghat Route 2",
    type: "Ghat",
    density: "High",
    status: "Open",
  },
  {
    id: 7,
    name: "Entry Route 3",
    type: "Entry",
    density: "Low",
    status: "Open",
  },
  {
    id: 8,
    name: "Route 4",
    type: "Entry",
    density: "Medium",
    status: "Open",
  },
];

const densityColors = {
  Low: "#1abc9c",
  Medium: "#f7ca18",
  High: "#e67e22",
  Critical: "#e74c3c",
};
const statusColors = {
  Open: "#27ae60",
  Stopped: "#e74c3c",
};

function MahakumbhRouteFlowManager() {
  const [routes, setRoutes] = useState(routeData);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [announcement, setAnnouncement] = useState("");
  const [message, setMessage] = useState(null);
  const [suggestion, setSuggestion] = useState(false);
  const [count, setCount] = useState(0);

  const onRouteClick = (route) => {
    setSelectedRoute(route);
    setMessage(null);
    setAnnouncement("");
  };

  const handleSuggestion = () => {
    setSuggestion(!suggestion);
    setCount(count + 1);
  };

  const onStopRoute = () => {
    if (!selectedRoute) return;
    if (window.confirm(`Are you sure to STOP route "${selectedRoute.name}"?`)) {
      const updatedRoutes = routes.map((r) =>
        r.id === selectedRoute.id ? { ...r, status: "Stopped" } : r
      );
      setRoutes(updatedRoutes);
      setSelectedRoute({ ...selectedRoute, status: "Stopped" });
      setMessage(`Route "${selectedRoute.name}" has been stopped.`);
    }
  };

  const onSendAnnouncement = () => {
    if (!announcement.trim()) {
      setMessage("Please enter an announcement before sending.");
      return;
    }
    setMessage(
      `Announcement sent for "${selectedRoute.name}": "${announcement.trim()}"`
    );
    setAnnouncement("");
  };

  const getCurrentFormattedTime = () => {
    return new Date().toLocaleString();
  };

  // Utility to get position by route id
  const getPosition = (id) => routePositions.find((route) => route.id === id);

  return (
    <div className="mkfm-app-container">
      <header className="mkfm-header">
        <h1>Mahakumbh Route Flow Manager</h1>
        <div className="mkfm-header-time">{getCurrentFormattedTime()}</div>
      </header>

      <main className="mkfm-main">
        <section
          className="mkfm-map-panel"
          aria-label="Map overlay with live route status"
        >
          <img
            src={MahaKumbhMap}
            alt="MahaKumbh Map"
            className="mkfm-map-image"
            loading="lazy"
          />
          {routes.map((route) => {
            const pos = getPosition(route.id);
            if (!pos) return null;
            return (
              <button
                key={route.id}
                className={`mkfm-route-marker ${
                  route.status === "Stopped" ? "stopped" : ""
                }`}
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  background: densityColors[route.density],
                  borderColor: statusColors[route.status],
                  color: "#131d2b",
                }}
                title={`${route.name}\nDensity: ${route.density}\nStatus: ${route.status}`}
                onClick={() =>
                  route.status !== "Stopped" && onRouteClick(route)
                }
                aria-label={`Manage ${route.name}`}
                disabled={route.status === "Stopped"}
              >
                <span
                  className="mkfm-marker-dot"
                  style={{ background: statusColors[route.status] }}
                />
                <span className="mkfm-marker-tooltip">
                  <strong>{route.name}</strong>
                  <br />
                  Density: {route.density}
                  <br />
                  Status: {route.status}
                </span>
              </button>
            );
          })}
        </section>

        <section className="mkfm-list-panel" aria-label="Live route list">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <h2 className="mkfm-list-header">Route Summary</h2>
            <button className="suggestion-button" onClick={handleSuggestion}>
              Suggestions
            </button>
          </div>
          {suggestion ? count < 2 ? (
            <div
            className="blinking-warning"
            role="alert"
            style={{
              backgroundColor: 'red', // A bright red for high alert
              color: 'white',
              borderRadius: '16px',
              padding: '24px',
              fontWeight: 'bold',
              boxShadow: '0 0 20px rgba(255, 60, 60, 0.7)',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            The crowd density is exceeding at <b>Entry Route 4</b>. It's suggested to close it and redirect the crowd to <b>Entry Route 3</b>.
          </div>
          ): (
<div style={{marginTop:16, border:"2px dotted white", padding:"15px 20px",alignItems:"center",borderRadius:16}}>Everything is running smoothly! Our AI system is continuously monitoring all routes to ensure the best and safest experience for everyone.</div>
          ) : (
            routes.map((route) => (
              <div
                key={route.id}
                className={`mkfm-list-item ${
                  route.status === "Stopped" ? "stopped" : ""
                }`}
                onClick={() =>
                  route.status !== "Stopped" && onRouteClick(route)
                }
                title={`${route.name}, Density: ${route.density}, Status: ${route.status}`}
                role="button"
                tabIndex={route.status === "Stopped" ? -1 : 0}
                aria-pressed={selectedRoute?.id === route.id}
                style={{
                  borderLeft: `5px solid ${densityColors[route.density]}`,
                }}
              >
                <span>{route.name}</span>
                <span
                  className="mkfm-list-density"
                  style={{
                    color: densityColors[route.density],
                    fontWeight: "700",
                  }}
                >
                  {route.density}
                </span>
                <span
                  className="mkfm-list-status"
                  style={{
                    color: statusColors[route.status],
                    fontWeight: "700",
                    textTransform: "uppercase",
                  }}
                >
                  {route.status}
                </span>
                <button
                  className="mkfm-list-btn"
                  disabled={route.status === "Stopped"}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRouteClick(route);
                  }}
                >
                  Manage
                </button>
              </div>
            ))
          )}
        </section>
      </main>

      {selectedRoute && (
        <div
          className="mkfm-drawer-overlay"
          onClick={() => setSelectedRoute(null)}
          aria-hidden={false}
        >
          <aside
            className="mkfm-drawer open"
            role="region"
            aria-label="Route management details"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mkfm-drawer-header">
              <span>{selectedRoute.name}</span>
              <span
                className="mkfm-close-drawer"
                role="button"
                tabIndex={0}
                aria-label="Close drawer"
                onClick={() => setSelectedRoute(null)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    setSelectedRoute(null);
                }}
              >
                &times;
              </span>
            </div>
            <div className="mkfm-drawer-content">
              <div className="mkfm-drawer-info">
                <span>
                  Density:{" "}
                  <strong
                    style={{ color: densityColors[selectedRoute.density] }}
                  >
                    {selectedRoute.density}
                  </strong>
                </span>
                <span>
                  Status:{" "}
                  <strong style={{ color: statusColors[selectedRoute.status] }}>
                    {selectedRoute.status}
                  </strong>
                </span>
              </div>

              <div className="mkfm-drawer-section">
                <label
                  htmlFor="announcement"
                  className="mkfm-announcement-label"
                >
                  Enter Announcement
                </label>
                <textarea
                  id="announcement"
                  placeholder="Type your announcement or instructions here..."
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  spellCheck={false}
                  aria-multiline="true"
                  disabled={selectedRoute.status === "Stopped"}
                  className="mkfm-textarea"
                />
              </div>

              <div className="mkfm-drawer-btns">
                <button
                  className="mkfm-btn-announcement"
                  onClick={onSendAnnouncement}
                  disabled={selectedRoute.status === "Stopped"}
                  aria-label="Send announcement"
                >
                  Send Announcement
                </button>
                <button
                  className="mkfm-btn-stop"
                  onClick={onStopRoute}
                  disabled={selectedRoute.status === "Stopped"}
                  aria-label="Stop this route"
                >
                  Stop Route
                </button>
              </div>
              {message && (
                <div className="mkfm-message-box" role="alert">
                  {message}
                </div>
              )}
            </div>
          </aside>
        </div>
      )}

      <footer className="mkfm-footer">
        Powered by RouteFlow | MahaKumbh 2025
      </footer>

      {/* Modern styles */}
      <style>{`
        .mkfm-app-container {
          background: #131d2b;
          min-height: 100vh;
          color: #fff;
          font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif;
          display: flex;
          flex-direction: column;
        }
        .mkfm-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.4rem 2.4rem 1.2rem 2.4rem;
          background: #151a21;
          border-bottom: 2px solid #2e4767;
        }
        .mkfm-header h1 {
          font-size: 1.38rem;
          letter-spacing: 0.07em;
          font-weight: 700;
          color: #fee715;
        }
        .suggestion-button {
  background-color: #e74c3c; /* A nice red */
  color: #fff; /* White text */
  border-radius: 50px; /* Fully rounded corners */
  padding: 10px 30px; /* Add some horizontal padding */
  border: none;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.suggestion-button:hover {
  background-color: #c0392b; /* Darker red on hover */
}
        .mkfm-header-time {
          color: #fee715;
          font-weight: 600;
          font-size: 1rem;
          letter-spacing: 0.03em;
          font-family: monospace;
        }
        .mkfm-main {
          display: flex;
          flex: 1;
          min-height: 0;
        }
        .mkfm-map-panel {
          flex: 2.5;
          position: relative;
          background: #131d2b;
          display: flex;
          align-items: center;
          justify-content: center;
          border-right: 2px solid #fee715;
          min-height: 68vh;
        }
        .mkfm-map-image {
          width: 97%;
          max-width: 1000px;
          height: auto;
          border-radius: 1.4rem;
          box-shadow: 0 0 32px #193c68bf;
          margin: auto;
          display: block;
        }
        .mkfm-route-spot {
          position: absolute;
          min-width: 110px;
          max-width: 210px;
          min-height: 46px;
          padding: 8px 14px;
          border-radius: 1.2rem;
          border: 3px solid #27ae60;
          box-shadow: 0 0 14px #2f5da7cc;
          font-weight: 700;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          transition: transform 0.22s cubic-bezier(.8,.2,.7,1), box-shadow 0.18s;
          z-index: 15;
          font-size: 1rem;
          backdrop-filter: blur(1.2px);
          pointer-events: auto;
        }
        .mkfm-route-spot.stopped {
          opacity: 0.63;
          filter: grayscale(65%);
          border-color: #e74c3c !important;
          box-shadow: 0 0 16px #e74c3cab;
          cursor: not-allowed;
        }
        .mkfm-route-spot:hover {
          box-shadow: 0 0 44px #fee715b1;
          transform: scale(1.08);
          border-color: #fee715;
          z-index: 500;
        }
        .mkfm-badge-icon {
          font-size: 1.12rem;
          margin-bottom: 2px;
        }
        .mkfm-badge-name {
          font-weight: 700;
          color: #131d2b;
          font-size: 1.03rem;
          letter-spacing: 0.06em;
        }
        .mkfm-badge-density {
          font-size: 0.92rem;
          font-weight: 700;
          color: #fff;
          margin-top: 1px;
        }
        .mkfm-status-dot {
          display: inline-block;
          margin-top: 5px;
          margin-right: 3px;
          border-radius: 50%;
          width: 14px;
          height: 14px;
          box-shadow: 0 0 8px #1116;
          vertical-align: middle;
        }
        .mkfm-status-dot.stopped {
          box-shadow: 0 0 11px #e74c3c;
        }
        .mkfm-list-panel {
          flex: 1.3;
          background: #161f29;
          padding: 2.2rem 1.3rem;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          border-left: 2px solid #fee715;
        }
        .mkfm-list-header {
          font-weight: 700;
          font-size: 1.25rem;
          color: #fee715;
          letter-spacing: 0.09em;
          margin-bottom: 1.25rem;
        }
        .mkfm-list-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #19263d;
          color: #fff;
          padding: 1rem 1.4rem;
          margin-bottom: 0.9rem;
          border-radius: 0.83rem;
          box-shadow: 0 0 14px #121a2b55;
          cursor: pointer;
          transition: background 0.21s;
          font-size: 1rem;
        }
        .mkfm-list-item.stopped {
          background: #541a1a;
          color: #e74c3c;
          cursor: not-allowed;
          border-left: 5px solid #e74c3c !important;
        }
        .mkfm-list-btn {
          margin-left: 10px;
          padding: 5px 12px;
          font-weight: 700;
          color: #193c68;
          background: #fee715;
          border-radius: 14px;
          border: none;
          cursor: pointer;
          transition: background 0.18s;
        }
        .mkfm-list-btn:disabled {
          background: #bbb;
          color: #888;
          cursor: not-allowed;
        }
        .mkfm-list-btn:hover:not(:disabled) {
          background: #fff54a;
        }
        /* Drawer Styles */
        .mkfm-drawer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(10,19,30,0.66);
          z-index: 999;
          display: flex;
          justify-content: flex-end;
        }
        .mkfm-drawer {
          width: 420px;
          max-width: 99vw;
          min-height: 100vh;
          background: linear-gradient(180deg,#19263d 0%,#1b2031 100%);
          box-shadow: -7px 0 22px rgba(0,0,0,0.95);
          border-left: 3px solid #fee715;
          padding: 2.3rem 1.7rem 1.7rem 1.8rem;
          display: flex;
          flex-direction: column;
          z-index: 1001;
          overflow-y: auto;
        }
        .mkfm-drawer-header {
          font-weight: 800;
          font-size: 1.15rem;
          color: #fee715;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.23rem;
        }
        .mkfm-close-drawer {
          font-weight: 700;
          font-size: 1.4rem;
          color: #e74c3c;
          cursor: pointer;
          user-select: none;
          transition: color 0.23s;
        }
        .mkfm-close-drawer:hover {
          color: #ff1b1b;
        }
        .mkfm-drawer-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1.3rem;
        }
        .mkfm-drawer-info {
          font-size: 1.09rem;
          font-weight: 600;
          color: #fee715;
          display: flex;
          justify-content: space-between;
          gap: 2.2rem;
          align-items: center;
          background: #19263d;
          border-radius: 8px;
          padding: 9px 16px;
          margin-bottom: 0.7rem;
        }
        .mkfm-announcement-label {
          color: #fee715;
          font-weight: 600;
          display: block;
          margin-bottom: 6px;
        }
        .mkfm-textarea {
          width: 100%;
          min-height: 80px;
          border-radius: 8px;
          padding: 12px;
          font-size: 1rem;
          background: #232e43;
          color: #fff;
          border: 2px solid #313d59;
          transition: border-color 0.18s;
          margin-bottom: 1.4rem;
          box-shadow: 0 0 10px #19263d44 inset;
        }
        .mkfm-textarea:focus {
          border-color: #fee715;
          outline: none;
        }
        .mkfm-drawer-btns {
          display: flex;
          gap: 1.1rem;
        }
        .mkfm-btn-announcement,
        .mkfm-btn-stop {
          flex: 1;
          padding: 10px 0px;
          border-radius: 24px;
          font-weight: 700;
          font-size: 1rem;
          letter-spacing: 0.04em;
          cursor: pointer;
          border: none;
          transition: background 0.23s;
        }
        .mkfm-btn-announcement {
          background: #fee715;
          color: #18437b;
        }
        .mkfm-btn-announcement:hover {
          background: #fff54a;
        }
        .mkfm-btn-stop {
          background: #e74c3c;
          color: #fff;
        }
        .mkfm-btn-stop:hover {
          background: #e02121;
        }
        .mkfm-message-box {
          background: #313d55;
          color: #fee715;
          font-weight: 600;
          padding: 13px 19px;
          border-radius: 12px;
          text-align: center;
          font-size: 1rem;
          margin-top: 1.1rem;
          box-shadow: 0 0 7px #fee71599;
        }
        .mkfm-route-marker {
  position: absolute;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 3px solid #27ae60;
  box-shadow: 0 2px 10px #2226;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 20;
  transition: border 0.18s, box-shadow 0.26s, transform 0.18s;
  outline: none;
  padding: 0;
  background: #fff;
}

.mkfm-route-marker.stopped {
  opacity: 0.66;
  filter: grayscale(80%);
  border-color: #e74c3c !important;
  cursor: not-allowed;
}

.mkfm-route-marker:hover, .mkfm-route-marker:focus {
  box-shadow: 0 0 16px #fee715b1, 0 0 2px #fee715 inset;
  transform: scale(1.18);
  z-index: 101;
}

.mkfm-marker-dot {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  box-shadow: 0 0 5px #1118;
  border: 2px solid #fff;
}

.mkfm-marker-tooltip {
  display: none;
  position: absolute;
  left: 34px;
  top: -6px;
  min-width: 140px;
  background: #19263d;
  color: #fee715;
  font-size: 0.92rem;
  padding: 11px 14px;
  border-radius: 12px;
  box-shadow: 0 6px 18px #101c28c0;
  pointer-events: none;
  white-space: pre-line;
}
.mkfm-route-marker:hover .mkfm-marker-tooltip,
.mkfm-route-marker:focus .mkfm-marker-tooltip {
  display: block;
}

        .mkfm-footer {
          background: #161f29;
          padding: 12px 2.3rem;
          color: #aaa;
          font-size: 0.91rem;
          text-align: center;
          letter-spacing: 0.06em;
          border-top: 1px solid #222;
        }
        ::-webkit-scrollbar { width: 9px; height: 8px; }
        ::-webkit-scrollbar-thumb { background: #24314dab; border-radius: 4px; }
      `}</style>
    </div>
  );
}

export default MahakumbhRouteFlowManager;
