import React from 'react';

/**
 * Sidebar phong cách Futuristic Glass
 */
export const Sidebar = ({ activeTab, onTabChange }) => {
  const menuGroups = [
    {
      groupLabel: 'TỔNG QUAN',
      items: [
        { id: 'dashboard', label: 'DASHBOARD', icon: '📊' }
      ]
    },
    {
      groupLabel: 'QUẢN LÝ ĐỘI XE',
      items: [
        { id: 'vehicles', label: 'THÔNG TIN XE', icon: '🚚' },
        { id: 'drivers', label: 'LÁI XE', icon: '🪪' },
        { id: 'equipments', label: 'CÔNG CỤ KÈM THEO', icon: '🛠️' },
      ]
    },
    {
      groupLabel: 'BẢO DƯỠNG & SỬA CHỮA',
      items: [
        { id: 'maintenance_history', label: 'LỊCH SỬ SỬA CHỮA', icon: '🔧' },
        { id: 'maintenance_tracking', label: 'THEO DÕI BẢO DƯỠNG', icon: '📅' },
      ]
    },
    {
      groupLabel: 'VẬN HÀNH & NHIÊN LIỆU',
      items: [
        { id: 'fuel', label: 'NHẬP ĐỔ DẦU', icon: '⛽' },
        { id: 'gps', label: 'ĐỊNH VỊ GPS', icon: '📍' },
        { id: 'handover', label: 'BIÊN BẢN BÀN GIAO', icon: '📝' },
      ]
    }
  ];

  return (
    <div className="glass-sidebar">
      <div className="menu-list">
        {menuGroups.map((group, gIndex) => (
          <div key={gIndex} className="menu-group">
            <div className="menu-group-label">{group.groupLabel}</div>
            {group.items.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <div
                  key={item.id}
                  className={`menu-item group ${isActive ? 'active' : ''}`}
                  onClick={() => onTabChange(item.id)}
                >
                  <div className="icon-box-modern">
                    <span className="icon-text">{item.icon}</span>
                  </div>
                  <span className="menu-label-text">
                    {item.label}
                  </span>
                  {isActive && (
                    <span className="chevron-icon">›</span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="user-profile">
        <div className="avatar">👤</div>
        <div className="user-info">
          <p className="user-label">User:</p>
          <p className="user-name">SH Logistics</p>
        </div>
      </div>
    </div>
  );
};

