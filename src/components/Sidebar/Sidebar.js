import React, { useState } from 'react';
import { 
  Menu, X, Home, Package, ShoppingCart, Settings, 
  TrendingUp, ChevronDown, BarChart3, Activity, ShoppingBag, 
  Database, Tag, Image as ImageIcon, FileText, Users, CreditCard 
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ currentPage, setCurrentPage, isMobileOpen, setIsMobileOpen }) => {
  const menuItems = [
    {
      title: 'Dashboard',
      icon: Home,
      children: [
        { name: 'Overview', id: 'overview', icon: BarChart3 },
        { name: 'Analytics', id: 'analytics', icon: TrendingUp },
        { name: 'Recent Activity', id: 'recent-activity', icon: Activity },
        { name: 'Top Products', id: 'top-products', icon: ShoppingBag }
      ]
    },
    {
      title: 'Products',
      icon: Package,
      children: [
        { name: 'Product List', id: 'product-list', icon: Package },
        { name: 'Inventory Control', id: 'inventory-control', icon: Database },
        { name: 'Categories', id: 'categories', icon: Tag },
        { name: 'Media Uploads', id: 'media-uploads', icon: ImageIcon }
      ]
    },
    {
      title: 'Orders & Customers',
      icon: ShoppingCart,
      children: [
        { name: 'Order Tracking', id: 'order-tracking', icon: ShoppingCart },
        { name: 'Invoicing', id: 'invoicing', icon: FileText },
        { name: 'Customer Database', id: 'customer-database', icon: Users }
      ]
    },
    {
      title: 'Site Config',
      icon: Settings,
      children: [
        { name: 'Banners & Carousels', id: 'banners-carousels', icon: ImageIcon },
        { name: 'Settings', id: 'settings', icon: Settings },
        { name: 'Payment & Shipping', id: 'payment-shipping', icon: CreditCard }
      ]
    }
  ];

  const [expandedSections, setExpandedSections] = useState(['Dashboard']);

  const toggleSection = (title) => {
    setExpandedSections(prev =>
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  return (
    <>
      {isMobileOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setIsMobileOpen(false)} 
        />
      )}
      <aside className={`sidebar ${isMobileOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <h1 className="sidebar-title">AF-Mart</h1>
          <button 
            onClick={() => setIsMobileOpen(false)} 
            className="sidebar-close"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map((section) => {
            const Icon = section.icon;
            const isExpanded = expandedSections.includes(section.title);
            return (
              <div key={section.title} className="sidebar-section">
                <button
                  onClick={() => toggleSection(section.title)}
                  className="sidebar-section-btn"
                >
                  <div className="sidebar-section-info">
                    <Icon size={20} />
                    <span className="sidebar-section-title">{section.title}</span>
                  </div>
                  <ChevronDown 
                    size={16} 
                    className={`sidebar-chevron ${isExpanded ? 'chevron-rotate' : ''}`} 
                  />
                </button>
                {isExpanded && (
                  <div className="sidebar-submenu">
                    {section.children.map((item) => {
                      const ItemIcon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setCurrentPage(item.id);
                            setIsMobileOpen(false);
                          }}
                          className={`sidebar-item ${currentPage === item.id ? 'sidebar-item-active' : ''}`}
                        >
                          <ItemIcon size={18} />
                          <span className="sidebar-item-text">{item.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;