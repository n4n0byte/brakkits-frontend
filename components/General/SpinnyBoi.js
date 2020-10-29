import React, { useState, useEffect } from "react";

import LoadingSpin from "react-loading-spin";

export default function SpinnyBoi(props) {
  return (
    <div class="container">
      <div className={`offset-${props.pos && 5} `}>
        <LoadingSpin />
      </div>
    </div>
  );
}
