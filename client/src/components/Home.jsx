import React from "react";
import Navbar from "./Navbar";
import logo from '../assets/images/logo.png';

function Home() {
  return (
    <>
      <Navbar />
      <div style={{
        maxWidth: 600,
        margin: "48px auto",
        padding: "32px 28px",
        background: "#f6fafd",
        borderRadius: 14,
        boxShadow: "0 4px 24px #223a5e22",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <img src={logo} alt="Logo" style={{ height: 80, margin: "32px auto" }} />
        <div style={{ textAlign: "center" }}>
          <h1 style={{ color: "#223a5e", fontWeight: "bold", fontSize: "2.2rem" }}>Welcome to Your Accounting Portal</h1>
          <p style={{ color: "#274472", fontSize: "1.1rem", marginTop: 16 }}>
            Manage your clients, updates, and communication in a secure and professional environment.
          </p>
        </div>
      </div>
    </>
  );
}

export default Home;