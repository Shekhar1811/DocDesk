import React from "react";

/**
 * Modern SVG Circular Spinner for DocDesk
 * Immune to CSS multi-column fragmentation and responsive across all layouts.
 */
const Loader = ({
  fullPage = false,
  size = "md",
  text = "",
  className = "",
}) => {
  const isSmall = size === "sm" || size === "small";
  const isLarge = size === "lg" || size === "large";

  const dimension = isSmall ? 22 : isLarge ? 56 : 42;
  const strokeWidth = isSmall ? 4 : isLarge ? 4 : 4;

  if (isSmall) {
    return (
      <span
        className={`docdesk-spinner-inline ${className}`}
        role="status"
        aria-label="Loading"
      >
        <svg
          className="docdesk-spinner-svg"
          width={dimension}
          height={dimension}
          viewBox="0 0 50 50"
        >
          <circle
            className="docdesk-spinner-track"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            strokeWidth={strokeWidth}
          />
          <circle
            className="docdesk-spinner-circle"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            strokeWidth={strokeWidth}
          />
        </svg>
      </span>
    );
  }

  return (
    <div
      className={`loader-container ${fullPage ? "full-page" : ""} ${className}`}
      role="status"
      aria-label="Loading"
    >
      <div className="docdesk-spinner-wrapper">
        <svg
          className="docdesk-spinner-svg"
          width={dimension}
          height={dimension}
          viewBox="0 0 50 50"
        >
          <circle
            className="docdesk-spinner-track"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            strokeWidth={strokeWidth}
          />
          <circle
            className="docdesk-spinner-circle"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            strokeWidth={strokeWidth}
          />
        </svg>
        {text ? (
          <span className="docdesk-spinner-text mt-2">{text}</span>
        ) : null}
      </div>
    </div>
  );
};

export default Loader;
