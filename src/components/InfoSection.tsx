import React from "react";

interface InfoSectionProps {
  title: string;
  children: React.ReactNode;
}

const InfoSection: React.FC<InfoSectionProps> = ({ title, children }) => {
  if (!children) {
    return null;
  }

  return (
    <div className="info-section">
      <h3>{title}</h3>
      <div className="info-content">{children}</div>
    </div>
  );
};

export default InfoSection;
