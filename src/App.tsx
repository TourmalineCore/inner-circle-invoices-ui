import { RequireAccessToken } from './routes/authStateProvider/RequireAccessToken'
import { getPageRoutes } from './routes/pageRoutes'
// import Layout from remote app
import Layout from 'inner_circle_layout_ui/layout'

// eslint-disable-next-line import/no-default-export
export default function App() {
  return (
    <RequireAccessToken>
      <Layout getPageRoutes={getPageRoutes} />
    </RequireAccessToken>
  )
}
