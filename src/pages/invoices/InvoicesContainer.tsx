import { useContext, useEffect } from "react"
import { InvoicesContent } from "./InvoicesContent"
import { InvoicesStateContext } from "./state/InvoicesStateContext"
import { api } from "../../common/api/api"
import { InvoiceData, ProjectDto } from "./types"

export function InvoicesContainer() {
  const invoicesState = useContext(InvoicesStateContext)
  
  useEffect(() => {
    loadInvoicesDataAsync()
    loadProjectsDataAsync()
  }, [])

  return (
    <InvoicesContent/>
  )

  async function loadProjectsDataAsync() {
    const {
      data,
    } = await api.get<ProjectDto[]>(`/api/invoices/projects`)

    invoicesState.initializeProjects({
      projects : data,
    })
  }

  async function loadInvoicesDataAsync() {
    const {
      data,
    } = await api.get<InvoiceData[]>(`/api/invoices`)

    invoicesState.initializeInvoicesData({
      invoicesData: data,
    })
  }
}