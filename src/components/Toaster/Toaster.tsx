import React, { useEffect } from "react";

interface ToasterProps {
  message: string;
  onClose: () => void;
}

const Toaster: React.FC<ToasterProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); 
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={toasterStyle}>
      {message}
    </div>
  );
};

const toasterStyle: React.CSSProperties = {
  position: "fixed",
  top: "10%", 
  left: "50%",
  transform: "translateX(-50%)", 
  backgroundColor: "#4CAF50",
  color: "white",
  padding: "10px 20px",
  borderRadius: "5px",
  fontSize: "1rem",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  zIndex: 1000,
};

export default Toaster;
