/**
 * Convert a number to a human readable value in pounds
 */
export const formatValue = (value: number) => {
  if (value >= 1000000) {
    return `£${(value / 1000000).toFixed(1)}m`;
  }
  if (value >= 10000) {
    return `£${(value / 1000).toFixed(0)}k`;
  }
  return `£${value.toFixed(0)}`;
};
