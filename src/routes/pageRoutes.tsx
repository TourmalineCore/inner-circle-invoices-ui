import { BreadcrumbComponentProps } from 'use-react-router-breadcrumbs'
import { invoicesRoutes } from '../pages/routes'

export function getPageRoutes(accessPermissions: Map<any, boolean>) {
  const routes: {
    path: string,
    breadcrumb: string | ((props: BreadcrumbComponentProps) => string | undefined),
    Component: () => JSX.Element,
  }[] = []

  if (accessPermissions.get(`CanViewInvoices`)) {
    routes.push(invoicesRoutes)
  }

  return routes
}
