export type InvoicesApiResponse = {
  employeesInvoicesByProject: InvoiceData[],
}

export type ProjectsApiResponse = {
  projects: ProjectDto[],
}

export type InvoiceData = {
  id: number,
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
