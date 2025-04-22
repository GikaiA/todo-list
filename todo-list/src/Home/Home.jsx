// src/Home.jsx
import React, { useEffect, useState } from "react";
import "./Home.css";

function Home() {
  return (
    <div className="home">
      <h1>Todo List</h1>
      <div className="todolist-section">
        <input
          type="text"
          className="input-field"
          placeholder="Enter your to-do list here"
        />
        <button className="submit-button">Submit</button>
      </div>
    </div>
  );
}

export default Home;
