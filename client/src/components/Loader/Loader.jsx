import React from "react";

const Loader = ({ fullPage = false, size = "md", className = "" }) => {
  if (size === "sm" || size === "small") {
    return <span className={`spinner spinner-sm ${className}`}></span>;
  }

  return (
    <div className={`loader-container ${fullPage ? "full-page" : ""} ${className}`}>
      <div className="spinner"></div>
    </div>
  );
};

export default Loader;
