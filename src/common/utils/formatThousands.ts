export const formatThousands = ({
  value,
}: {
  value: number | null | undefined,
}) => {
  if (value === null || value === undefined) return `-`
  
  // returns a formatted string with space-separated thousands
  return value.toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ` `)
}