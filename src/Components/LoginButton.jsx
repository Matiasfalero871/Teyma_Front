import React from "react";

const LoginButton = () => {
  return (
    <button
      onClick={() => alert("Login Clicked")}
      style={{
        position: "absolute",
        top: "10px",
        right: "20px",
        backgroundColor: "#4CAF50",
        color: "white",
        padding: "10px 20px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        transition: "background-color 0.3s ease, transform 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#026e1f";
        e.currentTarget.style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#4CAF50";
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      Login
    </button>
  );
};

export default LoginButton;
