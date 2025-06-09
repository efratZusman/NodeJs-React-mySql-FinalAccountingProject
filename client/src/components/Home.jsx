import React from "react";
import Navbar from "./Navbar";
import styles from "../styles/Home.module.css";

function Home() {
  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Welcome to Home Page</h1>
          <p className={styles.description}>This is the main content of the home page.</p>
        </div>
      </div>
    </>
  );
}

export default Home;