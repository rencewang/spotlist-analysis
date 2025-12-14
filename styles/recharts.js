/**
 * Recharts styling configuration
 * Centralized styles for all chart components
 */

export const chartStyles = {
  // Common styles
  fontFamily: 'Menlo, monospace',
  fontSize: 10,
  stroke: '#000',
  
  // Tooltip styles
  tooltip: {
    background: '#000',
    color: '#fff',
    padding: '4px 8px',
    fontSize: '0.7rem',
    fontFamily: 'Menlo, monospace',
    border: '2px solid #000',
  },
  
  // Axis styles
  axis: {
    tick: { 
      fontSize: 10, 
      fontFamily: 'Menlo, monospace' 
    },
    stroke: '#000',
  },
  
  // Bar chart specific
  bar: {
    fill: '#000',
    isAnimationActive: false,
  },
  
  // Scatter chart specific
  scatter: {
    fill: '#000',
    isAnimationActive: false,
  },
  
  // Chart margins
  margin: {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20,
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
