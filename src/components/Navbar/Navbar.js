import React, { useState } from 'react';
import { Menu, Search, Bell, User, ChevronDown, LogOut, Settings, HelpCircle } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ setIsMobileOpen, user, onLogout }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifications = [
    { id: 1, text: 'New order #1234 received', time: '5 minutes ago', read: false },
    { id: 2, text: 'Low stock alert: Product X', time: '1 hour ago', read: false },
    { id: 3, text: 'Customer feedback received', time: '3 hours ago', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search:', searchQuery);
  };

  const handleLogout = () => {
    setShowUserMenu(false);
    if (onLogout) {
      onLogout();
    }
  };

  // Get user display name
  const userName = user?.name || user?.email?.split('@')[0] || 'Admin';
  const userEmail = user?.email || 'admin@afmart.com';

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button 
          className="navbar-menu-btn"
          onClick={() => setIsMobileOpen(true)}
        >
          <Menu size={20} />
        </button>
        
        <form className="navbar-search" onSubmit={handleSearch}>
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search products, orders, customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </form>
      </div>

      <div className="navbar-right">
        {/* Notifications */}
        <div className="navbar-notifications">
          <button 
            className="navbar-icon-btn"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>
          
          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="notifications-header">
                <h4>Notifications</h4>
                <button className="mark-read-btn">Mark all as read</button>
              </div>
              <div className="notifications-list">
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  >
                    <div className="notification-dot"></div>
                    <div className="notification-content">
                      <p className="notification-text">{notification.text}</p>
                      <span className="notification-time">{notification.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="notifications-footer">
                <button className="view-all-btn">View all notifications</button>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="navbar-user">
          <button 
            className="user-btn"
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
          >
            <div className="user-avatar">
              <User size={18} />
            </div>
            <span className="user-name">{userName}</span>
            <ChevronDown size={16} className={`chevron ${showUserMenu ? 'rotate' : ''}`} />
          </button>

          {showUserMenu && (
            <div className="user-dropdown">
              <div className="user-dropdown-header">
                <div className="user-avatar large">
                  <User size={24} />
                </div>
                <div className="user-info">
                  <span className="user-dropdown-name">{userName}</span>
                  <span className="user-dropdown-email">{userEmail}</span>
                </div>
              </div>
              <div className="user-dropdown-divider"></div>
              <div className="user-dropdown-menu">
                <button className="user-dropdown-item">
                  <User size={16} />
                  <span>My Profile</span>
                </button>
                <button className="user-dropdown-item">
                  <Settings size={16} />
                  <span>Settings</span>
                </button>
                <button className="user-dropdown-item">
                  <HelpCircle size={16} />
                  <span>Help & Support</span>
                </button>
              </div>
              <div className="user-dropdown-divider"></div>
              <button 
                className="user-dropdown-item logout"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showUserMenu || showNotifications) && (
        <div 
          className="dropdown-backdrop"
          onClick={() => {
            setShowUserMenu(false);
            setShowNotifications(false);
          }}
        />
      )}
    </header>
  );
};

export default Navbar;

