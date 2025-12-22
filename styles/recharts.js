/**
 * Recharts styling configuration
 * Centralized styles for all chart components
 */

export const chartStyles = {
  // Common styles
  fontFamily: "sans-serif",
  fontSize: 10,
  stroke: "#000",

  // Tooltip styles
  tooltip: {
    background: "orange",
    color: "#000",
    padding: "4px 8px",
    fontSize: "0.75rem",
    border: "1px solid #000",
  },

  // Axis styles
  axis: {
    tick: {
      fontSize: 10,
    },
    stroke: "#000",
  },

  // Bar chart specific
  verticalBar: {
    fill: "#000",
    maxBarSize: 50,
    label: {
      position: "top",
      fill: "#000",
      fontSize: 10,
    },
  },

  horizontalBar: {
    fill: "#000",
    maxBarSize: 30,
    label: {
      position: "insideRight",
      fill: "#fff",
      fontSize: 10,
    },
  },

  // Scatter chart specific
  scatter: {
    fill: "#000",
    fillOpacity: 0.3,
    stroke: "#000",
    strokeWidth: 1,
  },

  // Scatter chart margins
  scatterMargin: {
    top: 15,
    right: 15,
    bottom: 10,
    left: 0,
  },

  axisLabel: {
    style: {
      fontFamily: "sans-serif",
      fontSize: 10,
      fill: "#000",
    },
  },
};

// Reusable tooltip component
export const CustomTooltip = ({ payload, labelFormatter, valueFormatter }) => {
  if (!payload?.[0]) return null;
  const data = payload[0].payload;

  return (
    <div style={chartStyles.tooltip}>
      {labelFormatter ? labelFormatter(data) : JSON.stringify(data)}
    </div>
  );
};
