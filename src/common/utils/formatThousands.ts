export function formatThousands(value: number){
  // returns a formatted string with space-separated thousands
  return value.toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ` `)
}