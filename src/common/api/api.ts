import { Api } from "@tourmalinecore/inner-circle-invoices-api-js-client"
import { API_ROOT_URL } from "../config/config"
import { initApiInterceptors } from "./initApiInterceptors"

const apiClient = new Api({
  baseURL: API_ROOT_URL,
})

initApiInterceptors(apiClient.instance)

// keep it after the auth interceptors in initApiInterceptors so that it runs first (interceptors are invoked in a reverse registration order)
apiClient.instance.interceptors.request.use((config: any) => {
  // this is needed to correctly combine baseUrl like http://localhost:30090/api/invoices and url like /api/invoices/projects
  // into a correct local/prod env URL like http://localhost:30090/api/invoices/invoices/projects
  // otherwise we get http://localhost:30090/api/invoices/api/projects which doesn't work
  config.url = config.url.replace(`/api`, ``)

  return config
}, 
null,
)

export const api = apiClient.api
