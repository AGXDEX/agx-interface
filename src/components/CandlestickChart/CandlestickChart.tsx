import React from "react";

function CandlestickChart({ url }) {
  return (
    <div id="dexscreener-embed">
      <iframe src={url} title="K Chart" style={{ border: "none" }}></iframe>
    </div>
  );
}

export default CandlestickChart;
