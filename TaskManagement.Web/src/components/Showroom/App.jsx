import React, { useState } from 'react';
import { Sidebar } from './UIComponents';
import Dashboard from './Dashboard';
import VehiclesModule from './VehiclesModule';
import DriversModule from './DriversModule';
import MaintenanceModule from './MaintenanceModule';
import MaintenanceTrackingModule from './MaintenanceTrackingModule';
import './App.css';

// Component Placeholder cho các module chưa hoàn thiện
const ModulePlaceholder = ({ title }) => (
  <div className="module-placeholder glass">
    <h2>Mô-đun: {title}</h2>
    <p>Tính năng đang được xây dựng...</p>
  </div>
);

/**
 * App Component - Phiên bản Dashboard điều hành đội xe hiện đại
 */
export default function App() {
  const [selectedCarId, setSelectedCarId] = useState(0);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Logic Render nội dung chính
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'vehicles':
        return <VehiclesModule />;
      case 'drivers':
        return <DriversModule />;
      case 'equipments':
        return <ModulePlaceholder title="Công cụ và Phương tiện kèm theo" />;
      case 'maintenance_history':
        return <MaintenanceModule />;
      case 'maintenance_tracking':
        return <MaintenanceTrackingModule />;
      case 'fuel':
        return <ModulePlaceholder title="Quản lý Nhập & Đổ Dầu" />;
      case 'gps':
        return <ModulePlaceholder title="Định vị GPS Hành trình" />;
      case 'handover':
        return <ModulePlaceholder title="Biên bản Bàn giao xe" />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar cố định bên trái */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Khu vực nội dung chính */}
      <main className="main-content">
        <div className="content-header">
          <h1>LOGISTICS COMMAND CENTER</h1>
          <p>Hệ thống Quản lý và Điều hành Đội xe</p>
        </div>

        {/* Render module tương ứng với menu được chọn */}
        {renderContent()}
      </main>

    </div>
  );
}
