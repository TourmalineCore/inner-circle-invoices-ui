export type InvoiceData = {
  employeeId: number,
  name: string,
  position?: string,
  trackedHours: number,
  rate?: number,
  total?: number | null,
}

export type ProjectDto = {
  id: number,
  name: string,
}
