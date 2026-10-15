export function formatToTwoDecimalPlaces(value: number) {
  // 1e-9 prevents loss of precision during truncation due to float errors
  return Math.trunc((value + 1e-9) * 100) / 100
}
