import logo from "@/assets/code-ampersand-logo.svg";
import { theme } from "@/styles/theme";
import React from "react";

const Header: React.FC = () => {
  const headerStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    display: "flex",
    alignItems: "center",
    padding: "1rem 1rem",
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    height: "40px",
    width: "100vw",
  };

  const logoStyle: React.CSSProperties = {
    height: "40px",
    width: "auto",
  };

  return (
    <header style={headerStyle}>
      <img src={logo} alt="Code & Ampersand Logo" style={logoStyle} />
      <span style={{ color: theme.primary, fontWeight: 600 }}>
        Code Ampersand
      </span>
    </header>
  );
};

export default Header;
