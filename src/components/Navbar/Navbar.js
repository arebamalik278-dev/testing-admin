import React, { useState, useEffect, useCallback } from 'react';
import { Menu, Search, Bell, User, ChevronDown, Settings, HelpCircle, LogOut } from 'lucide-react';
import socketService from '../../services/socketService';
import './Navbar.css';

const Navbar = ({ setIsMobileOpen }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/login';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search:', searchQuery);
  };

  const addNotification = useCallback((notification) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
  }, []);

  const handleMarkAllAsRead = () => {
    setUnreadCount(0);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = (now - date) / 1000;

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  useEffect(() => {
    const initSocket = async () => {
      try {
        await socketService.connect();
        setIsSocketConnected(true);

        // Emit join_admin event to join the admin room
        socketService.emit('join_admin');

        socketService.on('NEW_ORDER', (data) => {
          console.log('📦 New order notification:', data);
          addNotification({
            id: `order-${data.orderId}-${Date.now()}`,
            type: 'order',
            title: 'New Order Received!',
            text: `Order #${data.orderNumber || data.orderId} - ${data.totalAmount?.toFixed(2) || '0.00'} from ${data.customerName}`,
            time: data.createdAt || new Date().toISOString(),
            read: false,
          });
        });

        socketService.on('NEW_USER', (data) => {
          console.log('👤 New user notification:', data);
          addNotification({
            id: `user-${data.userId}-${Date.now()}`,
            type: 'user',
            title: 'New User Registered!',
            text: `${data.name} (${data.email}) has joined`,
            time: data.createdAt || new Date().toISOString(),
            read: false,
          });
        });

        socketService.on('ORDER_STATUS_UPDATED', (data) => {
          console.log('📋 Order status update notification:', data);
          addNotification({
            id: `status-${data.orderId}-${Date.now()}`,
            type: 'status',
            title: 'Order Status Updated',
            text: `Order #${data.orderNumber || data.orderId} is now ${data.status}`,
            time: new Date().toISOString(),
            read: false,
          });
        });

        socketService.on('admin_joined', (data) => {
          console.log('✅ Admin joined admin room:', data);
        });

        socketService.on('error', (data) => {
          console.error('Socket error:', data);
        });

      } catch (error) {
        console.error('Failed to connect to socket:', error);
        setIsSocketConnected(false);
      }
    };

    initSocket();

    return () => {
      socketService.off('NEW_ORDER');
      socketService.off('NEW_USER');
      socketService.off('ORDER_STATUS_UPDATED');
      socketService.off('admin_joined');
      socketService.off('error');
    };
  }, [addNotification]);

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
        <span className={`connection-status ${isSocketConnected ? 'connected' : ''}`}>
          {isSocketConnected ? 'Connected' : 'Disconnected'}
        </span>

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
              <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
            )}
          </button>
          
          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="notifications-header">
                <h4>Notifications</h4>
                {unreadCount > 0 && (
                  <button className="mark-read-btn" onClick={handleMarkAllAsRead}>
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="notifications-list">
                {notifications.length === 0 ? (
                  <div className="no-notifications">
                    <Bell size={40} />
                    <p>No notifications yet</p>
                  </div>
                ) : (
                  notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`notification-item ${!notification.read ? 'unread' : ''} ${notification.type}`}
                    >
                      <div className="notification-icon">
                        {notification.type === 'order' && '📦'}
                        {notification.type === 'user' && '👤'}
                        {notification.type === 'status' && '📋'}
                      </div>
                      <div className="notification-content">
                        <p className="notification-title">{notification.title}</p>
                        <p className="notification-text">{notification.text}</p>
                        <span className="notification-time">{formatTime(notification.time)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {notifications.length > 0 && (
                <div className="notifications-footer">
                  <button className="view-all-btn">Clear all notifications</button>
                </div>
              )}
            </div>
          )}
        </div>

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
            <span className="user-name">Admin</span>
            <ChevronDown size={16} className={`chevron ${showUserMenu ? 'rotate' : ''}`} />
          </button>

          {showUserMenu && (
            <div className="user-dropdown">
              <div className="user-dropdown-header">
                <div className="user-avatar large">
                  <User size={24} />
                </div>
                <div className="user-info">
                  <span className="user-dropdown-name">Admin</span>
                  <span className="user-dropdown-email">admin@afmart.com</span>
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
                <div className="user-dropdown-divider"></div>
                <button className="user-dropdown-item logout" onClick={handleLogout}>
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

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
