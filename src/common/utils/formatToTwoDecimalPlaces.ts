export function formatToTwoDecimalPlaces(value: number) {
  return Math.trunc(value * 100 ) / 100 
}
