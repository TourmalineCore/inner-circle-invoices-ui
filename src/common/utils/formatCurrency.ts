export const formatCurrency = ({
  value,
}: {
  value: number | null | undefined,
}) => {
  if (value === null || value === undefined) return `-`
  
  return value.toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ` `)
}