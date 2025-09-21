import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const notificationRef = useRef(null);

  // Sample notifications data
  const notifications = [
    {
      id: 1,
      title: "Medical Alert",
      message: "New health booth installed near your location",
      time: "2 min ago",
      type: "medical",
      unread: true
    },
    {
      id: 2,
      title: "Emergency Update",
      message: "Emergency services response time improved by 15%",
      time: "5 min ago",
      type: "emergency",
      unread: true
    },
    {
      id: 3,
      title: "System Notification",
      message: "Your RFID has been successfully registered",
      time: "1 hour ago",
      type: "system",
      unread: false
    },
    {
      id: 4,
      title: "Health Reminder",
      message: "Regular health checkup scheduled for tomorrow",
      time: "2 hours ago",
      type: "health",
      unread: true
    },
    {
      id: 5,
      title: "Event Alert",
      message: "Health awareness camp starting in 30 minutes",
      time: "3 hours ago",
      type: "event",
      unread: false
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleNotification = () => setIsNotificationOpen(!isNotificationOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'medical': return '🏥';
      case 'emergency': return '🚨';
      case 'health': return '❤️';
      case 'event': return '📅';
      default: return '🔔';
    }
  };

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'backdrop-blur-md shadow-lg border-b border-gray-200' : 'bg-transparent'
      }`}
      style={scrolled ? { backgroundImage: 'linear-gradient(to right, #F4A391, #E0B9C2, #EACDC6)' } : {}}
    >
      <div className={`max-w-7xl mx-auto px-6 flex items-center justify-between transition-all duration-300 ${
        scrolled ? 'py-2' : 'py-4'
      }`}>
        {/* Logo */}
        <a href="/" className="flex items-center">
          <img 
            src="/Logo new.png" 
            alt="Trinetra Logo" 
            className={`transition-all duration-300 ${scrolled ? 'h-12 w-auto' : 'h-16 w-auto'}`}
          />
        </a>

        {/* Desktop Links & Buttons */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Navigation Links */}
          <ul className="flex space-x-10 -mt-2 font-medium">
            {["About", "Events", "Contact"].map((item, idx) => (
              <li key={idx}>
                <a
                  href={`/${item.toLowerCase()}`}
                  className={`relative px-2 py-4 transition-all duration-300 group ${
                    scrolled 
                      ? 'text-gray-800 hover:text-gray-600' 
                      : 'text-white drop-shadow-md hover:text-gray-200'
                  }`}
                >
                  {item}
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-orange-500 via-purple-600 to-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
            ))}
          </ul>

          {/* Book Your Slot Button */}
          <Link
            to="/slots"
            className="px-5 py-2 rounded-full font-semibold text-white shadow-md transition-all duration-300 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 hover:scale-105"
          >
            Book Your Slot
          </Link>

          {/* Notification Bell */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={toggleNotification}
              className={`relative p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                scrolled 
                  ? 'text-gray-800 hover:bg-white hover:bg-opacity-20' 
                  : 'text-white drop-shadow-md hover:bg-black hover:bg-opacity-10'
              }`}
            >
              {/* Bell Icon */}
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 17h5l-5.405-5.405A2.032 2.032 0 0114 9.5V7a6 6 0 10-12 0v2.5c0 .728-.29 1.367-.595 1.905L6 17h5m4 0v1a3 3 0 11-6 0v-1m6 0H9" 
                />
              </svg>

              {/* Notification Badge */}
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 font-bold animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {isNotificationOpen && (
              <div 
                className="absolute right-0 mt-2 w-80 rounded-xl shadow-2xl border border-white border-opacity-30 overflow-hidden z-50"
                style={{ background: 'linear-gradient(to right, #F4A391, #E0B9C2, #EACDC6)' }}
              >
                {/* Header */}
                <div className="px-4 py-3 bg-white bg-opacity-20 border-b border-white border-opacity-30 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-black">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="text-sm text-black font-semibold bg-white bg-opacity-30 px-2 py-1 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-white border-opacity-20 hover:bg-white hover:bg-opacity-10 transition-colors duration-200 ${
                        notification.unread ? 'bg-white bg-opacity-5' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between space-x-3">
                        <div className="flex items-start space-x-3 flex-1">
                          {/* Notification Icon */}
                          <div className="p-2 rounded-lg bg-white bg-opacity-30 border border-white border-opacity-40 backdrop-blur-sm">
                            <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                          </div>

                          {/* Notification Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <h4 className="text-sm font-semibold text-black truncate">
                                {notification.title}
                              </h4>
                              {notification.unread && (
                                <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                              )}
                            </div>
                            <p className="text-sm text-black text-opacity-80 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-black text-opacity-60 mt-2">
                              {notification.time}
                            </p>
                          </div>
                        </div>

                        {/* See More Button */}
                        <button className="text-black font-semibold text-sm px-3 py-1 rounded-md bg-white bg-opacity-20 hover:bg-opacity-30 border border-white border-opacity-30 transition-all duration-200 flex-shrink-0">
                          See More
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 bg-white bg-opacity-20 border-t border-white border-opacity-30 backdrop-blur-sm">
                  <button className="w-full text-center text-black font-semibold text-sm py-2 hover:bg-white hover:bg-opacity-20 rounded-md transition-colors duration-200 border border-white border-opacity-30">
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center space-x-4">
          <Link
            to="/slots"
            className="px-3 py-1 rounded-full font-semibold text-white shadow-md bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 hover:scale-105 transition-all"
          >
            Book Slot
          </Link>

          <button 
            onClick={toggleMobileMenu}
            className={`text-2xl focus:outline-none transition-all duration-300 ${
              scrolled ? 'text-gray-800 drop-shadow-none' : 'text-white drop-shadow-md'
            }`}
          >
            ☰
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white bg-opacity-90 backdrop-blur-md shadow-lg z-40 md:hidden">
            <ul className="flex flex-col space-y-2 p-4 font-medium">
              {["About", "Events", "Contact"].map((item, idx) => (
                <li key={idx}>
                  <a href={`/${item.toLowerCase()}`} className="block px-3 py-2 rounded-md text-gray-800 hover:bg-gray-100 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
