export type InvoiceData = {
  id: number,
  name: string,
  position?: string,
  trackedHours: number,
  rate?: number,
  total?: number | null,
}