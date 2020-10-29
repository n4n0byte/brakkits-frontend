import React, { useState, useEffect } from "react";

import LoadingSpin from "react-loading-spin";

/**
 * Ali Cooper
 * brakkits
 * CST-452
 * 10/18/2020
 * 
 * Spinner to show that the application is loading data
 */
export default function SpinnyBoi(props) {
  return (
    <div className="container">
      <div className={`offset-${props.pos && 5} `}>
        <LoadingSpin />
      </div>
    </div>
  );
}
