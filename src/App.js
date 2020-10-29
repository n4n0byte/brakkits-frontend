import Root from "./Root";
import React, { useState } from "react";
import { useHistory, BrowserRouter as Router } from "react-router-dom";

/**
 * App
 * @returns {*} Root Application
 * @constructor
 */
export default function App() {
  // route definitions
  return (
    <Router>
      <Root />
    </Router>
  );
}
