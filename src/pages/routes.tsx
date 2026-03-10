import { InvoicesPage } from "./invoices/InvoicesPage"

const DEFAULT_PATH = `/invoices`

export const invoicesRoutes = {
  path: `${DEFAULT_PATH}`,
  breadcrumb: `Invoices`,
  Component: InvoicesPage,
}