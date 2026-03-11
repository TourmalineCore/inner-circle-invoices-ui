import { BreadcrumbComponentProps } from 'use-react-router-breadcrumbs'
import { invoicesRoutes } from '../pages/routes'

export function getPageRoutes() {
  const routes: {
    path: string,
    breadcrumb: string | ((props: BreadcrumbComponentProps) => string | undefined),
    Component: () => JSX.Element,
  }[] = []

  routes.push(invoicesRoutes)

  return routes
}
