// import { Api } from "../../../api"
// import { API_ROOT_URL } from "../config/config"
// import { initApiInterceptors } from "./initApiInterceptors"

// const apiClient = new Api({
//   // The generated API already contains /api/invoices, so it must be deleted in API_ROOT_URL
//   baseURL: API_ROOT_URL.replace(`/api/invoices`, ``),
// })

// initApiInterceptors(apiClient.instance)

// export const api = apiClient.api

import axios from 'axios'
import { API_ROOT_URL } from '../config/config'
import { initApiInterceptors } from './initApiInterceptors'

// TODO: NEED TO MAKE OUT WHY WE NEED TO REPLACE /api/time
export const api = axios.create({
  baseURL: API_ROOT_URL.replace(`/api/time`, ``),
})

initApiInterceptors(api)
