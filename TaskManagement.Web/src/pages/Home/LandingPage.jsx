import React from 'react';
import App3D from '../../components/Showroom/App';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-wrapper">
      {/* Chỉ giữ lại phần App Showroom chính, gỡ bỏ các text đè lớp gây lộn xộn */}
      <App3D />
    </div>
  );
};

export default LandingPage;
